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
});
