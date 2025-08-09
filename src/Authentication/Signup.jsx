import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
} from '../utils/responsive';

const Signup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !name || !dob || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        dob,
        email,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]);
    } catch (error) {
      console.log(error);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      Alert.alert('Signup Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>💰</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start tracking your expenses</Text>
        </View>

        {/* Signup Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Get Started</Text>
          <Text style={styles.formSubtitle}>Fill in your details below</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              autoCapitalize="words"
              autoCorrect={false}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#666"
              value={dob}
              onChangeText={setDob}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              isLoading && styles.signupButtonDisabled
            ]}
            onPress={handleSignup}
            disabled={isLoading}
          >
            <Text style={styles.signupButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: padding.lg,
    paddingVertical: verticalScale(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  logo: {
    fontSize: scale(64),
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes['4xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: verticalScale(40),
  },
  formTitle: {
    fontSize: fontSizes['3xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginBottom: spacing.xl,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    marginBottom: spacing.sm,
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
  signupButton: {
    backgroundColor: '#390cc1',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
    elevation: 5,
    shadowColor: '#390cc1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signupButtonDisabled: {
    backgroundColor: '#666',
  },
  signupButtonText: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
  },
  loginLink: {
    fontSize: fontSizes.base,
    color: '#00e0ff',
    fontFamily: 'Montserrat-SemiBold',
  },
});
