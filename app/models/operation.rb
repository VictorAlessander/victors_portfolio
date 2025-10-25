class Operation < ApplicationRecord
  # Operation represents a single buy or sell transaction
  validates :op_type, presence: true, inclusion: { in: %w[buy sell] }
  validates :symbol, :quantity, :cost, :currency, presence: true
  validates :quantity, numericality: { greater_than: 0 }

  scope :buys, -> { where(op_type: 'buy') }
  scope :sells, -> { where(op_type: 'sell') }
  scope :by_symbol, ->(symbol) { where(symbol: symbol) }
  scope :recent, -> { order(created_at: :desc) }
end
