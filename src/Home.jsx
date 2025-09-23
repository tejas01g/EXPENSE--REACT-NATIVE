import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { auth, db } from '../src/firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
  getResponsiveValue,
} from './utils/responsive';
import { useUserProfile } from './hooks/useUserProfile';
import {
  // collection,
  // onSnapshot,
  // query,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const Home = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const { profileImageUrl, userName } = useUserProfile();
    const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };
    const [currency, setCurrency] = useState('USD'); // default


  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

      const userRef = doc(db, 'users', userId);
        getDoc(userRef).then(snap => {
          if (snap.exists()) {
            setCurrency(snap.data().currency || 'USD');
          }
        });

    const q = query(collection(db, 'users', userId, 'transactions'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const trans = [];
      querySnapshot.forEach(doc => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      const sorted = trans.sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds,
      );
      setTransactions(sorted);
    });

    return () => unsubscribe();
  }, []);

  const [quote, setQuote] = useState('');
  useEffect(() => {
    const quotes = [
      'Save money, and money will save you.',
      "Budgeting isn't limiting yourself. It's freedom.",
      'Track your spending, not just your earnings.',
      'Spend less than you earn—always.',
      'Make your money work for you.',
      'Avoid impulse buys—pause and plan.',
      'Little savings grow big over time.',
      'Stick to your budget, and build wealth.',
      'Be mindful, not stingy.',
      'Smart money = peaceful mind.',
    ];

    const getRandomQuote = () => {
      const index = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[index]);
    };

    getRandomQuote();
    const interval = setInterval(getRandomQuote, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total balance from transactions
  const totalBalance = transactions.reduce((sum, transaction) => {
    return sum + (transaction.amount || 0);
  }, 0);

  // Calculate progress percentage (example: based on monthly budget)
  const monthlyBudget = 2000; // This could come from user settings
  const progressPercentage = Math.min((totalBalance / monthlyBudget) * 100, 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Home</Text>
          <Text style={styles.headerSubtitle}>
            Welcome back{userName ? `, ${userName}` : ''}!
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{
              uri: profileImageUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Balance Chart */}
      <View style={styles.chartContainer}>
        <AnimatedCircularProgress
          size={getResponsiveValue(180, 200, 220, 250)}
          width={scale(20)}
          fill={progressPercentage}
          tintColor="#00e0ff"
          tintColorSecondary="#8e2de2"
          backgroundColor="#2d2f4a"
          arcSweepAngle={360}
          rotation={135}
          lineCap="round"
        >
          {() => (
            <View style={styles.balanceContent}>
              <Text style={styles.balanceAmount}>${totalBalance.toFixed(2)}</Text>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.budgetProgress}>
                {progressPercentage.toFixed(1)}% of budget
              </Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Tip of the Day */}
      <View style={styles.tipContainer}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipTitle}>Tip of the day</Text>
        </View>
        <Text style={styles.tipText}>{quote}</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{transactions.length}</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {transactions.length > 0 
              ? (totalBalance / transactions.length).toFixed(2) 
              : '0.00'
            }
          </Text>
          <Text style={styles.statLabel}>Avg. Expense</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            ${(monthlyBudget - totalBalance).toFixed(2)}
          </Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>

      {/* Expenses Header */}
      <View style={styles.expensesHeader}>
        <Text style={styles.expensesTitle}>Recent Expenses</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView 
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactionsContent}
      >
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.slice(0, 5).map(item => (
            <View style={styles.transactionItem} key={item.id}>
              <View style={styles.transactionLeft}>
                <Image
                  style={styles.transactionIcon}
                  source={{
                    uri:
                      item.image ||
                      'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format',
                  }}
                />
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionCategory}>
                    {item.category || 'No Category'}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {item.date
                      ? new Date(item.date.seconds * 1000).toLocaleDateString()
                      : 'No Date'}
                  </Text>
                </View>
              </View>
              <Text style={styles.transactionAmount}>
                {currencySymbols[item.currency || currency]}
                {item.amount ? item.amount.toFixed(2) : '0.00'}
                {/* ${item.amount ? item.amount.toFixed(2) : '0.00'} */}
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySubtitle}>
              Start tracking your expenses to see them here
            </Text>
            <TouchableOpacity 
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('Add')}
            >
              <Text style={styles.addFirstButtonText}>Add Your First Expense</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

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
  chartContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  balanceContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAmount: {
    fontSize: getResponsiveValue(fontSizes.xl, fontSizes['2xl'], fontSizes['3xl'], fontSizes['4xl']),
    fontFamily: 'Montserrat-SemiBold',
    color: '#fff',
    fontWeight: '600',
  },
  balanceLabel: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  budgetProgress: {
    fontSize: fontSizes.xs,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  tipContainer: {
    backgroundColor: 'rgba(57, 12, 193, 0.1)',
    marginHorizontal: padding.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(57, 12, 193, 0.3)',
    marginBottom: spacing.xl,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.sm,
  },
  tipTitle: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  tipText: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    lineHeight: fontSizes.base * 1.4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  statLabel: {
    fontSize: fontSizes.xs,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.lg,
    marginBottom: spacing.md,
  },
  expensesTitle: {
    fontSize: fontSizes['2xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  viewAllButton: {
    backgroundColor: 'rgba(57, 12, 193, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(57, 12, 193, 0.3)',
  },
  viewAllText: {
    fontSize: fontSizes.sm,
    color: '#00e0ff',
    fontFamily: 'Montserrat-Regular',
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    paddingHorizontal: padding.lg,
    paddingBottom: spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: borderRadius.full,
    marginRight: spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  transactionAmount: {
    fontSize: fontSizes.base,
    color: '#ff6b6b',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
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
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  addFirstButton: {
    backgroundColor: '#390cc1',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  addFirstButtonText: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
});
