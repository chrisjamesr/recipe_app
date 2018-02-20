Rails.application.routes.draw do
  root 'recipes#index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/auth/:provider/callback', to: 'sessions#create'
  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete '/logout' => 'sessions#destroy'
  
  

  resources :users do
    resources :recipes 
  end
  resources :ingredients, :categories, :recipes, :only => [:index] 


  delete '/recipes/:id/recipe_ingredients/:id', :to => 'recipe_ingredients#destroy', :as => :remove_ingredient

  get '/recipes/newest' => 'recipes#newest'
  get '/recipes/oldest' => 'recipes#oldest'
  get '/recipes/longest' => 'recipes#longest'
  get '/recipes/shortest' => 'recipes#shortest'  

  # root
end
