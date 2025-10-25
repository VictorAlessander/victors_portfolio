class Asset < ApplicationRecord
  # Asset represents a unique holding in the portfolio
  # Aggregated view of all operations for a given symbol
  validates :symbol, presence: true, uniqueness: true
  validates :quantity, :cost, :market_value, numericality: { greater_than_or_equal_to: 0 }
end
