import * as React from 'react';
import { Outlet } from 'react-router-dom';
// material
import useAuth from '../../components/context/AuthContext';

export default function MyContainer() {
  const { user } = useAuth();
  return user && <Outlet />;
}
