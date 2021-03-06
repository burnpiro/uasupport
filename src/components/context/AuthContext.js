import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, getAuth, signOut } from 'firebase/auth';
import {
  createUserAccount,
  resetPassword,
  sighInWithFB,
  sighInWithGoogle,
  signInStandard
} from '../../utils/authService/AuthService';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { auth } from '../../firebase';

const AuthContext = createContext({});

const ALLOWED_ERRORS = ['auth/account-exists-with-different-credential'];
const REDIRECT_LOCATIONS = ['/login', '/register', '/forgot'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [errorCredential, setErrorCredential] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  async function setUserData(user) {
    if(user) {
      const token = await user.getIdTokenResult();
      if (token.claims.admin === true) {
        setIsAdmin(true);
      }
      if (token.claims.volunteer === true) {
        setIsVolunteer(true);
      }
      if (token.claims.manager === true) {
        setIsManager(true);
      }
      setUser(user);
    } else {
      setUser(null);
      setIsAdmin(false);
      setIsVolunteer(false);
      setIsManager(false);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
  }, []);

  async function loginGoogle() {
    setLoading(true);

    const res = await sighInWithGoogle({ errorCredential });
    if (res.user != null) {
      setUserData(res.user);
      if (REDIRECT_LOCATIONS.includes(location.pathname)) {
        navigate('/', { replace: true });
      }
    } else {
      setUser(null);
      if (ALLOWED_ERRORS.includes(res.code)) {
        setErrorCredential(res.credential);
        setError(res.code);
      } else {
        enqueueSnackbar(t('Error') + ': ' + t(res.code), { variant: 'error' });
      }
    }
    setLoading(false);
    return res;
  }

  async function loginFB() {
    setLoading(true);

    const res = await sighInWithFB({ errorCredential });
    if (res.user != null) {
      setUserData(res.user);
      if (REDIRECT_LOCATIONS.includes(location.pathname)) {
        navigate('/', { replace: true });
      }
    } else {
      setUser(null);
      if (ALLOWED_ERRORS.includes(res.code)) {
        setErrorCredential(res.credential);
        setError(res.code);
      } else {
        enqueueSnackbar(t('Error') + ': ' + t(res.code), { variant: 'error' });
      }
    }
    setLoading(false);
    return res;
  }

  async function login({ email, password }) {
    setLoading(true);

    const res = await signInStandard({
      email: email.trim(),
      password: password.trim(),
      errorCredential
    });
    if (res.user != null) {
      setUserData(res.user);
      if (REDIRECT_LOCATIONS.includes(location.pathname)) {
        navigate('/', { replace: true });
      }
    } else {
      setUser(null);
      if (ALLOWED_ERRORS.includes(res.code)) {
        setErrorCredential(res.credential);
        setError(res.code);
      } else {
        enqueueSnackbar(t('Error') + ': ' + t(res.code), { variant: 'error' });
      }
    }
    setLoading(false);
    return res;
  }

  async function signUp({ email, password }) {
    setLoading(true);

    const res = await createUserAccount({ email: email.trim(), password: password.trim() });
    if (res.user != null) {
      setUserData(res.user);
      if (REDIRECT_LOCATIONS.includes(location.pathname)) {
        navigate('/', { replace: true });
      }
    } else {
      setUser(null);
      if (ALLOWED_ERRORS.includes(res.code)) {
        setErrorCredential(res.credential);
        setError(res.code);
      } else {
        enqueueSnackbar(t('Error') + ': ' + t(res.code), { variant: 'error' });
      }
    }
    setLoading(false);
    return res;
  }

  async function forgotPassword({ email }) {
    setLoading(true);

    const res = await resetPassword({ email: email.trim() });
    if (res.status == 200) {
      if (location.pathname === '/forgot') {
        navigate('/login', { replace: true });
      }
      enqueueSnackbar(t('Message was sent to your email address'), { variant: 'success' });
    } else {
      if (ALLOWED_ERRORS.includes(res.code)) {
        setErrorCredential(res.credential);
        setError(res.code);
      } else {
        enqueueSnackbar(t('Error') + ': ' + t(res.code), { variant: 'error' });
      }
    }
    setUserData(null);
    setLoading(false);
  }

  function logout() {
    signOut(auth)
      .then(() => {
        setUserData(null);
        enqueueSnackbar(t('Logged out successfully'), { variant: 'success' });
      })
      .catch((error) => {
        setError(error);
        enqueueSnackbar(t('Error') + ': ' + t(error.message), { variant: 'error' });
      });
  }

  const memoedValue = useMemo(
    () => ({
      user,
      isAdmin,
      isVolunteer,
      isManager,
      loading,
      error,
      login,
      loginGoogle,
      loginFB,
      signUp,
      logout,
      forgotPassword
    }),
    [user, loading, error, isAdmin, isManager, isVolunteer]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{!loadingInitial && children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
