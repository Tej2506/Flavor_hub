import React, { useState } from 'react';
import { useFormik } from 'formik';

const RecipeForm = ({ dishes, setDishes }) => {
    const [recipeName, setRecipeName] = useState('');

    const formik = useFormik({
        initialValues: {
            dish_name: '',
            description: '',
            ingredients: '',
            instructions: '',
            cooking_time: '',
            servings: '',
            image_url: '',
            public: true
        },
        validate: (values) => {
            const errors = {};
            if (!values.dish_name) errors.dish_name = 'Recipe name is required';
            if (!values.description) errors.description = 'Description is required';
            if (!values.ingredients) errors.ingredients = 'Ingredients are required';
            if (!values.instructions) errors.instructions = 'Instructions are required';
            if (!values.cooking_time) errors.cooking_time = 'Cooking time is required';
            if (!values.servings) errors.servings = 'Servings are required';
            if (!values.image_url) errors.image_url = 'Image URL is required';
            return errors;
        },
        onSubmit: (values) => {
            fetch('http://127.0.0.1:5000/user/dishes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
                credentials: 'include'
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.json().then((data) => {
                        setDishes([...dishes, data]);
                        setRecipeName(values['dish_name']);
                        alert("Added recipe successfully: " + recipeName);
                    });
                } else {
                    alert("Error adding recipe");
                }
            })
            .catch(error => console.error("Error:", error));
        }
    });

    return (
        <div className="recipe-form-container">
            <h1>Add New Recipe</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <input
                        id="dish_name"
                        name="dish_name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.dish_name}
                        required
                        placeholder="Recipe Name"
                    />
                    {formik.errors.dish_name && <p className="error">{formik.errors.dish_name}</p>}
                </div>
                <div>
                    <input
                        id="description"
                        name="description"
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        required
                        placeholder="Description"
                    />
                    {formik.errors.description && <p className="error">{formik.errors.description}</p>}
                </div>
                <div>
                    <input
                        id="ingredients"
                        name="ingredients"
                        onChange={formik.handleChange}
                        value={formik.values.ingredients}
                        required
                        placeholder="Ingredients"
                    />
                    {formik.errors.ingredients && <p className="error">{formik.errors.ingredients}</p>}
                </div>
                <div>
                    <input
                        id="instructions"
                        name="instructions"
                        onChange={formik.handleChange}
                        value={formik.values.instructions}
                        required
                        placeholder="Instructions"
                    />
                    {formik.errors.instructions && <p className="error">{formik.errors.instructions}</p>}
                </div>
                <div>
                    <input
                        id="cooking_time"
                        name="cooking_time"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.cooking_time}
                        required
                        placeholder="Cooking Time"
                    />
                    {formik.errors.cooking_time && <p className="error">{formik.errors.cooking_time}</p>}
                </div>
                <div>
                    <input
                        id="servings"
                        name="servings"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.servings}
                        required
                        placeholder="Servings"
                    />
                    {formik.errors.servings && <p className="error">{formik.errors.servings}</p>}
                </div>
                <div>
                    <input
                        id="image_url"
                        name="image_url"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.image_url}
                        placeholder="Image URL"
                    />
                    {formik.errors.image_url && <p className="error">{formik.errors.image_url}</p>}
                </div>
                <div className="checkbox-container">
                    <label htmlFor="public">Make Public</label>
                    <input
                        id="public"
                        name="public"
                        type="checkbox"
                        onChange={formik.handleChange}
                        checked={formik.values.public}
                    />
                </div>
                <button type="submit">Add Recipe</button>
            </form>
            {recipeName && <p>Recipe added: {recipeName}</p>}
        </div>
    );
};

export default RecipeForm;
