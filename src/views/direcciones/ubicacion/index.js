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
    CTextarea

  } from '@coreui/react';
import axios from 'axios';
import swal from '@sweetalert/with-react'
import {useHistory} from 'react-router-dom';
import DireccionesForm from 'src/reusable/DireccionesForm';
import {configHeaders} from 'src/reusable/util';



const Direcciones = (props) =>{
    
    const history = useHistory();
    const [direcciones, setDirecciones] = useState([]);    
    const [idDireccion, setIdDireccion] = useState();
    //eslint-disable-next-line no-unused-vars
    const [ store, setStore ] = useState(JSON.parse(localStorage.getItem('login')));

    const getDirecciones = () =>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/getDirecciones`, configHeaders('Bearer ' + store.token))
        .then((res) => {  
                setDirecciones(res.data[0]);
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
                getDirecciones();
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[store]);
        
    //states del Modal
    
    const [details, setDetails] = useState([]);
    const [danger, setDanger] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);

    //State de Formulario

    //State de Formulario
    const [direccionForm, setDireccionForm] = useState({
        Tipo_Direccion: '',
        Direccion: ''
    });
    ////States del Modal
    const resetForm = () =>{
        setDireccionForm({
            Tipo_Direccion: '',
            Direccion: ''
        });
        setIsSubmited(false);
        setModalEdit(!modalEdit);
    }

    const { Tipo_Direccion, Direccion } = direccionForm;

    const handleForm = (e) =>{
        const { name, value } = e.target;
        setDireccionForm(preDireccionForm => ({
            ...preDireccionForm,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmited(true);

        if(Tipo_Direccion !== '' && Direccion !== ''){
            axios.put(`${process.env.REACT_APP_BASE_URL}/UpdateDireccion/${idDireccion}`, 
            {
                Tipo_Direccion: direccionForm.Tipo_Direccion,
                Direccion: direccionForm.Direccion
            }, configHeaders('Bearer ' + store.token))
            .then((res) => { 
                swal({
                    icon: "success",
                    title: "Se ha modificado la dirección!" 
                });
                setIsSubmited(false);
                getDirecciones();
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
        { key: 'Tipo_Direccion', _style: { width: '30%'} },
        { key: 'Direccion', _style: { width: '70%'} },        
        {
        key: 'show_details',
        label: '',
        _style: { width: '1%' },
        sorter: false,
        filter: false
        }
    ]


    const deleteDireccion = (id) =>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteDireccion/${id}`, configHeaders('Bearer ' + store.token))
            .then((res) =>{
                swal("La dirección ha sido eliminada!", {
                    icon: "success",
                });
                getDirecciones();
            })
            .catch((err) => {alert(err);})        
    };

    const ModalEliminar = (id) =>{
        
        swal({
            title: "Eliminar Dirección",
            text: "¿Estás seguro que quieres eliminar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                deleteDireccion(id);
            } 
            });

    };

    const ModalEditar = (id) =>{
        setIdDireccion(id);
        axios.get(`${process.env.REACT_APP_BASE_URL}/SelectDireccion/${id}`)
            .then((res) => {
                setModalEdit(!modalEdit);
                res.data[0].map((i) => {
                    return setDireccionForm({
                        Tipo_Direccion: i.Tipo_Direccion,
                        Direccion: i.Direccion
                    });
                    
                })
            })
                
    }

    return (
        <div>
            {/* Modal Venta nueva */}
            <DireccionesForm store={store} direcciones={getDirecciones}/>
            {/* Modal Venta nueva */}

            {/* Modal Editar venta */}
            <CModal show={modalEdit} onClose={() => resetForm()} size="lg">
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
                                            <CLabel htmlFor="TipoDireccion">Tipo Dirección</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="text" value={direccionForm.Tipo_Direccion} name="Tipo_Direccion" onChange={handleForm}/>
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
                                                value={direccionForm.Direccion} 
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
                    <CModalTitle>Eliminar Dirección</CModalTitle>
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
                items={direcciones}
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
                            <p className="text-muted">Acciones de Direcciones</p>
                            <CButton size="sm" color="info" onClick={() =>  ModalEditar(item.id_Direccion)}>
                                Editar Dirección
                            </CButton>
                            <CButton size="sm" color="danger" className="ml-1" onClick={() => ModalEliminar(item.id_Direccion)}>
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

export default Direcciones;