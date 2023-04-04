import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import Cookies from 'universal-cookie';
import { baseUrl, autorizacion, autorizacionFiles } from '../../Utils/ApiPDF';
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
import { faDownload, faEdit, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const url = baseUrl + "documento/";
const cookies = new Cookies();
const animatedComponents = makeAnimated();


class Upload extends Component {

    state = {
        form: {
            nombre: '',
            users: null,
        },
        data: [],
        open: '',
        files: null,
        user: [],
        UserOptions: [],
        modalInsertarDocumento: false,
        modalEditarDocumento: false,
        files: null,
    };

    constructor(props) {
        super(props);
        this.Botones = this.Botones.bind(this)
    };

    //PETICIÓN GET
    peticionGetUsuario = () => {
        axios.get(baseUrl + 'user', autorizacion).then(response => {
            this.setState({
                user: response.data,
            });
            this.UserOptions(response.data);
        }).catch(error => {
            console.log(error.message);
            this.setState({ loading: false });
            swal({ title: "ERROR AL CONSULTAR USUARIOS", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoDocumento = (Documento) => {
        axios.put(url + 'estado/' + Documento.id, this.state.edit, autorizacion).then(response => {
            this.peticionGetDocumento();
            swal({ title: "Documento " + response.data.nombre + " eliminado", text: " ", icon: "success", buttons: false, timer: 1500 })
        }).catch(error => {
            console.log(error.message);
            swal({ title: "ERROR AL ELIMINAR", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }

    //INGRESO DE DATOS AL FORM
    handleChangeDocumento = async (e) => {

        const lista = []
        e.forEach((e) => { lista.push(e.value) });
        await this.setState({
            form: {
                ...this.state.form,
                users: lista
            }
        });
        console.log(this.state.form);
    }

    //PETICIÓN GET
    peticionGetDocumento = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({
                data: response.data,
            });
        }).catch(error => {
            console.log(error.message);
            this.setState({ loading: false });
            swal({ title: "ERROR AL CONSULTAR", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }

    //MODAL DE INSERTAR
    modalInsertarDocumento = () => {
        this.setState({ modalInsertarDocumento: !this.state.modalInsertarDocumento })
    }

    Botones(Documento) {
        return <div className="btn-group btn-group-sm" role="group">
            <button className='btn btn-danger' onClick={() => { swal({ title: "¿Desea eliminar al Documento " + Documento.nombre + "?", icon: "warning", buttons: ["Cancelar", "Eliminar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.peticionEstadoDocumento(Documento) } }); }}><FontAwesomeIcon icon={faTrashAlt} /></button>
            <a className='btn btn-warning' href={baseUrl+"files/"+Documento.nombre}><FontAwesomeIcon icon={faDownload} /></a>
        </div>;
    }

    ListarDoc = (Doc, index) => {
        if (Doc.estado) {
            return (<tr>
                <th scope="row" key={Doc.id + "Doc"}>
                    {Doc.id}
                </th>
                <td>
                    {Doc.nombre}
                </td>
                <td>
                    <ListGroup flush>
                        {Doc.users.map((user, index) => (
                            <ListGroupItem key={user.id + "user"}>
                                {user.nombre}
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </td>
                <td>
                    {this.Botones(Doc)}
                </td>
            </tr>
            );
        }
        
    }

    //PETICIÓN POST
    peticionPostDocumento = async () => {
        var bodyFormData = new FormData();
        bodyFormData.append('files', this.state.files);
        await axios.post(baseUrl + "files/upload", bodyFormData, autorizacionFiles).then(response => {
            let name = response.data.message;
            console.log(name);
            this.state.form.nombre = name;
            console.log(this.state.form);
            axios.post(url, this.state.form, autorizacion).then(response => {
                console.log(response);
                this.modalInsertarDocumento();
                this.componentDidMount();
    
            }).catch(error => {
                console.log(error.message);
                swal({ title: "ERROR AL REGISTRAR", text: " ", icon: "error", buttons: false, timer: 1500 })
            })
        }).catch(error => {
            console.log(error.message);
        })

    }
    //INGRESO DE FILES
    handleChangeFiles = (e) => {
        this.setState({
            files: e.target.files[0],
        })
    }

    componentDidMount() {
        this.peticionGetDocumento();
        this.peticionGetUsuario();
    }

    //SELECCIONAR USUARIOS

    UserOptions(usuarios) {
        console.log(usuarios);
        let users = [];
        usuarios.map((user, index) => (users.push({ value: user.id, label: user.nombre + " " + user.apellido })));
        this.setState({ UserOptions: users });
    }

    render() {
        return (
            <body>
            <div>
                <Button style={{ marginBottom : "15px", marginTop: "15px"}}  color="warning"
                onClick={this.modalInsertarDocumento}>
                    Registrar Documento
                </Button>
                <Table hover>
                    <thead>
                        <tr>
                            <th>
                                Id
                            </th>
                            <th>
                                Nombre
                            </th>
                            <th>
                                Usuario
                            </th>
                            <th>
                                Acciones
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map((Doc, index) => (
                            this.ListarDoc(Doc, index)
                        ))}
                    </tbody>
                </Table>
                <div>
                    <Modal isOpen={this.state.modalInsertarDocumento} toggle={this.modalInsertarDocumento}>
                        <ModalHeader toggle={this.modalInsertarDocumento}>Registrar Documento</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md={12}>
                                    <Input
                                        type='file' name="files" accept=".pdf" onChange={this.handleChangeFiles}
                                    />
                                </Col>
                                <Col md={12}>
                                    <Label>
                                        Firmantes:
                                    </Label>
                                    <Select
                                        name='users'
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={this.state.UserOptions}
                                        onChange={this.handleChangeDocumento}
                                    />
                                </Col>

                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.peticionPostDocumento}>
                                Agregar
                            </Button>{' '}
                            <Button color="secondary" onClick={this.modalInsertarDocumento}>
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>

            </div>
            </body>
        );
    }
}

export default Upload;