import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';

const Signup = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>SignUp</Text>

      <TextInput 
      style = {styles.input}
      placeholder='Enter your name'
      placeholderTextColor='white'
      
      />     
      <TextInput
      style = {styles.input}
      placeholder='Enter your email'
      placeholderTextColor='white'
      />       
      <TextInput
      style = {styles.input}
      placeholder='Enter your password'
      placeholderTextColor='white'
      />      

      <TouchableOpacity style={styles.button}>
        <Text style= {styles.signupbtn}>Signup</Text>
     </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    gap:11,
    backgroundColor:'black'
  },

  header: {
    paddingBottom:30,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize:30,
    color:'white',
        fontFamily:'Montserrat-SemiBold'

  },

  input:{
    borderWidth:1,
    width:'80%',
    borderRadius:10,
    color:'white',
    borderColor:'#fff',
     fontFamily:'Montserrat-Regular'
  },

  button:{
    borderWidth:1,
    width:'20%',
    padding:5,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:15,
    borderColor:'white'
  },
  signupbtn:{
    color:'white',
     fontFamily:'Montserrat-Regular'
  }
});
