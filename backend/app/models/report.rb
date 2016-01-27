class Report < ActiveRecord::Base

  validates :route_name, presence: true
  validates :route_grade, presence: true

  has_one :user
  has_one :location
  has_many :tag

end
