class Role < ActiveRecord::Base

  VALID_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i

  validates :name, presence: true, length: { maximum: 50, minimum: 2}, format: { with: VALID_NAME_REGEX }

  has_and_belongs_to_many :users

end
