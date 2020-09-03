import React from 'react';
import { Link, NavLink  } from "react-router-dom";
import UserPerfil from '@public/dist/img/user_perfil.jpg';
import LogoVivinho from '@public/dist/img/logo_oceano.png';
import './style.css';

const Sidebar = () => {

    return (
        <div>
            <aside className="main-sidebar elevation-4 sidebar-light-indigo">
                <Link to="/user_equipe_eficiencia" className="brand-link navbar-indigo">
                    <img src={LogoVivinho} className="brand-image" alt="LogoVivinho" />
                    <span className="brand-text font-weight-light" style={{ color: '#d9c3fc' }}>Board Kaban - Vai Bem</span>
                </Link>
                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src={UserPerfil} className="img-circle elevation-2" alt="UserPerfil" />
                        </div>
                        <div className="info">
                            <Link to="#" className="d-block">Sistema VAIBEM</Link>
                        </div>
                    </div>
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <NavLink to="/home" className="nav-link" activeClassName="active">
                                    <i className="nav-icon fas fa-home" />
                                    <p>
                                        Home
                                    </p>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/tarefas" className="nav-link" activeClassName="active">
                                    <i className="nav-icon fas fa-tasks" />
                                    <p>
                                        Tarefas
                                    </p>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;