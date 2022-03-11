import { Link as RouterLink } from 'react-router-dom';
// material
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import AddAdminForm from '../../sections/@dashboard/admin/AddAdminForm';
import { useState } from 'react';
import {useTranslation} from "react-i18next";
import {addAdminClaim} from "../../utils/apiService/claimsAPI";
// ----------------------------------------------------------------------

export default function AdminPanel() {
  const { t, i18n } = useTranslation();
  const [addAdmin, setAddAdmin] = useState(false);

  const handleAddAdmin = () => {
    setAddAdmin(true);
  };
  const handleAddAdminClose = () => {
    setAddAdmin(false);
  };
  const handleAddAdminByEmail = async (email) => {
    const res = await addAdminClaim(email);
    console.log(res);
    return res;
  };
  return (
    <Page title={t('Admin Panel')}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('Admin Panel')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddAdmin}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {t('Add Admin')}
          </Button>
        </Stack>
      </Container>
      {addAdmin && (
        <AddAdminForm
          open={true}
          onClose={handleAddAdminClose}
          onFormSubmitted={handleAddAdminByEmail}
        />
      )}
    </Page>
  );
}
