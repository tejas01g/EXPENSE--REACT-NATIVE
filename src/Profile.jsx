import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db, storage } from '../src/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
  getResponsiveValue,
} from './utils/responsive';
import {
  validateImage,
  getImagePickerOptions,
  generateImageFileName,
  getStoragePath,
  formatFileSize,
} from './utils/imageUtils';

const Profile = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // 🔐 Handle Logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (error) {
              console.log('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  // 🔄 Fetch User Info
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInfo(data);
            // Set profile image if it exists
            if (data.profileImageUrl) {
              setImageUri(data.profileImageUrl);
            }
          } else {
            console.log('No user data found!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 📤 Upload Image to Firebase Storage
  const uploadImageToFirebase = async (uri, fileName) => {
    try {
      setIsUploading(true);
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Convert URI to blob
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      
      // Check blob size
      if (blob.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }

      // Create a reference to the file location
      const storagePath = getStoragePath(user.uid, fileName);
      const imageRef = ref(storage, storagePath);

      // Upload the blob to Firebase Storage
      const uploadResult = await uploadBytes(imageRef, blob);
      console.log('Image uploaded successfully:', uploadResult);

      // Get the download URL
      const downloadURL = await getDownloadURL(uploadResult.ref);
      console.log('Download URL:', downloadURL);

      // Update user profile in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        profileImageUrl: downloadURL,
        profileImageUpdatedAt: new Date(),
        profileImageFileName: fileName,
      });

      // Update local state
      setImageUri(downloadURL);
      setUserInfo(prev => ({
        ...prev,
        profileImageUrl: downloadURL,
        profileImageUpdatedAt: new Date(),
        profileImageFileName: fileName,
      }));

      Alert.alert('Success', 'Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // 📸 Open Gallery and Upload Image
  const openGallery = () => {
    if (isUploading) {
      Alert.alert('Upload in Progress', 'Please wait for the current upload to complete.');
      return;
    }

    launchImageLibrary(
      getImagePickerOptions(),
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Error', 'Failed to access gallery. Please try again.');
          return;
        }

        // Validate the selected image
        const validation = validateImage(response);
        if (!validation.isValid) {
          Alert.alert('Invalid Image', validation.error);
          return;
        }

        const asset = validation.asset;
        const uri = asset.uri;
        
        // Show file size info
        if (asset.fileSize) {
          console.log('Selected image size:', formatFileSize(asset.fileSize));
        }

        // Generate unique filename
        const fileName = generateImageFileName(auth.currentUser?.uid);
        
        // Show preview immediately
        setImageUri(uri);
        
        // Upload to Firebase
        uploadImageToFirebase(uri, fileName);
      }
    );
  };

  // 📊 Calculate user stats
  const getUserStats = () => {
    if (!userInfo) return { totalExpenses: 0, avgExpense: 0, totalTransactions: 0 };
    
    // This would be calculated from actual transaction data
    return {
      totalExpenses: 1250.50,
      avgExpense: 125.05,
      totalTransactions: 10,
    };
  };

  const stats = getUserStats();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            onPress={openGallery} 
            style={styles.profileImageContainer}
            disabled={isUploading}
          >
            <Image
              source={{
                uri: imageUri
                  ? imageUri
                  : 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80',
              }}
              style={styles.profileImage}
            />
            <View style={styles.editImageOverlay}>
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.editImageText}>📷</Text>
              )}
            </View>
            {isUploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#390cc1" />
                <Text style={styles.uploadingText}>Uploading...</Text>
              </View>
            )}
          </TouchableOpacity>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
          ) : userInfo ? (
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{userInfo.name || 'User Name'}</Text>
              <Text style={styles.userEmail}>{userInfo.email || 'user@email.com'}</Text>
              {userInfo.dob && (
                <Text style={styles.userDOB}>🎂 {userInfo.dob}</Text>
              )}
              {userInfo.profileImageUpdatedAt && (
                <Text style={styles.lastUpdatedText}>
                  Profile updated: {new Date(userInfo.profileImageUpdatedAt.toDate()).toLocaleDateString()}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load profile</Text>
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>${stats.totalExpenses.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Expenses</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>${stats.avgExpense.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Avg. Expense</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalTransactions}</Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>✏️</Text>
              <Text style={styles.actionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🔔</Text>
              <Text style={styles.actionText}>Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Links */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.supportLinks}>
            <TouchableOpacity style={styles.supportLink}>
              <Text style={styles.supportIcon}>📞</Text>
              <Text style={styles.supportText}>Contact Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportLink}>
              <Text style={styles.supportIcon}>ℹ️</Text>
              <Text style={styles.supportText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportLink}>
              <Text style={styles.supportIcon}>🐛</Text>
              <Text style={styles.supportText}>Report a Problem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportLink}>
              <Text style={styles.supportIcon}>📖</Text>
              <Text style={styles.supportText}>Help & FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(50),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: padding.lg,
    paddingTop: verticalScale(60),
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSizes['4xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  settingsButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: fontSizes.lg,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  profileImage: {
    width: getResponsiveValue(scale(120), scale(140), scale(160), scale(180)),
    height: getResponsiveValue(scale(120), scale(140), scale(160), scale(180)),
    borderRadius: borderRadius.full,
    borderWidth: scale(3),
    borderColor: '#390cc1',
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: scale(32),
    height: scale(32),
    borderRadius: borderRadius.full,
    backgroundColor: '#390cc1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: scale(2),
    borderColor: '#000',
  },
  editImageText: {
    fontSize: fontSizes.sm,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    color: '#fff',
    fontSize: fontSizes.sm,
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  loadingText: {
    color: '#888',
    fontSize: fontSizes.base,
    fontFamily: 'Montserrat-Regular',
  },
  userInfoContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  userName: {
    fontSize: fontSizes['2xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  userEmail: {
    fontSize: fontSizes.base,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
  },
  userDOB: {
    fontSize: fontSizes.sm,
    color: '#999',
    fontFamily: 'Montserrat-Regular',
  },
  lastUpdatedText: {
    fontSize: fontSizes.xs,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
    fontStyle: 'italic',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: fontSizes.base,
    fontFamily: 'Montserrat-Regular',
  },
  statsSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(57, 12, 193, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(57, 12, 193, 0.3)',
  },
  statValue: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  actionsSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIcon: {
    fontSize: fontSizes.xl,
    marginBottom: spacing.xs,
  },
  actionText: {
    fontSize: fontSizes.sm,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  supportSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  supportLinks: {
    gap: spacing.sm,
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  supportIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.md,
  },
  supportText: {
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: padding.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  logoutIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.sm,
  },
  logoutText: {
    fontSize: fontSizes.lg,
    color: '#ff6b6b',
    fontFamily: 'Montserrat-SemiBold',
  },
  versionText: {
    textAlign: 'center',
    fontSize: fontSizes.sm,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
  },
});
