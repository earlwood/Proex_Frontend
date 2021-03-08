import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Login = () => {

  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  //eslint-disable-next-line no-unused-vars
  const [ store, setStore ] = useState(JSON.parse(localStorage.getItem('login')));
  const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);

  useEffect(() =>{

    if(store && store.login){
      history.push('/dashboard');
    }
    else{      
      history.push('/login');
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const [formUserLogin, setFormUserLogin] = useState({
    Email: '',
    Password: ''
  });

  const resetForm = () =>{
    setFormUserLogin({
      Email: '',
      Password: ''
    });

  }

  const {Email, Password} = formUserLogin;

  const handleForm = (e) =>{
      
    const { name, value} = e.target;
    setFormUserLogin(preFormUserLogin => ({
        ...preFormUserLogin,
        [name]: value
    }));
};

const handleSubmit = (e) => {
  e.preventDefault();  
  setIsSubmited(true);

  if(Email !== '' && Password !== ''){
    axios.post(`${process.env.REACT_APP_BASE_URL}/getUserLogin`, 
    {
      Email,
      Password,
    })
    .then((res) => { 
      setLoading(!loading);
      if(res){
        if(!res.data.auth){
          swal({
            icon: "warning",
            dangerMode: true,
            title: res.data.message
          });
          setIsSubmited(false);
          setLoading(false);
        }
        
        if(res.data.auth){
          setIsSubmited(false);
          localStorage.setItem('login', JSON.stringify({
            login:true,
            token: res.data.token,
            id: res.data.result[0][0].id_User,
            email: res.data.result[0][0].Email,
            role: res.data.result[0][0].id_Role
          }));
          
          setTimeout(() =>{
            setLoading(false);
            history.push('/dashboard');
          }, 3000);
        }
      }
    })
    .catch((err) => {alert(err);})
    resetForm();   
  }
  else{
    setErrors('Éste campo es obligatorio');
  }
     
}



  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Iniciar Sesión</h1>
                    <p className="text-muted">Entra en tu cuenta!</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="email" placeholder="Correo Electrónico" autoComplete="email" value={Email} name="Email" onChange={handleForm} />
                      {isSubmited && Email === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="Password" value={Password} name="Password" onChange={handleForm}/>
                      {isSubmited && Password === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="primary" className="px-4" onClick={handleSubmit}>Entrar</CButton>
                      </CCol>                      
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Registro</h2>
                    <p>Para crear una nueva cuenta haz click en Registrar</p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>Registrar</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <Backdrop
        className={classes.backdrop}
        open={loading}        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default Login
