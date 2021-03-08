import React, {useEffect, useState} from 'react';
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
    CSelect,
    CButton
  } from '@coreui/react';

  import axios from 'axios';
  import swal from '@sweetalert/with-react';
  import {useHistory} from 'react-router-dom';
  import {configHeaders} from 'src/reusable/util';

const ClientesForm = ({store, clientes, vendedor}) =>{

    const history = useHistory();
    const [large, setLarge] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);
    
    useEffect(() =>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/getSellers`)
        .then((res) => {
            if(res.data[0].length > 0){
                setSellers(res.data[0]);
            }
            else{
                vendedor();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //State de Formulario
    const [clienteForm, setClienteForm] = useState({
        Name: '',
        Address: '',
        Cel: '',
        Email: '',
        Rate_x_Lb: '',
        Rate_x_Vol: '',
        id_Seller: 0
    });

    const resetForm = () =>{
        setClienteForm({
            Name: '',
            Address: '',
            Cel: '',
            Email: '',
            Rate_x_Lb: '',
            Rate_x_Vol: '',
            id_Seller: 0
        });

        setLarge(!large);
    };

    const { Name, Address, Cel, Email, Rate_x_Lb, Rate_x_Vol, id_Seller } = clienteForm;

    const handleForm = (e) =>{
        const { name, value} = e.target;
        setClienteForm(preClienteForm => ({
            ...preClienteForm,
            [name]: value
        }));
        
        if(name === 'id_Seller'){
            
            setClienteForm(preClienteForm =>({
                ...preClienteForm,                    
                [name]: value === '' || value === 'Seleccione'
                           ? 0
                           : parseInt(value, 10)
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmited(true);

        if(Name !== '' && Address !== '' && Cel !== '' && Email !== '' && Rate_x_Lb !== '' && Rate_x_Vol !== '' ){
            axios.post(`${process.env.REACT_APP_BASE_URL}/InsertCliente`, 
            {
                Name, 
                Address, 
                Cel, 
                Email, 
                Rate_x_Lb, 
                Rate_x_Vol,
                id_Seller
            }, configHeaders('Bearer ' + store.token))
            .then((res) => { 
                swal({
                    icon: "success",
                    title: "Se ha creado el nuevo cliente!" 
                  });
                  setIsSubmited(false);
                  clientes();           
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
                    <CModalTitle>Registro Cliente</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <CCard>
                                <CCardBody>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="Name">Nombre</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Name} name="Name" onChange={handleForm}/>
                                            {isSubmited && Name === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="Address">Dirección</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CTextarea 
                                                id="textarea-input" 
                                                rows="5"
                                                placeholder="Content..."
                                                value={Address} 
                                                name="Address" 
                                                onChange={handleForm}
                                            />
                                            {isSubmited && Address === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="Email">Email</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="email" placeholder="Email" value={Email} name="Email" onChange={handleForm}/>
                                            {isSubmited && Email === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
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
                                            <CLabel htmlFor="Cel">Celular</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="text" placeholder="Celular" value={Cel} name="Cel" onChange={handleForm}/>
                                            {isSubmited && Cel === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="Rate_x_Lb">Rate_x_Lb</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Rate_x_Lb} name="Rate_x_Lb" onChange={handleForm}/>
                                            {isSubmited && Rate_x_Lb === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Rate x Vol</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Rate_x_Vol} name="Rate_x_Vol" onChange={handleForm}/>
                                            {isSubmited && Rate_x_Vol === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Seller</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect name="id_Seller" value={id_Seller} onChange={handleForm}>
                                            <option value="0">Seleccione</option>
                                            {sellers.map(({id_Seller, Seller_Name}, index) =>
                                                <option key={index} value={parseInt(id_Seller,10)}>{Seller_Name}</option>
                                            )}
                                            </CSelect>
                                            {/* {isSubmited && id_Seller === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>} */}
                                        </CCol>
                                    </CFormGroup>

                                </CCardBody>
                            </CCard>
                        </CCol>               
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="info" disabled={id_Seller < 1} onClick={handleSubmit}>Guardar</CButton>{' '}
                    <CButton color="danger" onClick={() => resetForm()}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
            <CButton size="sm" color="info" onClick={() => setLarge(!large)}>Agregar Cliente</CButton>
        </div>
    )
};

export default ClientesForm;