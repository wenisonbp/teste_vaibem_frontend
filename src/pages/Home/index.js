// Inserir componente

import React from 'react';
import { Link } from "react-router-dom";
import './style.css';
import LogoVaiBem from '@public/dist/img/logo_roxa.png';

const Home = () => {

    return (
        <>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">Home</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                                    <li className="breadcrumb-item active" />
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="jumbotron">
                                    <div style={{ textAlign: 'center' }}>
                                        <img className="img-acesso-negado" style={{ width: 100, paddingTop: 0 }} src={LogoVaiBem} alt="LogoVaiBem" />
                                        <h1 className="display-4">Olá, bem vindo ao <span style={{ fontWeight: 500 }}>Board Kanban - Vai Bem</span>!</h1>
                                        <p className="lead">O que você deseja realizar hoje? Escolha uma das opções abaixo...</p>
                                    </div>
                                    <hr className="my-4" />
                                    <div class="container">
                                        <div class="row justify-content-md-center">
                                            <div class="col-md-auto">
                                                <div className="card card-home">
                                                    <div className="card-body">
                                                        <h5 className="card-title"><b>Gerenciar Tarefas</b></h5>
                                                        <p className="card-text">Controle todas as suas atividades diárias</p>
                                                        <i class="fas fa-tasks"></i>
                                                        <Link to="/tarefas" className="card-link float-right">Ir para</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home;
