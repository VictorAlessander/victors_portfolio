class AssetsController < ApplicationController
  def index
    @assets = Asset.all
    render inertia: "Assets/index", props: {data: @assets.as_json}
  end

  def refresh_prices
    fetcher = PriceFetcherService.new
    result = fetcher.fetch_all_prices

    if result[:success] > 0
      render json: {
        success: true,
        message: "Successfully updated #{result[:success]} out of #{result[:total]} assets",
        errors: result[:errors]
      }
    else
      render json: {
        success: false,
        message: "Failed to update prices",
        errors: result[:errors]
      }, status: :unprocessable_entity
    end
  end
end
