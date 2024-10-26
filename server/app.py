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
        if session['user_id']:
            return make_response({'message': 'User is logged in'},200)

        else:
            return make_response({'message': 'User is not logged in'}, 401)

# Views go here!
api.add_resource(SignupResource, '/signup')
api.add_resource(LoginResource, '/login')
api.add_resource(LogoutResource, '/logout')
api.add_resource(CheckLoginResource, '/checklogin')



if __name__ == '__main__':
    app.run(port=5555, debug=True)

