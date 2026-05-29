import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ReaderPage} from '../components/ReaderPage';
import {
  getChaptersByManga,
  getMangaById,
  getPagesByChapter,
} from '../services/mangaService';
import type {
  Chapter,
  Manga,
  MangaPage,
  RootStackParamList,
} from '../types/manga';

type Props = NativeStackScreenProps<RootStackParamList, 'Reader'>;

export function ReaderScreen({navigation, route}: Props): React.JSX.Element {
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [pages, setPages] = useState<MangaPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReader = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextManga = await getMangaById(route.params.mangaId);

      if (!nextManga) {
        setError('Manga not found.');
        return;
      }

      const chapters = await getChaptersByManga(nextManga.id);
      const nextChapter =
        chapters.find(item => item.id === route.params.chapterId) ??
        chapters[0];

      if (!nextChapter) {
        setError('No chapters are available for this manga.');
        return;
      }

      const nextPages = await getPagesByChapter(nextChapter.id);

      if (nextPages.length === 0) {
        setError('This chapter does not have any pages yet.');
        return;
      }

      setManga(nextManga);
      setChapter(nextChapter);
      setPages(nextPages);
    } catch {
      setError('Could not load this chapter.');
    } finally {
      setLoading(false);
    }
  }, [route.params.chapterId, route.params.mangaId]);

  useEffect(() => {
    loadReader();
  }, [loadReader]);

  const title = useMemo(() => {
    if (!manga || !chapter) {
      return 'Reader';
    }

    return `${manga.title} - Ch. ${chapter.chapterNumber}`;
  }, [chapter, manga]);

  return (
    <SafeAreaView
      style={styles.screen}
      edges={['top', 'right', 'bottom', 'left']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#f6c453" size="large" />
          <Text style={styles.centerText}>Loading chapter...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadReader}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pages}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ReaderPage page={item} />}
          ListFooterComponent={<Text style={styles.end}>End of chapter</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
    backgroundColor: '#101010',
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  backText: {
    color: '#f6c453',
    fontWeight: '800',
  },
  title: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
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
  end: {
    color: '#777777',
    paddingVertical: 24,
    textAlign: 'center',
  },
});
