class Location < ActiveRecord::Base

  validates :name, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true

  has_many :report

end
