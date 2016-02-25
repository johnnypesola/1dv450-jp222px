class Report < ActiveRecord::Base

  VALID_NAME_REGEX = /\A[\w+\-.&_\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_GRADE_REGEX = /\A[\w+\-]+\z/i

  validates :route_name,
            presence: true,
            length: {
                maximum: 50,
                minimum: 2,
                too_short: "minst %{count} tecken måste anges",
                too_long: "max %{count} tecken får anges"
            },
            format: { with: VALID_NAME_REGEX, message: "Namnet innehåller ogiltiga tecken." }

  validates :route_grade,
            presence: true,
            length: {
                maximum: 5,
                minimum: 1,
                too_short: "minst %{count} tecken måste anges",
                too_long: "max %{count} tecken får anges"
            },
            format: { with: VALID_GRADE_REGEX, message: "Graderingen innehåller ogiltiga tecken."}

  belongs_to :clientuser
  belongs_to :location

  has_and_belongs_to_many :tags

end
