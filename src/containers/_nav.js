import React from 'react'
import CIcon from '@coreui/icons-react'

let store = JSON.parse(localStorage.getItem('login'));
console.log("Store desde _Nav ",store);
let _nav = [];

if(store){
  if(store.role === 1){
    _nav = [
      {
        _tag: 'CSidebarNavItem',
        name: 'Registro Usuario',
        to: '/register',
        icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon"/>,
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Ventas',
        route: '/ventas',
        icon: <CIcon name="cilChart" customClasses="c-sidebar-nav-icon"/>,
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Ventas Totales',
            to: '/ventas/ventas-todas',
          },
        ],
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Direcciones',
        to: '/direcciones',
        icon: <CIcon name="cil-address-book" customClasses="c-sidebar-nav-icon"/>,
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Ubicaciones',
            to: '/direcciones/ubicacion',
          },
        ],
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Clientes',
        to: '/clientes',
        icon: <CIcon name="cil-address-book" customClasses="c-sidebar-nav-icon"/>,
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Información',
            to: '/clientes/informacion',
          },
        ],
      }
    ];
  }
  else{
    _nav = [      
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Ventas',
        route: '/ventas',
        icon: <CIcon name="cilChart" customClasses="c-sidebar-nav-icon"/>,
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Ventas Totales',
            to: '/ventas/ventas-todas',
          },
        ],
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Direcciones',
        to: '/direcciones',
        icon: <CIcon name="cil-address-book" customClasses="c-sidebar-nav-icon"/>,
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Ubicaciones',
            to: '/direcciones/ubicacion',
          },
        ],
      },
      {
        _tag: 'CSidebarNavDropdown',
        name: 'Clientes',
        to: '/clientes',
        icon: <CIcon name="cil-address-book" customClasses="c-sidebar-nav-icon"/>,
        _children: [
          {
            _tag: 'CSidebarNavItem',
            name: 'Información',
            to: '/clientes/informacion',
          },
        ],
      }
    ];
  }
}

export default _nav;
