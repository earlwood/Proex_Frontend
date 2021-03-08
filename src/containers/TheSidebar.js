import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import logoProex from '../assets/icons/logo-proex_oscuro-horizontal.png';
import axios from 'axios';

// sidebar nav config
// import navigation from './_nav'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const [navMenu, setNavMenu] = useState([]);
    
    useEffect(() =>{
      let mounted = true;
      let store = JSON.parse(localStorage.getItem('login'));
      if(store){
          if(store.id){
              axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogged/${store.id}`)
              .then((res) => {
                  if(mounted){
                    if(store.role === 1){
                      setNavMenu([
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
                        },
                        {
                          _tag: 'CSidebarNavDropdown',
                          name: 'Vendedores',
                          to: '/vendedores',
                          icon: <CIcon name="cil-user" customClasses="c-sidebar-nav-icon"/>,
                          _children: [
                            {
                              _tag: 'CSidebarNavItem',
                              name: 'Información',
                              to: '/vendedores/informacion',
                            },
                          ],
                        }
                      ]);
                    }
                    else{
                      setNavMenu([      
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
                      ]);
                    }
                  }
              });
          }
      } 
      
      return () =>{
          mounted = false;
          store = '';        
      }            

  }, []);
  
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          src={logoProex}
          height={105}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          src={logoProex}
          height={105}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navMenu}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
