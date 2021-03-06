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
    CTextarea,
    // CHeaderBrand

  } from '@coreui/react';
import axios from 'axios';
import swal from '@sweetalert/with-react';
import {useHistory} from 'react-router-dom';

import VentaForm from 'src/reusable/VentaForm';
import {configHeaders} from 'src/reusable/util';
// import logoProex from 'src/assets/icons/logo-proex_claro-horizontal.png';
// import CIcon from '@coreui/icons-react';
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
    const [rate_xLB, setRate_xLB] = useState(0);
    const [rate_xVol, setRate_xVol] = useState(0);

    // const sendEmail = () =>{
        
    //     var EmailTemplate = require('email-templates').EmailTemplate;
    //     var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

    //     // create template based sender function
    //     // assumes text.{ext} and html.{ext} in template/directory
    //     var sendPwdReminder = transporter.templateSender(new EmailTemplate('template/directory'), {
    //         from: 'sender@example.com',
    //     });

    //     // use template based sender to send a message
    //     sendPwdReminder({
    //         to: 'receiver@example.com',
    //         // EmailTemplate renders html and text but no subject so we need to
    //         // set it manually either here or in the defaults section of templateSender()
    //         subject: 'Password reminder'
    //     }, {
    //         username: 'Node Mailer',
    //         password: '!"\'<>&some-thing'
    //     }, function(err, info){
    //         if(err){
    //         console.log('Error');
    //         }else{
    //             console.log('Password reminder sent');
    //         }
    //     });
    // }
    

    const Add = statusList.map(Add => Add);

    const getVentas = () =>{
        axios.get(`${process.env.REACT_APP_BASE_URL}/getVentas`, configHeaders('Bearer ' + store.token))
        .then((res) => {                            
            
            const arrVenta = res.data[0];
            // let arrnewVenta = [];
            const newArrVenta = arrVenta.map((venta) =>{
                
                const newDate = venta.Date_Arrival.substring(0,10);
                return {...venta, Date_Arrival: newDate};
            });

            if(store.role === 1){
                setVentas(newArrVenta);
            }
            else{
                const arrnewVentaa = newArrVenta.map( ({id_Venta, Date_Arrival, idClientes_Informacion, Cliente, Real_Weight, Vol_Weight, Total_Weight, Total_RW, 
                    Total_Vol_W, Total, Notes, Estatus }) => { 
                        return {
                        id_Venta, 
                        Date_Arrival, 
                        idClientes_Informacion, 
                        Cliente, 
                        Real_Weight, 
                        Vol_Weight, 
                        Total_Weight, 
                        Total_RW, 
                        Total_Vol_W, 
                        Total, 
                        Notes, 
                        Estatus
                        }
                    });
                    setVentas(arrnewVentaa);
            }
            // 
            // console.log(newArrVenta.id_Venta);
            // 
        })
        .catch((err) =>{
            swal({
                icon: "warning",
                dangerMode: true,
                title: err + ' Inicia sesi??n de nuevo'
            });
            localStorage.clear();
            history.push('/login');
        });
    };
    
    const getRate = (rateXLb, rateXVol) => {
        if(rateXLb > 0){
            setRate_xLB(rateXLb);
            setRate_xVol(rateXVol);

            setVentaForm(preVentaForm =>({
                ...preVentaForm,
                // 'Total_RW': parseFloat(rate).toFixed(2),
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
                getRate(res.data.rateXLb, res.data.rateXVol);
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
    // const [modalFactura, setModalFactura] = useState(false);

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

        //State de Layout Factura
        // const [factura, setFactura] = useState({
        //     Date_Arrival: '',
        //     idClientes_Informacion: 0,
        //     Real_Weight: '',
        //     Vol_Weight: '',
        //     Total_Weight: '',
        //     Total_RW: '',
        //     Total_Vol_W: '',
        //     Total: '',
        //     Paid: '',
        //     Internal_Cost_Percentage: '',
        //     Cost_x_Lb: '',
        //     Total_Cost: '',
        //     Revenue: '',
        //     Percentage: '',
        //     Notes: '',
        //     Estatus: ''
        // });

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
        // setModalFactura(!modalFactura);

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
        // const percent = parseFloat(reven/tot2);
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
        // console.log(parseFloat(ventaForm.Total));
        
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
            //         title: err + ' Inicia sesi??n de nuevo'
            //       });
            //       localStorage.clear();
            //       history.push('/login');
            // })
            resetForm();
        }
        else{
            setErrors('??ste campo es obligatorio');
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
    
    
    let fields = [];
     if(store.role === 1){
         fields.push({ key: 'Date_Arrival', _style: { width: '40%'} },
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
         })
     }
     else{
        fields.push({ key: 'Date_Arrival', _style: { width: '40%'} },
        'Cliente',
        'Real_Weight',
        'Vol_Weight',
        'Total_Weight',
        'Total_RW',
        'Total_Vol_W',
        'Total',
        'Notes',
        { key: 'Estatus', _style: { width: '20%'} },
        {
            key: 'show_details',
            label: '',
            _style: { width: '1%' },
            sorter: false,
            filter: false
        })
     }
    
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
            text: "??Est??s seguro que quieres eliminar el registro?",
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

    // const ModalGenerarFactura = (id) =>{
    //     setIdVenta(id);
        
        
    //     axios.get(`${process.env.REACT_APP_BASE_URL}/selectVenta/${id}`)
    //         .then((res) => {
    //             setModalFactura(!modalFactura);
    //             res.data[0].map((i) => {
    //                 return setFactura({
    //                     Date_Arrival: i.Date_Arrival.substring(0,10),
    //                     idClientes_Informacion: i.idClientes_Informacion,
    //                     Real_Weight: i.Real_Weight,
    //                     Vol_Weight: i.Vol_Weight,
    //                     Total_Weight: i.Total_Weight,
    //                     Total_RW: i.Total_RW,
    //                     Total_Vol_W: i.Total_Vol_W,
    //                     Total: i.Total,
    //                     Paid: i.Paid,
    //                     Internal_Cost_Percentage: i.Internal_Cost_Percentage,
    //                     Cost_x_Lb: i.Cost_x_Lb,
    //                     Total_Cost: i.Total_Cost,
    //                     Revenue: i.Revenue,
    //                     Percentage: i.Percentage,
    //                     Notes: i.Notes,
    //                     Estatus: i.Estatus
    //                 });
    //             })
    //         })
                
    // }

    return (
        <div>    
            {/* Modal Venta nueva */}
            <VentaForm store={store} ventas={getVentas}/>
            {/* Modal Venta nueva */}

            {/* Modal Editar venta */}
            <CModal show={modalEdit} onClose={() => resetForm()} size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>Edici??n Venta</CModalTitle>
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
                                            <CLabel htmlFor="select">Client</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect name="idClientes_Informacion" value={idClientes_Informacion} onChange={(e) => onClientsInfo_Change(e.target)}>
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
                                            <CLabel htmlFor="select">Real Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Real_Weight} name="Real_Weight" onChange={(e) => onRealWeight_Change(e.target)} disabled={idClientes_Informacion < 1}/>
                                            {isSubmited && Real_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>
                                
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Vol Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Vol_Weight} name="Vol_Weight" onChange={(e) => onVolWeight_Change(e.target)} disabled={Real_Weight.length < 1}/>
                                            {isSubmited && Vol_Weight === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Weight</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total_Weight} name="Total_Weight" onChange={(e) => handleForm(e)} disabled/>
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total RW</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total_RW} name="Total_RW" onChange={(e) => handleForm(e)} disabled/>
                                        </CCol>
                                    </CFormGroup>
                                    
                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total Vol W</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total_Vol_W} name="Total_Vol_W" onChange={(e) => onTotalVolW_Change(e.target)} disabled={Vol_Weight.length < 1}/>
                                            {isSubmited && Total_Vol_W === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>

                                    <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Total</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CInput placeholder="Text" value={Total} name="Total" onChange={(e) => onTotal_Change(e.target)} disabled/>
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
                                            <CInput placeholder="Text" value={Paid} name="Paid" onChange={(e) => onPaid_Change(e.target)} disabled={Total_Vol_W.length < 1}/>
                                            {isSubmited && Paid === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                        </CCol>
                                    </CFormGroup>


                                    {store.role === 2 
                                        ?
                                        <>
                                            <CFormGroup row style={{display: 'none'}}>
                                                <CCol md="3">
                                                    <CLabel htmlFor="select">Internal Cost %</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput type="number" placeholder="Text" value={Internal_Cost_Percentage} name="Internal_Cost_Percentage" onChange={(e) => handleForm(e)} />
                                                </CCol>
                                            </CFormGroup>

                                            <CFormGroup row style={{display: 'none'}}>
                                                <CCol md="3">
                                                    <CLabel htmlFor="select">Cost x Lb</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput type="number" placeholder="Text" value={Cost_x_Lb} name="Cost_x_Lb" onChange={(e) => handleForm(e)} disabled/>
                                                    {isSubmited && Cost_x_Lb === '' && <p className="p-1 mb-1 bg-danger text-white">{errors}</p>}
                                                </CCol>
                                            </CFormGroup>
                                        
                                            <CFormGroup row style={{display: 'none'}}>
                                                <CCol md="3">
                                                    <CLabel htmlFor="select">Total Cost</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput type="number" placeholder="Text" value={Total_Cost} name="Total_Cost"  disabled/>
                                                    
                                                </CCol>
                                            </CFormGroup>

                                            <CFormGroup row style={{display: 'none'}}>
                                                <CCol md="3">
                                                    <CLabel htmlFor="select">Revenue</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput type="number" placeholder="Text" value={Revenue} name="Revenue" onChange={(e) => handleForm(e)} disabled/>
                                                    
                                                </CCol>
                                            </CFormGroup>

                                            <CFormGroup row style={{display: 'none'}}>
                                                <CCol md="3">
                                                    <CLabel htmlFor="select">Percentage</CLabel>
                                                </CCol>
                                                <CCol xs="12" md="9">
                                                    <CInput type="number" placeholder="Text" value={Percentage} name="Percentage" onChange={(e) => handleForm(e)} disabled/>
                                                    
                                                </CCol>
                                            </CFormGroup>
                                        </>
                                        :
                                        <>
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
                                        </>
                                    }
                                    
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
                ??Est??s seguro de eliminar ??ste registro?
                </CModalBody>
                <CModalFooter>
                <CButton color="danger" >Eliminar</CButton>{' '}
                <CButton color="secondary" >Cancel</CButton>
                </CModalFooter>
            </CModal>


            {/* Modal Generar Factura */}
            {/* <CModal show={modalFactura} size="lg">
                <CModalHeader closeButton>
                    <CModalTitle>Factura de Venta</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CRow>
                        <CCol xs="12" sm="12">
                            <CCard>
                                <CCardBody> */}
                                {/* Header Factura */}
                                {/* <CRow>
                                    <CCol md="2">
                                          
                                        <CIcon name="logo" height="75" alt="Logo" src={logoProex}/>

                                    </CCol>
                                    <CCol md="6">

                                        <CCol md="12">

                                            <b><CLabel>  ProEx - S.A de C.V.</CLabel></b>
                                        
                                        </CCol>

                                        <CCol md="12">
                                            
                                        234/90, New York Street
                                    

                                        </CCol>
                                        <CCol md="12">
                                            
                                            United States.                                        
    
                                        </CCol>

                                    </CCol>

                                    <CCol md="4">

                                        <CLabel xs="12" sm="12">
                                        
                                            <CCol md="12">
                                                
                                                Tel.+456-345-908-559                                 

                                            </CCol>   
                                            <CCol md="12">
                                                
                                                Email. info@obedalvarado.pw                                    

                                            </CCol>

                                        </CLabel>
                                     
                                    </CCol> */}
                                    {/* =================== */}

                                    {/*Body Factura */}        

                                    {/* <CCol md="12">
                                        <hr/>
                                    </CCol>

                                    <CCol md="6">
                                        <CLabel xs="12" sm="12">
                                            <h2><b>FACTURA</b></h2>
                                        </CLabel>
                                        
                                    </CCol>
                                    <CCol md="6">
                                        
                                        <CCol md="12">
                             
                                        <CLabel xs="12" sm="12">
                                            <b>Fecha:</b>
                                        </CLabel>

                                        </CCol>
                       
                                        <CCol md="12">
                             
                                        <CLabel xs="12" sm="12">
                                            <b>Factura #:</b>
                                        </CLabel>

                                        </CCol>
                                        <CCol md="12">
                                
                                            <CLabel xs="12" sm="12">
                                                <b>Vencimiento:</b>
                                            </CLabel>

                                        </CCol>

                                    </CCol>

                                    <CCol md="6" Style={"margin-top:20px;"}>
                                        <CLabel xs="12" sm="12">
                                            <b>Facturar a:</b>
                                        </CLabel>
                                        
                                    </CCol>
                                    <CCol md="6" Style={"margin-top:20px;"}>
                                        <CLabel xs="12" sm="12">
                                            <b>Enviar a:</b>
                                        </CLabel>
                                        
                                    </CCol> */}
                          

                                    {/* =================== */}

                                                
                                {/* </CRow>

                                <CRow Style={"margin-top:20px;"}>
                                <CCol md="12">

                                
                                    <table Style={"width:100%;border: 1px solid #ddd;"}>
                                        <thead Style={"border-bottom: 1px solid #ddd;"}>
                                            <tr>
                                                <th width="25%">factura</th>
                                                <th width="25%">Orden de compra </th>
                                                <th width="20%">Enviar por</th>
                                                <th width="30%">T??rminos y condiciones</th>
                                            </tr> 
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td width="25%">{factura.idClientes_Informacion}</td>
                                                <td width="25%">#PO-2020 </td>
                                                <td width="20%">DHL</td>
                                                <td width="30%">Pago al contado</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                   

                                    </CCol>
                                </CRow>
                         
                                <CRow Style={"margin-top:20px;"}>

                                <CCol md="12">

                                
                                <table Style={"width:100%"}>
                                    <thead Style={"border-bottom: 1px solid black;"}>
                                    <th width="5%" Style={"text-align:center"}>C??digo</th>
                                    <th width="60%" Style={"text-align:center"}>Descripci??n</th>
                                    
                                    <th width="5%" Style={"text-align:center"}>Cant.</th>
                                    <th width="15%" Style={"text-align:center"}>Precio</th>
                                    <th class="taxrelated" Style={"text-align:center"}>IVA</th>
                                    <th width="10%" Style={"text-align:center"}>Total</th>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td width='5%' Style={"text-align:center"}><span>12345</span></td>
                                        <td width='60%' Style={"text-align:center"}><span>Factura Proex Prueba</span></td>
                                        <td width='5%' Style={"text-align:center"}><span>1</span></td>
                                        <td width='10%' Style={"text-align:center"}><span>$99</span></td>
                                        <td class="tax taxrelated" Style={"text-align:center"}>$99</td>
                                        <td class="sum" Style={"text-align:center"}>$99.00</td>
                                    </tr>
                                    </tbody>
                                </table>
                                   

                                    </CCol>
                                </CRow>

                                <CRow Style={"margin-top:35px;"}>
                                <CCol md="9">

                                </CCol>

                                    <CCol md="3">

                                    <table>

                                        <tr>
                                        <td><strong>Total:</strong><CLabel Style={"font-size:30px;color:red"}>$198.00</CLabel></td>
                                        <td id="total_price"></td>
                                        </tr>

                                    </table>

                                    </CCol>
  
                                </CRow>

                                <CRow md="6" Style={"margin-top:50px;"}>
                                    <CCol md="12">
                                        <footer class="row">
                                            <div class="col-12 text-center">
                                                <p class="notaxrelated"><b>El monto de la factura no incluye el impuesto sobre las ventas.</b></p>
                                            
                                            </div>
                                        </footer>
                                    </CCol>
                                </CRow>
                         
                                </CCardBody>
                            </CCard>
                        </CCol>
              
                    </CRow>
                </CModalBody>
                <CModalFooter> */}
                    {/* <CButton color="info" href="javascript:window.print()">Imprimir</CButton>{' '} */}
                    {/* <CButton color="danger" onClick={() => sendEmail(item.id_Venta)}>Enviar Email</CButton> */}
                {/* </CModalFooter>
            </CModal> */}
            {/* Modal Generar Factura */}


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
                                {/* <CButton size="sm" color="success" className="ml-1" onClick={() => ModalGenerarFactura(item.id_Venta)}>
                                    Generar Factura
                                </CButton> */}
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