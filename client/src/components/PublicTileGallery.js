import React, { useState } from 'react';
import PublicFeedModal from './PublicFeedModal'

function PublicTileGallery({ dishes, setDishes }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handlers to open and close the modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            {dishes.map(dish => (
                <div key={dish.id} className="dish-tile" onClick={openModal}>
                    <img src={dish.image_url} alt={dish.dish_name} className="thumbnail" />
                    <h4>{dish.dish_name}</h4>
                    <p>{new Date(dish.date_created).toLocaleDateString()}</p>
    
                    {isModalOpen && <PublicFeedModal key ={dish.id} dish={dish} onClose={closeModal} dishes={dishes} setDishes={setDishes} />}
                </div>
            ))}
        </div>
    );
    
}

export default PublicTileGallery;
