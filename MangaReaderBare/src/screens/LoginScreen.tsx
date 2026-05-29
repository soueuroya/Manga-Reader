import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {signInWithGoogle} from '../services/authService';
import type {RootStackParamList} from '../types/manga';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props): React.JSX.Element {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithGoogle();

      if (!result.cancelled) {
        navigation.replace('Library');
      }
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Google sign-in failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.content}>
        <Text style={styles.kicker}>Classic Manga</Text>
        <Text style={styles.title}>MangaVerse</Text>
        <Text style={styles.copy}>
          Sign in with your Google account to browse the library and open a
          chapter.
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#111111" />
          ) : (
            <Text style={styles.buttonText}>Continue with Google</Text>
          )}
        </TouchableOpacity>

        <View style={styles.legalRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Legal', {type: 'terms'})}>
            <Text style={styles.legalLink}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.legalText}>and</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Legal', {type: 'privacy'})}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101010',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  kicker: {
    color: '#f6c453',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '900',
    marginTop: 8,
  },
  copy: {
    color: '#c8c8c8',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 14,
    marginBottom: 28,
  },
  error: {
    color: '#ff8a8a',
    marginBottom: 12,
  },
  button: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6c453',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
  },
  legalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    marginTop: 22,
  },
  legalText: {
    color: '#888888',
    fontSize: 12,
  },
  legalLink: {
    color: '#f6c453',
    fontSize: 12,
    fontWeight: '800',
  },
});
