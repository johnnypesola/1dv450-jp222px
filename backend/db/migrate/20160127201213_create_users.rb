class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|

      t.string "name", :limit => 50, :null=> false
      t.string "password_digest", :null=> false
      t.string "email", :limit => 50, :null=> false

      t.timestamps null: false
    end
  end
end
