# Clear existing data
Operation.destroy_all
Asset.destroy_all
Income.destroy_all

# Portfolio data from assets.csv (cost = preço médio * quantidade)
portfolio_data = [
  { symbol: "BBAS3", quantity: 480, avg_price: 22.28, cost: 10694.40, sector: "Finance", category: "Stock" },
  { symbol: "BBDC3", quantity: 3226, avg_price: 14.35, cost: 46293.10, sector: "Finance", category: "Stock" },
  { symbol: "CMIG4", quantity: 2590, avg_price: 8.75, cost: 22662.50, sector: "Utilities", category: "Stock" },
  { symbol: "CSAN3", quantity: 6882, avg_price: 11.72, cost: 80657.04, sector: "Consumer Goods", category: "Stock" },
  { symbol: "DEXP3", quantity: 5300, avg_price: 10.41, cost: 55173.00, sector: "Consumer Services", category: "Stock" },
  { symbol: "EALT4", quantity: 2400, avg_price: 13.00, cost: 31200.00, sector: "Basic Materials", category: "Stock" },
  { symbol: "JALL3", quantity: 12400, avg_price: 5.19, cost: 64356.00, sector: "Consumer Services", category: "Stock" },
  { symbol: "KLBN11", quantity: 1550, avg_price: 18.51, cost: 28690.50, sector: "Basic Materials", category: "Stock" },
  { symbol: "KLBN4", quantity: 7480, avg_price: 3.63, cost: 27152.40, sector: "Basic Materials", category: "Stock" },
  { symbol: "ODPV3", quantity: 981, avg_price: 12.83, cost: 12586.23, sector: "Healthcare", category: "Stock" },
  { symbol: "RECV3", quantity: 3622, avg_price: 16.86, cost: 61066.92, sector: "Finance", category: "Stock" },
  { symbol: "SIMH3", quantity: 7300, avg_price: 5.47, cost: 39931.00, sector: "Basic Materials", category: "Stock" },
  { symbol: "TTEN3", quantity: 260, avg_price: 14.04, cost: 3650.40, sector: "Utilities", category: "Stock" },
  { symbol: "UNIP6", quantity: 825, avg_price: 60.39, cost: 49821.75, sector: "Utilities", category: "Stock" }
]

# Create operations and assets from portfolio data
portfolio_data.each do |data|
  # Create buy operation
  Operation.create!(
    symbol: data[:symbol],
    quantity: data[:quantity],
    cost: data[:cost],
    op_type: "buy",
    currency: "BRL"
  )

  # Create asset (market_value = cost for now, can be updated manually)
  Asset.create!(
    symbol: data[:symbol],
    quantity: data[:quantity],
    cost: data[:cost],
    market_value: data[:cost], # Set to cost initially
    sector: data[:sector],
    category: data[:category]
  )
end

# Create sample income records based on actual portfolio
Income.create!(
  symbol: "BBDC3",
  income_type: "jcp",
  amount: 450.00,
  payment_date: Date.new(2025, 8, 20),
  quantity: 3226,
  tax_withheld: 67.50,
  notes: "JCP payment with 15% tax withheld"
)

Income.create!(
  symbol: "RECV3",
  income_type: "dividend",
  amount: 285.50,
  payment_date: Date.new(2025, 9, 15),
  quantity: 3622,
  notes: "Quarterly dividend"
)

Income.create!(
  symbol: "BBAS3",
  income_type: "dividend",
  amount: 125.00,
  payment_date: Date.new(2025, 7, 10),
  quantity: 480
)

Income.create!(
  symbol: "CMIG4",
  income_type: "dividend",
  amount: 320.00,
  payment_date: Date.new(2025, 6, 5),
  quantity: 2590,
  notes: "Semi-annual dividend"
)

Income.create!(
  symbol: "KLBN11",
  income_type: "dividend",
  amount: 180.00,
  payment_date: Date.new(2025, 5, 18),
  quantity: 1550
)

puts "✅ Seed data created successfully!"
puts "   - #{Operation.count} operations"
puts "   - #{Asset.count} assets"
puts "   - #{Income.count} income records"
