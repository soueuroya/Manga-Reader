import type {ImageSourcePropType} from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  Library: undefined;
  Reader: {mangaId: string; chapterId?: string};
  Legal: {type: 'privacy' | 'terms'};
};

export type UserSession = {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  idToken: string | null;
};

export type Manga = {
  id: string;
  title: string;
  author: string;
  coverImage: ImageSourcePropType;
  rating: number;
  genres: string[];
  description: string;
  chapterCount: number;
  status: 'ongoing' | 'completed' | 'hiatus';
};

export type Chapter = {
  id: string;
  mangaId: string;
  chapterNumber: number;
  title: string;
  totalPages: number;
};

export type MangaPage = {
  id: string;
  chapterId: string;
  pageNumber: number;
  image: ImageSourcePropType;
};
