import { format, formatDistanceToNow, formatDistance, formatDis } from 'date-fns';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import bgLocale from 'date-fns/locale/be';
import csLocale from 'date-fns/locale/cs';
import daLocale from 'date-fns/locale/da';
import etLocale from 'date-fns/locale/et';
import fiLocale from 'date-fns/locale/fi';
import frLocale from 'date-fns/locale/fr';
import deLocale from 'date-fns/locale/de';
import huLocale from 'date-fns/locale/hu';
import itLocale from 'date-fns/locale/it';
import ltLocale from 'date-fns/locale/lt';
import mtLocale from 'date-fns/locale/mt';
import nlLocale from 'date-fns/locale/nl';
import noLocale from 'date-fns/locale/nb';
import ptLocale from 'date-fns/locale/pt';
import roLocale from 'date-fns/locale/ro';
import skLocale from 'date-fns/locale/sk';
import esLocale from 'date-fns/locale/es';
import svLocale from 'date-fns/locale/sv';
import enLocale from 'date-fns/locale/en-GB';
import i18next from '../i18n';

const getLocale = () => {
  switch (i18next.language) {
    case 'pl':
      return plLocale;
    case 'ua':
      return ruLocale;
    case 'ru':
      return ruLocale;
    case 'bg':
      return bgLocale;
    case 'cs':
      return csLocale;
    case 'da':
      return daLocale;
    case 'et':
      return etLocale;
    case 'fi':
      return fiLocale;
    case 'fr':
      return frLocale;
    case 'de':
      return deLocale;
    case 'hu':
      return huLocale;
    case 'it':
      return itLocale;
    case 'lt':
      return ltLocale;
    case 'mt':
      return mtLocale;
    case 'nl':
      return nlLocale;
    case 'no':
      return noLocale;
    case 'pt':
      return ptLocale;
    case 'ro':
      return roLocale;
    case 'sk':
      return skLocale;
    case 'es':
      return esLocale;
    case 'sv':
      return svLocale;
    default:
      return enLocale;
  }
};
// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: getLocale() });
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: getLocale() });
}

export function fDayTime(date) {
  return format(new Date(date), 'iii HH:mm', { locale: getLocale() });
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p', { locale: getLocale() });
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: getLocale()
  });
}

export function fFromNow(date) {
  return formatDistanceToNow(new Date(date), {
    locale: getLocale()
  });
}

export function fDistance(datefrom, date) {
  return formatDistance(new Date(datefrom), new Date(date), {
    locale: getLocale()
  });
}