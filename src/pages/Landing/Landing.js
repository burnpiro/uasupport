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
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Iconify from "../../components/Iconify";
import {Link as RouterLink} from "react-router-dom";
import {useTheme} from "@mui/material/styles";

export default function Landing() {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');
  const theme = useTheme();

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
          <Grid item sx={{ pb: 0, textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }} flexGrow={1}>
            <Typography variant={'h3'} sx={{ pb: 0, textAlign: 'center' }}>
              {t('For the offerors')}
            </Typography>
            <Link href={"https://pl.airbnb.org/help-ukraine?c=.pi130.pkua_support"}>
              <img src={'/static/airbnb_baner.png'} alt={"AirBnB.org baner"}/>
            </Link>
            <Typography variant={'body1'} sx={{ pt: 2, pb: 2, textAlign: 'justify' }}>
              {t('AirbnbDeal')}
            </Typography>
            <Button
              variant={'outlined'}
              style={{ color: theme.palette.success.dark, borderColor: theme.palette.success.dark }}
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={Link}
              href="https://pl.airbnb.org/help-ukraine?c=.pi130.pkua_support"
            >
              {t('AddHome')}
            </Button>
            <Typography variant={'body1'} sx={{ pt: 2, pb: 2, textAlign: 'justify' }}>
              {t('AirbnbHomes')}
            </Typography>
            <Button variant={'outlined'} style={{color: theme.palette.info.dark}} startIcon={<Iconify icon="material-symbols:contact-phone-outline" />} component={Link} href="https://forms.gle/A4sWjwWMbvBgkW7Y8">
              {t('Contact')}
            </Button>
          </Grid>
          {/*<Grid container item xs={12} sm={6} spacing={1} alignItems="flex-start">*/}
            {/*<Grid item sx={{ pb: 0, textAlign: 'center' }} flexGrow={1}>*/}
            {/*  <Typography variant={'h3'} sx={{ pb: 0, textAlign: 'center' }}>*/}
            {/*    {t('For the offerors')}*/}
            {/*  </Typography>*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12} sx={{ pb: 2 }}>*/}
            {/*  <AppHomesOffer />*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12} md={6} sx={{ pb: 2 }}>*/}
            {/*  <AppAidsOffer />*/}
            {/*</Grid>*/}
            {/*<Grid item xs={12} md={6} sx={{ pb: 2 }}>*/}
            {/*  <AppTransportOffer />*/}
            {/*</Grid>*/}
          {/*</Grid>*/}
          {/*<Grid container item xs={12} sm={6} spacing={1} alignItems="flex-start">*/}
          {/*  <Grid item sx={{ pb: 0 }} flexGrow={1}>*/}
          {/*    <Typography variant={'h3'} sx={{ pb: 0, textAlign: 'center' }}>*/}
          {/*      {t('For those who seek')}*/}
          {/*    </Typography>*/}
          {/*  </Grid>*/}
          {/*  <Grid item xs={12} sx={{ pb: 2 }}>*/}
          {/*    <AppInfoGet />*/}
          {/*  </Grid>*/}
          {/*  <Grid item xs={12} sx={{ pb: 2 }}>*/}
          {/*    <AppHomesGet />*/}
          {/*  </Grid>*/}
          {/*  <Grid item xs={12} md={6} sx={{ pb: 2 }}>*/}
          {/*    <AppAidsGet />*/}
          {/*  </Grid>*/}
          {/*  <Grid item xs={12} md={6} sx={{ pb: 2 }}>*/}
          {/*    <AppTransportGet />*/}
          {/*  </Grid>*/}
          {/*</Grid>*/}
        </Grid>
      </Container>
    </Page>
  );
}
