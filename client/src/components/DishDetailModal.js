import React from 'react';

function DishDetailModal({ dish, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={dish.image_url} alt={dish.name} className="full-image" />
                <h2>{dish.name}</h2>
                <p><strong>Date Created:</strong> {new Date(dish.date_created).toLocaleString()}</p>
                <p><strong>Ingredients:</strong> {dish.ingredients}</p>
                <p><strong>Instructions:</strong> {dish.instructions}</p>
                <p><strong>Tags:</strong> {dish.tags && dish.tags.join(', ')}</p>
                <div>
                    <h3>Comments</h3>
                    {dish.comments && dish.comments.map((comment, index) => (
                        <p key={index}><strong>{comment.username}:</strong> {comment.content}</p>
                    ))}
                </div>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default DishDetailModal;
