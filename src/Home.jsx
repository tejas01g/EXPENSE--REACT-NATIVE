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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

// Gradient View Component using React Native Animated
const GradientView = ({ colors, style, children, start = { x: 0, y: 0 }, end = { x: 1, y: 1 } }) => {
  const animatedColors = useRef(
    colors.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.stagger(100, animatedColors.map(color => 
      Animated.timing(color, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    )).start();
  }, []);

  const interpolatedColors = animatedColors.map((animValue, index) =>
    animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors[index], colors[index]],
    })
  );

  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: interpolatedColors[0], // Fallback to first color
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

const Home = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const styles = createStyles(width, height);

  const [transactions, setTransactions] = useState([]);
  const { profileImageUrl, userName } = useUserProfile();
  const [currency, setCurrency] = useState('USD');
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£', INR: '₹', CAD: 'C$', AUD: 'A$' };
  const [quote, setQuote] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Morning');
    else if (hour < 17) setTimeOfDay('Afternoon');
    else setTimeOfDay('Evening');
  }, []);

  // Data fetching logic
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
      'Financial freedom is a mental, emotional, and educational process.',
      'Budgeting is not about limiting yourself, it\'s about making the things that excite you possible.',
    ];
    const getRandomQuote = () => setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    getRandomQuote();
    const interval = setInterval(getRandomQuote, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalBalance = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const monthlyBudget = 2000;
  const progressPercentage = Math.min((totalBalance / monthlyBudget) * 100, 100);
  
  // Calculate recent expenses (last 7 days)
  const recentExpenses = transactions.filter(t => {
    const transactionDate = t.date ? new Date(t.date.seconds * 1000) : new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return transactionDate >= sevenDaysAgo;
  });
  
  const recentTotal = recentExpenses.reduce((sum, t) => sum + (t.amount || 0), 0);

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': 'food',
      'Transportation': 'car',
      'Shopping': 'shopping',
      'Entertainment': 'movie',
      'Bills': 'file-document',
      'Healthcare': 'medical-bag',
      'Education': 'school',
      'Other': 'dots-horizontal'
    };
    return icons[category] || 'currency-usd';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': '#FF6B6B',
      'Transportation': '#4ECDC4',
      'Shopping': '#FFD166',
      'Entertainment': '#9D4EDD',
      'Bills': '#118AB2',
      'Healthcare': '#06D6A0',
      'Education': '#FF9E6D',
      'Other': '#A0A0A0'
    };
    return colors[category] || '#00E0FF';
  };

  // Helper function to create gradient style object
  const getGradientStyle = (colors, start = { x: 0, y: 0 }, end = { x: 1, y: 1 }) => {
    // In React Native without Expo LinearGradient, we use a solid color with gradient-like effects
    // You could implement a custom gradient component or use react-native-linear-gradient package
    return {
      backgroundColor: colors[0],
      position: 'relative',
      overflow: 'hidden',
    };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

      {/* Background with gradient effect */}
      <View style={styles.background}>
        <View style={styles.backgroundTop} />
        <View style={styles.backgroundMiddle} />
        <View style={styles.backgroundBottom} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.container}>
          {/* Header Section */}
          <AnimatedEntry delay={100}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.greetingText}>Good {timeOfDay}!</Text>
                <Text style={styles.welcomeText}>
                  Welcome back{userName ? `, ${userName}` : ''} 👋
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                <View style={styles.profileBorder}>
                  <Image
                    source={{
                      uri:
                        profileImageUrl ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop',
                    }}
                    style={styles.profileImage}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </AnimatedEntry>

          {/* Stats Cards */}
          <AnimatedEntry delay={200}>
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, styles.primaryCard]}>
                <View style={styles.statHeader}>
                  <Icon name="currency-usd" size={24} color="#00E0FF" />
                  <Text style={styles.statLabel}>Monthly Budget</Text>
                </View>
                <Text style={styles.statValue}>
                  {currencySymbols[currency] || '$'}{monthlyBudget.toFixed(2)}
                </Text>
                <Text style={styles.statSubtext}>Target spending limit</Text>
              </View>

              <View style={[styles.statCard, styles.secondaryCard]}>
                <View style={styles.statHeader}>
                  <Icon name="clock-outline" size={24} color="#FF6B6B" />
                  <Text style={styles.statLabel}>Recent Expenses</Text>
                </View>
                <Text style={[styles.statValue, styles.recentExpenseValue]}>
                  {currencySymbols[currency] || '$'}{recentTotal.toFixed(2)}
                </Text>
                <Text style={styles.statSubtext}>Last 7 days</Text>
              </View>
            </View>
          </AnimatedEntry>

          {/* Circular Progress Chart */}
          <AnimatedEntry delay={300}>
            <View style={styles.chartContainer}>
              <View style={styles.chartBackground}>
                <AnimatedCircularProgress
                  size={getResponsiveValue(200, 220, 240, 260)}
                  width={scale(16)}
                  fill={progressPercentage}
                  tintColor="#00E0FF"
                  tintColorSecondary="#8E2DE2"
                  backgroundColor="rgba(255, 255, 255, 0.05)"
                  rotation={135}
                  lineCap="round"
                  duration={1500}
                  arcSweepAngle={270}
                >
                  {() => (
                    <View style={styles.balanceContent}>
                      <Text style={styles.balanceAmount}>
                        {currencySymbols[currency] || '$'}
                        {totalBalance.toFixed(2)}
                      </Text>
                      <Text style={styles.balanceLabel}>Total Spent This Month</Text>
                      <View style={styles.progressTextContainer}>
                        <Text style={styles.progressText}>
                          {progressPercentage.toFixed(1)}% of budget
                        </Text>
                      </View>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
            </View>
          </AnimatedEntry>

          {/* Motivational Quote */}
          {quote && (
            <AnimatedEntry delay={350}>
              <View style={styles.quoteContainer}>
                <Icon name="format-quote-open" size={24} color="#00E0FF" style={styles.quoteIcon} />
                <Text style={styles.quoteText}>{quote}</Text>
                <Icon name="format-quote-close" size={24} color="#8E2DE2" style={[styles.quoteIcon, styles.quoteIconEnd]} />
              </View>
            </AnimatedEntry>
          )}

          {/* Recent Activity Section */}
          <View style={styles.activitySection}>
            <AnimatedEntry delay={400}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Recent Activity</Text>
                  <Text style={styles.sectionSubtitle}>Track your latest transactions</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => navigation.navigate('Expense')}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                  <Icon name="chevron-right" size={20} color="#00E0FF" />
                </TouchableOpacity>
              </View>
            </AnimatedEntry>

            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((item, index) => (
                <AnimatedEntry key={item.id} delay={500 + index * 100}>
                  <TouchableOpacity
                    style={styles.transactionItem}
                    onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
                  >
                    <View style={[styles.categoryIconContainer, { backgroundColor: `${getCategoryColor(item.category)}20` }]}>
                      <Icon 
                        name={getCategoryIcon(item.category)} 
                        size={24} 
                        color={getCategoryColor(item.category)} 
                      />
                    </View>
                    
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionCategory} numberOfLines={1}>
                        {item.category || 'Uncategorized'}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {item.date
                          ? new Date(item.date.seconds * 1000).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'No Date'}
                      </Text>
                    </View>
                    
                    <View style={styles.amountContainer}>
                      <Text style={styles.transactionAmount}>
                        - {currencySymbols[item.currency || currency]}
                        {item.amount ? item.amount.toFixed(2) : '0.00'}
                      </Text>
                      {item.note && (
                        <Text style={styles.transactionNote} numberOfLines={1}>
                          {item.note}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </AnimatedEntry>
              ))
            ) : (
              <AnimatedEntry delay={500}>
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Icon name="chart-line" size={64} color="#00E0FF" />
                  </View>
                  <Text style={styles.emptyTitle}>All Clear!</Text>
                  <Text style={styles.emptySubtitle}>
                    You have no recent transactions. Start tracking your expenses to see insights.
                  </Text>
                  <TouchableOpacity
                    style={styles.addFirstButton}
                    onPress={() => navigation.navigate('Add')}
                  >
                    <View style={styles.addButtonGradient}>
                      <Icon name="plus" size={24} color="#000" />
                      <Text style={styles.addFirstButtonText}>Add First Expense</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </AnimatedEntry>
            )}
          </View>

          {/* Quick Actions */}
          <AnimatedEntry delay={600}>
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsGrid}>
                <TouchableOpacity
                  style={[styles.quickActionButton, styles.primaryGradientButton]}
                  onPress={() => navigation.navigate('Add')}
                >
                  <Icon name="plus-circle" size={32} color="#000" />
                  <Text style={styles.quickActionText}>Add Expense</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.quickActionButton, styles.secondaryGradientButton]}
                  onPress={() => navigation.navigate('Stats')}
                >
                  <Icon name="chart-bar" size={32} color="#000" />
                  <Text style={styles.quickActionText}>View Stats</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AnimatedEntry>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const createStyles = (width, height) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#0A0A0A',
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    backgroundTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '30%',
      backgroundColor: '#0A0A0A',
    },
    backgroundMiddle: {
      position: 'absolute',
      top: '30%',
      left: 0,
      right: 0,
      height: '40%',
      backgroundColor: '#121212',
    },
    backgroundBottom: {
      position: 'absolute',
      top: '70%',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#0A0A0A',
    },
    scrollContainer: {
      paddingBottom: spacing['4xl'],
    },
    container: {
      flex: 1,
      paddingHorizontal: padding.lg,
      paddingTop: verticalScale(10),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
      marginTop: spacing.md,
    },
    headerLeft: {
      flexDirection: 'column',
    },
    greetingText: {
      fontSize: fontSizes.lg,
      color: '#888',
      fontFamily: 'Montserrat-Regular',
    },
    welcomeText: {
      fontSize: fontSizes['3xl'],
      color: '#FFF',
      fontFamily: 'Montserrat-Bold',
      marginTop: spacing.xs,
    },
    profileButton: {
      width: scale(56),
      height: scale(56),
    },
    profileBorder: {
      width: '100%',
      height: '100%',
      borderRadius: borderRadius.full,
      borderWidth: 2,
      borderColor: '#00E0FF',
      padding: scale(2),
      backgroundColor: '#0A0A0A',
      shadowColor: '#00E0FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 8,
    },
    profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: borderRadius.full,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
      gap: spacing.md,
    },
    statCard: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    primaryCard: {
      borderTopWidth: 2,
      borderTopColor: '#00E0FF',
    },
    secondaryCard: {
      borderTopWidth: 2,
      borderTopColor: '#FF6B6B',
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    statLabel: {
      fontSize: fontSizes.sm,
      color: '#AAA',
      fontFamily: 'Montserrat-Medium',
    },
    statValue: {
      fontSize: fontSizes['2xl'],
      color: '#FFF',
      fontFamily: 'Montserrat-Bold',
      marginBottom: spacing.xs,
    },
    recentExpenseValue: {
      color: '#FF6B6B',
    },
    statSubtext: {
      fontSize: fontSizes.xs,
      color: '#888',
      fontFamily: 'Montserrat-Regular',
    },
    chartContainer: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    chartBackground: {
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      backgroundColor: 'rgba(0, 224, 255, 0.03)',
      shadowColor: '#00E0FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 10,
    },
    balanceContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    balanceAmount: {
      fontSize: getResponsiveValue(
        fontSizes['3xl'],
        fontSizes['4xl'],
        fontSizes['5xl']
      ),
      fontFamily: 'Montserrat-Bold',
      color: '#FFF',
      textShadowColor: 'rgba(0, 224, 255, 0.3)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 15,
    },
    balanceLabel: {
      fontSize: fontSizes.base,
      color: '#AAA',
      fontFamily: 'Montserrat-Medium',
      marginTop: spacing.xs,
    },
    progressTextContainer: {
      backgroundColor: 'rgba(0, 224, 255, 0.1)',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
      marginTop: spacing.sm,
    },
    progressText: {
      fontSize: fontSizes.sm,
      color: '#00E0FF',
      fontFamily: 'Montserrat-SemiBold',
    },
    quoteContainer: {
      padding: spacing.lg,
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: 'rgba(0, 224, 255, 0.2)',
      marginBottom: spacing.xl,
      position: 'relative',
      backgroundColor: 'rgba(0, 224, 255, 0.03)',
    },
    quoteIcon: {
      position: 'absolute',
      top: spacing.md,
      left: spacing.md,
      opacity: 0.5,
    },
    quoteIconEnd: {
      top: 'auto',
      left: 'auto',
      bottom: spacing.md,
      right: spacing.md,
    },
    quoteText: {
      fontSize: fontSizes.base,
      color: '#DDD',
      fontFamily: 'Montserrat-Italic',
      textAlign: 'center',
      lineHeight: 24,
      paddingHorizontal: spacing.lg,
    },
    activitySection: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSizes['2xl'],
      color: '#FFF',
      fontFamily: 'Montserrat-Bold',
    },
    sectionSubtitle: {
      fontSize: fontSizes.sm,
      color: '#888',
      fontFamily: 'Montserrat-Regular',
      marginTop: spacing.xs,
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
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    categoryIconContainer: {
      width: scale(48),
      height: scale(48),
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionCategory: {
      fontSize: fontSizes.base,
      color: '#FFF',
      fontFamily: 'Montserrat-SemiBold',
      marginBottom: spacing.xs,
    },
    transactionDate: {
      fontSize: fontSizes.sm,
      color: '#AAA',
      fontFamily: 'Montserrat-Regular',
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    transactionAmount: {
      fontSize: fontSizes.base,
      color: '#FF6B6B',
      fontFamily: 'Montserrat-Bold',
      marginBottom: spacing.xs,
    },
    transactionNote: {
      fontSize: fontSizes.xs,
      color: '#888',
      fontFamily: 'Montserrat-Regular',
      maxWidth: scale(100),
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing['3xl'],
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: 'rgba(0, 224, 255, 0.2)',
      marginTop: spacing.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    emptyIconContainer: {
      width: scale(100),
      height: scale(100),
      borderRadius: borderRadius.full,
      backgroundColor: 'rgba(0, 224, 255, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      fontSize: fontSizes.xl,
      color: '#FFF',
      fontFamily: 'Montserrat-Bold',
      marginBottom: spacing.sm,
    },
    emptySubtitle: {
      fontSize: fontSizes.base,
      color: '#AAA',
      fontFamily: 'Montserrat-Regular',
      textAlign: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.lg,
      lineHeight: 22,
    },
    addFirstButton: {
      borderRadius: borderRadius.full,
      overflow: 'hidden',
      backgroundColor: '#00E0FF',
      shadowColor: '#00E0FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
    },
    addButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      gap: spacing.sm,
    },
    addFirstButtonText: {
      fontSize: fontSizes.base,
      color: '#000',
      fontFamily: 'Montserrat-Bold',
    },
    quickActionsSection: {
      marginBottom: spacing.xl,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.md,
    },
    quickActionButton: {
      flex: 1,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
    },
    primaryGradientButton: {
      backgroundColor: '#00E0FF',
    },
    secondaryGradientButton: {
      backgroundColor: '#FF6B6B',
    },
    quickActionText: {
      fontSize: fontSizes.sm,
      color: '#000',
      fontFamily: 'Montserrat-Bold',
      textAlign: 'center',
    },
  });