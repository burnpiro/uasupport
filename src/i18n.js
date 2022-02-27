import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Transport: 'Transport',
      Name: 'Name',
      Address: 'Address',
      Date: 'Date',
      People: 'People',
      Verified: 'Verified',
      Status: 'Status',
      szukam: 'Looking For',
      dam: 'Give',
      AddTransport: 'Add Transport'
    }
  },
  pl: {
    translation: {
      Transport: 'Transport',
      Name: 'Imię',
      Address: 'Adres',
      AddressDesc: 'Adres Odbioru - opis',
      AddressToDesc: 'Jadę do... - opis',
      Date: 'Data',
      Car: 'Samochód - rodzaj',
      People: 'Osoby',
      Verified: 'Zweryfikowany',
      Phone: 'Telefon',
      Email: 'Email',
      TransportDescription: 'Dodatkowy opis',
      Status: 'Status',
      szukam: 'Szukam',
      dam: 'Oferuję',
      'all-statuses': 'Wszystkie Statusy',
      AddTransport: 'Oferuję Transport',
      GetTransport: 'Szukam Transportu',
      SzczegolyTransportu: 'Szczegóły Transportu',
      DodajTransport: 'Dodaj Transport',
      SzukajTransport: 'Szukaj Transportu',
      'Field required': 'Pole jest wymagane',
      PositiveNumberError: 'Liczba musi być dodatnia',
      IntegerNumberError: 'Liczba musi być całkowita',
      TooShort: 'Zbyt krótkie',
      TooLong: 'Za długie',
      'Invalid Email': 'Niepoprawny format email',
      'Invalid URL': 'Niepoprawny format URL',
      Cancel: 'Anuluj',
      'Form Invalid': 'Formularz nie został wypełniony poprawnie',
      'Form Invalid - Social':
        'Musisz podać przynajmniej jedną formę kontaktu (email, telefon, FB)',
      PickLocation: 'Kliknij na mapę aby wskazać dokładną lokalizację',
      selected: 'zaznaczone',
      "Szukaj zakwaterowania": 'Szukaj zakwaterowania...',
      "Szukaj transport": "Szukaj transport...",
      "Szukaj pomocy": 'Szukaj pomocy...',
      "Filter list": "Filtruj wyniki",
      "Clear filter": "Wyczyść filter",
      "Clear location": "Wyczyść lokalizację",
      "SzczegolyZakwaterowania": "Szczegóły Zakwaterowania",
      "Wyjazd-od": "Wyjazd: ",
      "Jade-z": "Jadę z:",
      "Jade-do": "Jadę z:",
      "Mieszkanie-adres": "Adres mieszkania: ",
      "CheckIn": "Przyjazd od: ",
      Homes: 'Zakwaterowania',
      AddHome: 'Oferuję Zakwaterowanie',
      GetHome: 'Szukam Zakwaterowania',
      'Not found': 'Nie znaleziono',
      'No results found for your query, please consider to change it in order to see more.': 'Nie znaleziono wyników dla twojego zapytania, zmień zapytanie aby zobaczyć więcej wyników.',
      Aids: 'Centra Pomocy',
      AddAid: 'Dodaj Centrum Pomocy',
      HealthAids: 'Centra Pomocy Medycznej',
      HealthAddAid: 'Dodaj Centrum Pomocy Medycznej',
      "Aid-address": 'Adres centra pomocy: ',
      AidName: 'Nazwa',
      AidType: 'Typ Pomocy',
      'health-aid': 'Pomoc Medyczna',
      'standard-aid': 'Pomoc Rzeczowa',
      'all-aid': 'Dowolna Pomoc',
      "SzczegolyPomocy": "Szczegóły Pomocy",
      AddressHomeDesc: 'Adres Mieszkania - opis',
      AddressAidDesc: 'Adres Centrum - opis',
    }
  },
  ru: {
    translation: {
      Transport: 'Транспорт'
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'pl', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
