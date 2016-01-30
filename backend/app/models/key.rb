class Key < ActiveRecord::Base

  validates :app_name, presence: true
  validates :key_value, presence: true

  belongs_to :user

end
