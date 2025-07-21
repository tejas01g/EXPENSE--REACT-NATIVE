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
import LinearGradient from 'react-native-linear-gradient';


const Home = ({ navigation }) => {
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

    return() => clearInterval(interval);
  },[]);
  return (
    // <LinearGradient
    //   colors={['#00008b', '#483d8b', '#9400d3']}
    //   style={{ flex: 1 }}
    // >
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Home</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            style={styles.profileimage}
          />
        </TouchableOpacity>
      </View>

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
          lineCap="round"
        >
          {() => (
            <View style={styles.innercontent}>
              <Text style={styles.balance}>$1159</Text>
              <Text style={styles.label}>Available Balance</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* <LinearGradient colors={['#8b008b', '#9932cc', '#ff00ff']} style ={styles.thought}>   */}
      <View style={styles.thought}>
        <Text style={styles.thoughttxt}>Tip of the day</Text>

        <Text style={styles.thoughtdata}>{quote}</Text>
      </View>
      {/* </LinearGradient> */}
      {/* Second header */}

      <View style={styles.secheader}>
        <Text style={styles.expense}>Expenses</Text>
      </View>

      <ScrollView style={styles.expenselist}>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
        <View style={styles.row}>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?q=80&w=1490&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contain1}>Nike Air Max 2090</Text>
            <Text style={styles.time}>09 Oct 2023</Text>
          </View>
          <Text style={styles.price}>-$50</Text>
        </View>
      </ScrollView>
    </View>
    // </LinearGradient>
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
    padding: 25,
    paddingTop: 29,
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#390cc1ff',
  },

  chartContainer: {
    marginTop: 20,
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
    marginLeft: 25,
    marginTop: 16,
    width: '85%',
    height: '10%',
    paddingLeft: 14,
    borderWidth: 1,
    borderColor: '#301a6dff',
    borderRadius: 15,
    gap: 1,
    justifyContent: 'center',
  },

  thoughttxt: {
    fontSize: 14,
    paddingBottom: 20,
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  thoughtdata: {
    fontSize: 16,
    marginBottom: 17,
    color: 'white',
    // fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
  },

  secheader: {},
  expense: {
    padding: 13,
    fontSize: 25,
    // fontWeight: 'bold',
  },

  contain1: {
    paddingLeft: 30,
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
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  time: {
    fontSize: 10,
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
    fontWeight: 600,
    color: 'red',
    marginLeft: 10,
    fontFamily: 'Montserrat-SemiBold',
  },
});
