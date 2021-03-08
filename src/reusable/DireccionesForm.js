import React, {useState} from 'react';
import {
    CCardBody,
    CCard,
    CCol,
    CFormGroup,
    CInput,
    CLabel,
    CRow,
    CTextarea,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton
  } from '@coreui/react';

  import {configHeaders} from 'src/reusable/util';
  import axios from 'axios';
  import swal from '@sweetalert/with-react';
  import {useHistory} from 'react-router-dom';

const DireccionesForm = ({store, direcciones}) =>{

    const history = useHistory();
    const [large, setLarge] = useState(false);
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);

    //State de Formulario
    const [direccionForm, setDireccionForm] = useState({
        Tipo_Direccion: '',
        Direccion: ''
    });

    const resetForm = () =>{
        setDireccionForm({
            Tipo_Direccion: '',
            Direccion: ''
        });
        setIsSubmited(false);
        setLarge(!large);
    };

    const { Tipo_Direccion, Direccion } = direccionForm;

    const handleForm = (e) =>{
        
        const { name, value} = e.target;
        setDireccionForm(preDireccionForm => ({
            ...preDireccionForm,
            [name]: value
        }));
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmited(true);

        if(Tipo_Direccion !== '' && Direccion !== ''){
            axios.post(`${process.env.REACT_APP_BASE_URL}/insertDireccion`, 
            {
                Tipo_Direccion,
                Direccion
            }, configHeaders('Bearer ' + store.token))
            .then((res) => { 
                swal({
                    icon: "success",
                    title: "Se ha creado la nueva dirección!" 
                  });
                  setIsSubmited(false);
                  direcciones();
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
        else{
            setErrors('Éste campo es obligatorio');
        }  
    };

    return(
        <div>
            <CModal show={large} onClose={() => resetForm()} size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>Registro Dirección</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <CCard>
                                <CCardBody>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Tipo Dirección</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Tipo_Direccion} name="Tipo_Direccion" onChange={handleForm}/>
                                            {isSubmited && Tipo_Direccion === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol xs="12" sm="6">
                            <CCard>
                                <CCardBody>
                                <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Dirección</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CTextarea 
                                                id="textarea-input" 
                                                rows="5"
                                                placeholder="Content..."
                                                value={Direccion} 
                                                name="Direccion" 
                                                onChange={handleForm}
                                            />
                                            {isSubmited && Direccion === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>               
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="info"  onClick={handleSubmit}>Guardar</CButton>{' '}
                    <CButton color="danger" onClick={() => resetForm()}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
            <CButton size="sm" color="info" onClick={() => setLarge(!large)}>Agregar Dirección</CButton>
        </div>
    )
};

export default DireccionesForm;