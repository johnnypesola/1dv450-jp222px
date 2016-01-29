# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160127232208) do

  create_table "locations", force: :cascade do |t|
    t.integer  "latitude",   limit: 4
    t.integer  "longitude",  limit: 4
    t.string   "name",       limit: 50
    t.integer  "report_id",  limit: 4
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_index "locations", ["report_id"], name: "index_locations_on_report_id", using: :btree

  create_table "reports", force: :cascade do |t|
    t.string   "route_name",  limit: 50
    t.string   "route_grade", limit: 5
    t.integer  "tag_id",      limit: 4
    t.integer  "user_id",     limit: 4
    t.integer  "location_id", limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "reports", ["location_id"], name: "index_reports_on_location_id", using: :btree
  add_index "reports", ["tag_id"], name: "index_reports_on_tag_id", using: :btree
  add_index "reports", ["user_id"], name: "index_reports_on_user_id", using: :btree

  create_table "reports_tags", id: false, force: :cascade do |t|
    t.integer "report_id", limit: 4
    t.integer "tag_id",    limit: 4
  end

  add_index "reports_tags", ["report_id", "tag_id"], name: "index_reports_tags_on_report_id_and_tag_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name",       limit: 50
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",       limit: 50
    t.integer  "report_id",  limit: 4
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_index "users", ["report_id"], name: "index_users_on_report_id", using: :btree

end
