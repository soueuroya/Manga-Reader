import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import type {UserSession} from '../types/manga';

const SESSION_KEY = 'mangaverse/session';
const GOOGLE_WEB_CLIENT_ID =
  '585429184360-hqbp7e1d9akkktj2h4234med411scm89.apps.googleusercontent.com';

let isGoogleConfigured = false;

export function configureGoogleSignIn(): void {
  if (isGoogleConfigured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    scopes: ['profile', 'email'],
    offlineAccess: false,
  });

  isGoogleConfigured = true;
}

export async function getStoredSession(): Promise<UserSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    await AsyncStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export async function signInWithGoogle(): Promise<{
  cancelled: boolean;
  session: UserSession | null;
}> {
  configureGoogleSignIn();

  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();
    const session: UserSession = {
      id: userInfo.user.id,
      email: userInfo.user.email,
      displayName: userInfo.user.name || userInfo.user.email,
      photoURL: userInfo.user.photo ?? null,
      idToken: userInfo.idToken ?? null,
    };

    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return {
      cancelled: false,
      session,
    };
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === statusCodes.SIGN_IN_CANCELLED
    ) {
      return {
        cancelled: true,
        session: null,
      };
    }

    throw error;
  }
}

export async function signOutFromGoogle(): Promise<void> {
  configureGoogleSignIn();

  try {
    await GoogleSignin.signOut();
  } catch (error) {
    if (isErrorWithCode(error) && error.code !== statusCodes.SIGN_IN_REQUIRED) {
      throw error;
    }
  } finally {
    await AsyncStorage.removeItem(SESSION_KEY);
  }
}
