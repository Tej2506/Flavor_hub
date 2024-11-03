import React, { useState } from 'react';
import DishDetailModal from './DishDetailModal';

function TileGallery({ dishes, setDishes }) {
    const [selectedDish, setSelectedDish] = useState(null)

    // Handlers to open and close the modal
    const openModal = (dish) => setSelectedDish(dish);
    const closeModal = () => setSelectedDish(null);

    return (
        <div>
            {dishes.map(dish => (
                <div key={dish.id} className="dish-tile" onClick={()=>openModal(dish)}>
                    <img src={dish.image_url} alt={dish.name} className="thumbnail" />
                    <h4>{dish.dish_name}</h4>
                    <p>{new Date(dish.date_created).toLocaleDateString()}</p>
    
                    {selectedDish && <DishDetailModal key ={dish.id} dish={dish} onClose={closeModal} dishes={dishes} setDishes={setDishes} />}
                </div>
            ))}
        </div>
    );
    
}

export default TileGallery;
