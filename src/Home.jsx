import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';



const Home = ({navigation}) => {
  return (
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

      <View style = {styles.chartContainer}>
        <AnimatedCircularProgress
        size={180}
        width={20}
        fill={45}
        tintColor='#00e0ff'
        tintColorSecondary = '#8e2de2'
        backgroundColor='#2d2f4a'
        arcSweepAngle={360}
        rotation={135}
        lineCap='round'
        >
            {() =>(
                <View style = {styles.innercontent}>
                    <Text style = {styles.balance}>$11889</Text>
                    <Text style ={styles.label}>Available Balance</Text>
                </View>
            )}
        </AnimatedCircularProgress>
      </View>

      <View style ={styles.thought}>
        <Text style = {styles.thoughttxt}>Tip of the day</Text>

        <Text style = {styles.thoughtdata}>Prepare a Budget and Abide by it</Text>
      </View>
    </View>
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

  chartContainer:{
    marginTop: 40,
    alignItems:'center',
  },

  innercontent:{
    alignItems:'center',
  },
  balance:{
    fontSize:22,
    fontWeight:'bold',
    color:'navyblue',
  },
  label:{
    fontSize:14,
    color: 'black'
  },

  thought:{
    marginLeft:'25',
    marginTop:'15',
    width:'85%',
    height:'10%',
    // backgroundColor:'green',
    // alignItems:'center'
    paddingLeft:'14',
    borderWidth:1,
    borderColor:'blue',
    borderRadius:15,
    gap:30
},
  thoughttxt:{
    fontSize:14
  },
  thoughtdata:{

  }
});
