class User < ActiveRecord::Base

  has_secure_password

  VALID_NAME_REGEX = /\A[\w+\såäöÅÄÖéèëÉÈËáàÁÀúùüÚÙÜóòÒÓ]+\z/i
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :name,
            :presence => { :message => "Var god ange ett namn" },
            length: {
                maximum: 50,
                minimum: 2,
                too_short: "minst %{count} tecken måste anges",
                too_long: "max %{count} tecken får anges"
            },
            format: { with: VALID_NAME_REGEX, message: "Namnet innehåller ogiltiga tecken."  }

  validates :password_digest,
            presence: true

  validates :email,
            :presence => { :message => "Var god ange en e-postadress"},
            length: { maximum: 50, minimum: 3 },
            format: { with: VALID_EMAIL_REGEX, message: "Var god ange en giltig e-postadress" },
            uniqueness: { message: "e-postadressen finns redan registrerad." }

  has_many :report
  has_many :key

  has_and_belongs_to_many :roles

end
