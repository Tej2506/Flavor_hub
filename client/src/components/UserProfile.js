//UserProfile
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TileGallery from './TileGallery';
import RecipeForm from './RecipeForm';

function UserProfile() {
    const [user, setUser] = useState(null)
    const [dishes, setDishes] = useState([])
    const history = useHistory()
    const [message, setMessage] = useState('')

    useEffect(() => {
      fetch('http://127.0.0.1:5000/userprofile', { credentials: 'include' })
          .then(response => response.json())
          .then(data => setUser(data))
          .catch(error => console.error('Error fetching profile:', error));
  
      fetch('http://127.0.0.1:5000/user/dishes', { credentials: 'include' })
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

    function handleLogout() {
        fetch('http://127.0.0.1:5000/logout', {
          method: 'POST',
          credentials: 'include',
        })
          .then(res => {
            if (res.ok) {
              history.push('/');
            }
          })
          .catch(error => {
            console.error('Error logging out:', error);
          });
    }

    function submitFeedback(){
      history.push('/user/feedback')
    }

    return (
        <div className="user-profile-page">
            {user && (
                <div className="user-profile-header">
                    <h1>{user.username}'s Flavour Hub</h1>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={() => history.push('/user/publicfeed')}>Public Feed</button>
                    <p>Dishes: {user.total_dishes}</p>
                    <p>Public Dishes: {user.public_dishes}</p>
                </div>
            )}
            {message && <p>{message}</p>}
            <RecipeForm dishes={dishes} setDishes={setDishes} />
            <TileGallery dishes={dishes} setDishes={setDishes} />
            <button onClick={submitFeedback}>Send Feedback</button>
        </div>
    )
}

export default UserProfile;
