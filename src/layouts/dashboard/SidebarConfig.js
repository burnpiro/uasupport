// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const sidebarConfig = [
  // {
  //   title: 'Informacje',
  //   path: '/dashboard/app',
  //   icon: getIcon('ic:round-perm-device-information')
  // },
  {
    title: 'Zbiórki Pieniędzy',
    path: '/dashboard/fundraising',
    icon: getIcon('mdi:account-cash-outline')
  },
  {
    title: 'Zakwaterowanie',
    path: '/dashboard/homes',
    icon: getIcon('eva:home-fill')
  },
  {
    title: 'Transport',
    path: '/dashboard/transport',
    icon: getIcon('eva:car-fill')
  },
  {
    title: 'Centra Pomocy',
    path: '/dashboard/aids',
    icon: getIcon('bxs:first-aid')
  },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill')
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill')
  // }
];

export default sidebarConfig;
