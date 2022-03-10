import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DEFAULT_MAP_SIZE } from '../utils/settings';
import { useTranslation } from 'react-i18next';

export default function MapPlaceholder({ onClick }) {
  const { t, i18n } = useTranslation();
  return (
    <Box
      sx={{ width: '100%', minHeight: DEFAULT_MAP_SIZE, position: 'relative', cursor: 'pointer' }}
      onClick={onClick}
    >
      <img src={'/static/illustrations/illustration_blur_map.jpg'} alt={'Map Preview'} />
      <Typography
        variant={'h2'}
        style={{
          position: 'absolute',
          left: 'calc(50%)',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}
      >
        {t('clickToDisplay')}
      </Typography>
    </Box>
  );
}
