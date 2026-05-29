import React from 'react';
import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import type {MangaPage} from '../types/manga';

type Props = {
  page: MangaPage;
};

export function ReaderPage({page}: Props): React.JSX.Element {
  const {width} = useWindowDimensions();
  const pageWidth = Math.min(width, 720);

  return (
    <View style={styles.wrap}>
      <Image
        source={page.image}
        style={[styles.image, {width: pageWidth, height: pageWidth * 1.5}]}
        resizeMode="contain"
      />
      <Text style={styles.pageNumber}>Page {page.pageNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    backgroundColor: '#050505',
  },
  image: {
    backgroundColor: '#111111',
  },
  pageNumber: {
    color: '#777777',
    fontSize: 12,
    paddingVertical: 10,
  },
});
