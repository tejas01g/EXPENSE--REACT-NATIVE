import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import LinearGradient from 'react-native-linear-gradient';


const Home = ({ navigation }) => {
  return (

    <LinearGradient colors={['#00008b', '#483d8b', '#9400d3']} style={{flex:1}}>
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
          size={180}
          width={20}
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
              <Text style={styles.balance}>$11889</Text>
              <Text style={styles.label}>Available Balance</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>

      {/* <LinearGradient colors={['#00008b','#483d8b','#696969']}>  */}
      <View style={styles.thought}>
        <Text style={styles.thoughttxt}>Tip of the day</Text>

        <Text style={styles.thoughtdata}>Prepare a Budget and Abide by it</Text>
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
      </LinearGradient>
      
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 25,
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
    borderColor: '#4caf50',
  },

  chartContainer: {
    marginTop: 40,
    alignItems: 'center',
  },

  innercontent: {
    alignItems: 'center',
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'navyblue',
  },
  label: {
    fontSize: 14,
    color: 'black',
  },

  thought: {
    marginLeft: '25',
    marginTop: '15',
    width: '85%',
    height: '10%',
    // backgroundColor: 'green',
    // alignItems:'center'
    paddingLeft: '14',
    borderWidth: 1,
    borderColor: '#8b008b',
    borderRadius: 15,
    gap: 30,
  },
  thoughttxt: {
    fontSize: 14,
  },
  thoughtdata: {},

  secheader: {},
  expense: {
    padding: 13,
    fontSize: 25,
    fontWeight: 'bold',
  },

  contain1: {
    paddingLeft: 30,
    fontSize: 16,
    fontWeight: '500',
    // width:'200%',
    // height:'40'
  },
  expenselist: {
    padding: 16,
  },
  row: {
    gap:15,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
    justifyContent:'space-between',
    marginBottom:16
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  time: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingLeft: 30,
    marginBottom: 10,
  },
  textContainer: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  price: {
    fontSize:16,
    fontWeight:600,
    color: 'red',
    marginLeft:10
  },
});
