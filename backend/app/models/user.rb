class User < ActiveRecord::Base

  has_secure_password

  VALID_NAME_REGEX = /\A[\w+\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :name,
            presence: true,
            length: {
                maximum: 50,
                minimum: 2
            },
            format: { with: VALID_NAME_REGEX  }

  validates :email,
            presence: true,
            length: { maximum: 50, minimum: 3 },
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: true

  has_many :key

  has_and_belongs_to_many :roles


  ### Methods

  # Check if user has role
  def has_role?(*role_names)
    self.roles.where(:name => role_names).present?
  end

  # Return true if user is admin
  def is_admin?
    self.has_role?("Admin")
  end

end
