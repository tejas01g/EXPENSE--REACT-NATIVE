import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { LineChart } from 'react-native-chart-kit';

// Dummy expense data (real data can come from Firebase or local state)
const historicalData = [200, 400, 300, 500, 600, 650, 700];

// Predict next 3 days based on linear trend
const getPredictedData = (data, days = 3) => {
  const len = data.length;
  const slope = (data[len - 1] - data[0]) / (len - 1);
  const lastValue = data[len - 1];
  return Array.from({ length: days }, (_, i) => lastValue + slope * (i + 1));
};

const predictedData = getPredictedData(historicalData);

// Create labels like D1, D2, ...
const combinedLabels = [...Array(historicalData.length + predictedData.length).keys()].map(i => `D${i + 1}`);

// Combine actual + forecast data
const actualPlusPredicted = [...historicalData, ...predictedData];

const Analytics = ({ navigation }) => {
  return (
    <LinearGradient colors={['#00008b', '#483d8b', '#9400d3']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Statistics</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=687&auto=format&fit=crop',
            }}
            style={styles.profileimage}
          />
        </TouchableOpacity>
      </View>

      <LineChart
        data={{
          labels: combinedLabels,
          datasets: [
            {
              data: actualPlusPredicted,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blue - Actual
              strokeWidth: 2,
            },
            {
              data: Array(historicalData.length).fill(null).concat(predictedData),
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red - Prediction
              strokeWidth: 2,
              withDots: true,
            },
          ],
          legend: ['Actual Expenses', 'AI Forecast'],
        }}
        width={Dimensions.get('window').width - 16}
        height={250}
        yAxisSuffix="₹"
        chartConfig={{
          backgroundColor: '#fefefe',
          backgroundGradientFrom: '#fefefe',
          backgroundGradientTo: '#fefefe',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={styles.chartStyle}
      />
      <View style = {styles.spending}>
        <View style = {styles.spendcontainer}>
          <Text style = {styles.spendtext}>Total Spending</Text>
          <Text style={styles.spendamount}>$4,001.89</Text>
        </View>

         <View style= {styles.spendrow}>
            {/* <Text style = {styles.spendtext}>Due Date 10th Oct</Text> */}
          </View>
      </View>

      <View style = {styles.recentheader}>
        <Text style = {styles.recenttext}>Recent Transaction</Text>
      </View>

      <View style= {styles.recentcontainer}>
        <View style = {styles.row}>
        <View style={styles.textcontain}>
          <Text style={styles.text1}>Netflix</Text>
          <Text style = {styles.texttime}>21 Sept - 13.01</Text>
        {/* <View style = {styles.recentprice}> */}
          <Text style ={styles.recentamount}>$20.00</Text>
        </View>
        </View>
      </View>
      {/* </View> */}
    </LinearGradient>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'gray',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
  },

  spending:{
    margin:'10',
    marginLeft:'30',
    width: '85%',
    height: '13%',
    backgroundColor:'',
    borderWidth:2,
    borderColor:'black',
    borderRadius:13,
    
  },

  spendcontainer:{
    padding:'25',
    gap:10,
    
  },

  spendtext:{
    color:'white',
    flexDirection:'row',
    alignItems:'flex-end'

  },
  spendamount:{
    color:'white',
    fontSize:26,
    fontWeight:'bold'
  },
  spendrow:{
    flexDirection:'row',
     justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentheader:{
    padding:13,
    marginLeft:14
  },
  recenttext:{
    fontSize:17,
    fontWeight:'bold',
    color:'grey'
  },
  recentcontainer:{
    backgroundColor:'green',
    borderRadius:25,
    padding:12,
    marginVertical:8,
    width:'85%',
    // height:'100%',
    alignSelf:'center',
  },
  textcontain:{
    flexDirection:'column',
    justifyContent:'center',
    flex:1,

    // alignItems:'flex-start',
    // padding:13,
    // paddingTop:30,
    // marginLeft:'20%',
    // gap:1,
    // backgroundColor:'green'
  },
  text1:{
    fontSize:12,
    fontWeight:'bold',
    marginLeft:'18%'
  },
  texttime:{
    fontSize:13,
    marginLeft:'18%'
  },
  recentprice:{
     flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // padding: 25,
    // paddingTop: 29,
  },
  recentamount:{
    // flexDirection:'row',
    fontSize: 16,
  fontWeight: '600',
  color: '#000',
  marginTop: 4,
  marginLeft:'80%',
  // marginBottom:
  },
  row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
});
