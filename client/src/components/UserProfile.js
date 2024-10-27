import React, { useEffect, useState } from 'react';
import TileGallery from './Tilegallery';

function UserProfile(){
    const [user, setUser] = useState(null)
    const [dishes, setDishes] = useState([])

    useEffect(()=>{
        fetch('/user/profile', {credentials: 'include'})
        .then(response=> response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error fetching profile:',error))


        fetch('/user/dishes', {credentials: 'include'})
        .then(response => response.json())
        .then(data => setDishes(data.dishes))
        .catch(error => console.error('Error fetching dishes:', error))
    },[]);


return(
    <div>
        {/* User Profile Header*/}
        {user && (
            <div className='user-profile-header'>
                <h1>{user.username}</h1>
                <p>Dishes: {user.total_dishes}</p>
                <p>Public Dishes: {user.public_dishes}</p>
            </div>
        )}
        {/*gallery of User's Dishes*/}
        <TileGallery dishes = {dishes} />
    </div>
    )
}