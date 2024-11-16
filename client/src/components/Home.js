//Home
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home">
            <h1>Welcome to FlavorHub</h1>
            <p>Your culinary journey begins here! Share your favorite recipes, explore dishes from others, and connect with a community that shares your passion for flavor and creativity in the kitchen.</p>
            <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
            </ul>
        </div>
    );
}

export default Home;
