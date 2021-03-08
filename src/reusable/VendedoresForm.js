import React, {useState} from 'react';
import {
    CCardBody,
    CCard,
    CCol,
    CFormGroup,
    CInput,
    CLabel,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton
  } from '@coreui/react';

  import axios from 'axios';
  import swal from '@sweetalert/with-react';
  import {useHistory} from 'react-router-dom';
  import {configHeaders} from 'src/reusable/util';

const VendedoresForm = ({store, vendedores}) =>{

    const history = useHistory();
    const [large, setLarge] = useState(false);
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);

    //State de Formulario
    const [sellerForm, setSellerForm] = useState({
        Seller_Name: ''
    });

    const resetForm = () =>{
        setSellerForm({
            Seller_Name: ''
        });
        setIsSubmited(false);
        setLarge(!large);
    };

    const { Seller_Name } = sellerForm;

    const handleForm = (e) =>{
        const { name, value} = e.target;
        setSellerForm(preSellerForm => ({
            ...preSellerForm,
            [name]: value
        }));        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmited(true);
        
        if(Seller_Name !== ''){
            axios.post(`${process.env.REACT_APP_BASE_URL}/InsertSeller`, 
            {
                Seller_Name: sellerForm.Seller_Name
            }, configHeaders('Bearer ' + store.token))
            .then((res) => { 
                swal({
                    icon: "success",
                    title: "Se ha creado el nuevo vendedor!" 
                  });
                  setIsSubmited(false);
                  vendedores();
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
                    <CModalTitle>Registro Vendedor</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <CCard>
                                <CCardBody>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Vendedor</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Seller_Name} name="Seller_Name" onChange={handleForm}/>
                                            {isSubmited && Seller_Name === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>        
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="info" onClick={handleSubmit}>Guardar</CButton>{' '}
                    <CButton color="danger" onClick={() => resetForm()}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
            <CButton size="sm" color="info" onClick={() => setLarge(!large)}>Agregar Vendedor</CButton>
        </div>
    )
};

export default VendedoresForm;