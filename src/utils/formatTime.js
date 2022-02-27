import { format, formatDistanceToNow, formatDistance, formatDis } from 'date-fns';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';
import i18next from '../i18n';

const getLocale = () => {
  switch (i18next.language) {
    case 'en':
      return enLocale;
    case 'ru':
      return ruLocale;
    default:
      return plLocale;
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