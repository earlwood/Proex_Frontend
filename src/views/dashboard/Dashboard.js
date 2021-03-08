import React, { useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {

  const history = useHistory();
  //eslint-disable-next-line no-unused-vars
  const [ store, setStore ] = useState(JSON.parse(localStorage.getItem('login')));
  
  useEffect(() => {
    
    if(store && store.id){
      axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogged/${store.id}`)
      .then((res) => {
        
      })
    }
    else{
      history.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  return (
    <div>
      <h1>Bienvenido al Sistema de Administración de <b>ProEx Cargo</b></h1>
    </div>    
  )
}

export default Dashboard;
