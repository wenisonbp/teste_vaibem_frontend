// Inserir componente

import React, { useState } from 'react';
import api from '@src/services/api';
import { useHistory, Link } from "react-router-dom";
import LogoVaiBem from '@public/dist/img/logo_vai_bem.png';
import './style.css';


const Login = () => {


    const [hasError, setHasError] = useState(false);
    const [errorMensagem, setErrorMensagem] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const history = useHistory()

    const LoginAuthenticate = async (e) => {

        try {

            e.preventDefault();

            const { data } = await api.post('/authenticate', {
                email,
                password
            })


            if (data.token) {

                localStorage.setItem('token', data.token);
                history.push('/home');
                window.location.reload();

            }

        } catch (error) {


            setHasError(true);
            setErrorMensagem(error.response.data.error)

        }


    }


    return (
        <div className="d-flex justify-content-center pt-5">
            <div className="login-box">
                <div className="card">
                    <div className="card-body login-card-body">
                        <img src={LogoVaiBem} className="logo_vai_bem d-flex justify-content-center" alt="LogoVaiBem" />
                        <p className="login-box-msg">Identifique-se para continuar</p>

                        <form onSubmit={LoginAuthenticate}>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="E-mail" required value={email} onChange={({ target }) => setEmail(target.value)} />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" placeholder="Senha" required value={password} onChange={({ target }) => setPassword(target.value)} />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            {
                                hasError && (

                                    <div className="alert alert-danger" role="alert" >
                                        {errorMensagem}
                                    </div>

                                )

                            }

                            <div className="row">
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block">Entrar</button>
                                </div>
                                <div className="col-6">
                                    <Link to="/register" className="float-right">Não sou cadastratado</Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
