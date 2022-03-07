import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import Transport from './pages/Transport/Transport';
import Homes from './pages/Homes/Homes';
import Aids from './pages/Aids/Aids';
import Fundraising from './pages/Fundraising/Fundraising';
import ForgotPassword from "./pages/ForgotPassword";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        // { path: 'app', element: <DashboardApp /> },
        { path: 'fundraising*', element: <Fundraising /> },
        { path: 'transport*', element: <Transport /> },
        { path: 'homes*', element: <Homes /> },
        { path: 'aids*', element: <Aids /> }
        // { path: 'products', element: <Products /> },
        // { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/homes" /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'forgot', element: <ForgotPassword /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
