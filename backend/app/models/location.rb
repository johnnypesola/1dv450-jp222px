class Location < ActiveRecord::Base

  validates :name, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true

  belongs_to :report

end
