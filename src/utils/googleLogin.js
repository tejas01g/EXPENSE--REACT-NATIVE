import { GoogleIdTokenCredential, GoogleIdTokenRequestOptions } from "google-identity-services";
import { CredentialManager } from "react-native-credentials";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";

export const signInWithGoogle = async () => {
  try {
    const credentialManager = new CredentialManager();

    const googleCredential = await credentialManager.get({
      googleIdTokenRequestOptions: new GoogleIdTokenRequestOptions({
        serverClientId: "111740839007-6dcip2tbhqvatn5r5nseslm7om54vdur.apps.googleusercontent.com",
      }),
    });

    if (!googleCredential?.idToken) {
      throw new Error("No ID token found");
    }

    const firebaseCredential = GoogleAuthProvider.credential(
      googleCredential.idToken
    );

    return await signInWithCredential(auth, firebaseCredential);

  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};
