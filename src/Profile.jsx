import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';

const Profile = ({navigation}) => {
  return (
 
     <LinearGradient colors={['#00008b', '#483d8b', '#9400d3']} style={{flex:1}}>
           <View>
       <Text>Profile</Text>
     </View>
     </LinearGradient>
  )
}

export default Profile;

const styles = StyleSheet.create({
    
})