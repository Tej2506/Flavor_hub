import React from 'react';

function DishTile({ dish }) {
    return (
        <div className="dish-tile">
            <img src={dish.image_url} alt={dish.name} className="dish-image" />
            <div className="dish-info">
                <h2>{dish.name}</h2>
                <p><strong>Ingredients:</strong> {dish.ingredients}</p>
                <p><strong>Instructions:</strong> {dish.instructions}</p>
                <p><strong>Servings:</strong> {dish.servings}</p>
                <p><strong>Cooking Time:</strong> {dish.cooking_time} minutes</p>
            </div>
            <div className="comments-section">
                <h3>Comments:</h3>
                {dish.comments.length > 0 ? (
                    dish.comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p><strong>{comment.username}:</strong> {comment.content}</p>
                            <small>{new Date(comment.date).toLocaleDateString()}</small>
                        </div>
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
}

export default DishTile;
