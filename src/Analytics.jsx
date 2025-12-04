import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { auth, db } from '../src/firebaseConfig';
import { collection, onSnapshot, query, orderBy, getDoc, doc, where, Timestamp } from 'firebase/firestore';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
} from './utils/responsive';
import { useUserProfile } from './hooks/useUserProfile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Animated Entry Component
const AnimatedEntry = ({ children, delay = 0 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
};

const Analytics = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [filteredBalance, setFilteredBalance] = useState(0);
  const [historicalData, setHistoricalData] = useState({ labels: [], data: [] });
  const [categoryData, setCategoryData] = useState([]);
  const [filteredCategoryData, setFilteredCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week'); // 'week', 'month', 'year'
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedPieSlice, setSelectedPieSlice] = useState(null);
  const { profileImageUrl, userName } = useUserProfile();

  const animatedValue = useRef(new Animated.Value(0)).current;

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };

  const [currency, setCurrency] = useState('USD');
  const activeSymbol = currencySymbols[currency] || '$';

  // Enhanced color palette
  const categoryColors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#9D4EDD', '#118AB2',
    '#06D6A0', '#FF9E6D', '#00E0FF', '#FF8E53', '#A78BFA'
  ];

  const categoryIcons = {
    'Food': 'food',
    'Transportation': 'car',
    'Shopping': 'shopping',
    'Entertainment': 'movie',
    'Bills': 'file-document',
    'Healthcare': 'medical-bag',
    'Education': 'school',
    'Other': 'dots-horizontal',
    'Uncategorized': 'help-circle',
    'Groceries': 'cart',
    'Dining': 'silverware-fork-knife',
    'Travel': 'airplane',
    'Housing': 'home',
    'Utilities': 'flash',
    'Personal': 'account',
    'Savings': 'piggy-bank',
    'Insurance': 'shield-check',
    'Investment': 'chart-line',
    'Gifts': 'gift'
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Get user's preferred currency
    const userRef = doc(db, 'users', userId);
    getDoc(userRef).then(snap => {
      if (snap.exists()) {
        setCurrency(snap.data().currency || 'USD');
      }
    });

    // Listen to all transactions
    const q = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const trans = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().createdAt || doc.data().date || null
      }));
      setTransactions(trans);
      
      // Apply initial filter
      filterTransactionsByTimeframe(trans, selectedTimeframe);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter transactions when timeframe changes
  useEffect(() => {
    if (transactions.length > 0) {
      filterTransactionsByTimeframe(transactions, selectedTimeframe);
    }
  }, [selectedTimeframe, transactions]);

  const filterTransactionsByTimeframe = (trans, timeframe) => {
    const now = new Date();
    let startDate = new Date();
    
    switch(timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    const filtered = trans.filter(item => {
      if (!item.timestamp) return false;
      
      const itemDate = item.timestamp.seconds 
        ? new Date(item.timestamp.seconds * 1000)
        : new Date(item.timestamp);
      
      return itemDate >= startDate && itemDate <= now;
    });
    
    setFilteredTransactions(filtered);
    
    // Calculate filtered balance
    const total = filtered.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    setFilteredBalance(total);
    
    // Process data for charts
    processHistoricalData(filtered, timeframe);
    processCategoryData(filtered, total);
  };

  const processHistoricalData = (trans, timeframe) => {
    const now = new Date();
    let labels = [];
    let dataPoints = [];
    
    // Generate labels based on timeframe
    if (timeframe === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const label = date.toLocaleDateString('en-US', { weekday: 'short' });
        labels.push(label);
        
        // Calculate total for this day
        const dayTotal = trans.reduce((sum, item) => {
          if (!item.timestamp) return sum;
          
          const itemDate = item.timestamp.seconds 
            ? new Date(item.timestamp.seconds * 1000)
            : new Date(item.timestamp);
            
          const isSameDay = itemDate.getDate() === date.getDate() &&
                           itemDate.getMonth() === date.getMonth() &&
                           itemDate.getFullYear() === date.getFullYear();
          
          return isSameDay ? sum + Number(item.amount || 0) : sum;
        }, 0);
        
        dataPoints.push(dayTotal);
      }
    } else if (timeframe === 'month') {
      // Last 30 days, grouped by week
      for (let i = 3; i >= 0; i--) {
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - (i * 7) - 6);
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() - (i * 7));
        
        const label = `W${i + 1}`;
        labels.push(label);
        
        // Calculate total for this week
        const weekTotal = trans.reduce((sum, item) => {
          if (!item.timestamp) return sum;
          
          const itemDate = item.timestamp.seconds 
            ? new Date(item.timestamp.seconds * 1000)
            : new Date(item.timestamp);
            
          const isInWeek = itemDate >= startDate && itemDate <= endDate;
          return isInWeek ? sum + Number(item.amount || 0) : sum;
        }, 0);
        
        dataPoints.push(weekTotal);
      }
    } else if (timeframe === 'year') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const label = date.toLocaleDateString('en-US', { month: 'short' });
        labels.push(label);
        
        // Calculate total for this month
        const monthTotal = trans.reduce((sum, item) => {
          if (!item.timestamp) return sum;
          
          const itemDate = item.timestamp.seconds 
            ? new Date(item.timestamp.seconds * 1000)
            : new Date(item.timestamp);
            
          const isSameMonth = itemDate.getMonth() === date.getMonth() &&
                             itemDate.getFullYear() === date.getFullYear();
          
          return isSameMonth ? sum + Number(item.amount || 0) : sum;
        }, 0);
        
        dataPoints.push(monthTotal);
      }
    }
    
    setHistoricalData({
      labels,
      data: dataPoints
    });
  };

  const processCategoryData = (trans, totalBalance) => {
    const categorySums = {};
    
    trans.forEach(item => {
      const category = item.category || 'Uncategorized';
      const amount = Number(item.amount || 0);
      categorySums[category] = (categorySums[category] || 0) + amount;
    });

    // Convert to array and sort
    let categoriesArray = Object.keys(categorySums).map(category => ({
      name: category,
      amount: categorySums[category],
      color: categoryColors[Object.keys(categorySums).indexOf(category) % categoryColors.length],
      percentage: totalBalance > 0 ? (categorySums[category] / totalBalance) * 100 : 0
    }));

    // Sort by amount descending
    categoriesArray.sort((a, b) => b.amount - a.amount);

    // Take top 5 categories
    const topCategories = categoriesArray.slice(0, 5);
    
    // Prepare data for Pie Chart
    const pieData = topCategories.map((cat, index) => ({
      name: cat.name,
      population: cat.amount,
      color: cat.color,
      legendFontColor: '#FFF',
      legendFontSize: 12,
      percentage: cat.percentage
    }));

    setCategoryData(pieData);
    setFilteredCategoryData(pieData);
  };

  // Forecasting logic
  const getPredictedData = (data, days = 3) => {
    const len = data.length;
    if (len < 2) return Array(days).fill(data[len - 1] || 0);
    
    // Simple moving average for prediction
    const lastThree = data.slice(-3);
    const avg = lastThree.reduce((a, b) => a + b, 0) / lastThree.length;
    const growthRate = data[len - 1] / (data[len - 2] || data[len - 1]);
    
    return Array.from({ length: days }, (_, i) => 
      Math.max(0, avg * Math.pow(growthRate, i + 1))
    );
  };

  const predictedData = historicalData.data ? getPredictedData(historicalData.data) : [];
  const combinedLabels = [...(historicalData.labels || []), ...['P1', 'P2', 'P3']];
  const actualPlusPredicted = [...(historicalData.data || []), ...predictedData];

  // Stats based on filtered data
  const avgExpense = filteredTransactions.length > 0 ? filteredBalance / filteredTransactions.length : 0;
  const highestExpense = filteredTransactions.length > 0 
    ? Math.max(...filteredTransactions.map(t => t.amount || 0)) 
    : 0;
  const transactionCount = filteredTransactions.length;

  // Get insights
  const getTopCategory = () => {
    if (categoryData.length === 0) return null;
    return categoryData.reduce((max, cat) => 
      cat.population > max.population ? cat : max, categoryData[0]
    );
  };

  const getSpendingTrend = () => {
    if (historicalData.data && historicalData.data.length > 1) {
      const last = historicalData.data[historicalData.data.length - 1];
      const first = historicalData.data[0];
      return last > first ? 'up' : last < first ? 'down' : 'stable';
    }
    return 'stable';
  };

  const topCategory = getTopCategory();
  const spendingTrend = getSpendingTrend();

  const handlePieSlicePress = (slice) => {
    setSelectedPieSlice(slice);
    // Animate the selection
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const getTimeframeLabel = () => {
    switch(selectedTimeframe) {
      case 'week': return 'Last 7 Days';
      case 'month': return 'Last 30 Days';
      case 'year': return 'Last 12 Months';
      default: return 'Last 7 Days';
    }
  };

  const getTimeframeStats = () => {
    switch(selectedTimeframe) {
      case 'week':
        return { label: 'Weekly', avgLabel: 'Daily Avg' };
      case 'month':
        return { label: 'Monthly', avgLabel: 'Weekly Avg' };
      case 'year':
        return { label: 'Yearly', avgLabel: 'Monthly Avg' };
      default:
        return { label: 'Weekly', avgLabel: 'Daily Avg' };
    }
  };

  const timeframeStats = getTimeframeStats();

  const renderPieChart = () => {
    const chartConfig = {
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      backgroundGradientFrom: 'transparent',
      backgroundGradientTo: 'transparent',
      decimalPlaces: 0,
    };

    return (
      <View style={styles.pieChartWrapper}>
        <Animated.View 
          style={[
            styles.pieChartContainer,
            { transform: [{ rotate: rotateInterpolate }] }
          ]}
        >
          <PieChart
            data={filteredCategoryData}
            width={SCREEN_WIDTH - 96}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
            hasLegend={false}
            avoidFalseZero
            onDataPointPress={handlePieSlicePress}
          />
        </Animated.View>
        
        {/* Custom Legend */}
        <View style={styles.legendContainer}>
          {filteredCategoryData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.legendItem,
                selectedPieSlice?.name === item.name && styles.legendItemSelected
              ]}
              onPress={() => handlePieSlicePress(item)}
            >
              <View style={styles.legendColorContainer}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              </View>
              <View style={styles.legendTextContainer}>
                <Text style={styles.legendName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.legendPercentage}>
                  {item.percentage.toFixed(1)}%
                </Text>
              </View>
              <Text style={styles.legendAmount}>
                {activeSymbol}{item.population.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Slice Details */}
        {selectedPieSlice && (
          <View style={styles.selectedSliceContainer}>
            <View style={[styles.selectedSliceColor, { backgroundColor: selectedPieSlice.color }]} />
            <View style={styles.selectedSliceInfo}>
              <Text style={styles.selectedSliceName}>{selectedPieSlice.name}</Text>
              <Text style={styles.selectedSliceAmount}>
                {activeSymbol}{selectedPieSlice.population.toFixed(2)}
              </Text>
              <Text style={styles.selectedSlicePercentage}>
                {selectedPieSlice.percentage.toFixed(1)}% of {timeframeStats.label.toLowerCase()} spending
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header */}
      <AnimatedEntry delay={100}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>Financial Insights</Text>
            <Text style={styles.welcomeText}>
              {timeframeStats.label} Analytics • {userName || 'Guest'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri:
                    profileImageUrl ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop',
                }}
                style={styles.profileImage}
              />
              <View style={styles.profileBadge}>
                <Icon name="chart-box" size={12} color="#000" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </AnimatedEntry>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Timeframe Filter */}
        <AnimatedEntry delay={150}>
          <View style={styles.timeframeFilterContainer}>
            <Text style={styles.filterLabel}>Filter by Timeframe</Text>
            <View style={styles.timeframeButtons}>
              {['week', 'month', 'year'].map((timeframe) => (
                <TouchableOpacity
                  key={timeframe}
                  style={[
                    styles.timeframeButton,
                    selectedTimeframe === timeframe && styles.timeframeButtonActive
                  ]}
                  onPress={() => setSelectedTimeframe(timeframe)}
                >
                  <Icon 
                    name={
                      timeframe === 'week' ? 'calendar-week' : 
                      timeframe === 'month' ? 'calendar-month' : 'calendar'
                    }
                    size={20}
                    color={selectedTimeframe === timeframe ? '#000' : '#666'}
                    style={styles.timeframeIcon}
                  />
                  <Text style={[
                    styles.timeframeButtonText,
                    selectedTimeframe === timeframe && styles.timeframeButtonTextActive
                  ]}>
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.timeframeInfo}>
              Showing data for {getTimeframeLabel()}
            </Text>
          </View>
        </AnimatedEntry>

        {/* Summary Cards */}
        <AnimatedEntry delay={200}>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Icon name="currency-usd" size={24} color="#00E0FF" />
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryValue}>{activeSymbol}{filteredBalance.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Total {timeframeStats.label} Spending</Text>
                <Text style={styles.summarySubtext}>
                  {transactionCount} transactions
                </Text>
              </View>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIconContainer}>
                <Icon name="chart-line" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryValue}>
                  {activeSymbol}{avgExpense.toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>{timeframeStats.avgLabel}</Text>
                <Text style={styles.summarySubtext}>
                  {spendingTrend === 'up' ? '↑ Increasing' : 
                   spendingTrend === 'down' ? '↓ Decreasing' : '→ Stable'}
                </Text>
              </View>
            </View>
          </View>
        </AnimatedEntry>

        {/* Chart Type Selector */}
        <AnimatedEntry delay={250}>
          <View style={styles.chartTypeContainer}>
            <Text style={styles.chartTypeLabel}>Visualization Type</Text>
            <View style={styles.chartTypeButtons}>
              <TouchableOpacity
                style={[
                  styles.chartTypeButton,
                  selectedChart === 'line' && styles.chartTypeButtonActive
                ]}
                onPress={() => setSelectedChart('line')}
              >
                <Icon 
                  name="chart-line" 
                  size={20} 
                  color={selectedChart === 'line' ? '#000' : '#666'} 
                />
                <Text style={[
                  styles.chartTypeButtonText,
                  selectedChart === 'line' && styles.chartTypeButtonTextActive
                ]}>
                  Trends
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.chartTypeButton,
                  selectedChart === 'pie' && styles.chartTypeButtonActive
                ]}
                onPress={() => setSelectedChart('pie')}
              >
                <Icon 
                  name="chart-pie" 
                  size={20} 
                  color={selectedChart === 'pie' ? '#000' : '#666'} 
                />
                <Text style={[
                  styles.chartTypeButtonText,
                  selectedChart === 'pie' && styles.chartTypeButtonTextActive
                ]}>
                  Categories
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedEntry>

        {/* Main Chart Section */}
        <AnimatedEntry delay={300}>
          <View style={styles.chartSection}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>
                {selectedChart === 'line' ? 'Spending Trends' : 'Category Breakdown'}
              </Text>
              <Text style={styles.chartSubtitle}>{getTimeframeLabel()}</Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00E0FF" />
                <Text style={styles.loadingText}>Loading analytics...</Text>
              </View>
            ) : filteredTransactions.length === 0 ? (
              <View style={styles.emptyDataContainer}>
                <Icon name="chart-line" size={48} color="#666" />
                <Text style={styles.emptyDataTitle}>No Data Available</Text>
                <Text style={styles.emptyDataText}>
                  No expenses found for {getTimeframeLabel().toLowerCase()}
                </Text>
                <TouchableOpacity
                  style={styles.addExpenseButton}
                  onPress={() => navigation.navigate('Add')}
                >
                  <Icon name="plus" size={20} color="#000" />
                  <Text style={styles.addExpenseButtonText}>Add Expense</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.chartCard}>
                {selectedChart === 'line' ? (
                  // Line Chart
                  <View>
                    <LineChart
                      data={{
                        labels: combinedLabels,
                        datasets: [
                          {
                            data: actualPlusPredicted,
                            color: (opacity = 1) => `rgba(0, 224, 255, ${opacity})`,
                            strokeWidth: 3,
                          },
                          {
                            data: [...(historicalData.data || []), ...Array(predictedData.length).fill(null)],
                            color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
                            strokeWidth: 2,
                            strokeDashArray: [5, 5],
                          },
                        ],
                        legend: ['Actual', 'Forecast'],
                      }}
                      width={SCREEN_WIDTH - 64}
                      height={220}
                      yAxisLabel={activeSymbol}
                      yAxisSuffix=""
                      chartConfig={{
                        backgroundColor: '#000000',
                        backgroundGradientFrom: '#000000',
                        backgroundGradientTo: '#000000',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: {
                          r: '6',
                          strokeWidth: '2',
                          stroke: '#00E0FF'
                        },
                        propsForBackgroundLines: {
                          strokeDasharray: '',
                          stroke: 'rgba(255, 255, 255, 0.15)'
                        },
                        propsForLabels: {
                          fontSize: 10
                        }
                      }}
                      bezier
                      style={styles.chart}
                      fromZero
                    />
                    <View style={styles.chartLegend}>
                      <View style={styles.legendItemInline}>
                        <View style={[styles.legendDot, { backgroundColor: '#00E0FF' }]} />
                        <Text style={styles.legendText}>Actual Spending</Text>
                      </View>
                      <View style={styles.legendItemInline}>
                        <View style={[styles.legendDot, { 
                          backgroundColor: '#FF6B6B', 
                          borderWidth: 2,
                          borderColor: '#FF6B6B',
                          borderStyle: 'dashed'
                        }]} />
                        <Text style={styles.legendText}>AI Forecast</Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  // Pie Chart
                  renderPieChart()
                )}
              </View>
            )}
          </View>
        </AnimatedEntry>

        {/* Category Breakdown */}
        {filteredTransactions.length > 0 && (
          <AnimatedEntry delay={350}>
            <View style={styles.categoryBreakdownSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Categories</Text>
                <Text style={styles.sectionSubtitle}>{getTimeframeLabel()}</Text>
              </View>
              <View style={styles.categoryList}>
                {categoryData.slice(0, 5).map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                        <Icon 
                          name={categoryIcons[category.name] || 'help-circle'} 
                          size={18} 
                          color={category.color} 
                        />
                      </View>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>{category.name}</Text>
                        <Text style={styles.categoryPercentage}>{category.percentage.toFixed(1)}%</Text>
                      </View>
                    </View>
                    <View style={styles.categoryRight}>
                      <Text style={styles.categoryAmount}>{activeSymbol}{category.population.toFixed(2)}</Text>
                      <View style={styles.progressBarContainer}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { 
                              width: `${Math.min(category.percentage, 100)}%`,
                              backgroundColor: category.color
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </AnimatedEntry>
        )}

        {/* Recent Transactions */}
        <AnimatedEntry delay={400}>
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('Expense')}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <Icon name="chevron-right" size={20} color="#00E0FF" />
              </TouchableOpacity>
            </View>
            <View style={styles.recentList}>
              {filteredTransactions.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.transactionItem}
                  onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
                >
                  <View style={[styles.transactionIcon, { 
                    backgroundColor: `${categoryColors[index % categoryColors.length]}20` 
                  }]}>
                    <Icon 
                      name={categoryIcons[item.category] || 'help-circle'} 
                      size={18} 
                      color={categoryColors[index % categoryColors.length]} 
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionCategory}>{item.category || 'Uncategorized'}</Text>
                    <Text style={styles.transactionDate}>
                      {item.timestamp
                        ? new Date(item.timestamp.seconds * 1000).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'No Date'}
                    </Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmount}>
                      - {activeSymbol}{item.amount ? item.amount.toFixed(2) : '0.00'}
                    </Text>
                    <Icon name="chevron-right" size={16} color="#666" />
                  </View>
                </TouchableOpacity>
              ))}
              {filteredTransactions.length === 0 && (
                <View style={styles.emptyTransactions}>
                  <Icon name="receipt" size={48} color="#666" />
                  <Text style={styles.emptyTransactionsText}>No transactions in this period</Text>
                  <Text style={styles.emptyTransactionsSubtext}>
                    Try changing the timeframe or add new expenses
                  </Text>
                </View>
              )}
            </View>
          </View>
        </AnimatedEntry>
      </ScrollView>
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.lg,
    paddingTop: verticalScale(60),
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: fontSizes['3xl'],
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: spacing.xs,
  },
  welcomeText: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
  },
  profileButton: {
    width: scale(56),
    height: scale(56),
  },
  profileImageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: '#00E0FF',
    padding: scale(2),
    backgroundColor: '#000000',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  profileBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#00E0FF',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  timeframeFilterContainer: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Medium',
    marginBottom: spacing.sm,
  },
  timeframeButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  timeframeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  timeframeButtonActive: {
    backgroundColor: '#00E0FF',
    borderColor: '#00E0FF',
  },
  timeframeIcon: {
    marginRight: spacing.sm,
  },
  timeframeButtonText: {
    fontSize: fontSizes.sm,
    color: '#AAAAAA',
    fontFamily: 'Montserrat-Medium',
  },
  timeframeButtonTextActive: {
    color: '#000000',
    fontFamily: 'Montserrat-Bold',
  },
  timeframeInfo: {
    fontSize: fontSizes.xs,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: padding.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  summaryIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryValue: {
    fontSize: fontSizes.lg,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    marginBottom: spacing.xs,
  },
  summarySubtext: {
    fontSize: fontSizes.xs,
    color: '#666666',
    fontFamily: 'Montserrat-Regular',
  },
  chartTypeContainer: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.lg,
  },
  chartTypeLabel: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Medium',
    marginBottom: spacing.sm,
  },
  chartTypeButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: 4,
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  chartTypeButtonActive: {
    backgroundColor: 'rgba(0, 224, 255, 0.15)',
  },
  chartTypeButtonText: {
    fontSize: fontSizes.sm,
    color: '#AAAAAA',
    fontFamily: 'Montserrat-Medium',
  },
  chartTypeButtonTextActive: {
    color: '#00E0FF',
    fontFamily: 'Montserrat-SemiBold',
  },
  chartSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  chartHeader: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: fontSizes.xl,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: spacing.xs,
  },
  chartSubtitle: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  loadingText: {
    color: '#888888',
    fontSize: fontSizes.base,
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.md,
  },
  emptyDataContainer: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyDataTitle: {
    fontSize: fontSizes.lg,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyDataText: {
    fontSize: fontSizes.base,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  addExpenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00E0FF',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  addExpenseButtonText: {
    fontSize: fontSizes.base,
    color: '#000000',
    fontFamily: 'Montserrat-Bold',
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chart: {
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  legendItemInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: fontSizes.sm,
    color: '#AAAAAA',
    fontFamily: 'Montserrat-Regular',
  },
  // Pie Chart Styles
  pieChartWrapper: {
    alignItems: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    width: '100%',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  legendItemSelected: {
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    borderColor: '#00E0FF',
  },
  legendColorContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  legendName: {
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
  },
  legendPercentage: {
    fontSize: fontSizes.xs,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  legendAmount: {
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  selectedSliceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 224, 255, 0.2)',
    width: '100%',
  },
  selectedSliceColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  selectedSliceInfo: {
    flex: 1,
  },
  selectedSliceName: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
  },
  selectedSliceAmount: {
    fontSize: fontSizes.lg,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: spacing.xs,
  },
  selectedSlicePercentage: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
  },
  categoryBreakdownSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
  },
  categoryList: {
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  categoryIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
  },
  categoryRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  categoryAmount: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  recentSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: fontSizes.sm,
    color: '#00E0FF',
    fontFamily: 'Montserrat-SemiBold',
  },
  recentList: {
    gap: spacing.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  transactionIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
    marginBottom: spacing.xs,
  },
  transactionDate: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
  },
  transactionAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  transactionAmount: {
    fontSize: fontSizes.base,
    color: '#FF6B6B',
    fontFamily: 'Montserrat-SemiBold',
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyTransactionsText: {
    fontSize: fontSizes.lg,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  emptyTransactionsSubtext: {
    fontSize: fontSizes.base,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});