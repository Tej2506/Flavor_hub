import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PublicTileGallery from './PublicTileGallery';

function PublicFeed() {
    const [dishes, setDishes] = useState([]);
    const [message, setMessage] = useState('')
    const history = useHistory()

    useEffect(() => {
        fetch('http://127.0.0.1:5000/user/publicfeed', { credentials: 'include' })
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then(data => setDishes(data));
            } else {
                res.json()
                    .then(response => setMessage(response['message']));
            }
        })
        .catch(error => console.error('Error fetching dishes:', error));
    }, []);

    return (
        <div className="public-feed">
            <button onClick={()=>history.push('/userprofile')}>Profile</button>
            {dishes.length > 0 ? (
                <PublicTileGallery dishes = {dishes} />
            ) : (
                <p>{message}</p>
            )}
        </div>
    );
}

export default PublicFeed;
