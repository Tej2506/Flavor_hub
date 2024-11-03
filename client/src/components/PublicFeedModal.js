import React, { useState } from 'react';

function PublicFeedModal({ dish, onClose, setDishes }) {
    const [isEditing, setIsEditing] = useState(false)
    const [comment, setComment] = useState('')

    function handleAddComment(){
        setIsEditing(true)
    }
    function handleInputChange(e){
        const comment_content = e.target.value;
        setComment(comment_content);
    };

    function handleSaveComment(){
        setIsEditing(false)

        fetch('http://127.0.0.1:5000/user/dish/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'comment':comment,'recipe_id':dish.id, ...dish}),
            credentials: 'include'
        })
        .then(response => {
            if (response.status === 200) {
                return response.json().then(data => setDishes(...dish,data));
            } else {
                alert("Error adding comment"+ response.status);
            }
        })
        .catch(error => console.error('Error adding  comment:', error));

    }
    
    
    

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={dish.image_url} alt={dish.dish_name} className="full-image" />
                <h2>{dish.dish_name}</h2>
                <p><strong>Date Created:</strong> {new Date(dish.date_created).toLocaleString()}</p>
                <p><strong>Description:</strong> {dish.description}</p>
                <p><strong>Ingredients:</strong> {dish.ingredients}</p>
                <p><strong>Instructions:</strong> {dish.instructions}</p>
                <p><strong>Tags:</strong> {dish.tags && dish.tags.join(', ')}</p>
                
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
                            <p key={index}><strong>{comment.username}:</strong> {comment.content}</p>
                        ))}
                    </div>
                    )}
                </div>
                <button onClick={onClose}>Close</button>
                <button onClick={()=>handleAddComment(dish.id)}>Add Comment</button>
            </div>
        </div>
    );
}

export default PublicFeedModal;