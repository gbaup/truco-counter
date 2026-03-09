import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esFormal from '../locales/es.json';
import esColoquial from '../locales/es-coloquial.json';

const currentLang = process.env.NEXT_PUBLIC_APP_LANG || 'es';

const selectedResources = currentLang === 'es-coloquial'
    ? esColoquial
    : esFormal;

i18n
    .use(initReactI18next)
    .init({
        lng: 'es',
        resources: {
            es: {
                translation: selectedResources
            }
        },
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;