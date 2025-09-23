import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { auth, db } from '../src/firebaseConfig';
import { collection, onSnapshot, query, doc, getDoc } from 'firebase/firestore';
import { useUserProfile } from './hooks/useUserProfile';

import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
  getResponsiveValue,
} from './utils/responsive';

// Reusable animation component using the built-in Animated API
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

const Home = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);

  const [transactions, setTransactions] = useState([]);
  const { profileImageUrl, userName } = useUserProfile();
  const [currency, setCurrency] = useState('USD');
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$' };
  const [quote, setQuote] = useState('');

  // Data fetching and other logic remains unchanged
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const userRef = doc(db, 'users', userId);
    getDoc(userRef).then(snap => setCurrency(snap.exists() ? snap.data().currency || 'USD' : 'USD'));

    const q = query(collection(db, 'users', userId, 'transactions'));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const trans = [];
      querySnapshot.forEach(doc => trans.push({ id: doc.id, ...doc.data() }));
      setTransactions(trans.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const quotes = [
      'The best time to plant a tree was 20 years ago. The second best time is now.',
      'An investment in knowledge pays the best interest.',
      'Beware of little expenses. A small leak will sink a great ship.',
    ];
    const getRandomQuote = () => setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    getRandomQuote();
    const interval = setInterval(getRandomQuote, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalBalance = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const monthlyBudget = 2000;
  const progressPercentage = Math.min((totalBalance / monthlyBudget) * 100, 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        
        {/* --- 1. NON-SCROLLING CONTENT --- */}
        <View>
            <AnimatedEntry delay={100}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Dashboard</Text>
                        <Text style={styles.headerSubtitle}>Welcome back{userName ? `, ${userName}` : ''}!</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={{ uri: profileImageUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format' }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>
            </AnimatedEntry>

            <AnimatedEntry delay={200}>
                <View style={styles.chartContainer}>
                    <AnimatedCircularProgress
                        size={getResponsiveValue(180, 200, 220, 250)}
                        width={scale(18)}
                        fill={progressPercentage}
                        tintColor="#00e0ff"
                        tintColorSecondary="#8e2de2"
                        backgroundColor="rgba(255,255,255,0.1)"
                        rotation={135}
                        lineCap="round"
                        duration={1000}
                    >
                        {() => (
                            <View style={styles.balanceContent}>
                                <Text style={styles.balanceAmount}>{currencySymbols[currency] || '$'}{totalBalance.toFixed(2)}</Text>
                                <Text style={styles.balanceLabel}>Total Spent This Month</Text>
                            </View>
                        )}
                    </AnimatedCircularProgress>
                </View>
            </AnimatedEntry>

            {/* The Tip and Stats containers can also be part of the non-scrolling section if you prefer */}
            {/* For this example, we keep the main dashboard fixed and scroll the rest */}

        </View>

        {/* --- 2. SCROLLING CONTENT --- */}
        <View style={styles.scrollableContent}>
            <AnimatedEntry delay={300}>
                <View style={styles.expensesHeader}>
                    <Text style={styles.expensesTitle}>Recent Activity</Text>
                    <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate('Expense')}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>
            </AnimatedEntry>

            <ScrollView showsVerticalScrollIndicator={false}>
                {transactions.length > 0 ? (
                    transactions.map((item, index) => (
                        <AnimatedEntry key={item.id} delay={400 + index * 100}>
                            <View style={styles.transactionItem}>
                                <View style={styles.transactionLeft}><Image style={styles.transactionIcon} source={{ uri: item.image || 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format' }}/><View style={styles.transactionInfo}><Text style={styles.transactionCategory} numberOfLines={1}>{item.category || 'Uncategorized'}</Text><Text style={styles.transactionDate}>{item.date ? new Date(item.date.seconds * 1000).toLocaleDateString() : 'No Date'}</Text></View></View><Text style={styles.transactionAmount}>- {currencySymbols[item.currency || currency]}{item.amount ? item.amount.toFixed(2) : '0.00'}</Text>
                            </View>
                        </AnimatedEntry>
                    ))
                ) : (
                    <AnimatedEntry delay={400}>
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>✨</Text><Text style={styles.emptyTitle}>All Clear!</Text><Text style={styles.emptySubtitle}>You have no recent transactions. Add one to get started.</Text><TouchableOpacity style={styles.addFirstButton} onPress={() => navigation.navigate('Add')}><Text style={styles.addFirstButtonText}>Add First Expense</Text></TouchableOpacity>
                        </View>
                    </AnimatedEntry>
                )}
            </ScrollView>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default Home;

const createStyles = (width, height) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.lg,
    paddingTop: verticalScale(20),
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSizes['4xl'],
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    textShadowColor: 'rgba(0, 224, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerSubtitle: {
    fontSize: fontSizes.base,
    color: '#aaa',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  profileButton: {
    width: scale(50),
    height: scale(50),
    borderRadius: borderRadius.full,
    borderWidth: scale(2),
    borderColor: '#00e0ff',
    shadowColor: '#00e0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  chartContainer: {
    alignItems: 'center',
    // Reduced vertical padding as it's no longer in a scrollview
    paddingBottom: spacing.xl, 
    shadowColor: '#8e2de2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  balanceContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAmount: {
    fontSize: getResponsiveValue(fontSizes['2xl'], fontSizes['3xl'], fontSizes['4xl']),
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  balanceLabel: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  
  // --- Scrollable Area Styles ---
  scrollableContent: {
      flex: 1, // This is crucial, it makes this view take up all remaining space
      paddingHorizontal: padding.lg,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingTop: spacing.sm, 
  },
  expensesTitle: {
    fontSize: fontSizes['2xl'],
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  viewAllText: {
    fontSize: fontSizes.sm,
    color: '#00e0ff',
    fontFamily: 'Montserrat-SemiBold',
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
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: spacing.sm },
  transactionIcon: { width: scale(40), height: scale(40), borderRadius: borderRadius.full, marginRight: spacing.md },
  transactionInfo: { flex: 1 },
  transactionCategory: { fontSize: fontSizes.base, color: '#fff', fontFamily: 'Montserrat-SemiBold' },
  transactionDate: { fontSize: fontSizes.sm, color: '#ccc', fontFamily: 'Montserrat-Regular', marginTop: spacing.xs },
  transactionAmount: { fontSize: fontSizes.base, color: '#ff6b6b', fontFamily: 'Montserrat-Bold' },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: spacing.lg,
  },
  emptyIcon: { fontSize: scale(48), marginBottom: spacing.lg },
  emptyTitle: { fontSize: fontSizes.xl, color: '#fff', fontFamily: 'Montserrat-Bold', marginBottom: spacing.sm },
  emptySubtitle: { fontSize: fontSizes.base, color: '#ccc', fontFamily: 'Montserrat-Regular', textAlign: 'center', marginBottom: spacing.xl, paddingHorizontal: spacing.lg },
  addFirstButton: {
    backgroundColor: '#00e0ff',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    shadowColor: '#00e0ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  addFirstButtonText: { fontSize: fontSizes.base, color: '#000', fontFamily: 'Montserrat-Bold' },
});