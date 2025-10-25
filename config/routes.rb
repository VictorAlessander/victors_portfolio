Rails.application.routes.draw do
  get 'inertia-example', to: 'inertia_example#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
  
  root "dashboard#index"
  get "assets", to: "assets#index"

  # Operations/Transactions routes
  get "transactions", to: "operations#index"
  post "operations", to: "operations#create"
  patch "operations/:id", to: "operations#update"
  delete "operations/:id", to: "operations#destroy"

  # Income routes
  get "income", to: "incomes#index"
  post "incomes", to: "incomes#create"
  patch "incomes/:id", to: "incomes#update"
  delete "incomes/:id", to: "incomes#destroy"
end
