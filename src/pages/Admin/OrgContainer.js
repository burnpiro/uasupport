import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import useAuth from '../../components/context/AuthContext';

export default function OrgContainer() {
  const { user, isAdmin, isManager, isVolunteer } = useAuth();

  return user && (isAdmin || isManager || isVolunteer) && <Outlet />;
}
