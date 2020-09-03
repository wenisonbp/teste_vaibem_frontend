import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from "react-router-dom";
import Navbar from '@src/common/layout/Navbar';
import Sidebar from '@src/common/layout/Sidebar';
import Footer from '@src/common/layout/Footer';
import Home from '@src/pages/Home';
import Tarefas from '@src/pages/Tarefas';
import Login from '@src/pages/Login';
import Register from '@src/pages/Register';

let ckeckLogin = localStorage.getItem('token');

const Routes = () => {

    return (
        <>
            {
                ckeckLogin ? (
                    <Router>
                        <Navbar />
                        <Sidebar />
                        <Route path="/home" component={Home} />
                        <Route path="/tarefas" component={Tarefas} />
                        <Footer />
                    </Router>
                ) : (
                        <Router>
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                        </Router>
                    )
            }
        </>
    );

};

export default Routes;