import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Manga} from '../types/manga';

type Props = {
  manga: Manga;
  onPress: () => void;
};

export function MangaCard({manga, onPress}: Props): React.JSX.Element {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={manga.coverImage}
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.author}>{manga.author.toUpperCase()}</Text>
        <Text style={styles.title}>{manga.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {manga.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.meta}>Chapter 1</Text>
          <Text style={styles.rating}>{manga.rating.toFixed(1)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#1b1b1b',
    borderWidth: 1,
    borderColor: '#2f2f2f',
  },
  cover: {
    width: 96,
    height: 136,
    borderRadius: 6,
    backgroundColor: '#333333',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  author: {
    color: '#f6c453',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    color: '#bcbcbc',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  meta: {
    color: '#d8d8d8',
    fontSize: 12,
  },
  rating: {
    color: '#111111',
    overflow: 'hidden',
    borderRadius: 10,
    backgroundColor: '#f6c453',
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontWeight: '800',
  },
});
