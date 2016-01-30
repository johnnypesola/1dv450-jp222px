class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|

      t.string "name", :limit => 50
      t.string "username", :limit => 50
      t.string "password", :limit => 50
      t.string "email", :limit => 50

      t.timestamps null: false
    end
  end
end
