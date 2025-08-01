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
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from '../src/firebaseConfig';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
  imageSizes,
  buttonSizes,
  inputSizes,
  screenDimensions,
  getResponsiveValue,
} from './utils/responsive';

const Add = ({ navigation }) => {
  const [currency, setCurrency] = useState('');
  const [payment, setPayment] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExpense = async () => {
    if (!category || !amount || !currency || !payment) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Authentication Error', 'User not logged in.');
      return;
    }

    setIsSubmitting(true);

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
      Alert.alert('Success', 'Expense added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            setAmount('');
            setCategory('');
            setCurrency('');
            setPayment('');
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding expense:', error.message);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <Text style={styles.headerSubtitle}>Track your spending</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
            }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Transaction Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeLabel}>📅 Date</Text>
              <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeLabel}>🕒 Time</Text>
              <Text style={styles.dateTimeValue}>{formatTime(date)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Food, Transport, Shopping..."
            placeholderTextColor="#666"
            value={category}
            onChangeText={setCategory}
            autoCapitalize="words"
          />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        </View>

        {/* Currency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={setCurrency}
              value={currency}
              placeholder={{ label: 'Select currency...', value: null }}
              items={[
                { label: '🇺🇸 US Dollar ($)', value: 'USD' },
                { label: '🇪🇺 Euro (€)', value: 'EUR' },
                { label: '🇬🇧 British Pound (£)', value: 'GBP' },
                { label: '🇮🇳 Indian Rupee (₹)', value: 'INR' },
                { label: '🇨🇦 Canadian Dollar (C$)', value: 'CAD' },
                { label: '🇦🇺 Australian Dollar (A$)', value: 'AUD' },
              ]}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: { color: '#666' },
              }}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={setPayment}
              value={payment}
              placeholder={{ label: 'Select payment method...', value: null }}
              items={[
                { label: '💳 Credit/Debit Card', value: 'Card' },
                { label: '💰 Cash', value: 'Cash' },
                { label: '📱 Digital Wallet', value: 'Digital Wallet' },
                { label: '🏦 Bank Transfer', value: 'Bank Transfer' },
                { label: '📊 UPI', value: 'UPI' },
                { label: '📄 Check', value: 'Check' },
              ]}
              style={{
                inputIOS: styles.pickerInput,
                inputAndroid: styles.pickerInput,
                placeholder: { color: '#666' },
              }}
            />
          </View>
        </View>

        {/* Quick Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Categories</Text>
          <View style={styles.quickCategories}>
            {['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.quickCategoryButton,
                  category === cat && styles.quickCategoryButtonActive
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.quickCategoryText,
                  category === cat && styles.quickCategoryTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.addButton,
            isSubmitting && styles.addButtonDisabled
          ]} 
          onPress={handleAddExpense}
          disabled={isSubmitting}
        >
          <Text style={styles.addButtonText}>
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date/Time Pickers */}
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
    </KeyboardAvoidingView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.lg,
    paddingTop: verticalScale(60),
    paddingBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSizes['4xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  profileButton: {
    width: scale(50),
    height: scale(50),
    borderRadius: borderRadius.full,
    borderWidth: scale(3),
    borderColor: '#390cc1',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: padding.lg,
    paddingBottom: verticalScale(120),
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.md,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateTimeLabel: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginBottom: spacing.xs,
  },
  dateTimeValue: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currencySymbol: {
    fontSize: fontSizes['2xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSizes['2xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    paddingVertical: spacing.lg,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  pickerInput: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    padding: spacing.lg,
  },
  quickCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quickCategoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickCategoryButtonActive: {
    backgroundColor: '#390cc1',
    borderColor: '#390cc1',
  },
  quickCategoryText: {
    fontSize: fontSizes.sm,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  quickCategoryTextActive: {
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: padding.lg,
    paddingVertical: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  addButton: {
    backgroundColor: '#390cc1',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#390cc1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#666',
  },
  addButtonText: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
});
