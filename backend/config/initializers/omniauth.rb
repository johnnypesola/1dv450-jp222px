Rails.application.config.middleware.use OmniAuth::Builder do
  provider :github, '5a3c1f2a7ca8c59fd87d', 'c44f5a55313d113e8a43af6aa9a1e2036e4cd7cc'
end