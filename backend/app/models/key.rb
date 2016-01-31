class Key < ActiveRecord::Base

  VALID_APP_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_APP_KEY_REGEX = /\A[\w+]+\z/i

  validates :app_name,
            presence: true,
            length: {
                maximum: 100,
                minimum: 2
            },
            format: { with: VALID_APP_NAME_REGEX }

  validates :key_value,
            presence: true,
            length: {
                maximum: 100,
                minimum: 2
            },
            format: { with: VALID_APP_KEY_REGEX },
            uniqueness: true

  belongs_to :user

end
