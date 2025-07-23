import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../src/firebaseConfig';

const Add = ({ navigation }) => {
  const [currency, setCurrency] = useState('');
  const [payment, setPayment] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAddExpense = async () => {
    if (!category || !amount || !currency || !payment) {
      Alert.alert('Please fill all fields');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('User not logged in.');
      return;
    }

    const newExpense = {
      category,
      amount: parseFloat(amount),
      currency,
      payment,
      date: Timestamp.fromDate(date),
      createdAt: Timestamp.now(),
    };
    try {
      await addDoc(collection(db, 'users', userId, 'transactions'), newExpense);
      Alert.alert('Expense added!');
      setAmount('');
      setCategory('');
      setCurrency('');
      setPayment('');
      // navigation.goBack();
    } catch (error) {
      console.error('Error adding expense:', error.message);
      Alert.alert('Failed to add expense. Try again.', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headertext}>Add Expenses</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
            }}
            style={styles.profileimage}
          />
        </TouchableOpacity>
      </View>

      {/* Scrollable Form */}
      <ScrollView
        style={{ height: '85%' }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Date and Time */}
        <View style={styles.wrapper}>
          <View style={styles.sectionBox}>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>TRANSACTION</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.value}>{date.toDateString()}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <Text style={styles.value}>
                  {date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const updatedDate = new Date(selectedDate);
                      updatedDate.setHours(date.getHours(), date.getMinutes());
                      setDate(updatedDate);
                    }
                  }}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      const updatedDate = new Date(date);
                      updatedDate.setHours(selectedTime.getHours());
                      updatedDate.setMinutes(selectedTime.getMinutes());
                      setDate(updatedDate);
                    }
                  }}
                />
              )}
            </View>
          </View>

          {/* Category */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>CATEGORY</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Electronics"
                placeholderTextColor="white"
                value={category}
                onChangeText={setCategory}
              />
            </View>
          </View>

          {/* Amount */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>AMOUNT</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5993"
                placeholderTextColor="white"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>

          {/* Currency */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>CURRENCY</Text>
              <RNPickerSelect
                onValueChange={setCurrency}
                value={currency}
                placeholder={{ label: 'Select currency...', value: null }}
                items={[
                  { label: 'Dollar', value: 'Dollar' },
                  { label: 'Rupee', value: 'Rupee' },
                  { label: 'Other', value: 'Other' },
                ]}
                style={{
                  inputIOS: styles.input,
                  inputAndroid: styles.input,
                  placeholder: { color: 'gray' },
                }}
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>PAYMENT METHOD</Text>
              <RNPickerSelect
                onValueChange={setPayment}
                value={payment}
                placeholder={{ label: 'Select Payment Method...', value: null }}
                items={[
                  { label: 'UPI', value: 'UPI' },
                  { label: 'Cash', value: 'Cash' },
                  { label: 'Other', value: 'Other' },
                ]}
                style={{
                  inputIOS: styles.input,
                  inputAndroid: styles.input,
                  placeholder: { color: 'gray' },
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Add Button */}
      <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
        <Text style={styles.btntext}>ADD</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  scrollContainer: {
    // backgroundColor:'pink',
    paddingBottom: 100,
    alignItems: 'center',
    // height: '85%',
    flexGrow: 1,
    overflow: 'scroll',
  },
  header: {
    height: '20%',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 20,
    alignSelf: 'center',
  },
  wrapper: {
    // height: '80%',
    width: '100%',
    alignItems: 'center',
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
  button: {
    // position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#2196f3',
    borderRadius: 50,
    padding: 1,
    elevation: 5,
    height: '5%',
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    fontSize: 24,
    color: '#fff',
  },
});
