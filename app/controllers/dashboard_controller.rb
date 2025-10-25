class DashboardController < ApplicationController
  def index
    analytics = PortfolioAnalyticsService.new
    portfolio_data = analytics.portfolio_summary

    render inertia: 'Dashboard/index', props: {
      portfolio: portfolio_data
    }
  end
end
