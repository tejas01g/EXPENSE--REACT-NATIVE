import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../src/firebaseConfig';
import { collection, onSnapshot, query, orderBy, getDoc, doc } from 'firebase/firestore';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
} from './utils/responsive';
import { useUserProfile } from './hooks/useUserProfile';

const Analytics = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profileImageUrl } = useUserProfile();

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };

  const [currency, setCurrency] = useState('USD'); // default
  const activeSymbol = currencySymbols[currency] || '$';

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

    // Listen to transactions
    const q = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const trans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(trans);

      // Calculate total balance
      const total = trans.reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0
      );
      setTotalBalance(total);

      // Group by date
      const dailySums = {};
      trans.forEach(item => {
        const dateKey = item.date
          ? new Date(item.date.seconds * 1000).toLocaleDateString()
          : 'Unknown';
        dailySums[dateKey] = (dailySums[dateKey] || 0) + Number(item.amount || 0);
      });

      const dailyAmounts = Object.values(dailySums);
      setHistoricalData(dailyAmounts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Forecasting logic
  const getPredictedData = (data, days = 3) => {
    const len = data.length;
    if (len < 2) return Array(days).fill(data[len - 1] || 0);
    const slope = (data[len - 1] - data[0]) / (len - 1);
    const lastValue = data[len - 1];
    return Array.from({ length: days }, (_, i) => lastValue + slope * (i + 1));
  };

  const predictedData = getPredictedData(historicalData);
  const combinedLabels = [...Array(historicalData.length + predictedData.length).keys()].map(
    i => `D${i + 1}`
  );
  const actualPlusPredicted = [...historicalData, ...predictedData];

  // Stats
  const avgExpense = transactions.length > 0 ? totalBalance / transactions.length : 0;
  const highestExpense =
    transactions.length > 0 ? Math.max(...transactions.map(t => t.amount || 0)) : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <Text style={styles.headerSubtitle}>Your spending insights</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{
              uri:
                profileImageUrl ||
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Chart Section */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading chart...</Text>
            </View>
          ) : (
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: combinedLabels,
                  datasets: [
                    {
                      data: actualPlusPredicted,
                      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                      strokeWidth: 2,
                    },
                    {
                      data: Array(historicalData.length).fill(null).concat(predictedData),
                      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                      strokeWidth: 2,
                      withDots: true,
                    },
                  ],
                  legend: ['Actual Expenses', 'AI Forecast'],
                }}
                width={scale(350)}
                height={scale(220)}
                yAxisSuffix={activeSymbol}
                chartConfig={{
                  backgroundColor: '#1a1a1a',
                  backgroundGradientFrom: '#1a1a1a',
                  backgroundGradientTo: '#1a1a1a',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#00e0ff',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                bezier
                style={styles.chartStyle}
              />
            </View>
          )}
        </View>

        {/* Summary Stats */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {activeSymbol}{totalBalance.toFixed(2)}
              </Text>
              <Text style={styles.summaryLabel}>Total Spending</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{transactions.length}</Text>
              <Text style={styles.summaryLabel}>Transactions</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {activeSymbol}{avgExpense.toFixed(2)}
              </Text>
              <Text style={styles.summaryLabel}>Average</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {activeSymbol}{highestExpense.toFixed(2)}
              </Text>
              <Text style={styles.summaryLabel}>Highest</Text>
            </View>
          </View>
        </View>

        {/* Spending Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.sectionTitle}>Spending Breakdown</Text>
          <View style={styles.breakdownContainer}>
            {transactions.length > 0 ? (
              transactions.slice(0, 10).map((item, index) => (
                <View style={styles.breakdownItem} key={item.id}>
                  <View style={styles.breakdownLeft}>
                    <View style={styles.breakdownIcon}>
                      <Text style={styles.breakdownIconText}>
                        {['🛒', '🍔', '🚗', '🎬', '🏥', '💳'][index % 6]}
                      </Text>
                    </View>
                    <View style={styles.breakdownInfo}>
                      <Text style={styles.breakdownCategory}>
                        {item.category || 'No Category'}
                      </Text>
                      <Text style={styles.breakdownDate}>
                        {item.date
                          ? new Date(item.date.seconds * 1000).toLocaleDateString()
                          : 'No Date'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.breakdownRight}>
                    <Text style={styles.breakdownAmount}>
                      {activeSymbol}{item.amount ? item.amount.toFixed(2) : '0.00'}
                    </Text>
                    <Text style={styles.breakdownPercentage}>
                      {((item.amount / totalBalance) * 100).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyTitle}>No data available</Text>
                <Text style={styles.emptySubtitle}>
                  Add some expenses to see your analytics
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>💡</Text>
              <Text style={styles.insightTitle}>Spending Pattern</Text>
              <Text style={styles.insightText}>
                {transactions.length > 0
                  ? `You've spent an average of ${activeSymbol}${avgExpense.toFixed(2)} per transaction`
                  : 'Start tracking expenses to see insights'}
              </Text>
            </View>

            <View style={styles.insightCard}>
              <Text style={styles.insightIcon}>📈</Text>
              <Text style={styles.insightTitle}>Trend Analysis</Text>
              <Text style={styles.insightText}>
                {historicalData.length > 1
                  ? historicalData[historicalData.length - 1] > historicalData[0]
                    ? 'Your spending is trending upward'
                    : 'Your spending is trending downward'
                  : 'Add more data to see trends'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.lg,
    paddingTop: verticalScale(60),
    paddingBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSizes['4xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  profileButton: {
    width: scale(50),
    height: scale(50),
    borderRadius: borderRadius.full,
    borderWidth: scale(3),
    borderColor: '#390cc1',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(50),
  },
  chartSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    color: '#888',
    fontSize: fontSizes.base,
    fontFamily: 'Montserrat-Regular',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartStyle: {
    borderRadius: borderRadius.md,
  },
  summarySection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  summaryCard: {
    flex: 1,
    minWidth: scale(150),
    backgroundColor: 'rgba(57, 12, 193, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(57, 12, 193, 0.3)',
  },
  summaryValue: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  breakdownSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  breakdownContainer: {
    gap: spacing.sm,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  breakdownIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(57, 12, 193, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  breakdownIconText: {
    fontSize: fontSizes.lg,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownCategory: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
  },
  breakdownDate: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  breakdownRight: {
    alignItems: 'flex-end',
  },
  breakdownAmount: {
    fontSize: fontSizes.base,
    color: '#ff6b6b',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  breakdownPercentage: {
    fontSize: fontSizes.xs,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyIcon: {
    fontSize: scale(48),
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  insightsSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  insightsContainer: {
    gap: spacing.md,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightIcon: {
    fontSize: fontSizes.xl,
    marginBottom: spacing.sm,
  },
  insightTitle: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.sm,
  },
  insightText: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    lineHeight: fontSizes.base * 1.4,
  },
});
