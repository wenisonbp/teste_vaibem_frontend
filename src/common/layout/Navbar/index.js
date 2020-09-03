import React from 'react';
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './style.css';


const Navbar = () => {

    const logoff = () => {
        confirmAlert({
            title: 'Confirmar saída',
            message: 'Deseja realmente sair?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                },
                {
                    label: 'Não',
                    onClick: () => {
                        return;
                    }
                }
            ]
        });
    };

    return (
        <div>
            <nav className="main-header navbar navbar-expand navbar-dark navbar-indigo">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" data-widget="pushmenu" to="#"><i className="fas fa-bars" /></Link>
                    </li>
                    <li className="nav-item d-none d-sm-inline-block">
                        <Link to="/home" className="nav-link">Home</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item d-none d-sm-inline-block">
                        <Link to="#" id="logoff_hde" className="nav-link" onClick={logoff}>Sair</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;