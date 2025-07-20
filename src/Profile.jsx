import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const Profile = ({ navigation }) => {
  const [dob, setdob] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setdob(selectedDate);
    }
  };

  const [imageUri, setImageUri] = useState(null);

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets[0].uri;
          setImageUri(uri);
        }
      },
    );
  };
  return (
    // <LinearGradient
    //   colors={['#00008b', '#483d8b', '#9400d3']}
    //   style={{ flex: 1 }}
    // >
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.contain}>
        <View style={styles.profile}>
          <TouchableOpacity onPress={openGallery} style={styles.circle}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }}
                style={styles.image}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputcontainer}>
          <TextInput placeholder="Name" style={styles.input} backgroundColor ="black" placeholderTextColor='white'></TextInput>
          <TextInput placeholder="Email" style={styles.input} backgroundColor ="black" placeholderTextColor='white'></TextInput>

          <TouchableOpacity
            onPress={() => setShowPicker(!showPicker)}
            style={styles.input}
            // backgroundColor ="black"
          >
            <Text style={{ color: dob ? 'black' : '#999' }}>
              {dob ? dob.toDateString() : 'Select Date of Birth'}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <View style={styles.inlinePicker}>
              <DateTimePicker
                value={dob}
                mode="date"
                display="calendar" // shows small calendar style
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowPicker(false); // hide after selection (optional)
                  if (selectedDate) {
                    setdob(selectedDate);
                  }
                }}
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.button}>
        <TouchableOpacity styles={styles.edit}>
          <Text style={styles.editbtn}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.secheader}>
        <Text style={styles.text}>Contact us</Text>
        <Text style={styles.text}>About us</Text>
        <Text style={styles.text}>About us</Text>
        <Text style={styles.text}>Report or Problem</Text>
      </View>
      <View style={styles.logout}>
        <TouchableOpacity style={styles.logouttbtn}>
          <Text style={styles.logouttext}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>

    // {/* </View> */}
    // </LinearGradient>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    // alignItems: 'center',
    // flexDirection:'row',
    gap: 40,
  },
  header: {
    fontSize: 30,
    color: 'white',
    padding: 30,
    marginTop: 20,
    // flex:1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginRight: '60%',
  },
  contain: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20',
  },
  circle: {
    borderColor: 'blue',
    borderWidth: 2,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    paddingTop: 10,
    borderWidth: 1,
  },
  inputcontainer: {
    gap: 20,
    width: '70%',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  dobText: {
    marginTop: 12,
    fontSize: 16,
    // color: '#333',
  },
  inlinePicker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    marginTop: -10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  edit: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editbtn: {
    color: 'white',
    padding: 7,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
    width: 80,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secheader: {
    padding: 10,
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },

  logouttbtn: {
    borderWidth: 1,
    width: 80,
    borderColor: 'white',
    borderRadius: 6,
  },
  logouttext: {
    fontSize: 19,
    color: 'white',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
