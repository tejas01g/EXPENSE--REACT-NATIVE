import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  useWindowDimensions, // 1. Import the hook
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {auth, db} from '../src/firebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

// We no longer need Dimensions from here
// const {width, height} = Dimensions.get('window');

const Expense = ({navigation}) => {
  // 2. Use the hook to get dynamic width and height
  const {width, height} = useWindowDimensions();
  // 3. Create styles that depend on these dynamic dimensions
  const styles = createStyles(width, height);

  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    // ... all of your existing useEffect logic remains the same
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
        trans.push({id: doc.id, ...doc.data()});
      });
      const sorted = trans.sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds,
      );
      setTransactions(sorted);

      const total = trans.reduce(
        (acc, curr) => acc + Number(curr.amount || 0),
        0,
      );
      setTotalBalance(total);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = transactionId => {
    // ... handleDelete function remains the same
  };

  // The JSX remains the same, but it will now use the dynamically generated styles
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Gradient Balance Box */}
      <LinearGradient
        colors={['#4a4e69', '#2a2d3e']}
        style={styles.balanceBox}>
        <Text style={styles.balanceText}>My Balance</Text>
        <Text style={styles.money}>
          {currency ? currencySymbols[currency] : '$'}{' '}
          {totalBalance.toFixed(2)}
        </Text>
      </LinearGradient>

      {/* Section Title for Expense List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>

      {/* Expense List */}
      <ScrollView
        style={styles.expenseList}
        showsVerticalScrollIndicator={false}>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.map(item => (
            <View style={styles.transactionRow} key={item.id}>
              <View style={styles.iconContainer}>
                <Image
                  style={styles.logo}
                  source={{
                    uri:
                      item.image ||
                      'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format',
                  }}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.categoryText}>
                  {item.category || 'No Category'}
                </Text>
                <Text style={styles.dateText}>
                  {item.date
                    ? new Date(item.date.seconds * 1000).toLocaleDateString()
                    : 'No Date'}
                </Text>
              </View>
              <Text style={styles.price}>
                - {currencySymbols[item.currency || currency]}
                {item.amount ? item.amount.toFixed(2) : '0.00'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No transactions found.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Expense;

// 4. Create a function that returns the StyleSheet
// This function takes width and height as arguments
const createStyles = (width, height) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: width * 0.06,
      paddingTop: height * 0.02,
      paddingBottom: height * 0.01,
    },
    headerTitle: {
      fontSize: width * 0.08,
      color: '#E0E0E0',
      fontFamily: 'Montserrat-Bold',
    },
    profileImage: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: width * 0.06,
      borderWidth: 2,
      borderColor: '#4a4e69',
    },
    balanceBox: {
      marginHorizontal: width * 0.06,
      marginVertical: height * 0.02,
      padding: 20,
      borderRadius: 25,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    balanceText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: width * 0.045,
      fontFamily: 'Montserrat-Regular',
    },
    // Adding a max font size for very large screens (like tablets)
    money: {
      fontSize: Math.min(width * 0.1, 60), // Font size will not exceed 60
      color: 'white',
      fontFamily: 'Montserrat-SemiBold',
      marginTop: 5,
    },
    sectionHeader: {
      paddingHorizontal: width * 0.06,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: width * 0.05,
      color: '#A0A0A0',
      fontFamily: 'Montserrat-SemiBold',
    },
    expenseList: {
      paddingHorizontal: width * 0.06,
    },
    transactionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E1E1E',
      borderRadius: 15,
      padding: width * 0.035,
      marginBottom: height * 0.015,
    },
    iconContainer: {
      width: width * 0.12,
      height: width * 0.12,
      borderRadius: width * 0.06,
      backgroundColor: '#333333',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    logo: {
      width: '100%',
      height: '100%',
      borderRadius: width * 0.06,
    },
    textContainer: {
      flex: 1,
    },
    categoryText: {
      fontSize: width * 0.042,
      fontFamily: 'Montserrat-SemiBold',
      color: 'white',
    },
    dateText: {
      fontSize: width * 0.032,
      color: 'gray',
      fontFamily: 'Montserrat-Regular',
      marginTop: 2,
    },
    price: {
      fontSize: width * 0.045,
      color: '#ff6b6b',
      fontFamily: 'Montserrat-SemiBold',
    },
    noData: {
      textAlign: 'center',
      color: 'gray',
      fontSize: width * 0.04,
      marginTop: 50,
      fontFamily: 'Montserrat-Regular',
    },
  });