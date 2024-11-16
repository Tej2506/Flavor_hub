import React, { useState } from 'react';

function PublicFeedModal({ username, dish, closeModal, dishes, setDishes }) {
    const [isEditing, setIsEditing] = useState(false)
    const [comment, setComment] = useState('')

    function handleAddComment(){
        setIsEditing(true)
    }
    function handleInputChange(e){
        const comment_content = e.target.value;
        setComment(comment_content);
    };

    function handleSaveComment() {
        setIsEditing(false);
    
        fetch('http://127.0.0.1:5000/user/dish/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment, recipe_id: dish.id }),
            credentials: 'include'
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json().then(data => {
                        // Update the dishes array with the new dish data
                        const updatedDishes = dishes.map(d =>
                            d.id === dish.id ? data : d
                        );
                        setDishes(updatedDishes);
                        window.location.reload()
                    });
                } else {
                    alert("Error adding comment: " + response.status);
                }
            })
            .catch(error => console.error('Error adding comment:', error));
    }
    

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={dish.image_url} alt={dish.dish_name} className="full-image" />
                <h2>{dish.dish_name}</h2>
                <p><strong>Date Created:</strong> {new Date(dish.date_created).toLocaleString()}</p>
                <p><strong>Description:</strong> {dish.description}</p>
                <p><strong>Ingredients:</strong> {dish.ingredients}</p>
                <p><strong>Instructions:</strong> {dish.instructions}</p>
                <p><strong>Servings:</strong> {dish.servings}</p>
                
                <div>
                    {isEditing ? (
                    <div>                        
                        <input
                            name="comment"
                            value={comment}
                            onChange={(e)=>handleInputChange(e)}
                        />
                        <button onClick={handleSaveComment}>Save Comment</button>
                    </div>
                    )
   
                     : (
                    <div>
                        <h3>Comments</h3>
                        {dish.comments && dish.comments.map((comment, index) => (
                            <p key={index}><strong>{comment.username}:</strong> {comment.content}: {new Date(comment.date_created).toLocaleString()}</p>
                        ))}
                    </div>
                    )}
                </div>
                <button onClick={closeModal}>Close</button>
                <button onClick={()=>handleAddComment(dish.id)}>Add Comment</button>
            </div>
        </div>
    );
}

export default PublicFeedModal;