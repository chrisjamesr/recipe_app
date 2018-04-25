class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  helper_method :current_user



  def current_user
    @user = User.find_by(:id => session[:user_id]) unless nil
  end

  def logged_in?
    !!session[:user_id]
  end

  def set_session
    session[:user_id] = @user.id if @user
  end

  def has_permission?
    user = User.find_by(:id => params[:user_id])
    recipe = Recipe.find_by(:id => params[:id])
    if current_user != user && !current_user.recipes.include?(recipe)
      flash[:notice] = "You are not authorized to edit this record!"
      redirect_to user_recipe_path(user, recipe)
    end
  end

end  # End of Class

