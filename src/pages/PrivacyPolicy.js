import { Link as RouterLink } from 'react-router-dom';
// material
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
// components
import Page from '../components/Page';
import { useTranslation } from 'react-i18next';
import { PPPL, PPUA, PPEN } from '../utils/data/PP';
import { useEffect, useState } from 'react';

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');

  // i18n has to resolve lang value in next tick
  useEffect(() => {
    setTimeout(() => {
      setSelectedLang(i18n.resolvedLanguage);
    }, 10);
  }, [i18n.resolvedLanguage]);

  let selectedPP = PPEN;
  switch (selectedLang) {
    case 'ua':
    case 'ru':
      selectedPP = PPUA;
      break;
    case 'pl':
      selectedPP = PPPL;
      break;
  }
  return (
    <Page title={t('Privacy Policy')}>
      <Container>
        <Typography variant={'h2'}>{t('Privacy Policy')}</Typography>
        <Typography component={'pre'} variant={'body1'} style={{ whiteSpace: 'break-spaces' }}>
          {selectedPP}
        </Typography>
      </Container>
    </Page>
  );
}
