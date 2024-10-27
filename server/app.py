#!/usr/bin/env python3
#app.py


# Remote library imports
from flask import Flask, request, jsonify, make_response, session
from flask_restful import Resource
from bs4 import BeautifulSoup
import requests
import os

# Local imports
from config import app, db, api, bcrypt, CORS  # bcrypt imported from config
from models import User, Car, Feature, Comparison  # Import your models

# Views go here!

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
        return make_response(user_data.to_dict(), 200)

class AllDishesRecipes(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
             return make_response({'message': 'User not logged in'}, 401)
        
        dishes = Recipe.query.filter_by(user_id = user_id).all()
        if dishes:
            all_dishes=[]
            for dish in dishes:
                comments_data = []
                for comment in dish.recipe.comments:
                    comment_data = {
                        'username': comment.user.username,  # Access username through the user relationship
                        'content': comment.content,
                        'date': comment.date_created
                    }
                    comments_data.append(comment_data)
                dish.to_dict()['comments'] = comments_data 

                all_dishes.append({**dish.to_dict(),'name':dish.dish_name})
                
            
            return make_response(all_dishes,200)
        
        return make_response({'message':'No dishes added'},201)


# Views go here!
api.add_resource(SignupResource, '/signup')
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(CheckLoginResource, '/checklogin')
# api.add_resource(DishDetailResource, '/dishdetail/<int:dish_id>')
api.add_resource(UserProfileResource, '/userprofile')
api.add_resource(AllDishesRecipes, '/user/dishes')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

class DishDetailResource(Resource):
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
