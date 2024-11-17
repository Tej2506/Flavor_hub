"""Initial migration

Revision ID: e37d1913f219
Revises: 
Create Date: 2024-11-11 15:40:21.909749

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e37d1913f219'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('dishes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('tags',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('dish_tags',
    sa.Column('dish_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['dish_id'], ['dishes.id'], name=op.f('fk_dish_tags_dish_id_dishes')),
    sa.ForeignKeyConstraint(['tag_id'], ['tags.id'], name=op.f('fk_dish_tags_tag_id_tags'))
    )
    op.create_table('recipes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('ingredients', sa.Text(), nullable=False),
    sa.Column('instructions', sa.Text(), nullable=False),
    sa.Column('cooking_time', sa.Integer(), nullable=True),
    sa.Column('servings', sa.Integer(), nullable=True),
    sa.Column('image_url', sa.String(), nullable=True),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('public', sa.Boolean(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('dish_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['dish_id'], ['dishes.id'], name=op.f('fk_recipes_dish_id_dishes')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_recipes_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('date_created', sa.DateTime(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], name=op.f('fk_comments_recipe_id_recipes')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_comments_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ratings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('score', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('recipe_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['recipe_id'], ['recipes.id'], name=op.f('fk_ratings_recipe_id_recipes')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_ratings_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('ratings')
    op.drop_table('comments')
    op.drop_table('recipes')
    op.drop_table('dish_tags')
    op.drop_table('users')
    op.drop_table('tags')
    op.drop_table('dishes')
    # ### end Alembic commands ###