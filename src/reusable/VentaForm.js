import React, {useState, useEffect} from 'react';
import {
    CCardBody,
    CCard,
    CCol,
    CFormGroup,
    CInput,
    CLabel,
    CRow,
    CSelect,
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
  
  const VentaForm = ({store, ventas}) => {
      
    const history = useHistory();
    let statusList = ['Entregado', 'Pendiente'];
    const [large, setLarge] = useState(false);    
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState('');
    const Add = statusList.map(Add => Add);
    const [errors, setErrors] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);
    const [rate, setRate] = useState(0);

    const getRate = (rate) => {
        if(rate > 0){
            setRate(rate);
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
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
    
    useEffect(() =>{
                    
        axios.get(`${process.env.REACT_APP_BASE_URL}/getClientes`)
        .then((res) => {
            setClientes(res.data[0]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, []);

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
        setLarge(!large);
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
                'Total_RW': '',
                'Total_Vol_W': '',
                'Total': '',
                'Paid': '',
                'Internal_Cost_Percentage': '',
                'Cost_x_Lb': '',
                'Total_Cost': '',
                'Revenue': '',
                'Percentage': '',
                'Notes': '',
                'Estatus': 0
            }));
            setClienteId(value);
        }

        if(name === 'Real_Weight'){
            
            if(ventaForm.Real_Weight === ''){
                setVentaForm(preVentaForm =>({
                    ...preVentaForm,
                    'Vol_Weight': '',
                    'Total_Weight': '',
                    'Total_RW': '',
                    'Total_Vol_W': '',
                    'Total': '',
                    'Paid': '',
                    'Internal_Cost_Percentage': '',
                    'Cost_x_Lb': '',
                    'Total_Cost': '',
                    'Revenue': '',
                    'Percentage': '',
                    'Notes': '',
                    'Estatus': 0
                }))
            }
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
                                            : '',
                'Total_RW': parseFloat(value * rate).toFixed(2)
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

        if(name === 'Total_RW'){
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                'Total': value === '' 
                         ? ''
                         : parseFloat(parseFloat(preVentaForm.Total_RW) + parseFloat(preVentaForm.Total_Vol_W)).toFixed(2).toString()
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
            axios.post(`${process.env.REACT_APP_BASE_URL}/insertVentas`, 
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
                    title: "Se ha creado la nueva venta!" 
                  });
                  setIsSubmited(false);
                  ventas();
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

    return(
        <div>
            <CModal show={large} onClose={() => resetForm()} size="lg">
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
                                            <CLabel htmlFor="select">Cliente</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect name="idClientes_Informacion" value={idClientes_Informacion} onChange={handleForm}>
                                            <option value="0">Seleccione</option>
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
                                            <CInput type="number" placeholder="Text" value={Real_Weight} name="Real_Weight" onChange={handleForm} disabled={idClientes_Informacion < 1}/>
                                            {isSubmited && Real_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Vol Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Vol_Weight} name="Vol_Weight" onChange={handleForm} disabled={Real_Weight.length < 1}/>
                                            {isSubmited && Vol_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_Weight} name="Total_Weight" onChange={handleForm} disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total RW</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_RW} name="Total_RW" onChange={handleForm} disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>
                                    
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Vol W</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_Vol_W} name="Total_Vol_W" onChange={handleForm} disabled={Vol_Weight.length < 1}/>
                                            {isSubmited && Total_Vol_W === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total} name="Total" onChange={handleForm} disabled/>
                                            
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
                                            <CInput type="number" placeholder="Text" value={Paid} name="Paid" onChange={handleForm} disabled={Total_Vol_W.length < 1}/>
                                            {isSubmited && Paid === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Internal Cost %</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Internal_Cost_Percentage} name="Internal_Cost_Percentage" onChange={handleForm} />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Cost x Lb</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Cost_x_Lb} name="Cost_x_Lb" onChange={handleForm} disabled={Paid.length < 1}/>
                                            {isSubmited && Cost_x_Lb === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Cost</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_Cost} name="Total_Cost" onChange={handleForm} disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Revenue</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Revenue} name="Revenue" onChange={handleForm} disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Percentage</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Percentage} name="Percentage" onChange={handleForm} disabled/>
                                            
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
                                                <option value="0">Seleccione</option>
                                                {Add.map((opcion, key) => (
                                                    <option key={key} value={opcion}>
                                                        {opcion}
                                                    </option>
                                                ))}
                                            </CSelect>
                                            {/* {isSubmited && (Estatus !== '' || Estatus !== 'Seleccione') && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>} */}
                                        </CCol>
                                    </CFormGroup>

                                </CCardBody>
                            </CCard>
                        </CCol>               
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButton color="info" disabled={Estatus < 1} onClick={handleSubmit}>Guardar</CButton>{' '}
                    <CButton color="danger" onClick={() => resetForm()}>Cancelar</CButton>
                </CModalFooter>
            </CModal>
            <CButton size="sm" color="info" onClick={() => setLarge(!large)}>Agregar Venta</CButton>
        </div>
    )
}

export default VentaForm;