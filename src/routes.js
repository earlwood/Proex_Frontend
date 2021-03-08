import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

const VentasTodas = React.lazy(() => import('./views/ventas/ventas-todas'));
const Direcciones = React.lazy(() => import('./views/direcciones/ubicacion'));
const Clientes = React.lazy(() => import('./views/clientes/informacion'));
const Vendedores = React.lazy(() => import('./views/vendedores/informacion'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', name: 'Theme', component: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  

  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },

  { path: '/ventas', name: 'Ventas', component: VentasTodas, exact: true },
  { path: '/ventas/ventas-todas', name: 'Ventas Totales', component: VentasTodas },
  
  { path: '/direcciones', name: 'Direcciones', component: Direcciones, exact: true },
  { path: '/direcciones/ubicacion', name: 'Ubicaciones', component: Direcciones },
  
  { path: '/clientes', name: 'Clientes', component: Clientes, exact: true },
  { path: '/clientes/informacion', name: 'Información', component: Clientes },
  
  { path: '/vendedores', name: 'Vendedores', component: Vendedores, exact: true },
  { path: '/vendedores/informacion', name: 'Información', component: Vendedores }

];

export default routes;
