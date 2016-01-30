class User < ActiveRecord::Base

  validates :name, presence: true
  validates :username, presence: true
  validates :password, presence: true
  validates :email, presence: true

  has_many :report
  has_many :key

  has_and_belongs_to_many :roles

end
