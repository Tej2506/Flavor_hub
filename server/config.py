#config.py
# Standard library imports

import os

# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData
from dotenv import load_dotenv
from flask_mail import Mail


# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.json.compact = False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True 

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'tejbasavanna90@gmail.com'  # Your Gmail address
app.config['MAIL_PASSWORD'] = 'xkbw swrw yhzn tzyi'  # Replace with the app password
app.config['MAIL_DEFAULT_SENDER'] = 'tejbasavanna90@gmail.com'

load_dotenv()
# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)


# Instantiate CORS
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app) 

mail = Mail(app)