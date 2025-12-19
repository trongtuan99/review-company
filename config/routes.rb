Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  root to: redirect('/health')
  get 'health', to: 'health#show'

  # Load API routes if ATTACHED_API is set to non-zero, or in development/test by default
  if ENV['ATTACHED_API'].to_i.positive? || Rails.env.development? || Rails.env.test?
    extend ApiRoutes
  end
end
