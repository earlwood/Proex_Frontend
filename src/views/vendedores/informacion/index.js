import React, {useState, useEffect} from 'react'
import {
    CButton,
    CCardBody,
    CCollapse,
    CDataTable,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCol,
    CFormGroup,
    CInput,
    CLabel,
    CRow
  } from '@coreui/react';
import axios from 'axios';
import swal from '@sweetalert/with-react'
import {useHistory} from 'react-router-dom';
import VendedoresForm from 'src/reusable/VendedoresForm';
import {configHeaders} from 'src/reusable/util';

const Vendedores = (props) =>{
    
    const history = useHistory();
    const [sellers, setSellers] = useState([]);    
    const [idSeller, setIdSeller] = useState();
    //eslint-disable-next-line no-unused-vars
    const [ store, setStore ] = useState(JSON.parse(localStorage.getItem('login')));
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);

    const getVendedores = () =>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/getSellersList`, configHeaders('Bearer ' + store.token))
        .then((res) => {
            setSellers(res.data[0]);
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

    useEffect(() => {
        if(store && store.id) {
            // axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogged/${store.id}`)
            // .then((res) =>{
                getVendedores();
            // })
        }
        else{
            history.push('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[store]);
        
    //states del Modal
    
    const [details, setDetails] = useState([]);
    const [danger, setDanger] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    //State de Formulario
    const [sellerForm, setSellerForm] = useState({
        Seller_Name: ''
    });
    
    const resetForm = () =>{
        setSellerForm({
            Seller_Name: ''
        });

        setModalEdit(!modalEdit);
    }

    const { Seller_Name } = sellerForm;

    const handleForm = (e) =>{
        const { name, value } = e.target;
        setSellerForm(preSellerForm => ({
            ...preSellerForm,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmited(true);

        if(Seller_Name !== ''){
            axios.put(`${process.env.REACT_APP_BASE_URL}/UpdateSeller/${idSeller}`, 
            {
                Seller_Name: sellerForm.Seller_Name
            }, configHeaders('Bearer ' + store.token))
            .then((res) => { 
                swal({
                    icon: "success",
                    title: "Se ha modificado el vendedor!" 
                });
                setIsSubmited(false);
                getVendedores();
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
        
    }

    const toggleDetails = (index) => {
        const position = details.indexOf(index)
        let newDetails = details.slice()
        if (position !== -1) {
        newDetails.splice(position, 1)
        } else {
        newDetails = [...details, index]
        }
        setDetails(newDetails)
    }


    const fields = [      
        { key: 'Vendedor', _style: { width: '50%'} },       
        {
        key: 'show_details',
        label: '',
        _style: { width: '1%' },
        sorter: false,
        filter: false
        }
    ]


    const deleteSeller = (id) =>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteSeller/${id}`, configHeaders('Bearer ' + store.token))
            .then((res) =>{
                swal("El vendedor ha sido eliminado!", {
                    icon: "success",
                });
                getVendedores();
            })
            .catch((err) => {
                axios.get(`${process.env.REACT_APP_BASE_URL}/SelectSeller/${id}`)
                .then((res) => {
                    res.data[0].map((i) => {
                        return swal({
                            icon: "error",
                            title: `Antes actualiza/elimina los registros existentes de Clientes con el Vendedor "${i.Seller_Name}"` 
                        });
                    });
                });  
            })        
    };

    const ModalEliminar = (id) =>{
        
        swal({
            title: "Eliminar Vendedor",
            text: "¿Estás seguro que quieres eliminar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                deleteSeller(id);
            } 
            });

    };

    const ModalEditar = (id) =>{
        setIdSeller(id);
        axios.get(`${process.env.REACT_APP_BASE_URL}/SelectSeller/${id}`)
            .then((res) => {
                setModalEdit(!modalEdit);
                res.data[0].map((i) => {
                    return setSellerForm({
                        Seller_Name: i.Seller_Name
                    });
                    
                })
            })
                
    }

    return (
        <div>
            {/* Modal Venta nueva */}
            <VendedoresForm store={store} vendedores={getVendedores}/>
            {/* Modal Venta nueva */}

            {/* Modal Editar venta */}
            <CModal show={modalEdit} onClose={() => resetForm()} size="lg">
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
                                            <CLabel htmlFor="Seller_Name">Vendedor</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="text" value={Seller_Name} name="Seller_Name" onChange={handleForm}/>
                                            {isSubmited && Seller_Name === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                </CCardBody>
                            </CCard>
                        </CCol>                                   
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="info" onClick={handleSubmit}>Editar</CButton>{' '}
                    <CButton color="danger" onClick={() => resetForm()}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
            {/* Modal Editar venta */}

            {/* Delete Confirm Modal */}
            <CModal 
                show={danger} 
                onClose={() => setDanger(!danger)}
                color="danger"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Eliminar Vendedor</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    ¿Estás seguro de eliminar éste registro?
                </CModalBody>
                <CModalFooter>
                    <CButton color="danger" >Eliminar</CButton>{' '}
                    <CButton color="secondary" >Cancelar</CButton>
                </CModalFooter>
            </CModal>

            <CDataTable
                items={sellers}
                fields={fields}
                columnFilter
                tableFilter
                footer
                itemsPerPageSelect
                itemsPerPage={5}
                hover
                sorter
                pagination
                scopedSlots = {{            
                    'show_details':
                    (item, index)=>{
                        return (
                        <td className="py-2">
                            <CButton
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            onClick={()=>{toggleDetails(index)}}
                            >
                            {details.includes(index) ? 'Hide' : 'Show'}
                            </CButton>
                        </td>
                        )
                    },
                    'details':
                        (item, index)=>{
                        return (
                        <CCollapse show={details.includes(index)}>
                            <CCardBody>
                            <p className="text-muted">Acciones de los Vendedores</p>
                            <CButton size="sm" color="info" onClick={() =>  ModalEditar(item.id_Seller)}>
                                Editar Vendedor
                            </CButton>
                            <CButton size="sm" color="danger" className="ml-1" onClick={() => ModalEliminar(item.id_Seller)}>
                                Eliminar
                            </CButton>
                            </CCardBody>
                        </CCollapse>
                        )
                    }
                }}
            />
        </div>
    )    
};

export default Vendedores;