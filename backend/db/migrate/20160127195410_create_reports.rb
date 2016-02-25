class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|

      t.string "route_name", :limit => 50
      t.string "route_grade", :limit => 5

      t.belongs_to :clientuser, index: true
      t.belongs_to :location, index: true

      t.timestamps null: false
    end
  end
end
