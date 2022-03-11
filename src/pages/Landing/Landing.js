import Page from '../../components/Page';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppNewUsers,
  AppOrderTimeline,
  AppTasks,
  AppTrafficBySite,
  AppWeeklySales
} from '../../sections/@dashboard/app';
import {useTranslation} from "react-i18next";
import AppHomesOffer from "./AppHomesOffer";
import AppAidsOffer from "./AppAidOffer";
import AppTransportOffer from "./AppTransportOffer";
import AppHomesGet from "./AppHomeGet";
import AppAidsGet from "./AppAidGet";
import AppTransportGet from "./AppTransportGet";

export default function Landing() {
  const { t, i18n } = useTranslation();
  return (
    <Page title={t('Landing')}>
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">{t('Hi, Welcome Back')}</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Grid item>
              <Typography variant={"h3"} sx={{pb: 2, textAlign: 'center'}}>
                {t('For the offerors')}
              </Typography>
              <Grid item xs={12} sx={{pb: 2}}>
                <AppHomesOffer />
              </Grid>
              <Grid item xs={12} sx={{pb: 2}}>
                <AppAidsOffer />
              </Grid>
              <Grid item xs={12} sx={{pb: 2}}>
                <AppTransportOffer />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid item>
              <Typography variant={"h3"} sx={{pb: 2, textAlign: 'center'}}>
                {t('For those who seek')}
              </Typography>
              <Grid item xs={12} sx={{pb: 2}}>
                <AppHomesGet />
              </Grid>
              <Grid item xs={12} sx={{pb: 2}}>
                <AppAidsGet />
              </Grid>
              <Grid item xs={12} sx={{pb: 2}}>
                <AppTransportGet />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
