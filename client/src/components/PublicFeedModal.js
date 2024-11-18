import React, { useState } from 'react';

function PublicFeedModal({ username, dish, closeModal, dishes, setDishes }) {
    const [isEditing, setIsEditing] = useState(false)
    const [comment, setComment] = useState('')
    const[modalDish, setModalDish] = useState(dish)

    function handleAddComment(){
        setIsEditing(true)
    }
    function handleInputChange(e){
        const comment_content = e.target.value;
        setComment(comment_content);
    };

    function handleSaveComment() {
        setIsEditing(false)
    
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
                        setDishes(updatedDishes)
                        setModalDish(data)
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
                <img src={modalDish.image_url} alt={modalDish.dish_name} className="full-image" />
                <h2>{dish.dish_name}</h2>
                <div className='detail-section'>
                    <p><strong>Date Created:</strong> {new Date(modalDish.date_created).toLocaleString()}</p>
                    <p><strong>Description:</strong> {modalDish.description}</p>
                    <p><strong>Ingredients:</strong> {modalDish.ingredients}</p>
                    <p><strong>Instructions:</strong> {modalDish.instructions}</p>
                    <p><strong>Cooking time:</strong> {modalDish.cooking_time} minutes</p>
                    <p><strong>Servings:</strong> {modalDish.servings}</p>

                </div>
                <div>
                    {isEditing ? (
                    <div>                        
                        <input
                            name="comment"
                            value={comment}
                            onChange={(e)=>handleInputChange(e)}
                        />
                    </div>
                    )
   
                     : (
                    <div className='detail-section'>
                        <h3>Comments</h3>
                        <ul className="comments-list">
                                {modalDish.comments.map((comment, index) => (
                                    <li key={index} className="comment-item">
                                        <strong>{comment.username}:</strong> {comment.content}
                                    </li>
                                ))}
                            </ul>
                    </div>
                    )}
                </div>
                <div className="modal-footer">
                    {isEditing ? (
                        <button className="save-button" onClick={handleSaveComment}>Save Comment</button>
                    ) : (
                        <button className="edit-button" onClick={()=>handleAddComment(modalDish.id)}>Add Comment</button>
                    )}
                    <button className="close-button" onClick={closeModal}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default PublicFeedModal;