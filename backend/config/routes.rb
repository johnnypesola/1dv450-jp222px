Rails.application.routes.draw do
  get 'errors/not_found'
  get 'errors/unacceptable'
  get 'errors/internal_error'

  # Custom error pages
  get "/404" => "errors#not_found"
  get "/422" => "errors#unacceptable"
  get "/500" => "errors#internal_error"

  # REST API session routes
  get "/auth/:provider/callback" => "api/sessions#create"
  get "/signout" => "api/sessions#destroy", :as => :signout
  get "/authenticate" => "api/sessions#authenticate"
  get "/is_logged_in" => "api/sessions#is_logged_in"
  get "/unauthorized" => "api/sessions#unauthorized", :as => :unauthorized
  get "/unauthorized_key" => "api/sessions#unauthorized_key", :as => :unauthorized_key

  # Get locations near gps coordinates
  get '/api/v1/locations/near' => 'api/v1/locations#near', :as => :locations_near

  # Search for locations
  get '/api/v1/locations/search' => 'api/v1/locations#search', :as => :locations_search

  # Search for reports
  get '/api/v1/reports/search' => 'api/v1/reports#search', :as => :reports_search

  # Get reports with specific tag
  get '/api/v1/tags/:id/reports' => 'api/v1/tags#reports', :as => :tag_reports

  # Add and remove tags for report
  post '/api/v1/reports/:report_id/tag/:tag_id' => 'api/v1/reports#add_tag', :as => :report_add_tag
  delete '/api/v1/reports/:report_id/tag/:tag_id' => 'api/v1/reports#remove_tag', :as => :report_remove_tag

  namespace :api, defaults: {format: 'json'} do

    namespace :v1 do

      resources :locations
      resources :tags
      resources :reports

    end

  end


  # API-key App specific routes
  root 'users#login'
  resources :users
  resources :keys, :except => [:index]

  get 'userkeys' => 'keys#show', as: :userkeys
  get 'login' => 'users#login', as: :login
  post 'dologin' => 'users#dologin', as: :dologin
  get 'dologout' => 'users#dologout', as: :dologout

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
