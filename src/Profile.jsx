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
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Background Elements */}
      <View style={styles.backgroundElements}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userGreetingName}>
              {userInfo?.name?.split(' ')[0] || 'User'}
            </Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.settingsButtonInner}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <TouchableOpacity 
              onPress={openGallery} 
              style={styles.profileImageContainer}
              disabled={isUploading}
            >
              <View style={styles.imageBorder}>
                <Image
                  source={{
                    uri: imageUri
                      ? imageUri
                      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000',
                  }}
                  style={styles.profileImage}
                />
              </View>
              
              <View style={styles.editImageButton}>
                {isUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.editIcon}>📷</Text>
                )}
              </View>
            </TouchableOpacity>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#6366f1" />
                <Text style={styles.loadingText}>Loading profile...</Text>
              </View>
            ) : userInfo ? (
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>{userInfo.name || 'User Name'}</Text>
                <Text style={styles.userEmail}>{userInfo.email || 'user@email.com'}</Text>
                
                <View style={styles.userDetails}>
                  {userInfo.dob && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>🎂</Text>
                      <Text style={styles.detailText}>{userInfo.dob}</Text>
                    </View>
                  )}
                  {userInfo.profileImageUpdatedAt && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailIcon}>🔄</Text>
                      <Text style={styles.detailText}>
                        Updated {new Date(userInfo.profileImageUpdatedAt.toDate()).toLocaleDateString()}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>Failed to load profile</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>💰</Text>
              </View>
              <Text style={styles.statValue}>${stats.totalExpenses.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Total Expenses</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>📈</Text>
              </View>
              <Text style={styles.statValue}>${stats.avgExpense.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Avg. Expense</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statIcon}>🔄</Text>
              </View>
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
              <View style={styles.actionButtonInner}>
                <Text style={styles.actionIcon}>✏️</Text>
                <Text style={styles.actionText}>Edit Profile</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonInner}>
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionText}>View Reports</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonInner}>
                <Text style={styles.actionIcon}>🔔</Text>
                <Text style={styles.actionText}>Notifications</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Links */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.supportLinks}>
            <TouchableOpacity style={styles.supportLink}>
              <View style={styles.supportLinkInner}>
                <Text style={styles.supportIcon}>📞</Text>
                <Text style={styles.supportText}>Contact Us</Text>
                <Text style={styles.supportArrow}>➔</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportLink}>
              <View style={styles.supportLinkInner}>
                <Text style={styles.supportIcon}>ℹ️</Text>
                <Text style={styles.supportText}>About Us</Text>
                <Text style={styles.supportArrow}>➔</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportLink}>
              <View style={styles.supportLinkInner}>
                <Text style={styles.supportIcon}>🐛</Text>
                <Text style={styles.supportText}>Report a Problem</Text>
                <Text style={styles.supportArrow}>➔</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportLink}>
              <View style={styles.supportLinkInner}>
                <Text style={styles.supportIcon}>📖</Text>
                <Text style={styles.supportText}>Help & FAQ</Text>
                <Text style={styles.supportArrow}>➔</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutButtonInner}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0 • Expense Tracker Pro</Text>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  // backgroundElements: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   zIndex: 0,
  // },
  circle: {
    position: 'absolute',
    borderRadius: borderRadius.full,
  },
  circle1: {
    width: scale(300),
    height: scale(300),
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
    top: -scale(100),
    right: -scale(100),
  },
  circle2: {
    width: scale(200),
    height: scale(200),
    backgroundColor: 'rgba(139, 92, 246, 0.03)',
    bottom: scale(100),
    left: -scale(100),
  },
  circle3: {
    width: scale(150),
    height: scale(150),
    backgroundColor: 'rgba(99, 102, 241, 0.02)',
    top: '40%',
    right: scale(50),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(50),
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: padding.lg,
    paddingTop: verticalScale(60),
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSizes.lg,
    color: '#aaa',
    fontFamily: 'Montserrat-Regular',
    marginBottom: spacing.xs,
  },
  userGreetingName: {
    fontSize: fontSizes['3xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
  },
  settingsButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  settingsButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  settingsIcon: {
    fontSize: fontSizes.lg,
  },
  profileCard: {
    marginHorizontal: padding.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  imageBorder: {
    width: getResponsiveValue(scale(120), scale(140), scale(160), scale(180)),
    height: getResponsiveValue(scale(120), scale(140), scale(160), scale(180)),
    borderRadius: borderRadius.full,
    padding: scale(4),
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
    backgroundColor: '#1a1a1a',
  },
  editImageButton: {
    position: 'absolute',
    bottom: scale(4),
    right: scale(4),
    width: scale(32),
    height: scale(32),
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    borderWidth: scale(2),
    borderColor: '#0a0a0a',
  },
  editIcon: {
    fontSize: fontSizes.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  loadingText: {
    color: '#888',
    fontSize: fontSizes.base,
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
  },
  userInfoContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  userName: {
    fontSize: fontSizes['2xl'],
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: fontSizes.base,
    color: '#aaa',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  userDetails: {
    gap: spacing.xs,
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailIcon: {
    fontSize: fontSizes.sm,
  },
  detailText: {
    fontSize: fontSizes.sm,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  errorIcon: {
    fontSize: fontSizes.xl,
  },
  errorText: {
    color: '#ef4444',
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
    marginBottom: spacing.lg,
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  statIconContainer: {
    marginBottom: spacing.sm,
    width: scale(40),
    height: scale(40),
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  statIcon: {
    fontSize: fontSizes.lg,
  },
  statValue: {
    fontSize: fontSizes.lg,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: '#ccc',
    fontFamily: 'Montserrat-Regular',
    opacity: 0.8,
  },
  actionsSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  actionButtonInner: {
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: borderRadius.lg,
  },
  actionIcon: {
    fontSize: fontSizes.xl,
    marginBottom: spacing.xs,
  },
  actionText: {
    fontSize: fontSizes.sm,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  supportSection: {
    paddingHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  supportLinks: {
    gap: spacing.sm,
  },
  supportLink: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  supportLinkInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  supportIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.md,
  },
  supportText: {
    flex: 1,
    fontSize: fontSizes.base,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  supportArrow: {
    fontSize: fontSizes.lg,
    color: '#666',
  },
  logoutButton: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginHorizontal: padding.lg,
    marginBottom: spacing.xl,
  },
  logoutButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.sm,
  },
  logoutText: {
    fontSize: fontSizes.lg,
    color: '#ef4444',
    fontFamily: 'Montserrat-SemiBold',
  },
  versionText: {
    textAlign: 'center',
    fontSize: fontSizes.sm,
    color: '#666',
    fontFamily: 'Montserrat-Regular',
    letterSpacing: 0.5,
  },
});