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
    CRow,
    CTextarea,    
    CSelect
  } from '@coreui/react';

  import axios from 'axios';
  import swal from '@sweetalert/with-react';
  import {useHistory} from 'react-router-dom';
  import {configHeaders} from 'src/reusable/util';

import ClientesForm from 'src/reusable/ClientesForm';

const Clientes = (props) =>{
    
    const history = useHistory();
    const [clientes, setClientes] = useState([]);    
    const [idCliente, setIdCliente] = useState();
    const [sellers, setSellers] = useState([]);
    //eslint-disable-next-line no-unused-vars
    const [ store, setStore ] = useState(JSON.parse(localStorage.getItem('login')));
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);
    
    const getClientes = () =>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/getClientesInfo`, configHeaders('Bearer ' + store.token))
        .then((res) => {    
                setClientes(res.data[0]);
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
            axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogged/${store.id}`)
            .then((res) =>{
                getClientes();
            })
        }
        else{
            history.push('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[store]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/getSellers`)
        .then((res) => {            
            setSellers(res.data[0]);
        });
    },[]);
    
    //states del Modal
    
    const [details, setDetails] = useState([]);
    const [danger, setDanger] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    //State de Formulario

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
        setIsSubmited(false);
        setModalEdit(!modalEdit);
    };

    const { Name, Address, Cel, Email, Rate_x_Lb, Rate_x_Vol, id_Seller } = clienteForm;

    const handleForm = (e) =>{
        const { name, value } = e.target;
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
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmited(true);

        if(Name !== '' && Address !== '' && Cel !== '' && Email !== '' && Rate_x_Lb !== '' && Rate_x_Vol !== '' ){
            axios.put(`${process.env.REACT_APP_BASE_URL}/UpdateCliente/${idCliente}`, 
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
                    title: "Se ha editado el cliente!" 
                });
                setIsSubmited(false);
                getClientes();
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
        { key: 'Nombre', _style: { width: '20%'} },
        { key: 'Dirección', _style: { width: '20%'} },        
        { key: 'Cel', _style: { width: '20%'} },     
        { key: 'Email', _style: { width: '20%'} },     
        { key: 'Rate_x_Lb', _style: { width: '10%'} },     
        { key: 'Rate_x_Vol', _style: { width: '10%'} },     
        { key: 'Vendedor', _style: { width: '10%'} },     
        {
        key: 'show_details',
        label: '',
        _style: { width: '1%' },
        sorter: false,
        filter: false
        }
    ]


    const deleteCliente = (id) =>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/DeleteCliente/${id}`, configHeaders('Bearer ' + store.token))
            .then((res) =>{
                swal("El cliente ha sido eliminado!", {
                    icon: "success",
                });
                getClientes();
            })
            .catch((err) => {
                axios.get(`${process.env.REACT_APP_BASE_URL}/SelectCliente/${id}`)
                .then((res) => {
                    res.data[0].map((i) => {
                        return swal({
                            icon: "error",
                            title: `Antes actualiza/elimina los registros existentes de Ventas con el Cliente "${i.Name}"` 
                        });
                    });
                });
            })
    };

    const ModalEliminar = (id) =>{
        
        swal({
            title: "Eliminar Cliente",
            text: "¿Estás seguro que quieres eliminar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                deleteCliente(id);
            } 
            });

    };

    const ModalEditar = (id) =>{
        setIdCliente(id);
        axios.get(`${process.env.REACT_APP_BASE_URL}/SelectCliente/${id}`)
            .then((res) => {
                setModalEdit(!modalEdit);
                res.data[0].map((i) => {
                    return setClienteForm({
                        Name: i.Name,
                        Address: i.Address,
                        Cel: i.Cel,
                        Email: i.Email,
                        Rate_x_Lb: i.Rate_x_Lb,
                        Rate_x_Vol: i.Rate_x_Vol,
                        id_Seller: i.id_Seller
                    });
                    
                });
            });
                
    }

    const swalVendedor = () =>{
        swal({
            icon: "warning",
            dangerMode: true,
            title: 'Antes crea un vendedor para enlazarlo al cliente.'
          });
    }

    return (
        <div>
            {/* Modal Venta nueva */}
            <ClientesForm store={store} clientes={getClientes} vendedor={swalVendedor}/>
            {/* Modal Venta nueva */}

            {/* Modal Editar venta */}
            <CModal show={modalEdit} onClose={() => resetForm()} size="lg">
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
                                            <CSelect name="id_Seller" value={clienteForm.id_Seller} onChange={handleForm}>
                                            <option value="0">Seleccione</option>
                                            {sellers.map(({id_Seller, Seller_Name}, index) =>
                                                <option key={index} value={parseInt(id_Seller,10)}>{Seller_Name}</option>
                                            )}
                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>

                                </CCardBody>
                            </CCard>
                        </CCol>               
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="info" disabled={id_Seller < 1} onClick={handleSubmit}>Editar</CButton>{' '}
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
                    <CModalTitle>Eliminar Cliente</CModalTitle>
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
                items={clientes}
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
                            <p className="text-muted">Acciones de Clientes</p>
                            <CButton size="sm" color="info" onClick={() => ModalEditar(item.idClientes_Informacion)}>
                                Editar Cliente
                            </CButton>
                            <CButton size="sm" color="danger" className="ml-1" onClick={() => ModalEliminar(item.idClientes_Informacion)}>
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

export default Clientes;