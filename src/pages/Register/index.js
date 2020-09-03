// Inserir componente

import React, { useState } from 'react';
import api from '@src/services/api';
import { useHistory, Link } from "react-router-dom";
import LogoVaiBem from '@public/dist/img/logo_vai_bem.png';
import Family from '@public/dist/img/family2.jpg';
import './style.css';


const Register = () => {


    const [hasError, setHasError] = useState(false);
    const [errorMensagem, setErrorMensagem] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const history = useHistory()

    const register = async (e) => {

        try {

            e.preventDefault();

            const { data } = await api.post('/register', {
                email,
                password,
                name,
                passwordConfirm,
            })


            if (data.token) {

                localStorage.setItem('token', data.token);
                window.location.href = '/home';

            }

        } catch (error) {

            setHasError(true);
            setErrorMensagem(error.response.data.error)

        }


    }


    return (
        <div className="d-flex justify-content-center pt-5">
            <div className="content-img-family col-12 col-sm-12 col-md-12 col-lg-6">
                <img src={Family} className="image_family float-right" alt="Family" />
            </div>
            <div className="content-form-register col-12 col-sm-12 col-md-12 col-lg-6">
                <div className="login-box d-flex align-items-center">
                    <div className="card">
                        <div className="card-body login-card-body">
                            <img src={LogoVaiBem} className="logo_vai_bem d-flex justify-content-center" alt="LogoVaiBem" />
                            <p className="login-box-msg">Preencha os dados para continuar</p>

                            <form onSubmit={register}>
                                <div className="form-group mb-3">
                                    <label>Nome completo</label>
                                    <input type="text" className="form-control" placeholder="Nome completo" minLength={5} maxLength={100} required value={name} onChange={({ target }) => setName(target.value)} />
                                </div>
                                <div className="form-group mb-3">
                                    <label>E-mail</label>
                                    <input type="email" className="form-control" placeholder="E-mail" minLength={5} maxLength={100} required value={email} onChange={({ target }) => setEmail(target.value)} />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Nova senha</label>
                                    <input type="password" className="form-control" placeholder="Senha" minLength={6} maxLength={15} required value={password} onChange={({ target }) => setPassword(target.value)} />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Confirme nova senha</label>
                                    <input type="password" className="form-control" placeholder="Senha" minLength={6} maxLength={15} required value={passwordConfirm} onChange={({ target }) => setPasswordConfirm(target.value)} />
                                </div>
                                {
                                    hasError && (

                                        <div className="alert alert-danger" role="alert" >
                                            {errorMensagem}
                                        </div>

                                    )

                                }

                                <div className="row">
                                    <div className="col-6">
                                        <button type="submit" className="btn btn-success btn-block">Cadastrar</button>
                                    </div>
                                    <div className="col-6">
                                        <Link to="/login" className="float-right">Já possuo cadastro</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Register;
