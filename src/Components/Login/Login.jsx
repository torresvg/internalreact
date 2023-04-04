import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import '../css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Cookies from 'universal-cookie';
import { baseUrl } from '../../Utils/ApiPDF';
import { FormGroup, Input, Label, Form, Button } from 'reactstrap';

const url = baseUrl + "auth/login";
const cookies = new Cookies();


class Login extends Component {

    state = {
        form: {
            email: '',
            password: ''
        }
    }

    handleChange = async e => {
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }

    iniciarSesion = async () => {
        await axios.post(url, this.state.form)
            .then(response => {
                if (response.data.token) {
                    swal("Inicio de Sesión", "Credenciales correctas", "success");
                    var respuesta = response.data;
                    cookies.set('token', respuesta.token, { path: "/" });
                    cookies.set('id', respuesta.id, { path: "/" });
                    axios.defaults.headers.common['Authorization'] = 'Bearer' + response.data.token;
                    window.location.href = "./dashboard";
                } else {
                    alert(response.data.infoMessage);
                }
            })
            .catch(error => {
                console.log(error);
            })

    }

    componentDidMount() {
        if (cookies.get('token')) {
            window.location.href = "./dashboard";
        }
    }

    render() {
        return (
            <body>
            <div>
                <Form>
                    <h1>Inicio de Sesión</h1>
                    <FormGroup floating>
                        <Input
                            id="exampleEmail"
                            name="email"
                            placeholder="Email"
                            type="email"
                            onChange={this.handleChange}
                        />
                        <Label for="exampleEmail">
                            Email
                        </Label>
                    </FormGroup>
                    {' '}
                    <FormGroup floating>
                        <Input
                            id="examplePassword"
                            name="password"
                            placeholder="Password"
                            type="password"
                            onChange={this.handleChange}
                        />
                        <Label for="examplePassword">
                            Password
                        </Label>
                    </FormGroup>
                    {' '}
                    <Button style={{width:170,justifyContent:'center', backgroundColor:'#99004d',marginTop:10,}}  onClick={() => this.iniciarSesion()}>
                        Iniciar sesión
                    </Button>
                </Form>
            </div>
            </body>
        );
    }
}

export default Login;