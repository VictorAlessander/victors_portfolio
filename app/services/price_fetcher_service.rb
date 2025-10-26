require "net/http"
require "json"

class PriceFetcherService
  BASE_URL = "http://localhost:3001/quotes" # wallet_quotes fastify project

  def initialize
    @errors = []
  end

  def fetch_all_prices
    assets = Asset.all
    success_count = 0

    assets.each do |asset|
      begin
        price = fetch_price(asset.symbol)

        if price
          asset.update!(
            current_price: price,
            market_value: price * asset.quantity,
            last_price_update: Time.current
          )
          success_count += 1
        else
          @errors << "Failed to fetch price for #{asset.symbol}"
        end

        # Sleep to avoid rate limiting
        sleep(1)
      rescue => e
        @errors << "Error fetching #{asset.symbol}: #{e.message}"
        Rails.logger.error("PriceFetcherService error for #{asset.symbol}: #{e.message}")
      end
    end

    {
      success: success_count,
      total: assets.count,
      errors: @errors
    }
  end

  def fetch_price(symbol)
    # Use local Fastify API endpoint
    uri = URI("#{BASE_URL}/#{symbol}.SA")
    Rails.logger.info("Fetching price for #{symbol} from #{uri}")

    # Create HTTP request
    http = Net::HTTP.new(uri.host, uri.port)
    http.open_timeout = 10
    http.read_timeout = 10

    request = Net::HTTP::Get.new(uri)
    request["Accept"] = "application/json"
    request["User-Agent"] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

    response = http.request(request)
    Rails.logger.info("Response for #{symbol}: #{response.code}")
    Rails.logger.info("Response body for #{symbol}: #{response.body[0..500]}")

    unless response.is_a?(Net::HTTPSuccess)
      Rails.logger.error("HTTP error for #{symbol}: #{response.code} #{response.body[0..200]}")
      return nil
    end

    if response.body.nil? || response.body.empty?
      Rails.logger.error("Empty response body for #{symbol}")
      return nil
    end

    data = JSON.parse(response.body)

    # Try different possible field names for the price
    price = data["price"] || data["regularMarketPrice"] || data["currentPrice"] || data.dig("results", 0, "regularMarketPrice")

    if price.nil?
      Rails.logger.error("Could not find price field for #{symbol}. Response: #{data.inspect}")
      return nil
    end

    Rails.logger.info("Successfully fetched price for #{symbol}: #{price}")
    price.to_f
  rescue => e
    Rails.logger.error("Error fetching price for #{symbol}: #{e.message}")
    nil
  end

  def errors
    @errors
  end
end
