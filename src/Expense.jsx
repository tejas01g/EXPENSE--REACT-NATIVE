import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../src/firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

const Expense = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

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

      const total = trans.reduce(
        (acc , curr) => acc + Number(curr.amount || 0),0,
      );
      setTotalBalance(total)
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Expenses</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            style={styles.profileimage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.balancebox}>
        <View style={styles.textcontainer}>
          <Text style={styles.balancetext}>My Balance</Text>
          <Text style={styles.money}>${totalBalance.toFixed(2)}</Text>
        </View>
      </View>

      <ScrollView style={styles.expenselist}>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.map(item => (
            <View style={styles.row} key={item.id}>
              <Image
                style={styles.logo}
                source={{
                  uri:
                    item.image ||
                    'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format',
                }}
              />
              <View style={styles.textContainer}>
                <Text style={styles.contain1}>
                  {item.category || 'No Category'}
                </Text>
                <Text style={styles.time}>
                  {' '}
                  {item.date
                    ? new Date(item.date.seconds * 1000).toLocaleDateString()
                    : 'No Date'}
                </Text>
              </View>
              <Text style={styles.price}>
                {' '}
                ${item.amount ? item.amount.toFixed(2) : '0.00'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No transactions found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Expense;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    paddingTop: 29,
  },
  text: {
    fontSize: 28,
    color: 'gray',
    // fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
  },

  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#200972ff',
  },

  balancebox: {
    // paddingLeft:10,
    margin: '25',
    width: '87%',
    height: '15%',
    backgroundColor: '#595860ff',
    borderColor: '#091e95ff',
    borderRadius: 30,
  },

  textcontainer: {},

  balancetext: {
    padding: 10,
    marginLeft: 12,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  money: {
    fontSize: 50,
    color: 'white',
    // fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'Montserrat-SemiBold',
  },
  contain1: {
    paddingLeft: 10,
    fontSize: 19,
    // fontWeight: '500',
    fontFamily: 'Montserrat-Regular',
    color: 'white',

    // width:'200%',
    // height:'40'
  },
  expenselist: {
    padding: 16,
  },
  row: {
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 40,
    padding: '20',
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181819ff',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  time: {
    fontSize: 12,
    // fontWeight: 'bold',
    paddingLeft: 10,
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  price: {
    fontSize: 16,
    // fontWeight:600,
    color: 'red',
    marginLeft: 10,
    fontFamily: 'Montserrat-SemiBold',
  },
  contain1: {
    paddingLeft: 10,
    fontSize: 19,
    // fontWeight: '500',
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    // width:'200%',
    // height:'40'
  },
});
