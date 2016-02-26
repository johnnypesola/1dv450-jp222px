class CreateLocations < ActiveRecord::Migration
  def change
    create_table :locations do |t|

      t.float :latitude
      t.float :longitude

      t.string "name", :limit => 50

      #t.belongs_to :report, index: true

      t.timestamps null: false
    end
  end
end
