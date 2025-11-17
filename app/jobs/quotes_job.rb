class QuotesJob < ApplicationJob
  def perform
    fetcher = PriceFetcherService.new
    fetcher.fetch_all_prices
  end
end
