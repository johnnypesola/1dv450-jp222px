class Tag < ActiveRecord::Base

  VALID_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i

  validates :name,
            presence: true,
            length: {
                maximum: 50,
                minimum: 2,
                too_short: "minst %{count} tecken måste anges",
                too_long: "max %{count} tecken får anges"
            },
            format: { with: VALID_NAME_REGEX, message: "Namnet innehåller ogiltiga tecken." }

  has_and_belongs_to_many :reports

end
