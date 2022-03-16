import { Link as RouterLink } from 'react-router-dom';
// material
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// components
import Page from '../components/Page';
import { useTranslation } from 'react-i18next';
import {TCUA, TCPL, TCEN} from '../utils/data/TC';
import { useEffect, useState } from 'react';

export default function TC() {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');

  // i18n has to resolve lang value in next tick
  useEffect(() => {
    setTimeout(() => {
      setSelectedLang(i18n.resolvedLanguage);
    }, 10);
  }, [i18n.resolvedLanguage]);

  let selectedTC = TCEN;
  switch (selectedLang) {
    case 'ua':
    case 'ru':
      selectedTC = TCUA;
      break;
    case 'pl':
      selectedTC = TCPL;
      break;
  }
  return (
    <Page title={t('TC')}>
      <Container>
        <Typography variant={'h2'}>{t('TC')}</Typography>
        <Typography component={'pre'} variant={'body1'} style={{ whiteSpace: 'break-spaces' }}>
          {selectedTC}
        </Typography>
      </Container>
    </Page>
  );
}
