class User < ActiveRecord::Base

  VALID_NAME_REGEX = /\A[\w+\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  VALID_USERNAME_REGEX = /\A[\w+\-.]+\z/i
  VALID_PASSWORD_REGEX = /\A[\w+\-.%&,åäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ!§*\=\#\@]+\z/i

  validates :name, presence: true, length: { maximum: 50, minimum: 2 }
  validates :username, presence: true, length: { maximum: 50, minimum: 3 }, format: { with: VALID_USERNAME_REGEX }
  validates :password, presence: true, length: { maximum: 50, minimum: 8 }, format: { with: VALID_PASSWORD_REGEX }
  validates :email, presence: true, length: { maximum: 50, minimum: 3 }, format: { with: VALID_EMAIL_REGEX }

  has_many :report
  has_many :key

  has_and_belongs_to_many :roles

end
