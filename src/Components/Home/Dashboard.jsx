import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import '../css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Cookies from 'universal-cookie';
import { baseUrl, autorizacion } from '../../Utils/ApiPDF';
import {Button, Table, Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Badge,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap';
import PdfViewerComponent from '../PdfViewerComponent';

const url = baseUrl + "user/";
const cookies = new Cookies();


class Dashboard extends Component {

    state = {
    }

    constructor(props) {
        super(props);
        this.state = {
            form: {
                email: '',
                password: ''
            },
            modalFirmar: false,
            data: [],
            datos: [],
            open: '',
            pageNumber: 1,
            numPages: null,
        }
        this.ExamplePDFViewer = this.ExamplePDFViewer.bind(this);
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    }

    toggle = (id) => {
        if (this.state.open === id) {
            this.setState({ open: "" });
        } else {
            this.setState({ open: id });
        }
    }


    //PETICIÓN GET
    peticionGetUsuario = () => {
        axios.get(url + cookies.get('id'), autorizacion).then(response => {
            this.setState({
                data: response.data,
                datos: response.data.documentos
            });
        }).catch(error => {
            console.log(error.message);
            this.setState({ loading: false });
            swal({ title: "ERROR AL CONSULTAR", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }

    //MODAL DE INSERTAR
    modalFirmar = () => {
        this.setState({ modalFirmar: !this.state.modalFirmar })
    }

    onDocumentLoadSuccess = (numPages) => {
        this.setState({ numPages: numPages });
        this.setState({ pageNumber: 1 });
    };

    goToPrevPage = () => {
        this.setState({ pageNumber: this.state.pageNumber - 1 <= 1 ? 1 : this.state.pageNumber - 1 });
    };
    goToNextPage = () =>{
        this.setState({ pageNumber: this.state.pageNumber + 1 >= this.state.numPages ? this.state.numPages : this.state.pageNumber + 1 });
};
    ExamplePDFViewer = (doc) => {
        let file = baseUrl + "files/" + doc.nombre
        return (
            <div>
                <Row>
                    <Col md={12}>
                        {doc.estado ? <p>Firmado: {doc.fecha}</p> : ""}
                    </Col>
                </Row>
                <Row>
                    <PdfViewerComponent document={file} estado={doc.estado} name={doc.nombre} id={doc.id}/>
                </Row>
            </div>

        );
    }
    componentDidMount() {
        this.peticionGetUsuario();
    }


    render() {
        return (
            <body>
            <div>
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">
                                {this.state.data.id}
                            </th>
                            <td>
                                {this.state.data.nombre}
                            </td>
                            <td>
                                {this.state.data.apellido}
                            </td>
                            <td>
                                {this.state.data.email}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <div>
                    <Accordion open={this.state.open} toggle={this.toggle}>
                        {
                            this.state.datos === [] ?
                                console.log("No datos")
                                : this.state.datos.map((doc, index) => {
                                    return (<AccordionItem key={index}>
                                        <AccordionHeader targetId={doc.id.toString()}>{doc.nombre + '-  '}
                                            {doc.estado ? <div><Badge color="success">Firmado</Badge></div> : <div><Badge color="danger">Sin firmar</Badge></div>}</AccordionHeader>
                                        <AccordionBody accordionId={doc.id.toString()}>
                                            {this.ExamplePDFViewer(doc)}
                                        </AccordionBody>
                                    </AccordionItem>)
                                })
                        }

                    </Accordion>
                </div>
                <div>
                <Modal isOpen={this.state.modalFirmar} toggle={this.modalFirmar} fullscreen centered={false}>
                        <ModalHeader toggle={this.modalFirmar}>Firmar Documento</ModalHeader>
                        <ModalBody>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.modalFirmar}>
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

export default Dashboard;