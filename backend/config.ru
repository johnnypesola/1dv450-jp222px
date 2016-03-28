# This file is used by Rack-based servers to start the application.

# Rack Cors
use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: :any
  end
end

require ::File.expand_path('../config/environment', __FILE__)
run Rails.application
