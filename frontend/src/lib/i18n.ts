import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import en from '../locales/en.json'
import th from '../locales/th.json'

const resources = {
  en: { translation: en },
  th: { translation: th },
}

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'th',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

export type TSupportedLanguages = keyof typeof resources
export const SupportedLanguages = Object.keys(resources) as TSupportedLanguages[]
