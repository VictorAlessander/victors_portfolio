class Income < ApplicationRecord
  # Income represents dividend/JCP/bonus payments received
  validates :symbol, :income_type, :amount, :payment_date, presence: true
  validates :amount, numericality: { greater_than: 0 }
  validates :income_type, inclusion: { in: %w[dividend jcp bonus subscription_rights] }
  validates :quantity, numericality: { greater_than: 0 }, allow_nil: true
  validates :tax_withheld, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true

  scope :recent, -> { order(payment_date: :desc) }
  scope :by_symbol, ->(symbol) { where(symbol: symbol) }
  scope :by_type, ->(type) { where(income_type: type) }
  scope :this_year, -> { where('payment_date >= ?', Date.current.beginning_of_year) }
  scope :this_month, -> { where('payment_date >= ?', Date.current.beginning_of_month) }
end
