$(document).on('turbolinks:load', function(){
  addEventListeners()
})

function addEventListeners(){
  $('#js-next').on('click', ()=>loadNext())
  $('#js-previous').on('click', ()=>loadPrevious())
  $('.js-user-link').on('click', (tag)=>loadIndexedRecipes(tag))
}

 // Event Handlers

function loadIndexedRecipes(tag){
  event.preventDefault()
  let userUrl = $(tag.target).attr('href')
  let userId = userUrl.match(/\d+/)[0] 
  let indexedRecipes = []
  $.get(userUrl, {user_id: userId} , null,'json')
    .done(function(response){
      response.forEach(function(element){
       return indexedRecipes.push(new Recipe(element))        
    })
    displayIndexedRecipes(indexedRecipes)    
  })
}

      // Index Page Functions
function displayIndexedRecipes(indexedRecipes){
  $('#recipe-cards').empty();
  // Recipe.all().forEach(recipe=> displayRecipe(recipe))
  let recipeTemplateString = $('#recipe-template').html()
  let recipeTemplate = Handlebars.compile(recipeTemplateString);
  let recipes = { recipes: indexedRecipes}
  $('#recipe-cards').html(recipeTemplate(recipes))
}

function displayRecipe(recipes){
  let recipeTemplate = $('#recipe-template').html()
  let recipeTemplateString = Handlebars.compile(recipeTemplate);
  $('#recipe-body').html(recipeTemplate(recipes))
}

      // Show Page Functions
function loadNext(){
  event.preventDefault()
  let userUrl = $('#js-user-link').attr('href')
  let currentId = $('#js-recipe-title').data()["recipeId"]
  $.get(`${userUrl}/${currentId}`,{ new_recipe_id: currentId+1 },null,'json')
    .done(loadRecipeText)  
}

function loadPrevious(){
  event.preventDefault()
  let userUrl = $('#js-user-link').attr('href')
  let currentId = $('#js-recipe-title').data()["recipeId"]
  $.get(`${userUrl}/${currentId}`,{ new_recipe_id: currentId+1 },null,'json')
    .done(loadRecipeText)  
}

        // Recipe Show Page Ajax

function loadRecipeText(res){
  $('#js-description').text(res["description"])
  $('#js-directions').text(res["directions"])
  $('#js-cook-time').text(res["time"])
  $('#js-recipe-title').text(res["title"])
  $('#js-recipe-title').data().recipeId = res["id"]
}



// Helper Functions

function getUserInfo(){
  let userUrl = $(tag.target).attr('href')
  let userId = userUrl.match(/\d+/)[0] 
  return {url: userUrl, id: userId}
}

// JS Model Objects 

function createRecipe(){
  let recipes = []
  return class Recipe{
    constructor(response){
      this.id = response.id 
      this.description = response.description
      this.time = response.time
      this.title = response.title
      this.user = User.findOrCreateUser(response.user)
      this.directions = response.directions
      this.recipeIngredients = []
      recipes.push(this);
      this.user.addRecipe(this);
      this.addRecipeIngredients(response.recipe_ingredients)
    }
    static all(){
      return recipes;
    }
    static userRecipes(userId){
      return Recipe.all().filter(function(recipe){
        return recipe.user.id === parseInt(userId)
      })
    }
    addRecipeIngredients(recipeIngredientsArray){
      recipeIngredientsArray.forEach(function(item){
        this.recipeIngredients.push(new RecipeIngredient(item))
      }, this)
    }
  }  
}
const Recipe = new createRecipe

function createRecipeIngredient(){
  return class RecipeIngredient{
    constructor(recipeIngredientObject){
      this.id = recipeIngredientObject.id
      this.recipeId = recipeIngredientObject.recipe_id
      this.ingredientId = recipeIngredientObject.ingredient_id
      this.quantity = recipeIngredientObject.quantity
      this.preparation = recipeIngredientObject.preparation

    }
  }
}
const RecipeIngredient = new createRecipeIngredient

// function createUser(){
//   let users = []
//   return class User{
//     constructor(responseUser){
//       this.id = responseUser.id
//       this.name = responseUser.name
//       this.recipes = []
//       users.push(this)
//     }
//     static recipes(){
//       return this.recipes
//     }
//     static all(){
//       return users
//     }
//     addRecipe(recipe){
//       this.recipes.push(recipe);
//     }
//     static findOrCreateUser(userObj){
//       return users.find(user=> user.id === userObj.id && user.name === userObj.name) || new User(userObj) 
//     }
//   }
// }

// const User = new createUser
