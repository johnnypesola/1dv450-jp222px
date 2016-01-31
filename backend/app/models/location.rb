class Location < ActiveRecord::Base

  VALID_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i

  validates :name,
            presence: true,
            length: {
                maximum: 50,
                minimum: 2,
                too_short: "minst %{count} tecken måste anges",
                too_long: "max %{count} tecken får anges"
            },
            format: { with: VALID_NAME_REGEX }

  validates :latitude,
            presence: true,
            numericality: {
                greater_than_or_equal_to: -90,
                less_than_or_equal_to: 90,
                message: "Latitud måste vara inom gränsvärdena -90 till 90"
            }

  validates :longitude,
            presence: true,
            numericality: {
                greater_than_or_equal_to: -180,
                less_than_or_equal_to: 180,
                message: "Longitud måste vara inom gränsvärdena -180 till 180"
            }

  has_many :report

end
