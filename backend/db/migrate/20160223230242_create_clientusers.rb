class CreateClientusers < ActiveRecord::Migration
  def change
    create_table :clientusers do |t|
      t.string :provider
      t.string :uid
      t.string :name
      t.string :token
      t.string :auth_token
      t.datetime :token_expires

      t.timestamps null: false
    end
  end
end
