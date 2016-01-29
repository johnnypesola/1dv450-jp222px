class Report < ActiveRecord::Base

  validates :route_name, presence: true
  validates :route_grade, presence: true

  #has_one :user
  #has_one :location
  belongs_to :user
  belongs_to :location
  belongs_to :tag

end
