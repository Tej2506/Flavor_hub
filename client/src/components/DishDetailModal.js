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
        servings: dish.servings,
        comments: dish.comments
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

    const handleDelete = (id) => {
        closeModal();
        fetch('http://127.0.0.1:5000/user/delete_recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipe_id: id }),
            credentials: 'include'
        })
            .then((res) => {
                if (res.status === 200) {
                    const newRecipeList = dishes.filter(dish => dish.id !== id);
                    setDishes(newRecipeList);
                    return res.json().then((data) => {
                        alert("Recipe deleted successfully: " + data['name']);
                    });
                } else {
                    alert("Error deleting recipe");
                }
            })
            .catch(error => console.error("Error:", error));
    };

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? (
                        <input
                            type="text"
                            name="name"
                            value={editedDish.name}
                            onChange={handleInputChange}
                            className="modal-input"
                        />
                    ) : (
                        editedDish.name
                    )}</h2>
                </div>

                <div className="modal-body">
                    <img src={editedDish.image_url} alt={editedDish.name} className="modal-image" />

                    <div className="detail-section">
                        <strong>Date Created:</strong>
                        <p>{new Date(editedDish.date_created).toLocaleString()}</p>
                    </div>

                    <div className="detail-section">
                        <strong>Description:</strong>
                        {isEditing ? (
                            <textarea
                                name="description"
                                value={editedDish.description}
                                onChange={handleInputChange}
                                className="modal-textarea"
                            />
                        ) : (
                            <p>{editedDish.description}</p>
                        )}
                    </div>

                    <div className="detail-section">
                        <strong>Ingredients:</strong>
                        {isEditing ? (
                            <textarea
                                name="ingredients"
                                value={editedDish.ingredients}
                                onChange={handleInputChange}
                                className="modal-textarea"
                            />
                        ) : (
                            <p>{editedDish.ingredients}</p>
                        )}
                    </div>

                    <div className="detail-section">
                        <strong>Instructions:</strong>
                        {isEditing ? (
                            <textarea
                                name="instructions"
                                value={editedDish.instructions}
                                onChange={handleInputChange}
                                className="modal-textarea"
                            />
                        ) : (
                            <p>{editedDish.instructions}</p>
                        )}
                    </div>

                    <div className="detail-section">
                        <strong>Servings:</strong>
                        {isEditing ? (
                            <input
                                type="number"
                                name="servings"
                                value={editedDish.servings}
                                onChange={handleInputChange}
                                className="modal-input"
                            />
                        ) : (
                            <p>{editedDish.servings}</p>
                        )}
                    </div>

                    <div className="detail-section">
                        <strong>Comments:</strong>
                        {editedDish.comments && editedDish.comments.length > 0 ? (
                            <ul className="comments-list">
                                {editedDish.comments.map((comment, index) => (
                                    <li key={index} className="comment-item">
                                        <strong>{comment.username}:</strong> {comment.content}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No comments yet.</p>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    {isEditing ? (
                        <button className="save-button" onClick={handleSave}>Save</button>
                    ) : (
                        <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                    <button className="close-button" onClick={closeModal}>Close</button>
                    <button className="delete-button" onClick={() => handleDelete(editedDish.id)}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default DishDetailModal;
