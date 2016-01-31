class Key < ActiveRecord::Base

  VALID_APP_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_APP_KEY_REGEX = /\A[\w+]+\z/i

  validates :app_name,
            presence: true,
            length: {
                maximum: 100,
                minimum: 2,
                too_short: "minst %{count} tecken måste anges",
                too_long: "max %{count} tecken får anges"
            },
            format: { with: VALID_APP_NAME_REGEX, message: "Namnet innehåller ogiltiga tecken."  }

  validates :key_value,
            presence: true,
            length: {
                maximum: 100,
                minimum: 2,
                too_short: "minst %{count} tecken måste anges",
                too_long: "max %{count} tecken får anges"
            },
            format: {
                with: VALID_APP_KEY_REGEX, message: "Nyckeln innehåller ogiltiga tecken."  }

  belongs_to :user

end
