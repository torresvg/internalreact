import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css';
import Cookies from 'universal-cookie';
import { baseUrl, autorizacion } from '../../Utils/ApiPDF';
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

const url = baseUrl + "user/";
const cookies = new Cookies();


class Admin extends Component {

    state = {
        form: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            roles: ["USER"],
        },
        edit: {
            id: '',
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            roles: ["USER"]
        },
        data: [],
        open: '',
        modalInsertarUsuario: false,
        modalEditarUsuario: false,
    };

    constructor(props) {
        super(props);
        this.Botones = this.Botones.bind(this)
    };

    //PETICIÓN PUT
    peticionPutUsuario = () => {
        axios.put(url + this.state.edit.id, this.state.edit, autorizacion).then(response => {
            this.modalEditarUsuario();
            this.peticionGetUsuario();
            swal({ title: "Usuario " + response.data.nombre + " editado", text: " ", icon: "success", buttons: false, timer: 1500 })
        }).catch(error => {
            console.log(error.message);
            swal({ title: "ERROR AL EDITAR", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }
    //PETICIÓN ESTADO

    peticionEstadoUsuario = (usuario) => {
        axios.put(url + 'estado/' + usuario.id, this.state.edit, autorizacion).then(response => {
            this.peticionGetUsuario();
            swal({ title: "usuario " + response.data.nombre + " eliminado", text: " ", icon: "success", buttons: false, timer: 1500 })
        }).catch(error => {
            console.log(error.message);
            swal({ title: "ERROR AL ELIMINAR", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }

    //INGRESO DE DATOS AL FORM
    handleChangeUsuario = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.form);
    }

    //MODAL DE EDITAR
    modalEditarUsuario = () => {
        this.setState({ modalEditarUsuario: !this.state.modalEditarUsuario });
    }

    //SELECCIONAR USUARIO PARA EDICIÓN
    seleccionarUsuario = (usuario) => {
        this.setState({
            edit: {
                "id": usuario.id,
                "nombre": usuario.nombre,
                "apellido": usuario.apellido,
                "email": usuario.email,
                "password": usuario.password,
                "roles": ["USER"]
            }
        })
    }

    //INGRESO DE DATOS AL editUsuario
    handleChangeEditUsuario = async e => {
        e.persist();
        await this.setState({
            edit: {
                ...this.state.edit,
                [e.target.name]: e.target.value
            }
        })
        console.log(this.state.edit);
    }

    //PETICIÓN GET
    peticionGetUsuario = () => {
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
    modalInsertarUsuario = () => {
        this.setState({ modalInsertarUsuario: !this.state.modalInsertarUsuario })
    }

    Botones(usuario) {
        return <div className="btn-group btn-group-sm" role="group">
            <button value={usuario.id} className='btn btn-primary' onClick={() => { swal({ title: "¿Desea editar al usuario " + usuario.nombre + "?", icon: "warning", buttons: ["Cancelar", "Editar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.seleccionarUsuario(usuario); this.modalEditarUsuario() } }); }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-danger' onClick={() => { swal({ title: "¿Desea eliminar al usuario " + usuario.nombre + "?", icon: "warning", buttons: ["Cancelar", "Eliminar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.peticionEstadoUsuario(usuario) } }); }}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>;
    }

    ListarUser = (user, index) => {
        return (<tr>
            <th scope="row" key={user.id + "user"}>
                {user.id}
            </th>
            <td>
                {user.nombre}
            </td>
            <td>
                {user.apellido}
            </td>
            <td>
                {user.email}
            </td>
            <td>
                <ListGroup flush>
                    {user.documentos.map((doc, index) => (
                        <ListGroupItem key={doc.id + "doc"}>
                            {doc.estado ? <div>{doc.nombre}<Badge color="success">Firmado</Badge></div> : <div>{doc.nombre}<Badge color="danger">Sin firmar</Badge></div>}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </td>
            <td>
                {this.Botones(user)}
            </td>
        </tr>
        );
    }

    //PETICIÓN POST
    peticionPostUsuario = async () => {
        console.log(this.state.form)
        await axios.post(baseUrl + "user", this.state.form, autorizacion).then(response => {
            console.log(response);
            this.modalInsertarUsuario();
            this.peticionGetUsuario();

        }).catch(error => {
            console.log(error.message);
            swal({ title: "ERROR AL REGISTRAR", text: " ", icon: "error", buttons: false, timer: 1500 })
        })

    }

    componentDidMount() {
        this.peticionGetUsuario();
    }


    render() {
        return (
            <body>
            <div>
                <Row>
                    <Col md={12} style={{ textAlign:"right", marginBottom : "15px", marginTop: "15px"}}>
                    <h1>Usuarios</h1>
                        <Button color="warning" onClick={this.modalInsertarUsuario}>
                            Registrar Usuario
                        </Button>
                    </Col>
                </Row>
                {''}
                <Row>
                    <Col md={12}>
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
                                        Apellido
                                    </th>
                                    <th>
                                        Email
                                    </th>
                                    <th>
                                        Actas
                                    </th>
                                    <th>
                                        Acciones
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.data.map((user, index) => (
                                    this.ListarUser(user, index)
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <div>
                    <Modal isOpen={this.state.modalInsertarUsuario} toggle={this.modalInsertarUsuario}>
                        <ModalHeader toggle={this.modalInsertarUsuario}>Registrar Usuario</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md={12}>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input type='text' name='nombre' id='nombre' onChange={this.handleChangeUsuario} />

                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input type='text' name='apellido' id='apellido' onChange={this.handleChangeUsuario} />

                                    <Label htmlFor="email">Email</Label>
                                    <Input type='text' name='email' id='email' onChange={this.handleChangeUsuario} />

                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input type='text' name='password' id='password' onChange={this.handleChangeUsuario} />

                                </Col>

                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.peticionPostUsuario}>
                                Agregar
                            </Button>{' '}
                            <Button color="secondary" onClick={this.modalInsertarUsuario}>
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </Modal>
                </div>

                <div>
                    <Modal isOpen={this.state.modalEditarUsuario} toggle={this.modalEditarUsuario}>
                        <ModalHeader toggle={this.modalEditarUsuario}>Editar Usuario</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md={12}>
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input type='text' name='nombre' id='nombre' onChange={this.handleChangeEditUsuario} value={this.state.edit.nombre || ''} />

                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input type='text' name='apellido' id='apellido' onChange={this.handleChangeEditUsuario} value={this.state.edit.apellido || ''} />

                                    <Label htmlFor="email">Email</Label>
                                    <Input disabled type='text' name='email' id='email' onChange={this.handleChangeEditUsuario} value={this.state.edit.email || ''} />

                                </Col>

                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.peticionPutUsuario}>
                                Editar
                            </Button>{' '}
                            <Button color="secondary" onClick={this.modalEditarUsuario}>
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

export default Admin;