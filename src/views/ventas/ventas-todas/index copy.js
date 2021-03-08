import React, {useState, useEffect} from 'react'
import {
    CBadge,
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
    CSelect,
    CTextarea

  } from '@coreui/react';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import {useHistory} from 'react-router-dom';

import VentaForm from 'src/reusable/VentaForm';

const VentasTodas = (props) =>{
    
    const history = useHistory();
    const [ventas, setVentas] = useState([]);
    const [idVenta, setIdVenta] = useState();
    const [clientes, setClientes] = useState([]);
    let statusList = ['Seleccione', 'Entregado', 'Pendiente'];
    let store = JSON.parse(localStorage.getItem('login'));

    let token = 'Bearer ' + store.token;
    let config = {
        headers: {
          Authorization: token
        }
    };
    

    const Add = statusList.map(Add => Add);

    useEffect(() =>{
        let arrVentaNew = [];
        let arrVenta = [];
        let mounted = true;
        let store = JSON.parse(localStorage.getItem('login'));
        let config = {};
      
        if(store){
            if(store.id){
                axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogged/${store.id}`)
                .then((res) => {
                    if(mounted){                        
                        config = {
                            headers: {
                                Authorization: token
                                }
                        };
                        axios.get(`${process.env.REACT_APP_BASE_URL}/getVentas`, config)
                        .then((res) => {
                            if(mounted){
                                arrVenta = res.data[0];
                                for(let i in arrVenta){
                                    // eslint-disable-next-line
                                    const objIndex = arrVenta.findIndex((obj => obj.id_Venta === arrVenta[i].id_Venta));
                            
                                    arrVenta[objIndex].Date_Arrival = arrVenta[i].Date_Arrival.substring(0,10);
                                    arrVentaNew.push(arrVenta[objIndex]);
                                }
                                    
                                setVentas(arrVentaNew);
                            }
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
                        axios.get(`${process.env.REACT_APP_BASE_URL}/getClientes`)
                        .then((res) => {
                            if(mounted){
                                setClientes(res.data[0]);
                            }
                        });
                    }
                })
            }
        }
        else{
            history.push('/login');
        }   
        return () => {
            mounted = false;
            arrVenta = [];
            arrVentaNew = [];
            config={};
        }            

    }, [ventas, history, token]);

    
    //states del Modal
    
    const [details, setDetails] = useState([]);
    const [danger, setDanger] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    

    //State de Formulario
    const [ventaForm, setVentaForm] = useState({
        Date_Arrival: '',
        idClientes_Informacion: 0,
        Real_Weight: '',
        Vol_Weight: '',
        Total_Weight: '',
        Total_RW: '',
        Total_Vol_W: '',
        Total: '',
        Paid: '',
        Internal_Cost_Percentage: '',
        Cost_x_Lb: '',
        Total_Cost: '',
        Revenue: '',
        Percentage: '',
        Notes: '',
        Estatus: ''
    });
    ////States del Modal
    const resetForm = () =>{
        setVentaForm({
        Date_Arrival: '',
        idClientes_Informacion: 0,
        Real_Weight: '',
        Vol_Weight: '',
        Total_Weight: '',
        Total_RW: '',
        Total_Vol_W: '',
        Total: '',
        Paid: '',
        Internal_Cost_Percentage: '',
        Cost_x_Lb: '',
        Total_Cost: '',
        Revenue: '',
        Percentage: '',
        Notes: '',
        Estatus: ''
        });

        setModalEdit(!modalEdit);
    }

    const handleForm = (e) =>{
        const { name, value } = e.target;
        setVentaForm(preVentaForm => ({
            ...preVentaForm,
            [name]: value
        }));
        if(name === 'idClientes_Informacion'){
            setVentaForm({
                ...ventaForm,
                [name]: parseInt(value, 10)
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.put(`${process.env.REACT_APP_BASE_URL}/UpdateVenta/${idVenta}`, 
            {
                Date_Arrival: ventaForm.Date_Arrival,
                idClientes_Informacion: ventaForm.idClientes_Informacion,
                Real_Weight: ventaForm.Real_Weight,
                Vol_Weight: ventaForm.Vol_Weight,
                Total_Weight: ventaForm.Total_Weight,
                Total_RW: ventaForm.Total_RW,
                Total_Vol_W: ventaForm.Total_Vol_W,
                Total: ventaForm.Total,
                Paid: ventaForm.Paid,
                Internal_Cost_Percentage: ventaForm.Internal_Cost_Percentage,
                Cost_x_Lb: ventaForm.Cost_x_Lb,
                Total_Cost: ventaForm.Total_Cost,
                Revenue: ventaForm.Revenue,
                Percentage: ventaForm.Percentage,
                Notes: ventaForm.Notes,
                Estatus: ventaForm.Estatus
            }, config)
            .then((res) => { 
                swal({
                    icon: "success",
                    title: "Se ha editado la venta!" 
                });
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
        { key: 'Date_Arrival', _style: { width: '40%'} },
        'Cliente',
        'Real_Weight',
        'Vol_Weight',
        'Total_Weight',
        'Total_RW',
        'Total_Vol_W',
        'Total',
        'Paid',
        'Internal_Cost_Percentage',
        'Cost_x_Lb',
        'Total_Cost',
        'Revenue',
        'Percentage',
        'Notes',
        { key: 'Estatus', _style: { width: '20%'} },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            sorter: false,
            filter: false
        }
    ]
    
    const getBadge = (Estatus)=>{
        switch (Estatus) {
            case 'Entregado': return 'success'
            case 'Pendiente': return 'warning'
            default: return 'primary'
        }
    }
    

    const deleteVenta = (id) =>{
        axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteVenta/${id}`, config)
            .then((res) =>{
                swal("La venta ha sido eliminada!", {
                    icon: "success",
                });
            })
            .catch((err) => {alert(err);})        
    };
                       
    const ModalEliminar = (id) =>{
        
        swal({
            title: "Eliminar Venta",
            text: "¿Estás seguro que quieres eliminar el registro?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                deleteVenta(id);
            } 
            });

    };

    const ModalEditar = (id) =>{
        setIdVenta(id);
        axios.get(`${process.env.REACT_APP_BASE_URL}/selectVenta/${id}`)
            .then((res) => {
                setModalEdit(!modalEdit);
                res.data[0].map((i) => {
                    return setVentaForm({
                        Date_Arrival: i.Date_Arrival.substring(0,10),
                        idClientes_Informacion: i.idClientes_Informacion,
                        Real_Weight: i.Real_Weight,
                        Vol_Weight: i.Vol_Weight,
                        Total_Weight: i.Total_Weight,
                        Total_RW: i.Total_RW,
                        Total_Vol_W: i.Total_Vol_W,
                        Total: i.Total,
                        Paid: i.Paid,
                        Internal_Cost_Percentage: i.Internal_Cost_Percentage,
                        Cost_x_Lb: i.Cost_x_Lb,
                        Total_Cost: i.Total_Cost,
                        Revenue: i.Revenue,
                        Percentage: i.Percentage,
                        Notes: i.Notes,
                        Estatus: i.Estatus
                    });
                    
                })
            })
                
    }

    return (
        <div>    
            {/* Modal Venta nueva */}
            <VentaForm/>
            {/* Modal Venta nueva */}

            {/* Modal Editar venta */}
            <CModal show={modalEdit} onClose={() => resetForm()} size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>Registro Venta</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12" sm="6">
                            <CCard>
                                <CCardBody>
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="dateArrival">Date Arrival</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="date" value={ventaForm.Date_Arrival} name="Date_Arrival" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Client</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect name="idClientes_Informacion" value={ventaForm.idClientes_Informacion} onChange={handleForm}>
                                            <option value="0">Please select</option>
                                            {clientes.map(({idClientes_Informacion, Name}, index) =>
                                                <option key={index} value={parseInt(idClientes_Informacion,10)}>{Name}</option>
                                            )}
                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Real Weigth</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Real_Weight} name="Real_Weight" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Vol Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Vol_Weight} name="Vol_Weight" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Total_Weight} name="Total_Weight" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total RW</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Total_RW} name="Total_RW" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>
                                    
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Vol W</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Total_Vol_W} name="Total_Vol_W" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Total} name="Total" onChange={handleForm}/>
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
                                            <CLabel htmlFor="dateArrival">Paid</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Paid} name="Paid" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Internal Cost %</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Internal_Cost_Percentage} name="Internal_Cost_Percentage" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Cost x Lb</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Cost_x_Lb} name="Cost_x_Lb" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Cost</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Total_Cost} name="Total_Cost" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Revenue</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Revenue} name="Revenue" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Percentage</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={ventaForm.Percentage} name="Percentage" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>
                                    
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Notes</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CTextarea 
                                                id="textarea-input" 
                                                rows="5"
                                                placeholder="Content..."
                                                value={ventaForm.Notes} 
                                                name="Notes" 
                                                onChange={handleForm}
                                            />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Estatus</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                        <CSelect name="Estatus" value={ventaForm.Estatus} onChange={(e) => handleForm(e)}>
                                            {Add.map((opcion, key) => (
                                                <option key={key} value={opcion}>
                                                    {opcion}
                                                </option>
                                            ))}
                                            </CSelect>
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
                <CModalTitle>Eliminar Venta</CModalTitle>
                </CModalHeader>
                <CModalBody>
                ¿Estás seguro de eliminar éste registro?
                </CModalBody>
                <CModalFooter>
                <CButton color="danger" >Eliminar</CButton>{' '}
                <CButton color="secondary" >Cancel</CButton>
                </CModalFooter>
            </CModal>


            <CDataTable
                items={ventas}
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
                    'Estatus':
                    (item)=>(
                        <td>
                        <CBadge color={getBadge(item.Estatus)}>
                            {item.Estatus}
                        </CBadge>
                        </td>
                    ),
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
                                <p className="text-muted">Acciones de Venta</p>
                                <CButton size="sm" color="info" onClick={() => { ModalEditar(item.id_Venta);}}>
                                    Editar Venta
                                </CButton>
                                <CButton size="sm" color="danger" className="ml-1" onClick={() => ModalEliminar(item.id_Venta)}>
                                    Eliminar Venta
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

export default VentasTodas;