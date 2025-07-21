import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Add = ({ navigation }) => {
  const [currency, setCurrency] = useState('');

  return (
    <View style={styles.container}>
      {/* Header Section */}
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

      {/* Transaction Time Section */}
      {/* <ScrollView> */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionContent}>
          <Text style={styles.label}>TRANSACTION</Text>
          <Text style={styles.value}>2:05p.m | Sep 01, 2025</Text>
        </View>
      </View>

      {/* Category Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionContent}>
          <Text style={styles.label}>CATEGORY</Text>
          <TextInput
            style={styles.input}
            placeholder="Electronics"
            placeholderTextColor="white"
          />
        </View>
      </View>

      {/* Amount Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionContent}>
          <Text style={styles.label}>AMOUNT</Text>
          <TextInput
            style={styles.input}
            placeholder="$5993"
            placeholderTextColor="white"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Currency Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionContent}>
          <Text style={styles.label}>CURRENCY</Text>
          <RNPickerSelect
            onValueChange={value => setCurrency(value)}
            value={currency}
            placeholder={{ label: 'Select currency...', value: null }}
            items={[
              { label: 'Dollar', value: 'dollar' },
              { label: 'Rupee', value: 'rupee' },
              { label: 'Other', value: 'other' },
            ]}
            style={{
              inputIOS: styles.input,
              inputAndroid: styles.input,
              placeholder: {
                color: 'gray',
              },
            }}
          />
        </View>
      </View>

      {/* Payment Method Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionContent}>
          <Text style={styles.label}>PAYMENT METHOD</Text>
          <Text style={styles.value}>Physical Cash</Text>
        </View>
      </View>
      
      <TouchableOpacity style = {styles.button}>
        <Text style = {styles.btntext}>ADD</Text>
      </TouchableOpacity>
    </View>
    
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headertext: {
    fontSize: 25,
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#230771ff',
  },
  sectionBox: {
    width: '85%',
    backgroundColor: '#181819',
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: 'blue',
    borderRadius: 30,
  },
  sectionContent: {
    padding: 13,
    gap: 20,
  },
  label: {
    color: 'white',
    fontFamily: 'Montserrat-Regular',
  },
  value: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  input: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  btntext:{
    
    color:'white',
    padding:10
  },
  button:{
    marginTop:44,
    justifyContent:'center',
    alignItems:'center',
    width:'25%',
    borderWidth: 1,
    borderColor:'white',
    borderRadius:10,
  }
});
