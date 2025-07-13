import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
// import { withDecay } from 'react-native-reanimated';

const Add = ({ navigation }) => {
  return (
    // <LinearGradient
    //   colors={['#00008b', '#483d8b', '#9400d3']}
    //   style={{ flex: 1 }}
    // >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headertext}>Add Expenses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
              }}
              style={styles.profileimage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.transaction}>
          <View style={styles.transcontainer}>
            <Text style={styles.transtext}>TRANSACTION</Text>
            <Text style={styles.transtime}>2:05p.m | Sep 01,2025</Text>
          </View>
        </View>

        <View style={styles.category}>
          <View style={styles.categorycontainer}>
            <Text style={styles.cattext}>CATEGORY</Text>
            <Text style={styles.catitem}>Electronics</Text>
          </View>
        </View>

         <View style={styles.amount}>
          <View style={styles.amountcontainer}>
            <Text style={styles.amounttext}>AMOUNT</Text>
            <Text style={styles.amountitem}>$2,999</Text>
          </View>
        </View>

         <View style={styles.currency}>
          <View style={styles.currencycontainer}>
            <Text style={styles.currencytext}>CURRENCY</Text>
            <Text style={styles.currencyitem}>DOLLAR($)</Text>
          </View>
        </View>

         <View style={styles.payment}>
          <View style={styles.paymentcontainer}>
            <Text style={styles.paymenttext}>PAYMENT METHOD</Text>
            <Text style={styles.paymentitem}>Physical Cash</Text>
          </View>
        </View>
      </View>
    // </LinearGradient>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor:'black'
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
    borderColor: '#230771ff',
  },
  headertext: {
    fontSize: 25,
    // fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },

  transaction: {
    marginTop:'26',
    width: '85%',
    height: '12%',
    backgroundColor: '#181819ff',
    margin: 10,
    marginLeft: '30',
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 30,
    // fontFamily: 'Montserrat-Regular',
    
  },

  transcontainer: {
    padding: 13,
    gap: 25,
  },

  transtext: {
    color:'white',
    fontFamily: 'Montserrat-Regular',
  },

  transtime:{
    color:'white',
    // fontWeight:'bold',
    fontSize:16,
    fontFamily: 'Montserrat-SemiBold',
  },

   category: {
    width: '85%',
    height: '12%',
    backgroundColor: '#181819ff',
    margin: 10,
    marginLeft: '30',
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 30,
  },

  categorycontainer: {
    padding: 13,
    gap: 25,
  },

  cattext: {
    color:'white',
    fontFamily: 'Montserrat-Regular',
  },

  catitem:{
    color:'white',
    // fontWeight:'bold',
    fontFamily: 'Montserrat-SemiBold',
    fontSize:16,
  },

   amount: {
    width: '85%',
    height: '12%',
    backgroundColor: '#181819ff',
    margin: 10,
    marginLeft: '30',
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 30,
  },

  amountcontainer: {
    padding: 13,
    gap: 25,
  },

  amounttext: {
    color:'white',
    fontFamily: 'Montserrat-Regular',
  },
  amountitem:{
    color:'white',
    // fontWeight:'bold',
    fontFamily: 'Montserrat-SemiBold',
    fontSize:16,
  },

  currency: {
    width: '85%',
    height: '12%',
    backgroundColor: '#181819ff',
    margin: 10,
    marginLeft: '30',
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 30,
  },

  currencycontainer: {
    padding: 13,
    gap: 25,
  },

  currencytext: {
    color:'white',
    fontFamily: 'Montserrat-Regular',
    
  },

  currencyitem:{
    color:'white',
    // fontWeight:'bold',
    fontFamily: 'Montserrat-SemiBold',
    fontSize:16,
  },

  payment: {
    width: '85%',
    height: '12%',
    backgroundColor: '#181819ff',
    margin: 10,
    marginLeft: '30',
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 30,
  },

  paymentcontainer: {
    padding: 13,
    gap: 25,
  },

  paymenttext: {
    color:'white',
    fontFamily: 'Montserrat-Regular',
    // fontFamily: 'Montserrat-SemiBold',
  },
  paymentitem:{
    color:'white',
    // fontWeight:'bold',
    fontSize:16,
    fontFamily: 'Montserrat-SemiBold',
  }
});
