class CreateKeys < ActiveRecord::Migration
  def change
    create_table :keys do |t|

      t.string "app_name", :limit => 100
      t.string "key_value", :limit => 100

      t.timestamps null: false

      t.belongs_to :user, index: true

    end
  end
end
