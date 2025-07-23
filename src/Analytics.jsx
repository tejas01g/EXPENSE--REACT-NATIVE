import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../src/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; // FIXED: added orderBy

const Analytics = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'users', auth.currentUser.uid, 'transactions'),
      orderBy('createdAt', 'desc') // FIXED: this is needed for sorting
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
        const dateKey = new Date(item.date?.seconds * 1000).toLocaleDateString();
        dailySums[dateKey] = (dailySums[dateKey] || 0) + Number(item.amount || 0);
      });

      const dailyAmounts = Object.values(dailySums);
      setHistoricalData(dailyAmounts);
    });

    return () => unsubscribe();
  }, []);

  // Forecasting logic
  const getPredictedData = (data, days = 3) => {
    const len = data.length;
    if (len < 2) return Array(days).fill(data[len - 1] || 0); // safe fallback
    const slope = (data[len - 1] - data[0]) / (len - 1);
    const lastValue = data[len - 1];
    return Array.from({ length: days }, (_, i) => lastValue + slope * (i + 1));
  };

  const predictedData = getPredictedData(historicalData);
  const combinedLabels = [...Array(historicalData.length + predictedData.length).keys()].map(
    i => `D${i + 1}`
  );
  const actualPlusPredicted = [...historicalData, ...predictedData];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Statistics</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop',
            }}
            style={styles.profileimage}
          />
        </TouchableOpacity>
      </View>

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
        width={Dimensions.get('window').width - 16}
        height={250}
        yAxisSuffix="₹"
        chartConfig={{
          backgroundColor: '#fefefe',
          backgroundGradientFrom: '#fefefe',
          backgroundGradientTo: '#fefefe',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={styles.chartStyle}
      />

      <View style={styles.spending}>
        <View style={styles.spendcontainer}>
          <Text style={styles.spendtext}>Total Spending</Text>
          <Text style={styles.spendamount}>${totalBalance.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.recentheader}>
        <Text style={styles.recenttext}>Recent Transactions</Text>
      </View>

      <ScrollView>
        {transactions.length > 0 ? (
          transactions.map(item => (
            <View style={styles.row} key={item.id}>
              <Image
                style={styles.logo}
                source={{
                  uri:
                    item.image ||
                    'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80',
                }}
              />
              <View style={styles.textContainer}>
                <Text style={styles.contain1}>
                  {item.category || 'No Category'}
                </Text>
                <Text style={styles.time}>
                  {item.date
                    ? new Date(item.date.seconds * 1000).toLocaleDateString()
                    : 'No Date'}
                </Text>
              </View>
              <Text style={styles.price}>
                ${item.amount ? item.amount.toFixed(2) : '0.00'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.spendtext, { textAlign: 'center' }]}>
            No transactions yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
    paddingTop: 29,
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#131dd6ff',
  },
  text: {
    fontSize: 28,
    // fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
  },

  spending: {
    margin: '10',
    marginLeft: '30',
    width: '85%',
    height: '13%',
    backgroundColor: '',
    borderWidth: 2,
    borderColor: 'blue',
    borderRadius: 13,
  },

  spendcontainer: {
    padding: '25',
    gap: 10,
  },

  spendtext: {
    color: 'white',
    flexDirection: 'row',
    alignItems: 'flex-end',
    fontFamily: 'Montserrat-Regular',
  },
  spendamount: {
    color: 'white',
    fontSize: 26,
    // fontWeight:'bold'
    fontFamily: 'Montserrat-SemiBold',
  },
  spendrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentheader: {
    padding: 13,
    marginLeft: 14,
  },
  recenttext: {
    fontSize: 17,
    // fontWeight:'bold',
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },
  recentcontainer: {
    backgroundColor: 'green',
    borderRadius: 25,
    padding: 12,
    marginVertical: 8,
    width: '85%',
    // height:'100%',
    alignSelf: 'center',
  },
  textcontain: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,

    // alignItems:'flex-start',
    // padding:13,
    // paddingTop:30,
    // marginLeft:'20%',
    // gap:1,
    // backgroundColor:'green'
  },
  text1: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: '18%',
  },
  texttime: {
    fontSize: 13,
    marginLeft: '18%',
  },
  recentprice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: 25,
    // paddingTop: 29,
  },
  recentamount: {
    // flexDirection:'row',
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
    marginLeft: '80%',
    // marginBottom:
  },
  //   row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },

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
    paddingLeft: 30,
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
