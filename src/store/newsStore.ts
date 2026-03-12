import { create } from 'zustand';
import type { NewsItem } from './types';

const NEWS_HISTORY_KEY = 'mecorp-news-history';
const NEWS_CACHE_KEY = 'mecorp-news-cache';

interface NewsCache {
  date: string;
  items: NewsItem[];
}

function loadHistory(): NewsItem[] {
  try {
    const raw = localStorage.getItem(NEWS_HISTORY_KEY);
    if (raw) return JSON.parse(raw).slice(0, 50);
  } catch {}
  return [];
}

function loadCache(): NewsCache | null {
  try {
    const raw = localStorage.getItem(NEWS_CACHE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

interface NewsState {
  newsCache: NewsCache | null;
  newsHistory: NewsItem[];
  isFetchingNews: boolean;

  fetchNewsIfStale: () => void;
  setNewsItems: (items: NewsItem[], date: string) => void;
}

export const useNewsStore = create<NewsState>()(
  (set, get) => ({
    newsCache: loadCache(),
    newsHistory: loadHistory(),
    isFetchingNews: false,

    fetchNewsIfStale: () => {
      const state = get();
      const today = new Date().toLocaleDateString('en-CA');
      if (state.newsCache?.date === today) return;
      if (state.isFetchingNews) return;

      set({ isFetchingNews: true });

      import('../lib/api').then(({ fetchNews }) => {
        fetchNews().then((items) => {
          const newsItems: NewsItem[] = items.map((item: { headline: string; body: string }, i: number) => ({
            id: `${today}-${i}`,
            headline: item.headline,
            body: item.body,
            date: today,
          }));
          get().setNewsItems(newsItems, today);
          set({ isFetchingNews: false });
        }).catch(() => {
          // Use fallback
          import('../lib/news-fallback').then(({ getRandomFallbackNews }) => {
            const fallback = getRandomFallbackNews();
            const newsItems: NewsItem[] = fallback.map((item, i) => ({
              id: `${today}-fallback-${i}`,
              headline: item.headline,
              body: item.body,
              date: today,
            }));
            get().setNewsItems(newsItems, today);
            set({ isFetchingNews: false });
          });
        });
      });
    },

    setNewsItems: (items, date) => {
      const cache: NewsCache = { date, items };
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(cache));

      const history = [
        ...items,
        ...get().newsHistory.filter((h) => h.date !== date),
      ].slice(0, 50);
      localStorage.setItem(NEWS_HISTORY_KEY, JSON.stringify(history));

      set({ newsCache: cache, newsHistory: history });
    },
  })
);
