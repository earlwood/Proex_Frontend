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
import {configHeaders} from 'src/reusable/util';
let statusList = ['Seleccione', 'Entregado', 'Pendiente'];

const VentasTodas = (props) =>{
    
    const history = useHistory();
    const [ventas, setVentas] = useState([]);
    const [idVenta, setIdVenta] = useState();
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState('');
    //eslint-disable-next-line no-unused-vars
    const [ store, setStore ] = useState(JSON.parse(localStorage.getItem('login')));
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);
    

    const Add = statusList.map(Add => Add);

    const getVentas = () =>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/getVentas`, configHeaders('Bearer ' + store.token))
        .then((res) => {                            
            
            const arrVenta = res.data[0];
            const newArrVenta = arrVenta.map((venta) =>{
                
                const newDate = venta.Date_Arrival.substring(0,10);
                return {...venta, Date_Arrival: newDate};
            });
            setVentas(newArrVenta);
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
    
    const getRate = (rate) => {
        if(rate > 0){
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                'Total_RW': parseFloat(rate).toFixed(2),
                'Total': preVentaForm.Total_Vol_W !== '' 
                            ? parseFloat(parseFloat(preVentaForm.Total_Vol_W) + parseFloat(rate)).toFixed(2).toString() 
                            : ''
                
            }));
            
        }else{
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                'Total_RW': ''
            }));
        }
    }

    useEffect(() => {
        if(store && store.id) {
            axios.get(`${process.env.REACT_APP_BASE_URL}/getUserLogged/${store.id}`)
            .then((res) =>{
                getVentas();
            })
        }
        else{
            history.push('/login');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[store]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/getClientes`)
        .then((res) => {            
            setClientes(res.data[0]);
        });
    },[]);

    useEffect(() => {
        if(clienteId > 0){
            axios.get(`${process.env.REACT_APP_BASE_URL}/getRatexLb/${clienteId}`)
            .then((res) => {
                getRate(res.data);
            });
        }else{
            getRate(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[clienteId])
    
    //states del Modal
    
    const [details, setDetails] = useState([]);
    const [danger, setDanger] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    // const [isValid, setIsValid] = useState(false);
    

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

        setIsSubmited(false);
        setModalEdit(!modalEdit);
    }

    const { 
        Date_Arrival, 
        idClientes_Informacion, 
        Real_Weight, 
        Vol_Weight, 
        Total_Weight,
        Total_RW,
        Total_Vol_W,
        Total,
        Paid,
        Internal_Cost_Percentage,
        Cost_x_Lb,
        Total_Cost,
        Revenue,
        Percentage,
        Notes,
        Estatus
    } = ventaForm;

    const handleForm = (e) =>{
        
        const { name, value} = e.target;
        setVentaForm(preVentaForm => ({
            ...preVentaForm,
            [name]: value
        }));

        
        if(name === 'idClientes_Informacion'){
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                [name]: parseInt(value, 10),
                'Real_Weight': '',
                'Vol_Weight': '',
                'Total_Weight': '',
                'Total_Vol_W': '',
                'Paid': '',
                'Internal_Cost_Percentage': '',
                'Cost_x_Lb': '',
                'Revenue': '',
                'Percentage': '',
                'Notes': '',
                'Estatus': 0
                               
            }));
            setClienteId(value);
        }

        if(name === 'Real_Weight'){
            
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                'Total_Weight': preVentaForm.Vol_Weight === '' || value === ''
                                ? '' 
                                : value >= 0 && preVentaForm.Vol_Weight === ''
                                    ? parseFloat(value, 10).toFixed(2)
                                    :  value >= 0 && preVentaForm.Vol_Weight >= 0
                                        ? parseFloat(parseFloat(preVentaForm.Vol_Weight) + parseFloat(value, 10)).toFixed(2)
                                        : value === '' && preVentaForm.Vol_Weight !== ''
                                            ? parseFloat(preVentaForm.Vol_Weight)
                                            : ''
            }));
        }

        if(name === 'Vol_Weight'){            
            
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                'Total_Weight': preVentaForm.Real_Weight === '' || value === ''
                                ? '' 
                                : value >= 0 && preVentaForm.Real_Weight === ''
                                    ? parseFloat(value, 10).toFixed(2)
                                    :  value >= 0 && preVentaForm.Real_Weight >= 0 
                                        ? parseFloat(parseFloat(preVentaForm.Real_Weight) + parseFloat(value, 10)).toFixed(2)
                                        : value === '' && preVentaForm.Real_Weight !== ''
                                            ? parseFloat(preVentaForm.Real_Weight)
                                            : ''
            }));
        }
        
        if(name === 'Total_Vol_W'){
            
            if(ventaForm.Total_RW > 0){
                setVentaForm(preVentaForm =>({
                    ...preVentaForm,
                    'Total': value === '' 
                             ? ''
                             : parseFloat(parseFloat(preVentaForm.Total_RW) + parseFloat(value)).toFixed(2).toString()
                }));
            }
        }

        if(name === 'Cost_x_Lb'){
            
            if(ventaForm.Real_Weight > 0){
                setVentaForm(preVentaForm =>({
                    ...preVentaForm,
                    'Total_Cost': value === ''
                                  ? ''
                                  : parseFloat(parseFloat(preVentaForm.Real_Weight) * parseFloat(value)).toFixed(2)
                                  
                }));
            }
            
        }

        if(ventaForm.Total_Cost !== ''){
            
            setVentaForm(preVentaForm =>({
                ...preVentaForm,                    
                'Revenue': preVentaForm.Total_Cost === ''
                           ? ''
                           : parseFloat(parseFloat(preVentaForm.Total) - parseFloat(preVentaForm.Total_Cost)).toFixed(2)
            }));
        }

        if(ventaForm.Revenue !== ''){
            setVentaForm(preVentaForm =>({
                ...preVentaForm,                    
                'Percentage': preVentaForm.Revenue === ''
                           ? ''
                           : ((parseFloat(parseFloat(preVentaForm.Revenue) / parseFloat(preVentaForm.Total))) * 100 ).toFixed(2)
            }));
        }
        
        // if(name === 'Estatus'){
        //     // setIsValid(true);
        //     if(value !== 'Seleccione'){
        //         setIsValid(true);
        //     }
        //     // console.log(value);
        //     else{
        //         setIsValid(false);
        //     }
        // }

        if(name === 'Estatus'){
            
            setVentaForm(preVentaForm =>({
                ...preVentaForm,                    
                'Estatus': value === '' || value === 'Seleccione'
                           ? 0
                           : value
            }));
        }


    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmited(true);
        if(Date_Arrival.value !== '' && idClientes_Informacion !== '' && Real_Weight !== '' && Vol_Weight !== '' && Total_Weight !== ''
            && Total_RW !== '' && Total_Vol_W !== ''  && Total !== '' && Paid !== '' && Cost_x_Lb !== '' 
            && Total_Cost !== '' & Revenue !== '' && Percentage !== ''
        ){
            axios.put(`${process.env.REACT_APP_BASE_URL}/UpdateVenta/${idVenta}`, 
            {
                Date_Arrival,
                idClientes_Informacion,
                Real_Weight,
                Vol_Weight,
                Total_Weight,
                Total_RW,
                Total_Vol_W,
                Total,
                Paid,
                Internal_Cost_Percentage: Internal_Cost_Percentage !== '' ? Internal_Cost_Percentage : 0,
                Cost_x_Lb,
                Total_Cost,
                Revenue,
                Percentage,
                Notes,
                Estatus
            }, configHeaders('Bearer ' + store.token))
            .then((res) => { 
                swal({
                    icon: "success",
                    title: "Se ha editado la venta!" 
                });
                setIsSubmited(false);
                getVentas();
            })
            // .catch((err) => {
            //     swal({
            //         icon: "warning",
            //         dangerMode: true,
            //         title: err + ' Inicia sesión de nuevo'
            //       });
            //       localStorage.clear();
            //       history.push('/login');
            // })
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
        axios.delete(`${process.env.REACT_APP_BASE_URL}/deleteVenta/${id}`, configHeaders('Bearer ' + store.token))
            .then((res) =>{
                swal("La venta ha sido eliminada!", {
                    icon: "success",
                });
                getVentas();
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
            <VentaForm store={store} ventas={getVentas}/>
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
                                            <CInput type="date" value={Date_Arrival} name="Date_Arrival" onChange={handleForm}/>
                                            {isSubmited && Date_Arrival === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Client</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect name="idClientes_Informacion" value={idClientes_Informacion} onChange={handleForm}>
                                            <option value="0">Please select</option>
                                            {clientes.map(({idClientes_Informacion, Name}, index) =>
                                                <option key={index} value={parseInt(idClientes_Informacion,10)}>{Name}</option>
                                            )}
                                            </CSelect>
                                            {isSubmited && idClientes_Informacion === 0 && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Real Weigth</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Real_Weight} name="Real_Weight" onChange={handleForm}/>
                                            {isSubmited && Real_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Vol Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Vol_Weight} name="Vol_Weight" onChange={handleForm}/>
                                            {isSubmited && Vol_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total_Weight} name="Total_Weight" onChange={handleForm} disabled/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total RW</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total_RW} name="Total_RW" onChange={handleForm} disabled/>
                                        </CCol>
                                    </CFormGroup>
                                    
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Vol W</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total_Vol_W} name="Total_Vol_W" onChange={handleForm}/>
                                            {isSubmited && Total_Vol_W === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total} name="Total" onChange={handleForm} disabled/>
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
                                            <CInput placeholder="Text" value={Paid} name="Paid" onChange={handleForm}/>
                                            {isSubmited && Paid === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Internal Cost %</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Internal_Cost_Percentage} name="Internal_Cost_Percentage" onChange={handleForm}/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Cost x Lb</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Cost_x_Lb} name="Cost_x_Lb" onChange={handleForm}/>
                                            {isSubmited && Cost_x_Lb === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Cost</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total_Cost} name="Total_Cost" onChange={handleForm} disabled/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Revenue</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Revenue} name="Revenue" onChange={handleForm} disabled/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Percentage</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Percentage} name="Percentage" onChange={handleForm} disabled/>
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
                                                value={Notes} 
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
                                        <CSelect name="Estatus" value={Estatus} onChange={(e) => handleForm(e)}>
                                            {/* <option value="0">Seleccione</option> */}
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
                    <CButton color="info" disabled={Estatus < 1} onClick={handleSubmit}>Editar</CButton>{' '}
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