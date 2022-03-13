import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
// mocks_
import account from '../../_mocks_/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import sidebarConfig, {adminMenu, managerMenu, volunteerMenu} from './SidebarConfig';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import Iconify from '../../components/Iconify';
import * as React from 'react';
import { GDPRContext } from '../../components/context/GDPRContext';
import useAuth from '../../components/context/AuthContext';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const [emailOpen, setEmailOpen] = useState(false);
  const [showGDPR, setShowGDPR] = React.useContext(GDPRContext);
  const isDesktop = useResponsive('up', 'lg');
  const { isAdmin, isManager, isVolunteer } = useAuth();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
  }, [pathname]);

  const navConfig = sidebarConfig.map((el) => ({
    ...el,
    title: t(el.title)
  }));
  const adminConfig = adminMenu.map((el) => ({
    ...el,
    title: t(el.title)
  }));
  const managerConfig = managerMenu.map((el) => ({
    ...el,
    title: t(el.title)
  }));
  const volunteerConfig = volunteerMenu.map((el) => ({
    ...el,
    title: t(el.title)
  }));

  const handleToggleEmail = () => {
    setEmailOpen(!emailOpen);
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
        <Typography variant="h4" sx={{ color: 'text.primary', textAlign: 'right', ml: 2 }}>
          {t('Pomoc UA')}
        </Typography>
      </Box>

      {/*<Box sx={{ mb: 5, mx: 2.5 }}>*/}
      {/*  <Link underline="none" component={RouterLink} to="#">*/}
      {/*    <AccountStyle>*/}
      {/*      <Avatar src={account.photoURL} alt="photoURL" />*/}
      {/*      <Box sx={{ ml: 2 }}>*/}
      {/*        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>*/}
      {/*          {account.displayName}*/}
      {/*        </Typography>*/}
      {/*        <Typography variant="body2" sx={{ color: 'text.secondary' }}>*/}
      {/*          {account.role}*/}
      {/*        </Typography>*/}
      {/*      </Box>*/}
      {/*    </AccountStyle>*/}
      {/*  </Link>*/}
      {/*</Box>*/}

      <NavSection navConfig={navConfig} />
      {isAdmin && (
        <Fragment>
          <Divider textAlign="left">{t('Admin')}</Divider>
          <NavSection navConfig={adminConfig} />
        </Fragment>
      )}
      {isManager && (
        <Fragment>
          <Divider textAlign="left">{t('Organization')}</Divider>
          <NavSection navConfig={managerConfig} />
        </Fragment>
      )}
      {isVolunteer && (
        <Fragment>
          <Divider textAlign="left">{t('My Volunteering')}</Divider>
          <NavSection navConfig={managerConfig} />
        </Fragment>
      )}

      <Box sx={{ flexGrow: 1 }} />
      <Stack spacing={1} sx={{ pb: 2, pt: 4 }}>
        <Box>
          <Typography
            sx={{
              color: 'text.secondary',
              textAlign: 'left',
              ml: 2,
              pb: 1
            }}
            variant={'subtitle2'}
          >
            {t('Regulaminy')}
            {':'}
          </Typography>
          <Button
            onClick={() => setShowGDPR(true)}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'left',
              alignItems: 'center',
              ml: 2
            }}
          >
            <Typography
              sx={{
                lineHeight: '20px',
                color: 'text.primary',
                textAlign: 'right'
              }}
            >
              {t('GDPR')}
            </Typography>
          </Button>
        </Box>
        <Box>
          <Typography
            sx={{
              color: 'text.secondary',
              textAlign: 'left',
              ml: 2,
              pb: 0
            }}
            variant={'subtitle2'}
          >
            {t('Contact')}
            {':'}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'left',
              alignItems: 'center',
              pl: 2
            }}
          >
            <Stack spacing={1}>
              <IconButton aria-label="email" color={'success'} onClick={handleToggleEmail}>
                <Iconify icon={'eva:email-outline'} width={24} height={24} />
                {emailOpen && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.primary', textAlign: 'left', ml: 2, fontSize: '14px' }}
                  >
                    {'kemalpiro+ua@gmail.com'}
                  </Typography>
                )}
                {!emailOpen && (
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.primary', textAlign: 'left', ml: 2, fontSize: '14px' }}
                  >
                    {t('Email')}
                  </Typography>
                )}
              </IconButton>
            </Stack>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              color: 'text.secondary',
              textAlign: 'left',
              pl: 2,
              pb: 2
            }}
            variant={'subtitle2'}
          >
            {t('SupportedBy')}
            {':'}
          </Typography>
          <Link underline="none" href={'https://crisisresponse.google/'} target={'_blank'}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                pl: 2
              }}
            >
              <img alt={"Google Logo"} src={'/static/icons/google-logo.svg'} style={{ height: '20px' }} />
              <Typography
                sx={{
                  fontSize: '18px',
                  lineHeight: '20px',
                  color: 'text.secondary',
                  textAlign: 'right',
                  ml: 1
                }}
              >
                {t('Crisis Response')}
              </Typography>
            </Box>
          </Link>
        </Box>
      </Stack>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed'
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
