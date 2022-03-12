import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
// material
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// utils
import { fShortenNumber } from '../../utils/formatNumber';
// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const SITES = [
  {
    name: '#PomagamyUkrainie',
    value: faker.datatype.number(),
    url: 'https://pomagamukrainie.gov.pl',
    icon: (
      <img
        src={
          'https://cms-v2-files.idcom-jst.pl/sites/12/wiadomosci/40742/fotos/medium/pomagam_ukrainie.png'
        }
        width={80}
        height={60}
      />
    )
  },
  {
    name: 'Gov.pl',
    value: faker.datatype.number(),
    url: 'https://www.gov.pl/web/ua',
    icon: (
      <img
        src={
          'https://www.gov.pl/img/Herb_Polski.svg'
        }
        width={51}
        height={60}
      />
    )
  },
  {
    name: 'NAWA',
    value: faker.datatype.number(),
    url: 'https://nawa.gov.pl/ukraina',
    icon: (
      <img
        src={
          '/static/icons/nava.png'
        }
        width={100}
        height={40}
      />
    )
  },
];

// ----------------------------------------------------------------------

function SiteItem({ site }) {
  const { icon, value, name } = site;

  return (
    <Grid item xs={6}>
      <Paper variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
        <Box sx={{ mb: 0.5, justifyContent: 'center', display: 'flex' }}>
          <IconButton color={'primary'}>{icon}</IconButton>
        </Box>
        <Typography variant="h6">{fShortenNumber(value)}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {name}
        </Typography>
      </Paper>
    </Grid>
  );
}

export default function ImportantSites() {
  return (
    <Card>
      <CardHeader title="Important sites" />
      <CardContent>
        <Grid container spacing={2}>
          {SITES.map((site) => (
            <SiteItem key={site.name} site={site} />
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
