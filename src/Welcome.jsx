import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const Welcome = ({navigation}) => {
  return (
      // <LinearGradient
      //     colors={['#00008b', '#483d8b', '#9400d3']}
      //     style={{ flex: 1 }}
      //   >
     <View style={styles.container}>
      <Text style={styles.text}>Expensr</Text>
      <Text style= {styles.para}>Track your expense in a Smart Way</Text>

      <TouchableOpacity
      onPress= {() => navigation.replace('Login')}
       style = {styles.btn}>
        <Text style ={styles.btnText}>Get Started</Text>
      </TouchableOpacity>

    </View>
    // </LinearGradient>
  );
};

export default Welcome;

const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'black'
      
  },
  text: {
    fontSize: 35,
    fontFamily:'Montserrat-SemiBold',
    color:'white'
  },

  para:{
    paddingTop:10,
    fontFamily:'Montserrat-Regular',
    fontWeight:'600',
    color:'white'
  },


  btn:{
    position:'absolute',
    bottom: '80',
    backgroundColor: 'grey',
    borderRadius: 50,
    width:'60%',
    justifyContent:'center',
    alignItems:'center',
    // borderColor:'blue',
    borderWidth:2
  },

  btnText:{
    fontSize: 20,
    padding: 15,
    // fontFamily:'Montserrat-Regular'
  }
});
