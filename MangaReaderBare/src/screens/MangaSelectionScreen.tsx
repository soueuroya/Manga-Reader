import type {StackScreenProps} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MangaCard} from '../components/MangaCard';
import {getStoredSession, signOutFromGoogle} from '../services/authService';
import {getMangas} from '../services/mangaService';
import type {Manga, RootStackParamList, UserSession} from '../types/manga';

type Props = StackScreenProps<RootStackParamList, 'Library'>;

export function MangaSelectionScreen({navigation}: Props): React.JSX.Element {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMangas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setMangas(await getMangas());
    } catch {
      setError('Could not load the manga library.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMangas();
    getStoredSession()
      .then(setSession)
      .catch(() => setSession(null));
  }, [loadMangas]);

  const handleSignOut = async () => {
    await signOutFromGoogle();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.kicker}>Library</Text>
          <Text style={styles.title}>Choose a Manga</Text>
          {session ? (
            <View style={styles.profileRow}>
              {session.photoURL ? (
                <Image source={{uri: session.photoURL}} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>
                    {session.displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.profileText}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {session.displayName}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {session.email}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#f6c453" size="large" />
          <Text style={styles.centerText}>Loading library...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMangas}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={mangas}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <MangaCard
              manga={item}
              onPress={() => navigation.navigate('Reader', {mangaId: item.id})}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101010',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  kicker: {
    color: '#f6c453',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  signOut: {
    color: '#c8c8c8',
    fontWeight: '700',
    paddingTop: 6,
  },
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2a2a2a',
  },
  avatarFallback: {
    alignItems: 'center',
    backgroundColor: '#f6c453',
    borderRadius: 21,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  avatarInitial: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  profileEmail: {
    color: '#a8a8a8',
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    padding: 18,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerText: {
    color: '#c8c8c8',
    marginTop: 12,
  },
  error: {
    color: '#ff8a8a',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#f6c453',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#111111',
    fontWeight: '800',
  },
});
