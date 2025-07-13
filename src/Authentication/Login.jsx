import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const Login = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.login}>
        <Text style={styles.logintext}>Login </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter the Email"
          keyboardType="email"
        />

        <TextInput style={styles.input} placeholder="Enter the password" />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.loginbtn}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 10,
    backgroundColor: '#fff',
  },
  login: {
    // color:'white',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logintext: {
    //  color:'white',
    fontSize: 30,
    marginTop: '40%',
    fontWeight: 'bold',
    gap: 10,
  },
  input: {
    color:'black',
    // color:'white',
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    width: '80%',
  },
  button: {
    // color:'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
