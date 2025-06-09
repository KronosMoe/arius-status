import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import en from '../locales/en.json'
import th from '../locales/th.json'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      th: { translation: th },
    },
    lng: 'th',
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
