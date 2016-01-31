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

ActiveRecord::Schema.define(version: 20160130183334) do

  create_table "keys", force: :cascade do |t|
    t.string   "app_name",   limit: 100
    t.string   "key_value",  limit: 100
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.integer  "user_id",    limit: 4
  end

  add_index "keys", ["user_id"], name: "index_keys_on_user_id", using: :btree

  create_table "locations", force: :cascade do |t|
    t.integer  "latitude",   limit: 4
    t.integer  "longitude",  limit: 4
    t.string   "name",       limit: 50
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "reports", force: :cascade do |t|
    t.string   "route_name",  limit: 50
    t.string   "route_grade", limit: 5
    t.integer  "user_id",     limit: 4
    t.integer  "location_id", limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "reports", ["location_id"], name: "index_reports_on_location_id", using: :btree
  add_index "reports", ["user_id"], name: "index_reports_on_user_id", using: :btree

  create_table "reports_tags", id: false, force: :cascade do |t|
    t.integer "report_id", limit: 4
    t.integer "tag_id",    limit: 4
  end

  add_index "reports_tags", ["report_id", "tag_id"], name: "index_reports_tags_on_report_id_and_tag_id", using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name",       limit: 50
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "roles_users", id: false, force: :cascade do |t|
    t.integer "user_id", limit: 4
    t.integer "role_id", limit: 4
  end

  add_index "roles_users", ["user_id", "role_id"], name: "index_roles_users_on_user_id_and_role_id", using: :btree

  create_table "tags", force: :cascade do |t|
    t.string   "name",       limit: 50
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",            limit: 50,  null: false
    t.string   "password_digest", limit: 255, null: false
    t.string   "email",           limit: 50,  null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

end
