import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db } from '../src/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  scale,
  verticalScale,
  fontSizes,
  spacing,
  padding,
  borderRadius,
  imageSizes,
  buttonSizes,
  screenDimensions,
  getResponsiveValue,
} from './utils/responsive';

const Profile = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
            setUserInfo(docSnap.data());
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

  // 📸 Open Gallery
  const openGallery = () => {
    launchImageLibrary(
      { 
        mediaType: 'photo', 
        quality: 0.8,
        maxWidth: 500,
        maxHeight: 500,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          const uri = response.assets[0].uri;
          setImageUri(uri);
          // Here you could upload the image to Firebase Storage
          // and update the user profile
        }
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
          <TouchableOpacity onPress={openGallery} style={styles.profileImageContainer}>
            <Image
              source={{
                uri: imageUri
                  ? imageUri
                  : 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80',
              }}
              style={styles.profileImage}
            />
            <View style={styles.editImageOverlay}>
              <Text style={styles.editImageText}>📷</Text>
            </View>
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
    width: getResponsiveValue(imageSizes.profile, imageSizes.profile, imageSizes.largeProfile, imageSizes.largeProfile),
    height: getResponsiveValue(imageSizes.profile, imageSizes.profile, imageSizes.largeProfile, imageSizes.largeProfile),
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
