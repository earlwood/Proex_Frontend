import React from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

const Logout =  () => {
    
    const history = useHistory();
    const logout = async () =>{
        let store = JSON.parse(localStorage.getItem('login'));
        await axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogout/${store.id}`)
        .then((res) =>{
            localStorage.clear();
            history.push('/login');
        })
    }

    return(
        <button type="button" className="btn btn-danger" onClick={() => logout()}>Salir</button>
    )
}

export default Logout;
