import React from 'react';
import './Navbar.css';
import {useHistory} from 'react-router';
import { useStateValue } from '../StateProvider';


function Navbar() {
    const [{ }, dispatch] = useStateValue();
    const history = useHistory();

    const logOut = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        history.push("/signin");
    }

    return (
       <div className="nav">
           
           <nav className="navbar fixed-top navbar-light navbar-expand-lg navbar-light shadow">
           
                <h4 className="navbar-brand nav-text text-light text-center m-auto" >
                    Journal App
                </h4>
                <button className="btn btn-sm btn-info me-3 shadow" onClick={logOut}>Logout</button>
            </nav>
            

       </div>
        
        
    )
}

export default Navbar
