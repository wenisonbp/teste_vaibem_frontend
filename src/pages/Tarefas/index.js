// Inserir componente

import React from 'react';
import { Link } from "react-router-dom";
import Drag from '@src/components/Drag';
import './style.css';


const Tarefas = () => {

    return (
        <>
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0 text-dark">Tarefas</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><Link to="#">Tarefas</Link></li>
                                    <li className="breadcrumb-item active" />
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                                <Drag></Drag>
                        </div>
                    </div>
                </section>
            </div>
        </ >
    )
}

export default Tarefas;
