import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const Expense = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#00008b', '#483d8b', '#9400d3']}
      style={{ flex: 1 }}
    >
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
            <Text style={styles.money}>$1,25,844</Text>
          </View>
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

export default Expense;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
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
    fontWeight: 'bold',
  },

  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4caf50',
  },

  balancebox: {
    // paddingLeft:10,
    margin: '25',
    width: '87%',
    height: '15%',
    backgroundColor: '#9400d3',
    borderColor: '#9400d3',
    borderRadius: 30,
  },

  textcontainer: {},

  balancetext: {
    padding: 10,
    marginLeft: 12,
    color: 'white',
    fontSize: 16,
  },
  money: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
   contain1: {
    paddingLeft: 10,
    fontSize: 19,
    fontWeight: '500',
    color:'white',
    // width:'200%',
    // height:'40'
  },
  expenselist: {
    padding: 16,
  },
  row: {
    borderWidth:1,
    borderColor:'#00bfff',
    borderRadius:40,
    padding:'20',
    gap:15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191970',
    justifyContent:'space-between',
    marginBottom:16
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  time: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingLeft: 30,
    marginBottom: 10,
    color:'gray',
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
  contain1: {
    paddingLeft: 10,
    fontSize: 19,
    fontWeight: '500',
    color:'white',
    // width:'200%',
    // height:'40'
  },
});
