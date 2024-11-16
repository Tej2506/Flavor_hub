#!/usr/bin/env python3
#app.py

# Remote library imports
from flask import Flask, request, jsonify, make_response, session
from flask_restful import Resource
from datetime import datetime
import requests
import os

# Local imports
from config import app, db, api, bcrypt, CORS  # bcrypt imported from config
from models import User, Dish, Recipe, Tag, Comment, Rating  # Import your models

# Views go here!
app.secret_key = b'\x11\x16\x83\xfee\x97\x0e\xd5Y5:FR+\xb1\\'

class SignupResource(Resource):
    def post(self):
        data = request.get_json()
        existing_user = User.query.filter_by(username = data.get('username')).first()

        if existing_user:
            return make_response({'error': 'Username already exists'}, 400)
        
        else:
            new_user = User()
            new_user.username = data.get('username')
            new_user.password= data.get('password')
           
            db.session.add(new_user)
            db.session.commit()

            session['user_id']= new_user.id
            return make_response(new_user.to_dict(), 200)

class LoginResource(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username = data['username']).first()

        if user:
            if user.authenticate(data['password']):
                session['user_id'] = user.id
                print(session.get('user_id'))
                return make_response({'user_id': user.id}, 200)
            else:
                return make_response({'message':'Incorrect password, try again'},201)
        else:
            return make_response({'message':'User does not exist'},202)


class LogoutResource(Resource):
    def post(self):
        session.pop('user_id', None)
        return make_response({'message': 'Logged out successfully'},200)

class CheckLoginResource(Resource):
    def get(self):
        if session.get('user_id'):
            return make_response({'message': 'User is logged in'},200)

        else:
            return make_response({'message': 'User is not logged in'}, 401)

class UserProfileResource(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'message': 'User not logged in'}, 401)

        user = User.query.get(user_id)
        if not user:
            return make_response({'message': 'User not found'}, 404)

        # Calculate the total number of dishes
        total_dishes = Recipe.query.filter_by(user_id=user_id).count()  # Assuming 'Recipe' is each unique dish instance
        public_dishes = Recipe.query.filter_by(user_id=user_id, public=True).count()

        user_data = {
            'username': user.username,
            'total_dishes': total_dishes,
            'public_dishes': public_dishes
        }
        return make_response(user_data, 200)

class AllDishesRecipes(Resource):
    def get(self):
        user_id = session.get('user_id')
        print('Session id:',user_id)
        if not user_id:
             return make_response({'message': 'User not logged in'}, 401)
        
        recipes = Recipe.query.filter_by(user_id = user_id).all()
        if recipes:
            all_recipes=[]
            for recipe in recipes:
                comments = Comment.query.filter_by(recipe_id = recipe.id).all()
                if comments:
                    comments_data = [
                        {
                            'username': comment.user.username,
                            'content': comment.content,
                            'date': comment.date_created
                        }
                        for comment in comments
                    ]
                
                recipe_data = {
                'id': recipe.id,
                'dish_name': recipe.dish.name,
                'description': recipe.dish.description,
                'ingredients': recipe.ingredients,
                'instructions': recipe.instructions,
                'cooking_time': recipe.cooking_time,
                'servings': recipe.servings,
                'image_url': recipe.image_url,
                'date_created': recipe.date_created
                }
                if comments:
                    recipe_data.update({'comments': comments_data})
                all_recipes.append(recipe_data)
            return make_response(jsonify(all_recipes), 200)
        
        return make_response({'message':'Start your journey by adding Recipes!!!'},201)

    def post(self):
        user_id = session.get('user_id')
        print('Session user_id:',user_id)
        if not user_id:
            return make_response({'message':"user not logged in"},404)
       
        data = request.get_json()
        dish = Dish.query.filter_by(name=data.get('name')).first()
        if dish:
            recipe = Recipe.query.filter_by(user_id=user_id).first()
            if recipe:
                return make_response({'message':'Dish already added in your profile'})
            else:
                recipe = Recipe(
                    ingredients = data.get('ingredients'),
                    instructions = data.get('instructions'),
                    cooking_time = data.get('cooking_time') ,
                    servings = data.get('servings'),
                    image_url = data.get('image_url'),
                    public = data.get('public'),
                    dish_id = dish.id,
                    user_id = user_id
                )
                db.session.add(recipe)
                db.session.commit()
                response ={
                'id': recipe.id,
                'dish_name': recipe.dish.name,
                'description': recipe.dish.description,
                'ingredients': recipe.ingredients,
                'instructions': recipe.instructions,
                'cooking_time': recipe.cooking_time,
                'servings': recipe.servings,
                'image_url': recipe.image_url,
                'date_created': recipe.date_created
                }
                return make_response(response,200)

        else:
            dish = Dish(
                name = data.get('dish_name'),
                description = data.get('description')
                )
            db.session.add(dish)
            db.session.commit()
            recipe = Recipe(
                    ingredients = data.get('ingredients'),
                    instructions = data.get('instructions'),
                    cooking_time = data.get('cooking_time'),
                    servings = data.get('servings'),
                    image_url = data.get('image_url'),
                    public = data.get('public'),
                    user_id = user_id,
                    dish_id = dish.id
                )
            db.session.add(recipe)
            db.session.commit()
            response = {
                'id': recipe.id,
                'dish_name': recipe.dish.name,
                'ingredients': recipe.ingredients,
                'description': recipe.dish.description,
                'instructions': recipe.instructions,
                'cooking_time': recipe.cooking_time,
                'servings': recipe.servings,
                'image_url': recipe.image_url,
                'date_created': recipe.date_created
                }
            return make_response(response,200)

    def patch(self):
        user_id = session.get('user_id')
        data = request.get_json()
        
        if not user_id:
            return make_response({'message':'User not logged in'},404)
       
        recipe = Recipe.query.filter_by(id = data.get('id')).first()
        if not recipe:
            return make_response({'message': 'Recipe not found'}, 404)
        for key, value in data.items():
            setattr(recipe, key, value)
        if data.get('name') != recipe.dish.name:
            setattr(recipe.dish, 'name', data.get('name'))
        if data.get('description') != recipe.dish.description:
            setattr(recipe.dish, 'description', data.get('description'))
        db.session.commit()
        return make_response({'message': 'updated dishes'},200)

class DeleteRecipe(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'message':'error deleting'},404)
        data = request.get_json()
        recipe_to_delete = Recipe.query.filter_by(id = data.get('recipe_id')).first()
        db.session.delete(recipe_to_delete)
        db.session.commit()
        return make_response({'message':'tile deleted successfully'},200)


class PublicAllDishes(Resource):
    def get(self):
        user_id = session.get('user_id')
        print("public feed user_id:",user_id)
        if not user_id:
            return make_response({'message': 'User not logged in'}, 401)

        user = User.query.filter_by(id=user_id).first()
        recipes = Recipe.query.filter((Recipe.user_id != user_id) & (Recipe.public == True)).all()

        if recipes:
            all_recipes=[]
            for recipe in recipes:
                comments = Comment.query.filter_by(recipe_id = recipe.id).all()
                comments_data = [
                    {
                        'username': comment.user.username,
                        'content': comment.content,
                        'date_created': comment.date_created
                    }
                    for comment in comments
                ]

                recipe_data = {
                'id': recipe.id,
                'username':recipe.user.username,
                'ingredients': recipe.ingredients,
                'instructions': recipe.instructions,
                'cooking_time': recipe.cooking_time,
                'servings': recipe.servings,
                'image_url': recipe.image_url,
                'date_created': recipe.date_created
                }
                recipe_data.update({
                    'dish_name': recipe.dish.name,
                    'description': recipe.dish.description,
                    'comments': comments_data
                })

                all_recipes.append(recipe_data)
            all_recipes.append({'username': user.username})

            return make_response(jsonify(all_recipes), 200)
        
        return make_response({'message':'No dishes added'},201)

class AddComment(Resource):
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'message':'User not logged in'},404)

        data = request.get_json()

        username = User.query.filter_by(id = user_id).first().username
        comment = Comment.query.filter((Comment.user_id == user_id) & (Comment.recipe_id == data.get('recipe_id'))).first()

        if comment:
            print("in if condition of comment")
            setattr(comment, 'content', data.get('comment'))
            setattr(comment, 'date_created', datetime.utcnow())
            db.session.commit()
        else:
            new_comment = Comment(
                user_id = user_id,
                recipe_id = data.get('recipe_id'),
                content = data.get('comment')
            )
            db.session.add(new_comment)
            db.session.commit()

        comments = Comment.query.filter_by(recipe_id=data.get('recipe_id')).all()
        comment_data = []
        for c in comments:
            comment = {
                'username': User.query.filter_by(id = c.user_id).first().username,
                'content' : c.content,
                'date_created': c.date_created
            }
            comment_data.append(comment)

        recipe = Recipe.query.filter_by(id=data.get('recipe_id')).first()
        recipe_data = {
            'id': recipe.id,
            'ingredients': recipe.ingredients,
            'instructions': recipe.instructions,
            'cooking_time': recipe.cooking_time,
            'servings': recipe.servings,
            'image_url': recipe.image_url,
            'date_created': recipe.date_created,
            'dish_name': recipe.dish.name,
            'description': recipe.dish.description,
            'comments': comment_data
            }

        return make_response(jsonify(recipe_data),200)

# Views go here!
api.add_resource(SignupResource, '/signup')
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(CheckLoginResource, '/checklogin')
api.add_resource(UserProfileResource, '/userprofile')
api.add_resource(AllDishesRecipes, '/user/dishes')
api.add_resource(PublicAllDishes, '/user/publicfeed')
api.add_resource(DeleteRecipe, '/user/delete_recipe')
api.add_resource(AddComment, '/user/dish/comments')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

# class DishDetailResource(Resource):
#     def get(self, dish_id):
#         dish = Dish.query.get(dish_id)
#         if not dish:
#             return make_response({'message': 'Dish not found'}, 404)

#         # Prepare dish data
#         dish_data = {
#             'id': dish.id,
#             'name': dish.name,
#             'description': dish.recipe.description,
#             'image_url': dish.recipe.image_url,
#             'date_created': dish.recipe.date_created,
#             'ingredients': [recipe.ingredients for recipe in dish.recipes],
#             'instructions': [recipe.instructions for recipe in dish.recipes],
#             'tags': dish.tag_names
#         }

#         # Get comments with usernames
#         comments_data = []
#         for recipe in dish.recipes:
#             for comment in recipe.comments:
#                 comment_data = {
#                     'username': comment.user.username,  # Access username through the user relationship
#                     'content': comment.content,
#                     'date': comment.date_created
#                 }
#                 comments_data.append(comment_data)

#         # Add comments to dish data
#         dish_data['comments'] = comments_data

#         return make_response(dish_data.to_dict(), 200)
