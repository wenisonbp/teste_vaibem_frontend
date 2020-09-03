import React from 'react';
import { Link } from "react-router-dom";
// import { Container } from './styles';

const Footer = () => {
    return (
        <div>
            <footer className="main-footer">
                <div className="float-right d-none d-sm-block">
                    <b>Version</b> 3.0.5
                </div>
                <strong>Copyright © 2020 <Link to="https://cartaovaibem.com.br/">Vai Bem</Link>.</strong> All rights
                reserved.
            </footer>
        </div>
    );
}

export default Footer;