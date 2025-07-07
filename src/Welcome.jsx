import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const Welcome = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome</Text>
      <Text style= {styles.para}>Track your expense in a Smart Way</Text>

      <TouchableOpacity
      onPress= {() => navigation.navigate('Home')}
       style = {styles.btn}>
        <Text style ={styles.btnText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  text: {
    fontSize: 30,
  },

  para:{
    paddingTop:10,
  },


  btn:{
    position:'absolute',
    bottom: '80',
    backgroundColor: 'green',
    borderRadius: 50,
    width:'60%',
    justifyContent:'center',
    alignItems:'center',
  },

  btnText:{
    fontSize: 20,
    padding: 15
  }
});
