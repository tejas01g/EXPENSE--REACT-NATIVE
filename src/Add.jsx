import React, { useState, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addDoc, collection, Timestamp, doc, getDoc, setDoc, updateDoc, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../src/firebaseConfig';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
  getResponsiveValue,
  headerDimensions,
  navigationDimensions,
} from './utils/responsive';
import { useUserProfile } from './hooks/useUserProfile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar } from 'react-native-paper';

const Add = ({ navigation }) => {
  const [currency, setCurrency] = useState('USD');
  const [payment, setPayment] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDuration, setTargetDuration] = useState('');
  const [targetStartDate, setTargetStartDate] = useState(new Date());
  const [targetEndDate, setTargetEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const [description, setDescription] = useState('');
  const { profileImageUrl, userName } = useUserProfile();

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
    CAD: 'C$',
    AUD: 'A$',
  };

  // Load user's target and expenses on component mount
  useEffect(() => {
    loadUserTargetAndExpenses();
  }, []);

  const loadUserTargetAndExpenses = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      // Load target
      const targetRef = doc(db, 'users', userId, 'targets', 'current');
      const targetSnap = await getDoc(targetRef);
      
      if (targetSnap.exists()) {
        const targetData = targetSnap.data();
        setCurrentTarget(targetData);
        setTargetAmount(targetData.amount?.toString() || '');
        setTargetDuration(targetData.duration || '');
        setTargetStartDate(targetData.startDate?.toDate() || new Date());
        setTargetEndDate(targetData.endDate?.toDate() || new Date());
        setTotalSpent(targetData.spent || 0);
        
        // Calculate remaining balance and progress
        calculateRemainingBalanceAndProgress(targetData);
      }
    } catch (error) {
      console.error('Error loading target:', error);
    }
  };

  const calculateRemainingBalanceAndProgress = (targetData) => {
    if (!targetData || !targetData.amount) return;
    
    const spent = targetData.spent || 0;
    const remaining = targetData.amount - spent;
    setRemainingBalance(remaining);
    setTargetProgress((spent / targetData.amount) * 100);
  };

  const handleAddExpense = async () => {
    // Validate all required fields
    if (!category || !amount || !currency || !payment) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    // Validate amount is a valid number
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }

    // Check if amount exceeds remaining target balance
    if (currentTarget && currentTarget.amount) {
      const newTotalSpent = totalSpent + amountNum;
      if (newTotalSpent > currentTarget.amount) {
        Alert.alert(
          'Target Exceeded',
          `This expense will exceed your target balance by ${currencySymbols[currency] || '$'}${(newTotalSpent - currentTarget.amount).toFixed(2)}. Continue anyway?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Continue', onPress: () => saveExpense(amountNum) }
          ]
        );
        return;
      }
    }

    await saveExpense(amountNum);
  };

  const saveExpense = async (amountNum) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Authentication Error', 'User not logged in.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare expense data
      const expenseData = {
        category,
        amount: amountNum,
        currency,
        payment,
        date: Timestamp.fromDate(date),
        createdAt: Timestamp.now(),
        userId: userId,
        hasTarget: !!currentTarget,
        type: 'expense', // Important: Specify this is an expense
        description: description || '',
      };

      // Only add targetId if currentTarget exists
      if (currentTarget) {
        expenseData.targetId = 'current';
      }

      // Add expense to transactions collection
      const expenseRef = await addDoc(collection(db, 'users', userId, 'transactions'), expenseData);
      console.log('Expense added with ID:', expenseRef.id);
      
      // Update target spent amount if target exists
      if (currentTarget) {
        const targetRef = doc(db, 'users', userId, 'targets', 'current');
        const newSpent = (currentTarget.spent || 0) + amountNum;
        
        await updateDoc(targetRef, { 
          spent: newSpent,
          updatedAt: Timestamp.now()
        });
        
        // Update local state
        const updatedTarget = { ...currentTarget, spent: newSpent };
        setCurrentTarget(updatedTarget);
        setTotalSpent(newSpent);
        calculateRemainingBalanceAndProgress(updatedTarget);
      }

      // Also update user's total balance in user document
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const currentBalance = userData.totalBalance || 0;
          const newBalance = currentBalance - amountNum; // Subtract expense from balance
          
          await updateDoc(userRef, {
            totalBalance: newBalance,
            lastUpdated: Timestamp.now()
          });
        }
      } catch (userError) {
        console.log('Could not update user balance:', userError);
        // Continue anyway, this is optional
      }

      Alert.alert('Success', 'Expense added successfully!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding expense:', error.message, error.code);
      Alert.alert('Error', `Failed to add expense: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetTarget = async () => {
    if (!targetAmount || !targetDuration) {
      Alert.alert('Missing Information', 'Please fill all target fields');
      return;
    }

    // Validate target amount
    const targetAmountNum = parseFloat(targetAmount);
    if (isNaN(targetAmountNum) || targetAmountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid target amount greater than 0');
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      // Set end date based on duration
      let endDate = new Date(targetStartDate);
      switch(targetDuration) {
        case 'daily':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case 'weekly':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'yearly':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
        case 'custom':
          // Use the manually selected end date
          break;
        default:
          endDate.setMonth(endDate.getMonth() + 1); // Default to monthly
      }

      const targetData = {
        amount: targetAmountNum,
        duration: targetDuration,
        startDate: Timestamp.fromDate(targetStartDate),
        endDate: Timestamp.fromDate(endDate),
        createdAt: Timestamp.now(),
        spent: 0,
        userId: userId,
        currency: currency || 'USD'
      };

      const targetRef = doc(db, 'users', userId, 'targets', 'current');
      await setDoc(targetRef, targetData);
      
      // Update local state
      setCurrentTarget(targetData);
      setTargetEndDate(endDate);
      setTotalSpent(0);
      setRemainingBalance(targetAmountNum);
      setTargetProgress(0);
      setShowTargetModal(false);
      
      Alert.alert('Success', 'Spending target set successfully!');
    } catch (error) {
      console.error('Error setting target:', error);
      Alert.alert('Error', 'Failed to set target. Please try again.');
    }
  };

  const removeTarget = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const targetRef = doc(db, 'users', userId, 'targets', 'current');
      // You can either delete the document or set spent to 0
      await updateDoc(targetRef, {
        spent: 0,
        isActive: false
      });
      
      setCurrentTarget(null);
      setTotalSpent(0);
      setRemainingBalance(0);
      setTargetProgress(0);
      setShowTargetModal(false);
      Alert.alert('Target Reset', 'Your spending target has been reset.');
    } catch (error) {
      console.error('Error removing target:', error);
      Alert.alert('Error', 'Failed to remove target');
    }
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setCurrency('USD');
    setPayment('');
    setDate(new Date());
    setDescription('');
  };

  const formatDate = dateToFormat => {
    return dateToFormat.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = dateToFormat => {
    return dateToFormat.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = dateToFormat => {
    return dateToFormat.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getBottomPosition = () => {
    if (Platform.OS === 'ios') {
      return navigationDimensions.height + verticalScale(10);
    }
    return navigationDimensions.height + verticalScale(5);
  };

  const quickCategories = [
    { name: 'Food', icon: 'food' },
    { name: 'Transport', icon: 'car' },
    { name: 'Shopping', icon: 'shopping' },
    { name: 'Entertainment', icon: 'movie' },
    { name: 'Bills', icon: 'file-document' },
    { name: 'Health', icon: 'medical-bag' },
    { name: 'Education', icon: 'school' },
    { name: 'Other', icon: 'dots-horizontal' }
  ];

  const durationOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
    { label: 'Custom', value: 'custom' }
  ];

  const paymentMethods = [
    { name: 'Card', icon: 'credit-card' },
    { name: 'Cash', icon: 'cash' },
    { name: 'Digital', icon: 'cellphone' },
    { name: 'Bank', icon: 'bank' },
    { name: 'UPI', icon: 'qrcode' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <Text style={styles.headerSubtitle}>Track your spending</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.targetButton}
            onPress={() => setShowTargetModal(true)}
          >
            <Icon name="target" size={20} color="#00E0FF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{
                uri:
                  profileImageUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1480&auto=format&fit=crop',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Target Progress Bar */}
      {currentTarget && currentTarget.amount && (
        <View style={styles.targetProgressContainer}>
          <View style={styles.targetProgressHeader}>
            <View style={styles.targetProgressInfo}>
              <Icon name="target" size={16} color="#00E0FF" />
              <Text style={styles.targetProgressTitle}>Spending Target</Text>
            </View>
            <TouchableOpacity onPress={() => setShowTargetModal(true)}>
              <Icon name="pencil" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatLabel}>Target</Text>
              <Text style={styles.progressStatValue}>
                {currencySymbols[currentTarget.currency || 'USD'] || '$'}
                {currentTarget.amount?.toFixed(2) || '0.00'}
              </Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatLabel}>Spent</Text>
              <Text style={[styles.progressStatValue, styles.spentValue]}>
                {currencySymbols[currentTarget.currency || 'USD'] || '$'}
                {totalSpent.toFixed(2)}
              </Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatLabel}>Remaining</Text>
              <Text style={[styles.progressStatValue, styles.remainingValue]}>
                {currencySymbols[currentTarget.currency || 'USD'] || '$'}
                {remainingBalance.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <ProgressBar 
              progress={targetProgress / 100} 
              color={targetProgress > 80 ? '#FF6B6B' : '#00E0FF'}
              style={styles.progressBar}
            />
            <Text style={styles.progressPercentage}>
              {targetProgress.toFixed(1)}%
            </Text>
          </View>

          <Text style={styles.targetDuration}>
            {formatShortDate(targetStartDate)} - {formatShortDate(targetEndDate)}
          </Text>
        </View>
      )}

      {/* Enhanced Form */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount *</Text>
          <View style={styles.amountContainer}>
            <View style={styles.currencySelector}>
              <RNPickerSelect
                onValueChange={setCurrency}
                value={currency}
                placeholder={{ label: '$', value: null }}
                items={[
                  { label: '$ USD', value: 'USD' },
                  { label: '€ EUR', value: 'EUR' },
                  { label: '£ GBP', value: 'GBP' },
                  { label: '₹ INR', value: 'INR' },
                  { label: 'C$ CAD', value: 'CAD' },
                  { label: 'A$ AUD', value: 'AUD' },
                ]}
                style={{
                  inputIOS: styles.currencyPicker,
                  inputAndroid: styles.currencyPicker,
                }}
                Icon={() => <Icon name="chevron-down" size={20} color="#666" />}
              />
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={(text) => {
                // Allow only numbers and decimal point
                const filteredText = text.replace(/[^0-9.]/g, '');
                // Ensure only one decimal point
                const parts = filteredText.split('.');
                if (parts.length > 2) {
                  return;
                }
                setAmount(filteredText);
                
                if (currentTarget && currentTarget.amount && filteredText) {
                  const amountNum = parseFloat(filteredText) || 0;
                  const newSpent = totalSpent + amountNum;
                  const newRemaining = currentTarget.amount - newSpent;
                  setRemainingBalance(newRemaining);
                }
              }}
            />
          </View>
          {currentTarget && currentTarget.amount && amount && (
            <View style={styles.amountImpact}>
              <Text style={styles.amountImpactText}>
                After this expense:{' '}
                <Text style={styles.amountImpactValue}>
                  {currencySymbols[currency || currentTarget.currency] || '$'}
                  {(remainingBalance - (parseFloat(amount) || 0)).toFixed(2)} remaining
                </Text>
              </Text>
            </View>
          )}
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.quickCategoriesGrid}>
            {quickCategories.map(cat => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.quickCategoryButton,
                  category === cat.name && styles.quickCategoryButtonActive,
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <Icon 
                  name={cat.icon} 
                  size={20} 
                  color={category === cat.name ? '#000' : '#FFF'} 
                />
                <Text style={[
                  styles.quickCategoryText,
                  category === cat.name && styles.quickCategoryTextActive,
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Or enter custom category..."
            placeholderTextColor="#666"
            value={category}
            onChangeText={setCategory}
            autoCapitalize="words"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method *</Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method.name}
                style={[
                  styles.paymentMethodButton,
                  payment === method.name && styles.paymentMethodButtonActive,
                ]}
                onPress={() => setPayment(method.name)}
              >
                <Icon 
                  name={method.icon} 
                  size={20} 
                  color={payment === method.name ? '#000' : '#FFF'} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  payment === method.name && styles.paymentMethodTextActive,
                ]}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar" size={20} color="#00E0FF" />
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeValue}>{formatDate(date)}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Icon name="clock" size={20} color="#00E0FF" />
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>Time</Text>
                <Text style={styles.dateTimeValue}>{formatTime(date)}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes (Optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add any additional notes..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>

      {/* Enhanced Add Button */}
      <View style={[styles.buttonContainer, { bottom: getBottomPosition() }]}>
        <TouchableOpacity
          style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
          onPress={handleAddExpense}
          disabled={isSubmitting}
        >
          <Icon name="plus-circle" size={24} color="#000" />
          <Text style={styles.addButtonText}>
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Target Setting Modal */}
      <Modal
        visible={showTargetModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTargetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentTarget ? 'Update Spending Target' : 'Set Spending Target'}
              </Text>
              <TouchableOpacity onPress={() => setShowTargetModal(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Target Amount *</Text>
                <View style={styles.modalAmountContainer}>
                  <Text style={styles.modalCurrencySymbol}>
                    {currencySymbols[currency] || '$'}
                  </Text>
                  <TextInput
                    style={styles.modalAmountInput}
                    placeholder="0.00"
                    placeholderTextColor="#666"
                    keyboardType="decimal-pad"
                    value={targetAmount}
                    onChangeText={(text) => {
                      const filteredText = text.replace(/[^0-9.]/g, '');
                      const parts = filteredText.split('.');
                      if (parts.length > 2) return;
                      setTargetAmount(filteredText);
                    }}
                  />
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Duration *</Text>
                <View style={styles.modalPickerContainer}>
                  <RNPickerSelect
                    onValueChange={(value) => {
                      setTargetDuration(value);
                      // Auto-set end date based on duration
                      if (value && value !== 'custom') {
                        const newEndDate = new Date(targetStartDate);
                        switch(value) {
                          case 'daily':
                            newEndDate.setDate(newEndDate.getDate() + 1);
                            break;
                          case 'weekly':
                            newEndDate.setDate(newEndDate.getDate() + 7);
                            break;
                          case 'monthly':
                            newEndDate.setMonth(newEndDate.getMonth() + 1);
                            break;
                          case 'yearly':
                            newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                            break;
                        }
                        setTargetEndDate(newEndDate);
                      }
                    }}
                    value={targetDuration}
                    placeholder={{ label: 'Select duration...', value: null }}
                    items={durationOptions}
                    style={{
                      inputIOS: styles.modalPicker,
                      inputAndroid: styles.modalPicker,
                    }}
                  />
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>Start Date</Text>
                <TouchableOpacity
                  style={styles.modalDateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Icon name="calendar" size={20} color="#00E0FF" />
                  <Text style={styles.modalDateText}>{formatDate(targetStartDate)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>End Date</Text>
                <TouchableOpacity
                  style={styles.modalDateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Icon name="calendar" size={20} color="#00E0FF" />
                  <Text style={styles.modalDateText}>{formatDate(targetEndDate)}</Text>
                </TouchableOpacity>
              </View>

              {currentTarget && (
                <TouchableOpacity
                  style={styles.removeTargetButton}
                  onPress={removeTarget}
                >
                  <Icon name="trash-can-outline" size={20} color="#FF6B6B" />
                  <Text style={styles.removeTargetText}>Remove Target</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowTargetModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSetTarget}
              >
                <Text style={styles.modalSaveText}>
                  {currentTarget ? 'Update Target' : 'Set Target'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={new Date()}
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

      {showStartDatePicker && (
        <DateTimePicker
          value={targetStartDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setTargetStartDate(selectedDate);
              // Update end date if duration is set
              if (targetDuration && targetDuration !== 'custom') {
                const newEndDate = new Date(selectedDate);
                switch(targetDuration) {
                  case 'daily':
                    newEndDate.setDate(newEndDate.getDate() + 1);
                    break;
                  case 'weekly':
                    newEndDate.setDate(newEndDate.getDate() + 7);
                    break;
                  case 'monthly':
                    newEndDate.setMonth(newEndDate.getMonth() + 1);
                    break;
                  case 'yearly':
                    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
                    break;
                }
                setTargetEndDate(newEndDate);
              }
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={targetEndDate}
          mode="date"
          display="default"
          minimumDate={targetStartDate}
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setTargetEndDate(selectedDate);
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
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.lg,
    paddingTop: headerDimensions.paddingTop,
    paddingBottom: spacing.lg,
    minHeight: headerDimensions.height,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: headerDimensions.titleSize,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: headerDimensions.subtitleSize,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
  },
  targetButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 224, 255, 0.2)',
  },
  profileButton: {
    width: headerDimensions.profileSize,
    height: headerDimensions.profileSize,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: '#00E0FF',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  },
  targetProgressContainer: {
    marginHorizontal: padding.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  targetProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  targetProgressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  targetProgressTitle: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatLabel: {
    fontSize: fontSizes.xs,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    marginBottom: spacing.xs,
  },
  progressStatValue: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  spentValue: {
    color: '#FF6B6B',
  },
  remainingValue: {
    color: '#06D6A0',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressPercentage: {
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    minWidth: 40,
    textAlign: 'right',
  },
  targetDuration: {
    fontSize: fontSizes.xs,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: padding.lg,
    paddingBottom: verticalScale(180),
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.md,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  currencySelector: {
    width: scale(80),
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
  },
  currencyPicker: {
    fontSize: fontSizes.lg,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  amountInput: {
    flex: 1,
    fontSize: fontSizes['3xl'],
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  amountImpact: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    borderRadius: borderRadius.md,
  },
  amountImpactText: {
    fontSize: fontSizes.sm,
    color: '#00E0FF',
    fontFamily: 'Montserrat-Regular',
  },
  amountImpactValue: {
    fontFamily: 'Montserrat-SemiBold',
  },
  quickCategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickCategoryButtonActive: {
    backgroundColor: '#00E0FF',
    borderColor: '#00E0FF',
  },
  quickCategoryText: {
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
  },
  quickCategoryTextActive: {
    color: '#000000',
    fontFamily: 'Montserrat-SemiBold',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notesInput: {
    minHeight: scale(80),
    textAlignVertical: 'top',
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  paymentMethodButton: {
    flex: 1,
    minWidth: scale(70),
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  paymentMethodButtonActive: {
    backgroundColor: '#00E0FF',
    borderColor: '#00E0FF',
  },
  paymentMethodText: {
    fontSize: fontSizes.xs,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  paymentMethodTextActive: {
    color: '#000000',
    fontFamily: 'Montserrat-SemiBold',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: fontSizes.sm,
    color: '#888888',
    fontFamily: 'Montserrat-Regular',
    marginBottom: spacing.xs,
  },
  dateTimeValue: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: padding.lg,
    paddingVertical: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#00E0FF',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    elevation: 8,
    shadowColor: '#00E0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#666666',
  },
  addButtonText: {
    fontSize: fontSizes.lg,
    color: '#000000',
    fontFamily: 'Montserrat-Bold',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000000',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  modalScroll: {
    padding: spacing.lg,
  },
  modalSection: {
    marginBottom: spacing.lg,
  },
  modalLabel: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.sm,
  },
  modalAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCurrencySymbol: {
    fontSize: fontSizes['2xl'],
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    paddingHorizontal: spacing.md,
  },
  modalAmountInput: {
    flex: 1,
    fontSize: fontSizes['2xl'],
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    paddingVertical: spacing.lg,
    paddingRight: spacing.lg,
  },
  modalPickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  modalPicker: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Regular',
    padding: spacing.lg,
  },
  modalDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalDateText: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
    flex: 1,
  },
  removeTargetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  removeTargetText: {
    fontSize: fontSizes.base,
    color: '#FF6B6B',
    fontFamily: 'Montserrat-SemiBold',
  },
  modalButtons: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: spacing.md,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCancelText: {
    fontSize: fontSizes.base,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#00E0FF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: fontSizes.base,
    color: '#000000',
    fontFamily: 'Montserrat-Bold',
  },
});