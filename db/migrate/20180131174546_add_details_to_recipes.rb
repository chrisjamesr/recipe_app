class AddDetailsToRecipes < ActiveRecord::Migration[5.1]
  def change
    add_column :recipes, :description, :string
  end
end
