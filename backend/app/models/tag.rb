class Tag < ActiveRecord::Base

  attr_accessor :href, :reports_href

  VALID_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_COLOR_REGEX = /\A#([A-Fa-f0-9]{6})/i

  validates :name,
            presence: true,
            length: {
                maximum: 50,
                minimum: 2
            },
            format: { with: VALID_NAME_REGEX },
            uniqueness: true

  validates :color,
            length: {
                maximum: 7,
                minimum: 7
            },
            format: { with: VALID_COLOR_REGEX }

  has_and_belongs_to_many :reports

end
