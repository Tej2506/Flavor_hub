import React, { useState } from 'react';
import { useFormik } from 'formik';

const RecipeForm  = ({ dishes, setDishes }) => {
  const [recipeName, setRecipeName] = useState('');

  const formik = useFormik({
    initialValues: {
      dish_name: '',
      description:'',
      ingredients: '',
      instructions: '',
      cooking_time: '',
      servings: '',
      image_url: '',
      public: true
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
                setDishes([...dishes, data])
                setRecipeName(values['name'])
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
    <div>
      <h1>Add New Recipe</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Recipe Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            onChange={formik.handleChange}
            value={formik.values.ingredients}
            required
          />
        </div>
        <div>
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            onChange={formik.handleChange}
            value={formik.values.instructions}
            required
          />
        </div>
        <div>
          <label htmlFor="cooking_time">Cooking Time (minutes)</label>
          <input
            id="cooking_time"
            name="cooking_time"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.cooking_time}
            required
          />
        </div>
        <div>
          <label htmlFor="servings">Servings</label>
          <input
            id="servings"
            name="servings"
            type="number"
            onChange={formik.handleChange}
            value={formik.values.servings}
            required
          />
        </div>
        <div>
          <label htmlFor="image_url">Image URL</label>
          <input
            id="image_url"
            name="image_url"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.image_url}
          />
        </div>
        <div>
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
