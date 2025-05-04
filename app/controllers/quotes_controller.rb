class QuotesController < ApplicationController
  include YahooFinance

  def initialize
    @provider = YahooFinance::Query.new
  end

  def search
    @result = @provider.quotes("RECV3.SA")

    @result
  end
end
