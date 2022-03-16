import Page from '../../components/Page';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import AppHomesOffer from './AppHomesOffer';
import AppAidsOffer from './AppAidOffer';
import AppTransportOffer from './AppTransportOffer';
import AppHomesGet from './AppHomeGet';
import AppAidsGet from './AppAidGet';
import AppTransportGet from './AppTransportGet';
import AppInfoGet from "./AppInfoGet";
import {useEffect, useState} from "react";

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');

  // i18n has to resolve lang value in next tick
  useEffect(() => {
    setTimeout(() => {
      setSelectedLang(i18n.resolvedLanguage);
    }, 10);
  }, [i18n.resolvedLanguage]);

  return (
    <Page title={t('Landing')}>
      <Container maxWidth="xl">
        <Grid container spacing={3} alignItems="flex-start">
          <Grid container item xs={12} sm={6} spacing={1} alignItems="flex-start">
            <Grid item sx={{ pb: 0, textAlign: 'center' }} flexGrow={1}>
              <Typography variant={'h3'} sx={{ pb: 0, textAlign: 'center' }}>
                {t('For the offerors')}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ pb: 2 }}>
              <AppHomesOffer />
            </Grid>
            <Grid item xs={12} md={6} sx={{ pb: 2 }}>
              <AppAidsOffer />
            </Grid>
            <Grid item xs={12} md={6} sx={{ pb: 2 }}>
              <AppTransportOffer />
            </Grid>
          </Grid>
          <Grid container item xs={12} sm={6} spacing={1} alignItems="flex-start">
            <Grid item sx={{ pb: 0 }} flexGrow={1}>
              <Typography variant={'h3'} sx={{ pb: 0, textAlign: 'center' }}>
                {t('For those who seek')}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ pb: 2 }}>
              <AppInfoGet />
            </Grid>
            <Grid item xs={12} sx={{ pb: 2 }}>
              <AppHomesGet />
            </Grid>
            <Grid item xs={12} md={6} sx={{ pb: 2 }}>
              <AppAidsGet />
            </Grid>
            <Grid item xs={12} md={6} sx={{ pb: 2 }}>
              <AppTransportGet />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
