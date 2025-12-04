import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  useWindowDimensions,
  Animated,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {auth, db} from '../src/firebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  getDoc,
  orderBy,
} from 'firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Swipeable } from 'react-native-gesture-handler';

const Expense = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  const styles = createStyles(width, height);
  
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [filter, setFilter] = useState('all');
  const [categoriesSummary, setCategoriesSummary] = useState({});
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };

  const categoryIcons = {
    Food: 'food',
    Transport: 'car',
    Shopping: 'shopping',
    Entertainment: 'movie',
    Bills: 'file-document',
    Health: 'medical-bag',
    Education: 'school',
    Other: 'dots-horizontal',
    Income: 'cash-plus',
    Salary: 'cash',
    Freelance: 'briefcase',
    Investment: 'trending-up',
  };

  const categoryColors = {
    Food: '#FF6B6B',
    Transport: '#4ECDC4',
    Shopping: '#FFD166',
    Entertainment: '#6A0572',
    Bills: '#118AB2',
    Health: '#06D6A0',
    Education: '#7209B7',
    Other: '#8A8A8A',
    Income: '#2ECC71',
    Salary: '#3498DB',
    Freelance: '#9B59B6',
    Investment: '#F39C12',
  };

  useEffect(() => {
    loadUserData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadUserData = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    getDoc(doc(db, 'users', userId)).then(snap => {
      if (snap.exists()) {
        setCurrency(snap.data().currency || 'USD');
      }
    });

    loadTransactions();
  };

  const loadTransactions = () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, querySnapshot => {
      const trans = [];
      const categoryTotals = {};
      let income = 0;
      let expenses = 0;

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const transaction = {id: doc.id, ...data};
        trans.push(transaction);
        
        const amount = Number(data.amount || 0);
        const category = data.category || 'Other';
        
        // Separate income and expenses
        if (data.type === 'income') {
          income += amount;
        } else {
          expenses += amount;
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });

      setTransactions(trans);
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setTotalBalance(income - expenses);
      setCategoriesSummary(categoryTotals);
      
      // Group transactions by date
      groupTransactionsByDate(trans);
    });

    return unsubscribe;
  };

  const groupTransactionsByDate = (trans) => {
    const grouped = {};
    
    trans.forEach(transaction => {
      const date = transaction.createdAt?.toDate();
      if (!date) return;
      
      const dateKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: date,
          transactions: [],
          total: 0
        };
      }
      
      const amount = Number(transaction.amount || 0);
      grouped[dateKey].transactions.push(transaction);
      grouped[dateKey].total += transaction.type === 'income' ? amount : -amount;
    });
    
    setGroupedTransactions(grouped);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadUserData();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleDelete = (transactionId) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const userId = auth.currentUser?.uid;
            if (!userId) return;
            
            try {
              await deleteDoc(doc(db, 'users', userId, 'transactions', transactionId));
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}>
        <Animated.View style={{transform: [{scale: trans}]}}>
          <Icon name="trash-can-outline" size={24} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const formatRelativeDate = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diff = (today - transactionDate) / (1000 * 60 * 60 * 24);
    
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff/7)} weeks ago`;
    if (diff < 365) return `${Math.floor(diff/30)} months ago`;
    return `${Math.floor(diff/365)} years ago`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryIcon = (category) => {
    return categoryIcons[category] || 'cash';
  };

  const getTransactionColor = (transaction) => {
    if (transaction.type === 'income') return '#2ECC71';
    return '#FF6B6B';
  };

  const getTransactionSign = (transaction) => {
    return transaction.type === 'income' ? '+' : '-';
  };

  const renderTransactionItem = (item) => {
    const isIncome = item.type === 'income';
    const transactionDate = item.createdAt?.toDate();
    
    return (
      <Swipeable
        key={item.id}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item)
        }
        friction={2}
        rightThreshold={40}>
        <TouchableOpacity
          style={styles.transactionCard}
          onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}>
          <View style={styles.transactionIconContainer}>
            <LinearGradient
              colors={[
                categoryColors[item.category] || '#8A8A8A',
                `${categoryColors[item.category] || '#8A8A8A'}80`
              ]}
              style={styles.transactionIconGradient}>
              <Icon
                name={getCategoryIcon(item.category)}
                size={20}
                color="#FFF"
              />
            </LinearGradient>
          </View>
          
          <View style={styles.transactionDetails}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionCategory} numberOfLines={1}>
                {item.category || 'Other'}
              </Text>
              <Text style={[
                styles.transactionAmount,
                { color: getTransactionColor(item) }
              ]}>
                {getTransactionSign(item)} {currencySymbols[item.currency || currency]}
                {item.amount?.toFixed(2) || '0.00'}
              </Text>
            </View>
            
            <View style={styles.transactionMeta}>
              {item.description ? (
                <Text style={styles.transactionDescription} numberOfLines={1}>
                  {item.description}
                </Text>
              ) : (
                <Text style={styles.transactionDate}>
                  {transactionDate ? formatTime(transactionDate) : ''}
                </Text>
              )}
              
              <View style={styles.transactionTags}>
                {item.payment && (
                  <View style={styles.paymentTag}>
                    <Icon name="credit-card" size={12} color="#888" />
                    <Text style={styles.tagText}>{item.payment}</Text>
                  </View>
                )}
                
                {isIncome && (
                  <View style={[styles.typeTag, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
                    <Icon name="arrow-up" size={12} color="#2ECC71" />
                    <Text style={[styles.tagText, { color: '#2ECC71' }]}>Income</Text>
                  </View>
                )}
                
                {item.hasTarget && (
                  <View style={[styles.typeTag, { backgroundColor: 'rgba(0, 224, 255, 0.1)' }]}>
                    <Icon name="target" size={12} color="#00E0FF" />
                    <Text style={[styles.tagText, { color: '#00E0FF' }]}>Target</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          <Icon
            name="chevron-right"
            size={20}
            color="rgba(255,255,255,0.3)"
          />
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#000000', '#1a1a1a']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Expenses</Text>
            <Text style={styles.headerSubtitle}>Track your spending</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Balance Summary */}
      <Animated.View
        style={[
          styles.balanceCard,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <LinearGradient
          colors={['#2a2d3e', '#4a4e69']}
          style={styles.gradientCard}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View style={styles.balanceHeader}>
            <Icon name="wallet-outline" size={24} color="#FFF" />
            <Text style={styles.balanceLabel}>Total Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>
            {currencySymbols[currency]} {totalBalance.toFixed(2)}
          </Text>
          
          <View style={styles.incomeExpenseRow}>
            <View style={styles.incomeExpenseItem}>
              <View style={[styles.ieIcon, { backgroundColor: 'rgba(46, 204, 113, 0.2)' }]}>
                <Icon name="arrow-up" size={16} color="#2ECC71" />
              </View>
              <View style={styles.ieTextContainer}>
                <Text style={styles.ieLabel}>Income</Text>
                <Text style={[styles.ieValue, { color: '#2ECC71' }]}>
                  {currencySymbols[currency]} {totalIncome.toFixed(2)}
                </Text>
              </View>
            </View>
            
            <View style={styles.separatorVertical} />
            
            <View style={styles.incomeExpenseItem}>
              <View style={[styles.ieIcon, { backgroundColor: 'rgba(255, 107, 107, 0.2)' }]}>
                <Icon name="arrow-down" size={16} color="#FF6B6B" />
              </View>
              <View style={styles.ieTextContainer}>
                <Text style={styles.ieLabel}>Expenses</Text>
                <Text style={[styles.ieValue, { color: '#FF6B6B' }]}>
                  {currencySymbols[currency]} {totalExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Category Summary */}
      {Object.keys(categoriesSummary).length > 0 && (
        <View style={styles.categoriesContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}>
            {Object.entries(categoriesSummary)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([category, amount]) => (
                <LinearGradient
                  key={category}
                  colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={styles.categoryCard}>
                  <View style={[
                    styles.categoryIconContainer,
                    { backgroundColor: `${categoryColors[category]}20` }
                  ]}>
                    <Icon
                      name={getCategoryIcon(category)}
                      size={20}
                      color={categoryColors[category] || '#FFF'}
                    />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={1}>
                    {category}
                  </Text>
                  <Text style={styles.categoryAmount}>
                    {currencySymbols[currency]} {amount.toFixed(2)}
                  </Text>
                  <View style={styles.categoryProgressBar}>
                    <View 
                      style={[
                        styles.categoryProgressFill, 
                        { 
                          width: `${(amount / totalExpenses) * 100}%`,
                          backgroundColor: categoryColors[category]
                        }
                      ]} 
                    />
                  </View>
                </LinearGradient>
              ))}
          </ScrollView>
        </View>
      )}

      {/* Recent Transactions */}
      <View style={styles.transactionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => {/* Open filter modal */}}>
              <Icon name="filter-variant" size={20} color="#888" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('Add')}>
              <Icon name="plus" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#00E0FF"
              colors={['#00E0FF']}
            />
          }>
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([dateKey, group]) => (
              <View key={dateKey} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Text style={styles.dateTitle}>
                    {formatRelativeDate(group.date)}
                  </Text>
                  <Text style={styles.dateSubtitle}>
                    {group.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={[
                    styles.dateTotal,
                    { color: group.total >= 0 ? '#2ECC71' : '#FF6B6B' }
                  ]}>
                    {group.total >= 0 ? '+' : ''}{currencySymbols[currency]} 
                    {Math.abs(group.total).toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.transactionsGroup}>
                  {group.transactions.map(transaction => renderTransactionItem(transaction))}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['rgba(0, 224, 255, 0.1)', 'rgba(0, 224, 255, 0.05)']}
                style={styles.emptyStateGradient}>
                <Icon name="wallet-outline" size={60} color="rgba(0, 224, 255, 0.5)" />
                <Text style={styles.emptyStateTitle}>No Transactions Yet</Text>
                <Text style={styles.emptyStateText}>
                  Start tracking your expenses to see your financial overview
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={() => navigation.navigate('Add')}>
                  <LinearGradient
                    colors={['#00E0FF', '#007AFF']}
                    style={styles.emptyStateButtonGradient}>
                    <Icon name="plus" size={20} color="#000" />
                    <Text style={styles.emptyStateButtonText}>Add First Transaction</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Floating Add Button */}
      {transactions.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('Add')}>
          <LinearGradient
            colors={['#00E0FF', '#007AFF']}
            style={styles.floatingButtonGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}>
            <Icon name="plus" size={24} color="#000" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Expense;

const createStyles = (width, height) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    header: {
      paddingHorizontal: width * 0.05,
      paddingTop: height * 0.02,
      paddingBottom: height * 0.03,
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      shadowColor: '#00E0FF',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: width * 0.08,
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Bold',
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: width * 0.035,
      color: 'rgba(255,255,255,0.7)',
      fontFamily: 'Montserrat-Regular',
      marginTop: 4,
    },
    profileButton: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: width * 0.06,
      borderWidth: 2,
      borderColor: 'rgba(0, 224, 255, 0.3)',
      overflow: 'hidden',
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: width * 0.06,
    },
    balanceCard: {
      marginHorizontal: width * 0.05,
      marginTop: height * 0.02,
      marginBottom: height * 0.02,
      borderRadius: 25,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 10,
    },
    gradientCard: {
      borderRadius: 25,
      padding: width * 0.05,
    },
    balanceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    balanceLabel: {
      fontSize: width * 0.038,
      color: 'rgba(255, 255, 255, 0.8)',
      fontFamily: 'Montserrat-SemiBold',
      marginLeft: 10,
    },
    balanceAmount: {
      fontSize: Math.min(width * 0.12, 48),
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Bold',
      marginBottom: 20,
    },
    incomeExpenseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: width * 0.02,
    },
    incomeExpenseItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    ieIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    ieTextContainer: {
      flex: 1,
    },
    ieLabel: {
      fontSize: width * 0.032,
      color: 'rgba(255, 255, 255, 0.6)',
      fontFamily: 'Montserrat-Regular',
      marginBottom: 2,
    },
    ieValue: {
      fontSize: width * 0.04,
      fontFamily: 'Montserrat-SemiBold',
    },
    separatorVertical: {
      width: 1,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginHorizontal: 15,
    },
    categoriesContainer: {
      marginHorizontal: width * 0.05,
      marginBottom: height * 0.02,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: width * 0.045,
      color: '#FFFFFF',
      fontFamily: 'Montserrat-SemiBold',
    },
    viewAllText: {
      fontSize: width * 0.035,
      color: '#00E0FF',
      fontFamily: 'Montserrat-SemiBold',
    },
    categoriesScroll: {
      flexDirection: 'row',
    },
    categoryCard: {
      width: width * 0.35,
      padding: width * 0.04,
      borderRadius: 20,
      marginRight: width * 0.03,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
    },
    categoryIconContainer: {
      width: width * 0.1,
      height: width * 0.1,
      borderRadius: width * 0.05,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryName: {
      fontSize: width * 0.038,
      color: '#FFFFFF',
      fontFamily: 'Montserrat-SemiBold',
      marginBottom: 6,
    },
    categoryAmount: {
      fontSize: width * 0.032,
      color: 'rgba(255,255,255,0.7)',
      fontFamily: 'Montserrat-Regular',
      marginBottom: 10,
    },
    categoryProgressBar: {
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 2,
      overflow: 'hidden',
    },
    categoryProgressFill: {
      height: '100%',
      borderRadius: 2,
    },
    transactionsContainer: {
      flex: 1,
      marginHorizontal: width * 0.05,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    filterButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.05)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#00E0FF',
      justifyContent: 'center',
      alignItems: 'center',
    },
    transactionsList: {
      flex: 1,
    },
    dateGroup: {
      marginBottom: 20,
    },
    dateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 5,
    },
    dateTitle: {
      fontSize: width * 0.04,
      color: '#FFFFFF',
      fontFamily: 'Montserrat-SemiBold',
    },
    dateSubtitle: {
      fontSize: width * 0.032,
      color: 'rgba(255,255,255,0.5)',
      fontFamily: 'Montserrat-Regular',
    },
    dateTotal: {
      fontSize: width * 0.035,
      fontFamily: 'Montserrat-SemiBold',
    },
    transactionsGroup: {
      gap: 8,
    },
    transactionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderRadius: 18,
      padding: width * 0.04,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
    },
    transactionIconContainer: {
      marginRight: width * 0.04,
    },
    transactionIconGradient: {
      width: width * 0.11,
      height: width * 0.11,
      borderRadius: width * 0.055,
      justifyContent: 'center',
      alignItems: 'center',
    },
    transactionDetails: {
      flex: 1,
    },
    transactionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    transactionCategory: {
      fontSize: width * 0.04,
      color: '#FFFFFF',
      fontFamily: 'Montserrat-SemiBold',
      flex: 1,
      marginRight: 10,
    },
    transactionAmount: {
      fontSize: width * 0.04,
      fontFamily: 'Montserrat-Bold',
    },
    transactionMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transactionDescription: {
      fontSize: width * 0.032,
      color: 'rgba(255,255,255,0.6)',
      fontFamily: 'Montserrat-Regular',
      flex: 1,
      marginRight: 10,
    },
    transactionDate: {
      fontSize: width * 0.032,
      color: 'rgba(255,255,255,0.5)',
      fontFamily: 'Montserrat-Regular',
    },
    transactionTags: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    paymentTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    typeTag: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    tagText: {
      fontSize: width * 0.028,
      color: '#888',
      fontFamily: 'Montserrat-Regular',
      marginLeft: 4,
    },
    deleteButton: {
      backgroundColor: '#FF6B6B',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 18,
      marginLeft: 8,
    },
    emptyState: {
      paddingVertical: height * 0.1,
    },
    emptyStateGradient: {
      alignItems: 'center',
      padding: 30,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: 'rgba(0, 224, 255, 0.1)',
    },
    emptyStateTitle: {
      fontSize: width * 0.06,
      color: '#FFFFFF',
      fontFamily: 'Montserrat-Bold',
      marginTop: 20,
      marginBottom: 10,
    },
    emptyStateText: {
      fontSize: width * 0.035,
      color: 'rgba(255,255,255,0.6)',
      fontFamily: 'Montserrat-Regular',
      textAlign: 'center',
      marginBottom: 25,
      lineHeight: 22,
    },
    emptyStateButton: {
      borderRadius: 25,
      overflow: 'hidden',
    },
    emptyStateButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 25,
      gap: 8,
    },
    emptyStateButtonText: {
      fontSize: width * 0.038,
      color: '#000000',
      fontFamily: 'Montserrat-Bold',
    },
    floatingButton: {
      position: 'absolute',
      bottom: height * 0.03,
      right: width * 0.05,
      shadowColor: '#00E0FF',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 10,
    },
    floatingButtonGradient: {
      width: width * 0.16,
      height: width * 0.16,
      borderRadius: width * 0.08,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });