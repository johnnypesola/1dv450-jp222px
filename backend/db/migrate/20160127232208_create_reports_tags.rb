class CreateReportsTags < ActiveRecord::Migration
  def change
    create_table :reports_tags, :id => false do |t|
      t.integer "report_id"
      t.integer "tag_id"
    end

    add_index :reports_tags, ["report_id", "tag_id"]

  end
end
