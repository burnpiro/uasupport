// material
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { purple, lime, brown } from '@mui/material/colors';
// components
import Page from '../../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppTrafficBySite
} from '../../sections/@dashboard/app';
import { useTranslation } from 'react-i18next';
import InfoBucketLink from './InfoBucketLink';
import { useTheme } from '@mui/material/styles';
import ImportantSites from "./ImportantSites";

export default function Info() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  return (
    <Page title={t('Info')}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={6} sm={4} md={2}>
            <InfoBucketLink
              title={'Borders'}
              icon={'emojione-monotone:passport-control'}
              color={theme.palette.success.dark}
              backgroundColor={theme.palette.success.lighter}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <InfoBucketLink
              title={'Offices'}
              icon={'fluent:building-government-32-regular'}
              color={theme.palette.info.dark}
              backgroundColor={theme.palette.info.lighter}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <InfoBucketLink
              title={'Regulations'}
              icon={'codicon:law'}
              color={theme.palette.error.darker}
              backgroundColor={theme.palette.error.lighter}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <InfoBucketLink
              title={'Work'}
              icon={'ps:work-case'}
              color={purple[800]}
              backgroundColor={purple[100]}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <InfoBucketLink
              title={'Health'}
              icon={'fa-solid:hand-holding-medical'}
              color={lime[900]}
              backgroundColor={lime[100]}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={2}>
            <InfoBucketLink
              title={'Education'}
              icon={'mdi:school-outline'}
              color={brown[800]}
              backgroundColor={brown[100]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <ImportantSites />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
