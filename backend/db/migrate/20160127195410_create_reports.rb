class CreateReports < ActiveRecord::Migration
  def change
    create_table :reports do |t|

      t.string "route_name", :limit => 50
      t.string "route_grade", :limit => 5

      t.references :tag, index: true
      t.references :user, index: true
      t.references :location, index: true

      t.timestamps null: false
    end
  end
end
