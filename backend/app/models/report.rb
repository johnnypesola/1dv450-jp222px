class Report < ActiveRecord::Base

  attr_accessor :href

  VALID_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_GRADE_REGEX = /\A[\w+\-]+\z/i

  validates :route_name,
            presence: true,
            length: {
                maximum: 50,
                minimum: 2
            },
            format: { with: VALID_NAME_REGEX }

  validates :route_grade,
            presence: true,
            length: {
                maximum: 5,
                minimum: 1
            },
            format: { with: VALID_GRADE_REGEX }

  belongs_to :clientuser
  belongs_to :location

  has_and_belongs_to_many :tags

end
