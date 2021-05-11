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
    const [rate_xLB, setRate_xLB] = useState(0);
    const [rate_xVol, setRate_xVol] = useState(0);

    const getRate = (rateXLb, rateXVol) => {
        if(rateXLb > 0){
            setRate_xLB(rateXLb);
            setRate_xVol(rateXVol);

            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                'Total': preVentaForm.Total_Vol_W !== '' 
                            ? parseFloat(parseFloat(preVentaForm.Total_Vol_W) + parseFloat(rateXLb)).toFixed(2).toString() 
                            : '',
                'Cost_x_Lb': parseFloat(rateXLb).toFixed(2)
            }));
            
        }else{
            
            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                'idClientes_Informacion': 0,
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
                getRate(res.data.rateXLb, res.data.rateXVol);
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

    const onClientsInfo_Change = ({name, value}) => {
        
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

    const onRealWeight_Change = ({name, value}) => {

        const totCost = parseFloat(parseFloat(value) * parseFloat(ventaForm.Cost_x_Lb)).toFixed(2);
        const tot2 = parseFloat(parseFloat(totCost) + parseFloat(ventaForm.Vol_Weight * rate_xVol) + parseFloat(ventaForm.Total_Vol_W)).toFixed(2);
        const reven = parseFloat(parseFloat(tot2) - parseFloat(totCost)).toFixed(2);
        const percent = ((parseFloat((parseFloat(tot2) - parseFloat(totCost)) / parseFloat(tot2))) * 100 ).toFixed(2);
        const totrw = parseFloat(parseFloat(ventaForm.Vol_Weight * rate_xVol)).toFixed(2);
        
        const newTotRW = parseFloat(parseFloat(value * rate_xLB) + parseFloat(totrw)).toFixed(2);
        const newTotal = parseFloat(parseFloat(newTotRW) + parseFloat(ventaForm.Total_Vol_W)).toFixed(2);

        let newVentaForm={};

        if(ventaForm.Total_Vol_W === ''){
            newVentaForm = (value === '') 
            ?{
                ...ventaForm,
                [name]: value,
                'Vol_Weight': '',
                'Total_Weight': '',
                'Total_RW': '',
                'Total_Vol_W': '',
                'Total': '',
                'Paid': '',
                'Internal_Cost_Percentage': '',
                'Total_Cost': '',
                'Revenue': '',
                'Percentage': '',
                'Notes': '',
                'Estatus': 0
            }
            :{
                ...ventaForm,
                [name]: value,
                'Total_Weight': value >= 0 && ventaForm.Vol_Weight === ''
                                    ? parseFloat(value, 10).toFixed(2)
                                    :  value >= 0 && ventaForm.Vol_Weight >= 0
                                        ? parseFloat(parseFloat(ventaForm.Vol_Weight) + parseFloat(value, 10)).toFixed(2)
                                        : value === '' && ventaForm.Vol_Weight !== ''
                                            ? parseFloat(ventaForm.Vol_Weight)
                                            : '',
                'Total_RW': parseFloat(value * rate_xLB).toFixed(2)
            }
        }
        else{

            newVentaForm = (value === '') 
            ?{
                ...ventaForm,
                [name]: value,
                'Vol_Weight': '',
                'Total_Weight': '',
                'Total_RW': '',
                'Total_Vol_W': '',
                'Total': '',
                'Paid': '',
                'Internal_Cost_Percentage': '',
                'Total_Cost': '',
                'Revenue': '',
                'Percentage': '',
                'Notes': '',
                'Estatus': 0
            }
            :{
                ...ventaForm,
                [name]: value,
                'Total_Weight': value >= 0 && ventaForm.Vol_Weight === ''
                                    ? parseFloat(value, 10).toFixed(2)
                                    :  value >= 0 && ventaForm.Vol_Weight >= 0
                                        ? parseFloat(parseFloat(ventaForm.Vol_Weight) + parseFloat(value, 10)).toFixed(2)
                                        : value === '' && ventaForm.Vol_Weight !== ''
                                            ? parseFloat(ventaForm.Vol_Weight)
                                            : '',
                'Total_RW': newTotRW,

                'Total': newTotal,

                'Total_Cost': newTotRW,

                'Revenue': ventaForm.Paid !== ''
                            ? reven
                            : '',
                            
                'Percentage': ventaForm.Paid !== ''
                            ? percent
                            : ''
            }
        }        
        setVentaForm(newVentaForm);
    }

    const onVolWeight_Change = ({name, value}) => {

        const totCost = parseFloat(parseFloat(ventaForm.Real_Weight) * parseFloat(ventaForm.Cost_x_Lb)).toFixed(2);
        const tot = parseFloat(parseFloat(ventaForm.Total_RW) + parseFloat(value)).toFixed(2).toString();
        const tot2 = parseFloat(parseFloat(totCost) + parseFloat(value * rate_xVol) + parseFloat(ventaForm.Total_Vol_W)).toFixed(2);
        const percent = ((parseFloat((parseFloat(tot2) - totCost) / parseFloat(tot2))) * 100 ).toFixed(2);
        let newVentaForm={};

        if(ventaForm.Total_Vol_W === ''){
            newVentaForm = (value === '')
            ?{
                ...ventaForm,
                [name]: value,
                'Total_Weight': parseFloat(ventaForm.Real_Weight),
                'Total_RW': parseFloat(ventaForm.Real_Weight * rate_xLB).toFixed(2),
                'Total_Vol_W': '',
                'Total': '',
                'Paid': '',
                'Internal_Cost_Percentage': '',
                'Total_Cost': '',
                'Revenue': '',
                'Percentage': '',
                'Notes': '',
                'Estatus': 0
            }
            :{
                ...ventaForm,
                [name]: value,
                'Total_Weight': value >= 0 && ventaForm.Real_Weight >= 0 
                                        ? parseFloat(parseFloat(ventaForm.Real_Weight) + parseFloat(value)).toFixed(2)
                                        : value === '' && ventaForm.Real_Weight !== ''
                                            // ? parseFloat(ventaForm.Real_Weight)
                                            // : '',
                                            ,
                'Total_RW': value > 0
                            ? parseFloat(parseFloat(ventaForm.Real_Weight * rate_xLB) + (parseFloat(value) * rate_xVol)).toFixed(2)
                            : parseFloat(ventaForm.Real_Weight * rate_xLB).toFixed(2),
                
                'Total': ventaForm.Total_Vol_W !== ''
                        ? tot
                        : ''
            }
        }
        else{
            
            newVentaForm = (value === '')
            ?{
                ...ventaForm,
                [name]: value,
                'Total_Weight': parseFloat(ventaForm.Real_Weight),
                'Total_RW': parseFloat(ventaForm.Real_Weight * rate_xLB).toFixed(2),
                'Total_Vol_W': '',
                'Total': '',
                'Paid': '',
                'Internal_Cost_Percentage': '',
                'Total_Cost': '',
                'Revenue': '',
                'Percentage': '',
                'Notes': '',
                'Estatus': 0
            }
            :{
                ...ventaForm,
                [name]: value,
                'Total_Weight': value >= 0 && ventaForm.Real_Weight >= 0 
                                        ? parseFloat(parseFloat(ventaForm.Real_Weight) + parseFloat(value)).toFixed(2)
                                        : value === '' && ventaForm.Real_Weight !== ''
                                            // ? parseFloat(ventaForm.Real_Weight)
                                            // : '',
                                            ,
                'Total_RW': value > 0
                            ? parseFloat(parseFloat(ventaForm.Real_Weight * rate_xLB) + (parseFloat(value) * rate_xVol)).toFixed(2)
                            : parseFloat(ventaForm.Real_Weight * rate_xLB).toFixed(2),
                
                'Total': tot2,

                'Revenue': ventaForm.Paid !== ''
                            ? parseFloat(tot2 - ventaForm.Total_Cost).toFixed(2)
                            : '',
                            
                'Percentage': ventaForm.Paid !== ''
                            ? percent
                            : ''
            }
        }

        
        setVentaForm(newVentaForm);

    }

    const onTotalVolW_Change = ({name, value}) =>{
        const totCost = parseFloat(parseFloat(ventaForm.Real_Weight) * parseFloat(ventaForm.Cost_x_Lb)).toFixed(2);
        const tot = parseFloat(parseFloat(ventaForm.Total_RW) + parseFloat(value)).toFixed(2).toString();
        const percent = ((parseFloat((parseFloat(tot) - totCost) / parseFloat(tot))) * 100 ).toFixed(2);

        const newVentaForm = (value === '')
        ?{
            ...ventaForm,
            [name]: value,
            'Total': '',
            'Paid': '',
            'Internal_Cost_Percentage': '',
            'Total_Cost': '',
            'Revenue': '',
            'Percentage': '',
            'Notes': '',
            'Estatus': 0
        }
        :{
            ...ventaForm,
            [name]: value,
            'Total': value === '' 
                    ? ''
                    : tot,
            'Revenue': ventaForm.Paid !== ''
                        ? parseFloat(tot - ventaForm.Total_Cost).toFixed(2)
                        : '',
            'Percentage': ventaForm.Paid !== ''
                        ? percent
                        : ''
        }
        setVentaForm(newVentaForm);
    }

    const onPaid_Change = ({name, value}) =>{
        
        const totCost = parseFloat(parseFloat(ventaForm.Real_Weight) * parseFloat(ventaForm.Cost_x_Lb)).toFixed(2);
        const rev = parseFloat(parseFloat(ventaForm.Total) - totCost).toFixed(2);
        const percent = ((parseFloat((parseFloat(ventaForm.Total) - totCost) / parseFloat(ventaForm.Total))) * 100 ).toFixed(2);

        const newVentaForm = (value === '')
        ?{
            ...ventaForm,
            [name]: value,
            'Internal_Cost_Percentage': '',
            'Total_Cost': '',
            'Revenue': '',
            'Percentage': '',
            'Notes': '',
            'Estatus': 0
        }
        :{
            ...ventaForm,
            [name]: value,
            'Total_Cost':  totCost,
            'Revenue': rev,
            'Percentage': rev === 0 
                            ? 0
                            : percent
            
        }
        setVentaForm(newVentaForm);
    }

    const onTotal_Change = ({name, value}) => {

        const totCost = parseFloat(parseFloat(ventaForm.Real_Weight) * parseFloat(ventaForm.Cost_x_Lb)).toFixed(2);
        const rev = parseFloat(parseFloat(ventaForm.Total) - totCost).toFixed(2);
        const percent = ((parseFloat((parseFloat(ventaForm.Total) - totCost) / parseFloat(value))) * 100 ).toFixed(2);

        const newVentaForm = {
            ...ventaForm,
            [name]: value,
            'Revenue': ventaForm.Revenue !== '' || ventaForm.Revenue > 0
                        ? parseFloat(parseFloat(value) - totCost).toFixed(2)
                        : '',
            'Percentage': rev === 0 
                            ? 0
                            : percent
            
        }
        setVentaForm(newVentaForm);
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
                                            <CInput type="date" value={Date_Arrival} name="Date_Arrival" onChange={(e) => handleForm(e)}/>
                                            {isSubmited && Date_Arrival === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Cliente</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect name="idClientes_Informacion" value={idClientes_Informacion} onChange={(e) => onClientsInfo_Change(e.target)}>
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
                                            <CLabel htmlFor="select">Real Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Real_Weight} name="Real_Weight" onChange={(e) => onRealWeight_Change(e.target)} disabled={idClientes_Informacion < 1}/>
                                            {isSubmited && Real_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Vol Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Vol_Weight} name="Vol_Weight" onChange={(e) => onVolWeight_Change(e.target)} disabled={Real_Weight.length < 1}/>
                                            {isSubmited && Vol_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_Weight} name="Total_Weight" onChange={(e) => handleForm(e)} disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total RW</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_RW} name="Total_RW" onChange={(e) => handleForm(e)} disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>
                                    
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Vol W</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_Vol_W} name="Total_Vol_W" onChange={(e) => onTotalVolW_Change(e.target)} disabled={Vol_Weight.length < 1}/>
                                            {isSubmited && Total_Vol_W === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total} name="Total" onChange={(e) => onTotal_Change(e.target)} disabled/>
                                            
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
                                            <CInput type="number" placeholder="Text" value={Paid} name="Paid" onChange={(e) => onPaid_Change(e.target)} disabled={Total_Vol_W.length < 1}/>
                                            {isSubmited && Paid === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>


                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Internal Cost %</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Internal_Cost_Percentage} name="Internal_Cost_Percentage" onChange={(e) => handleForm(e)} />
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Cost x Lb</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Cost_x_Lb} name="Cost_x_Lb" onChange={(e) => handleForm(e)} disabled/>
                                            {isSubmited && Cost_x_Lb === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Cost</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Total_Cost} name="Total_Cost"  disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Revenue</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Revenue} name="Revenue" onChange={(e) => handleForm(e)} disabled/>
                                            
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Percentage</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput type="number" placeholder="Text" value={Percentage} name="Percentage" onChange={(e) => handleForm(e)} disabled/>
                                            
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
                                                onChange={(e) => handleForm(e)}
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