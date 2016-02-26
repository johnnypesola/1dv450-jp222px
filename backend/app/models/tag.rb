class Tag < ActiveRecord::Base

  attr_accessor :href, :reports_href

  VALID_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i

  validates :name,
            presence: true,
            length: {
                maximum: 50,
                minimum: 2
            },
            format: { with: VALID_NAME_REGEX },
            uniqueness: true

  has_and_belongs_to_many :reports

end
