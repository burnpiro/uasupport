import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import useAuth from '../../components/context/AuthContext';

export default function AdminContainer() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getClaims() {
      if (user) {
        const token = await user.getIdTokenResult();
        setIsAdmin(token.claims.admin === true);
      }
    }
    getClaims();
  }, [user]);
  return user && isAdmin && <Outlet />;
}
