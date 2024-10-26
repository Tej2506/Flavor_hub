// components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';



function Home(){
    return(
        <div>
            <h1>Welcome to Flvor Hub</h1>
            <ul>
                <li><Link to ="/login">Login</Link></li>
                <li><Link to ="/signup">Signup</Link></li>
            </ul>
        </div>
    );
}

export default Home;
