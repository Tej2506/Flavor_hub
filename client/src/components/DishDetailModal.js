
import React, { useState } from 'react';

function DishDetailModal({ dish, closeModal, dishes, setDishes }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDish, setEditedDish] = useState({
        id: dish.id,
        name: dish.dish_name,
        image_url: dish.image_url,
        date_created: dish.date_created,
        description: dish.description,
        ingredients: dish.ingredients,
        instructions: dish.instructions,
        servings: dish.servings
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedDish({ ...editedDish, [name]: value });
    };

    const handleSave = () => {
        const updatedDishes = dishes.map((d) => 
            d.id === editedDish.id ? { ...d, ...editedDish } : d
        );
        setDishes(updatedDishes);
        setIsEditing(false);
        fetch('http://127.0.0.1:5000/user/dishes', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedDish),
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => alert(data['message']));
            } else {
                alert("Error editing recipe");
            }
        })
        .catch(error => console.error('Error updating recipe:', error));
        
        
    };

    function handleDelete(id) {
        closeModal()
        fetch('http://127.0.0.1:5000/user/delete_recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({recipe_id: id }),
            credentials: 'include'
        })
        .then((res) => {
            if (res.status === 200) {
                const new_recipe_list = dishes.filter(dish => dish.id !== id);
                setDishes(new_recipe_list);
                return res.json().then((data) => {
                    alert("Tile deleted successfully: " + data['name']);
                });
            } else {
                alert("Error deleting tile");
            }
        })
        .catch(error => console.error("Error:", error));
    }

    
    

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" tile_id={dish.id} onClick={(e) => e.stopPropagation()}>
                {isEditing ? (
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={editedDish.dish_name}
                            onChange={handleInputChange}
                            className="full-image"
                        />
                        <input
                            type="text"
                            name="image_url"
                            value={editedDish.image_url}
                            onChange={handleInputChange}
                        />
                    </div>
                ) : (
                    <div>
                        <img src={editedDish.image_url} alt={editedDish.name} className="full-image" />
                        <h2>{editedDish.name}</h2>
                    </div>
                )}
                
                <p><strong>Date Created:</strong> {new Date(editedDish.date_created).toLocaleString()}</p>

                <div>
                    <strong>Description:</strong>
                    {isEditing ? (
                        <textarea
                            name="description"
                            value={editedDish.description}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{editedDish.description}</p>
                    )}
                </div>

                <div>
                    <strong>Ingredients:</strong>
                    {isEditing ? (
                        <textarea
                            name="ingredients"
                            value={editedDish.ingredients}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{editedDish.ingredients}</p>
                    )}
                </div>

                <div>
                    <strong>Instructions:</strong>
                    {isEditing ? (
                        <textarea
                            name="instructions"
                            value={editedDish.instructions}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{editedDish.instructions}</p>
                    )}
                </div>

                <div>
                    <strong>Servings:</strong>
                    {isEditing ? (
                        <input
                            type="text"
                            name="servings"
                            value={editedDish.servings}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <p>{editedDish.servings}</p>
                    )}
                </div>

                <div>
                    <>{dish.comments && <h3>Comments</h3>}</>
                    {dish.comments && dish.comments.map((comment, index) => (
                        <p key={index}><strong>{comment.username}:</strong> {comment.content}</p>
                    ))}
                </div>

                {isEditing ? (
                    <button onClick={handleSave}>Save</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                )}
                <button onClick={closeModal}>Close</button>
                <button onClick={()=>handleDelete(editedDish.id)}>Delete Recipe</button>
            </div>
        </div>
    );
}

export default DishDetailModal;
