import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo1 from '../img/logo1.png';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import Cookies from 'universal-cookie';
import { baseUrl, autorizacion, autorizacionFiles, CerrarSesion, Sesion } from '../../Utils/ApiPDF';
import {
    FormGroup, Input, Label, Form, Button, Table, Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Badge,
    Row,
    Col,
    Fade,
    Card,
    CardBody,
    ButtonGroup,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import { faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const url = baseUrl + "user/";
const cookies = new Cookies();
const animatedComponents = makeAnimated();


class Navbar extends Component {

    state={
        data: [],
    }
    //PETICIÓN GET
    peticionGetUsuario = () => {
        axios.get(url + cookies.get('id'), autorizacion).then(response => {
            this.setState({
                data: response.data
            });
        }).catch(error => {
            console.log(error.message);
            swal({ title: "ERROR AL CONSULTAR", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }
    componentDidMount(){
        this.peticionGetUsuario();
        Sesion;
    }
    render() {
        return (
            <nav style={{backgroundColor:'#99004d'}} className="navbar navbar-light">
                <div className="container-fluid">
                <img style={{"height":"50px", "margin":"10px"}} src={logo1} className="App-logo"  alt="logo" />
                    <a className="navbar-brand" href="#">{this.state.data.nombre+" "+this.state.data.apellido}</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarScroll">
                        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{"--bs-scroll-height": "100px"}}>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/dashboard">Inicio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">Usuarios</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/documento">Documentos</Link>
                            </li>
                        </ul>
                            <button className="btn btn-outline-success" onClick={CerrarSesion}>Cerrar sesión</button>
                            {console.log(this.state.data)}
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;