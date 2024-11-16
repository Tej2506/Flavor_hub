import React, { useState } from 'react';
import PublicFeedModal from './PublicFeedModal'

function PublicTileGallery({ username, dishes, setDishes }) {
    const [selectedDish, setSelectedDish] = useState(null);

    const openModal = (dish) => setSelectedDish(dish);
    const closeModal = () => setSelectedDish(null);

    return (
        <div>
            {dishes.map(dish => (
                <div key={dish.id} className="public-feed-tile" onClick={()=>openModal(dish)}>
                    <img src={dish.image_url} alt={dish.dish_name} className="thumbnail" />
                    <h4>{dish.username}:{dish.dish_name}</h4>
                    <p>{new Date(dish.date_created).toLocaleDateString()}</p>
                   
                </div>
            ))}
            {selectedDish && (
                <PublicFeedModal
                    username={username}
                    dish={selectedDish}
                    closeModal={closeModal}
                    dishes={dishes}
                    setDishes={setDishes}
                />
            )}
        </div>
    );
    
}

export default PublicTileGallery;
