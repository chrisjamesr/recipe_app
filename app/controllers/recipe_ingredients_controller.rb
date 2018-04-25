class RecipeIngredientsController < ApplicationController
  before_action :current_user
  
  def create

  end

  def destroy
    recipe_ingredient = RecipeIngredient.find(params[:id])
    recipe = recipe_ingredient.recipe
    recipe_ingredient.destroy
    redirect_to edit_user_recipe_path(current_user, recipe)
  end


end
