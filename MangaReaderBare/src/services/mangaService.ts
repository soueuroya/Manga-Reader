import type {Chapter, Manga, MangaPage} from '../types/manga';

const MANGAS: Manga[] = [
  {
    id: 'a-hundred-tales',
    title: 'A Hundred Tales',
    author: 'Katsushika Hokusai',
    coverImage: require('../../assets/manga/hokusai/a-hundred-tales/cover.jpg'),
    rating: 4.8,
    genres: ['Yokai', 'Edo Life', 'Origin'],
    description:
      'A compact supernatural chapter inspired by Edo-period ghost-story gatherings and Hokusai visual folklore.',
    chapterCount: 1,
    status: 'completed',
  },
  {
    id: 'tokyo-puck',
    title: 'Tokyo Puck',
    author: 'Kitazawa Rakuten',
    coverImage: require('../../assets/manga/kitazawa/tokyo-puck/cover.jpg'),
    rating: 4.6,
    genres: ['Founder', 'Meiji Era', 'Editorial Cartoon'],
    description:
      'A tribute to Rakuten magazine culture, with early modern manga energy and editorial-cartoon bite.',
    chapterCount: 1,
    status: 'completed',
  },
  {
    id: 'edo-born-playboy',
    title: 'Edo-Born Playboy',
    author: 'Santo Kyoden',
    coverImage: require('../../assets/manga/kyoden/edo-born-playboy/cover.jpg'),
    rating: 4.5,
    genres: ['Kibyoshi', 'Edo Life', 'Proto-Manga'],
    description:
      'A playful popular-fiction entry inspired by Kyoden wit, social satire, and illustrated-book traditions.',
    chapterCount: 1,
    status: 'completed',
  },
  {
    id: 'brocade-of-the-east',
    title: 'Brocade of the East',
    author: 'Kitao Shigemasa',
    coverImage: require('../../assets/manga/shigemasa/brocade-of-the-east/cover.jpg'),
    rating: 4.6,
    genres: ['Bijin-ga', 'Edo Life', 'Kabuki'],
    description:
      'A refined Shigemasa-style sequence of figures, fashion, and Edo atmosphere.',
    chapterCount: 1,
    status: 'completed',
  },
];

const CHAPTERS: Chapter[] = MANGAS.map(manga => ({
  id: `${manga.id}-ch-1`,
  mangaId: manga.id,
  chapterNumber: 1,
  title: manga.title,
  totalPages:
    manga.id === 'tokyo-puck' ? 4 : manga.id === 'brocade-of-the-east' ? 11 : 5,
}));

const PAGES: MangaPage[] = [
  page(
    'a-hundred-tales',
    1,
    require('../../assets/manga/hokusai/a-hundred-tales/chapters/ch-1/page-001.jpg'),
  ),
  page(
    'a-hundred-tales',
    2,
    require('../../assets/manga/hokusai/a-hundred-tales/chapters/ch-1/page-002.jpg'),
  ),
  page(
    'a-hundred-tales',
    3,
    require('../../assets/manga/hokusai/a-hundred-tales/chapters/ch-1/page-003.jpg'),
  ),
  page(
    'a-hundred-tales',
    4,
    require('../../assets/manga/hokusai/a-hundred-tales/chapters/ch-1/page-004.jpg'),
  ),
  page(
    'a-hundred-tales',
    5,
    require('../../assets/manga/hokusai/a-hundred-tales/chapters/ch-1/page-005.jpg'),
  ),
  page(
    'tokyo-puck',
    1,
    require('../../assets/manga/kitazawa/tokyo-puck/chapters/ch-1/page-001.jpg'),
  ),
  page(
    'tokyo-puck',
    2,
    require('../../assets/manga/kitazawa/tokyo-puck/chapters/ch-1/page-002.jpg'),
  ),
  page(
    'tokyo-puck',
    3,
    require('../../assets/manga/kitazawa/tokyo-puck/chapters/ch-1/page-003.jpg'),
  ),
  page(
    'tokyo-puck',
    4,
    require('../../assets/manga/kitazawa/tokyo-puck/chapters/ch-1/page-004.jpg'),
  ),
  page(
    'edo-born-playboy',
    1,
    require('../../assets/manga/kyoden/edo-born-playboy/chapters/ch-1/page-001.jpg'),
  ),
  page(
    'edo-born-playboy',
    2,
    require('../../assets/manga/kyoden/edo-born-playboy/chapters/ch-1/page-002.jpg'),
  ),
  page(
    'edo-born-playboy',
    3,
    require('../../assets/manga/kyoden/edo-born-playboy/chapters/ch-1/page-003.jpg'),
  ),
  page(
    'edo-born-playboy',
    4,
    require('../../assets/manga/kyoden/edo-born-playboy/chapters/ch-1/page-004.jpg'),
  ),
  page(
    'edo-born-playboy',
    5,
    require('../../assets/manga/kyoden/edo-born-playboy/chapters/ch-1/page-005.jpg'),
  ),
  page(
    'brocade-of-the-east',
    1,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-001.jpg'),
  ),
  page(
    'brocade-of-the-east',
    2,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-002.jpg'),
  ),
  page(
    'brocade-of-the-east',
    3,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-003.jpg'),
  ),
  page(
    'brocade-of-the-east',
    4,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-004.jpg'),
  ),
  page(
    'brocade-of-the-east',
    5,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-005.jpg'),
  ),
  page(
    'brocade-of-the-east',
    6,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-006.jpg'),
  ),
  page(
    'brocade-of-the-east',
    7,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-007.jpg'),
  ),
  page(
    'brocade-of-the-east',
    8,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-008.jpg'),
  ),
  page(
    'brocade-of-the-east',
    9,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-009.jpg'),
  ),
  page(
    'brocade-of-the-east',
    10,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-010.jpg'),
  ),
  page(
    'brocade-of-the-east',
    11,
    require('../../assets/manga/shigemasa/brocade-of-the-east/chapters/ch-1/page-011.jpg'),
  ),
];

function page(
  mangaId: string,
  pageNumber: number,
  image: MangaPage['image'],
): MangaPage {
  const chapterId = `${mangaId}-ch-1`;
  const paddedPage = String(pageNumber).padStart(3, '0');

  return {
    id: `${mangaId}-p-${paddedPage}`,
    chapterId,
    pageNumber,
    image,
  };
}

const delay = () => new Promise(resolve => setTimeout(resolve, 250));

export async function getMangas(): Promise<Manga[]> {
  await delay();
  return [...MANGAS];
}

export async function getMangaById(id: string): Promise<Manga | undefined> {
  await delay();
  return MANGAS.find(manga => manga.id === id);
}

export async function getChaptersByManga(mangaId: string): Promise<Chapter[]> {
  await delay();
  return CHAPTERS.filter(chapter => chapter.mangaId === mangaId);
}

export async function getPagesByChapter(
  chapterId: string,
): Promise<MangaPage[]> {
  await delay();
  return PAGES.filter(pageItem => pageItem.chapterId === chapterId).sort(
    (a, b) => a.pageNumber - b.pageNumber,
  );
}
