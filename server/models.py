from sqlalchemy import Table, Column, Integer, ForeignKey, String
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt
from datetime import datetime


# Models go here!
dish_tags = Table(
    'dish_tags',
    db.Model.metadata,
    Column('dish_id', Integer, ForeignKey('dishes.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)


# User model
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    # Relationships
    recipes = db.relationship("Recipe", backref="user", lazy=True)
    comments = db.relationship("Comment", backref="user", lazy=True)
    ratings = db.relationship("Rating", backref="user", lazy=True)

    # Association Proxies
    dishes = association_proxy("recipes", "dish_name")       
    comment_texts = association_proxy("comments", "content") 
    rating_scores = association_proxy("ratings", "score") 

    def __repr__(self):
        return f"<User {self.username}>"
    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
        self._password_hash = password_hash

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Dish(db.Model, SerializerMixin):
    __tablename__ = 'dishes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)

    # Relationships
    recipes = db.relationship("Recipe", backref="dish", lazy=True)
    tags = db.relationship("Tag", secondary=dish_tags, backref="dishes")
    
    # Association Proxy
    tag_names = association_proxy("tags", "name")  # Access tag names directly

    def __repr__(self):
        return f"<Dish {self.name}>"

class Recipe(db.Model, SerializerMixin):
    __tablename__ = 'recipes'

    id = db.Column(db.Integer, primary_key=True)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    cooking_time = db.Column(db.Integer)
    servings = db.Column(db.Integer)
    image_url = db.Column(db.String())
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    public = db.Column(db.Boolean, default=True)  # Privacy feature

    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    dish_id = db.Column(db.Integer, db.ForeignKey('dishes.id'), nullable=False)

    # Relationships
    comments = db.relationship("Comment", backref="recipe", lazy=True, cascade="all, delete-orphan")
    ratings = db.relationship("Rating", backref="recipe", lazy=True, cascade = "all, delete-orphan")
    

    def __repr__(self):
        return f"<Recipe by User {self.user_id} for Dish {self.dish_id}>"


class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    def __repr__(self):
        return f"<Comment by User {self.user_id} on Recipe {self.recipe_id}>"


class Rating(db.Model, SerializerMixin):
    __tablename__ = 'ratings'

    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)

    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey('recipes.id'), nullable=False)

    def __repr__(self):
        return f"<Rating {self.score} by User {self.user_id} on Recipe {self.recipe_id}>"


class Tag(db.Model, SerializerMixin):
    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)

   

    def __repr__(self):
        return f"<Tag {self.name}>"



