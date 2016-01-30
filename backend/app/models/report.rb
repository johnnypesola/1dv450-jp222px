class Report < ActiveRecord::Base

  validates :route_name, presence: true
  validates :route_grade, presence: true

  belongs_to :user
  belongs_to :location

  has_and_belongs_to_many :tags

end
