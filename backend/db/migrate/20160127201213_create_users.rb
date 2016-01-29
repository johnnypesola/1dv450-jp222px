class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|

      t.string "name", :limit => 50

      t.belongs_to :report, index: true

      t.timestamps null: false
    end
  end
end
