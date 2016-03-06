Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, '5a3c1f2a7ca8c59fd87d', 'ed40d74bd46b2ee6736d125b8fd22161817fbbfe'
end