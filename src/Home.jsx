// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import LinearGradient from 'react-native-linear-gradient';
// import { db } from '../src/firebaseConfig';
// import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// const Home = ({ navigation }) => {

//     const [transactions, setTransactions] = useState([]);

//   useEffect(() => {
//     const userId = auth.currentUser?.uid;
//     if (!userId) return;

//     const q = query(collection(db, 'users', userId, 'transactions'));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       const trans = [];
//       querySnapshot.forEach((doc) => {
//         trans.push({ id: doc.id, ...doc.data() });
//       });
//       // Optional: Sort by createdAt descending
//       const sorted = trans.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
//       setTransactions(sorted);
//     });

//     return () => unsubscribe(); // Cleanup
//   }, []);

//   // const [transactions, setTransactions] = useState([]);
  
//   const quotes = [
//     'Save money, and money will save you.',
//     "Budgeting isn't limiting yourself. It's freedom.",
//     'Track your spending, not just your earnings.',
//     'Spend less than you earn—always.',
//     'Make your money work for you.',
//     'Avoid impulse buys—pause and plan.',
//     'Little savings grow big over time.',
//     'Stick to your budget, and build wealth.',
//     'Be mindful, not stingy.',
//     'Smart money = peaceful mind.',
//   ];
//   const [quote, setQuote] = useState('');


//   useEffect(() => {
//     const getRandomQuote = () => {
//       const index = Math.floor(Math.random() * quotes.length);
//       setQuote(quotes[index]);
//     };

//     getRandomQuote();
//     const interval = setInterval(getRandomQuote, 60000);

//     return() => clearInterval(interval);
//   },[],
  
// );
//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.text}>Home</Text>

//         <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
//           <Image
//             source={{
//               uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//             }}
//             style={styles.profileimage}
//           />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.chartContainer}>
//         <AnimatedCircularProgress
//           size={200}
//           width={25}
//           fill={45}
//           tintColor="#00e0ff"
//           tintColorSecondary="#8e2de2"
//           backgroundColor="#2d2f4a"
//           arcSweepAngle={360}
//           rotation={135}
//           lineCap="round"
//         >
//           {() => (
//             <View style={styles.innercontent}>
//               <Text style={styles.balance}>$1159</Text>
//               <Text style={styles.label}>Available Balance</Text>
//             </View>
//           )}
//         </AnimatedCircularProgress>
//       </View>

//       {/* <LinearGradient colors={['#8b008b', '#9932cc', '#ff00ff']} style ={styles.thought}>   */}
//       <View style={styles.thought}>
//         <Text style={styles.thoughttxt}>Tip of the day</Text>

//         <Text style={styles.thoughtdata}>{quote}</Text>
//       </View>
//       {/* </LinearGradient> */}
//       {/* Second header */}

//       <View style={styles.secheader}>
//         <Text style={styles.expense}>Expenses</Text>
//       </View>

//       <ScrollView style={styles.expenselist}>
//         {Array. isArray(transactions) && transactions.length > 0 ?(
//            transactions.map((item) => (
//            <View style={styles.row} key={item.id}>
       
//     <Image
//       style={styles.logo}
//       source={{
//         uri:
//         item.image ||
//         'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop',
//       }}
//       /> )) ):(
//          <Text style={styles.noData}>No transactions found.</Text>
//       )};
          
//     <View style={styles.textContainer}>
//       <Text style={styles.contain1}>{item.category || 'No Category'}</Text>
//       <Text style={styles.time}>
//         {item.date
//           ? new Date(item.date.seconds * 1000).toLocaleDateString()
//           : 'No Date'}
//       </Text>
//     </View>
//     <Text style={styles.price}>
//       ${item.amount ? item.amount.toFixed(2) : '0.00'}
//     </Text>
//   </View>
//         // <View style={styles.row} key = {item.id}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>{item.category}</Text>
//         //     <Text style={styles.time}>{item.date}</Text>
//         //   </View>
//         //   <Text style={styles.price}>{item.amount}</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         // <View style={styles.row}>
//         //   <Image
//         //     style={styles.logo}
//         //     source={{
//         //       uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         //     }}
//         //   />
//         //   <View style={styles.textContainer}>
//         //     <Text style={styles.contain1}>Nike Air Max 2090</Text>
//         //     <Text style={styles.time}>09 Oct 2023</Text>
//         //   </View>
//         //   <Text style={styles.price}>-$50</Text>
//         // </View>
//         ))}
//       </ScrollView>
//     </View>
//     // </LinearGradient>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'black',
//   },
//   text: {
//     fontSize: 25,
//     color: 'white',
//     fontFamily: 'Montserrat-SemiBold',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '4%',
//     paddingTop: '15%',
//   },
//   profileimage: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: '#390cc1ff',
//   },

//   chartContainer: {
//     marginTop: '4%',
//     alignItems: 'center',
//   },
//   innercontent: {
//     alignItems: 'center',
//   },
//   balance: {
//     fontSize: 22,
//     // fontWeight: 'bold',
//     fontFamily: 'Montserrat-SemiBold',
//     color: 'white',
//   },
//   label: {
//     fontSize: 14,
//     color: 'white',
//     fontFamily: 'Montserrat-Regular',
//   },

//   thought: {
//     backgroundColor: 'transparent',
//     marginLeft: '8%',
//     marginTop: '9%',
//     width: '85%',
//     height: '10%',
//     paddingLeft: '5%',
//     borderWidth: 1,
//     borderColor: '#301a6dff',
//     borderRadius: 15,
//     gap: '2%',
//     justifyContent: 'center',
//   },

//   thoughttxt: {
//     fontSize: 14,
//     paddingBottom: '5%',
//     color: 'white',
//     fontFamily: 'Montserrat-Regular',
//   },
//   thoughtdata: {
//     fontSize: 16,
//     marginBottom: '8%',
//     color: 'white',
//     // fontWeight: 'bold',
//     fontFamily: 'Montserrat-SemiBold',
//   },

//   secheader: {},

//   expense: {
//     paddingTop:'9%',
//     padding: '6%',
//     fontSize: 25,
//     color:'white',
//     fontFamily: 'Montserrat-SemiBold',
//     // fontWeight: 'bold',
//   },

//   contain1: {
//     paddingLeft: '8%',
//     fontSize: 16,
//     fontWeight: '500',
//     color: 'white',
//     fontFamily: 'Montserrat-Regular',
//     // width:'200%',
//     // height:'40'
//   },
//   expenselist: {
//     padding: 16,
//   },
//   row: {
//     gap: '5%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     // backgroundColor: 'blue',
//     justifyContent: 'space-between',
//     marginBottom: '5%',
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     borderRadius: 50,
//   },
//   time: {
//     fontSize: 10,
//     // fontWeight: 'bold',
//     paddingLeft: '11%',
//     marginBottom: '5%',
//     color: 'white',
//     fontFamily: 'Montserrat-SemiBold',
//   },
//   textContainer: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'center',
//   },

//   price: {
//     fontSize: 16,
//     // fontWeight: 600,
//     color: 'red',
//     marginLeft: '5%',
//     fontFamily: 'Montserrat-SemiBold',
//   },
// });


import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { auth, db } from '../src/firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';

const Home = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = query(collection(db, 'users', userId, 'transactions'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trans = [];
      querySnapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      const sorted = trans.sort(
        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
      );
      setTransactions(sorted);
    });

    return () => unsubscribe();
  }, []);

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

  const [quote, setQuote] = useState('');
  useEffect(() => {
    const getRandomQuote = () => {
      const index = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[index]);
    };

    getRandomQuote();
    const interval = setInterval(getRandomQuote, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.text}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format',
            }}
            style={styles.profileimage}
          />
        </TouchableOpacity>
      </View>

      {/* Balance Chart */}
      <View style={styles.chartContainer}>
        <AnimatedCircularProgress
          size={200}
          width={25}
          fill={45}
          tintColor="#00e0ff"
          tintColorSecondary="#8e2de2"
          backgroundColor="#2d2f4a"
          arcSweepAngle={360}
          rotation={135}
          lineCap="round">
          {() => (
            <View style={styles.innercontent}>
              <Text style={styles.balance}>$1159</Text>
              <Text style={styles.label}>Available Balance</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* Tip of the Day */}
      <View style={styles.thought}>
        <Text style={styles.thoughttxt}>Tip of the day</Text>
        <Text style={styles.thoughtdata}>{quote}</Text>
      </View>

      {/* Expenses Header */}
      <View style={styles.secheader}>
        <Text style={styles.expense}>Expenses</Text>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.expenselist}>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions.map((item) => (
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
                <Text style={styles.contain1}>{item.category || 'No Category'}</Text>
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
          <Text style={styles.noData}>No transactions found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4%',
    paddingTop: '15%',
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#390cc1ff',
  },

  chartContainer: {
    marginTop: '4%',
    alignItems: 'center',
  },
  innercontent: {
    alignItems: 'center',
  },
  balance: {
    fontSize: 22,
    // fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
    color: 'white',
  },
  label: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },

  thought: {
    backgroundColor: 'transparent',
    marginLeft: '8%',
    marginTop: '9%',
    width: '85%',
    height: '10%',
    paddingLeft: '5%',
    borderWidth: 1,
    borderColor: '#301a6dff',
    borderRadius: 15,
    gap: '2%',
    justifyContent: 'center',
  },

  thoughttxt: {
    fontSize: 14,
    paddingBottom: '5%',
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  thoughtdata: {
    fontSize: 16,
    marginBottom: '8%',
    color: 'white',
    // fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
  },

  secheader: {},

  expense: {
    paddingTop:'9%',
    padding: '6%',
    fontSize: 25,
    color:'white',
    fontFamily: 'Montserrat-SemiBold',
    // fontWeight: 'bold',
  },

  contain1: {
    paddingLeft: '8%',
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    fontFamily: 'Montserrat-Regular',
    // width:'200%',
    // height:'40'
  },
  expenselist: {
    padding: 16,
  },
  row: {
    gap: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
    justifyContent: 'space-between',
    marginBottom: '5%',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  time: {
    fontSize: 10,
    // fontWeight: 'bold',
    paddingLeft: '11%',
    marginBottom: '5%',
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
    // fontWeight: 600,
    color: 'red',
    marginLeft: '5%',
    fontFamily: 'Montserrat-SemiBold',
  },
});
