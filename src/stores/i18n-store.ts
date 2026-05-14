import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { dictionaries, Language, DictionaryKey } from '@/i18n/dictionaries';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: DictionaryKey) => string;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: DictionaryKey) => {
        const lang = get().language;
        return dictionaries[lang][key] || dictionaries['en'][key] || key;
      },
    }),
    {
      name: 'i18n-storage',
    }
  )
);
