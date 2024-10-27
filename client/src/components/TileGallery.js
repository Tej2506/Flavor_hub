import React, { useState } from 'react';
import DishDetailModal from './DishDetailModal';

function DishTile({ dish }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handlers to open and close the modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            {/* Thumbnail Tile */}
            <div className="dish-tile" onClick={openModal}>
                <img src={dish.image_url} alt={dish.name} className="thumbnail" />
                <h4>{dish.name}</h4>
                <p>{new Date(dish.date_created).toLocaleDateString()}</p>
            </div>

            {/* Modal for Full Dish Details */}
            {isModalOpen && <DishDetailModal dish={dish} onClose={closeModal} />}
        </div>
    );
}

export default DishTile;
