require 'jwt'

class AuthToken
  SECRET_KEY = ENV['SECRET_KEY_BASE'] || Rails.application.credentials.secret_key_base || Rails.application.secrets.secret_key_base

  def self.access_token(payload)
    JWT.encode(payload, SECRET_KEY)
  end

  def self.valid_payload(payload)
    true
  end

  def self.decode_token(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError
    nil
  end
end
