import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db } from '../src/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Profile = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // 🔐 Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // Make sure 'Login' exists in your navigator
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // 🔄 Fetch User Info
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          console.log('No user data found!');
        }
      }
    };

    fetchUserData();
  }, []);

  // 📸 Open Gallery
  const openGallery = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1 },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets[0].uri;
          setImageUri(uri);
        }
      }
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.centerContent}>
        <TouchableOpacity onPress={openGallery} style={styles.circle}>
          <Image
            source={{
              uri: imageUri
                ? imageUri
                : 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80',
            }}
            style={styles.image}
          />
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          {userInfo ? (
            <>
              <Text style={styles.infoText}>👤 Name: {userInfo.name}</Text>
              <Text style={styles.infoText}>📧 Email: {userInfo.email}</Text>
              <Text style={styles.infoText}>🎂 DOB: {userInfo.dob}</Text>
            </>
          ) : (
            <Text style={styles.loadingText}>Loading profile...</Text>
          )}
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.linksContainer}>
        <Text style={styles.link}>Contact Us</Text>
        <Text style={styles.link}>About Us</Text>
        <Text style={styles.link}>Report a Problem</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    color: 'white',
    marginTop: 40,
    marginBottom: 20,
    fontWeight: '600',
  },
  centerContent: {
    alignItems: 'center',
  },
  circle: {
    borderColor: 'blue',
    borderWidth: 2,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
  },
  loadingText: {
    color: 'gray',
    fontSize: 16,
  },
  editButton: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  editText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  linksContainer: {
    marginTop: 40,
    gap: 12,
  },
  link: {
    color: 'white',
    fontSize: 16,
    paddingVertical: 5,
  },
  logoutButton: {
    marginTop: 30,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
  },
});
