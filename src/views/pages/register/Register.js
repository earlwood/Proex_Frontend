import React, {useState, useEffect} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  // CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CSelect
} from '@coreui/react';
import { useHistory } from "react-router-dom";
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import {configHeaders} from 'src/reusable/util';

const Register = () => {
  const history = useHistory();

  const [roles, setRoles] = useState([]);
  //eslint-disable-next-line no-unused-vars
  const [ store, setStore ] = useState(JSON.parse(localStorage.getItem('login')));
  const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);

  const getRoles = () =>{
    axios.get(`${process.env.REACT_APP_BASE_URL}/getRoles`)
    .then((res) => {
      setRoles(res.data[0]);
    })
    .catch((err) =>{
      swal({
          icon: "warning",
          dangerMode: true,
          title: err + ' Inicia sesión de nuevo'
          });
          localStorage.clear();
          history.push('/login');
    });
};

  useEffect(() =>{
    if(store && store.id) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogged/${store.id}`)
      .then((res) =>{
          store.role === 2 ? history.push('/dashboard') : getRoles();
      })
    }
    else{
        history.push('/login');
    }    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  const [formUser, setFormUser] = useState({
    Email: '',
    Password: '',
    ConfirmPassword: '',
    id_Role: 0
  });

  const resetForm = () =>{
    setFormUser({
      Email: '',
      Password: '',
      ConfirmPassword: '',
      id_Role: 0
    });

  }

  const {Email, Password, ConfirmPassword, id_Role} = formUser;

  const handleForm = (e) =>{
      
    const { name, value} = e.target;
    setFormUser(preFormUser => ({
        ...preFormUser,
        [name]: value
    }));
    
    if(name === 'id_Role'){
            
      setFormUser(preFormUser =>({
          ...preFormUser,                    
          [name]: value === '' || value === 'Seleccione Rol'
                     ? 0
                     : parseInt(value, 10)
      }));
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmited(true);

  if(Email !== '' && Password !== '' && ConfirmPassword !== ''){
    if(Password !== ConfirmPassword){
      swal({
        icon: "warning",
        dangerMode: true,
        title: "Las contraseñas no coinciden" 
      });
    }else{
      axios.post(`${process.env.REACT_APP_BASE_URL}/insertUser`, 
      {
        Email: formUser.Email,
        Password: formUser.Password,
        id_Role: formUser.id_Role
      }, configHeaders('Bearer ' + store.token))
      .then((res) => { 
          
          // if(Object.prototype.toString.call(res.data) === '[object Object]'){
            if(res.data.inserted.affectedRows === 0){
            swal({
              icon: "warning",
              dangerMode: true,
              title: res.data.message
            });
          }else{
            
            swal({
                icon: "success",
                title:  res.data.message
              })
              .then(() => {
                if(!store){
                  history.push('/login');
                }
                else{
                  setIsSubmited(false);
                  history.push('/dashboard');
                }
              });
          }
      })
      .catch((err) => {
        swal({
          icon: "warning",
          dangerMode: true,
          title: err + ' Inicia sesión de nuevo'
        });
        localStorage.clear();
        history.push('/login');
      })
      resetForm();
    }    
  }
  else{
    setErrors('Éste campo es obligatorio');
  }

  
}

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Registro de Usuarios</h1>
                  <p className="text-muted">Crea una cuenta</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    {/* <CInput type="text" placeholder="Username" autoComplete="username" /> */}
                    <CSelect name="id_Role" value={id_Role} onChange={handleForm}>
                      <option value="0">Seleccione Rol</option>
                      {roles.map(({id_Role, Role}, index) =>
                          <option key={index} value={parseInt(id_Role,10)}>{Role}</option>
                      )}
                    </CSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="email" placeholder="Correo Electrónico" autoComplete="email" value={Email} name="Email" onChange={handleForm} />
                    {isSubmited && Email === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Contraseña" name="Password" value={Password} onChange={handleForm}/>
                    {isSubmited && Password === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Repetir Contraseña" name="ConfirmPassword" onChange={handleForm} value={ConfirmPassword}/>
                    {isSubmited && ConfirmPassword === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                  </CInputGroup>
                  <CButton color="success" disabled={id_Role < 1} block onClick={handleSubmit}>Crear Cuenta</CButton>
                </CForm>
              </CCardBody>
              {/* <CCardFooter className="p-4">
                <CRow>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-facebook mb-1" block><span>facebook</span></CButton>
                  </CCol>
                  <CCol xs="12" sm="6">
                    <CButton className="btn-twitter mb-1" block><span>twitter</span></CButton>
                  </CCol>
                </CRow>
              </CCardFooter> */}
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
