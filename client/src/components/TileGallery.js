import React, { useState } from 'react';
import DishDetailModal from './DishDetailModal';

function TileGallery({ dishes, setDishes }) {
    const [selectedDish, setSelectedDish] = useState(null);

    const openModal = (dish) => setSelectedDish(dish);
    const closeModal = () => setSelectedDish(null);

    return (
        <div className="tile-gallery">
            {dishes.map(dish => (
                <div key={dish.id} className="dish-tile" onClick={() => openModal(dish)}>
                    <img src={dish.image_url} alt={dish.name} className="thumbnail" />
                    <h4>{dish.dish_name}</h4>
                    <p>{new Date(dish.date_created).toLocaleDateString()}</p>
                </div>
            ))}

            {/* Render modal once, conditionally based on selectedDish */}
            {selectedDish && (
                <DishDetailModal
                    dish={selectedDish}
                    closeModal={closeModal}
                    dishes={dishes}
                    setDishes={setDishes}
                />
            )}
        </div>
    );
}

export default TileGallery;
