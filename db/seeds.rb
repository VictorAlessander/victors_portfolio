# Clear existing data
# Operation.destroy_all
# Asset.destroy_all
# Income.destroy_all
#
## Portfolio data from assets.csv (cost = preço médio * quantidade)
# portfolio_data = [
#  { symbol: "UNIP6", quantity: 825, avg_price: 60.39, cost: 49824.45, market_value: 51455.25, sector: "Utilities", category: "Stock" },
#  { symbol: "CSAN3", quantity: 7946, avg_price: 11.72, cost: 93119.12, market_value: 46960.86, sector: "Consumer Goods", category: "Stock" },
#  { symbol: "SIMH3", quantity: 7000, avg_price: 5.47, cost: 38290.00, market_value: 46200.00, sector: "Basic Materials", category: "Stock" },
#  { symbol: "BBDC3", quantity: 2426, avg_price: 14.35, cost: 34813.87, market_value: 44856.74, sector: "Finance", category: "Stock" },
#  { symbol: "DEXP3", quantity: 5962, avg_price: 9.25, cost: 55148.50, market_value: 44238.04, sector: "Consumer Services", category: "Stock" },
#  { symbol: "RECV3", quantity: 3622, avg_price: 16.86, cost: 61066.92, market_value: 41544.34, sector: "Finance", category: "Stock" },
#  { symbol: "JALL3", quantity: 12500, avg_price: 5.17, cost: 64625.00, market_value: 39250.00, sector: "Consumer Services", category: "Stock" },
#  { symbol: "EALT4", quantity: 2400, avg_price: 13.00, cost: 31200.00, market_value: 33960.00, sector: "Basic Materials", category: "Stock" },
#  { symbol: "KLBN11", quantity: 1565, avg_price: 18.33, cost: 28686.45, market_value: 30282.75, sector: "Basic Materials", category: "Stock" },
#  { symbol: "CMIG4", quantity: 2590, avg_price: 8.75, cost: 22651.83, market_value: 29603.70, sector: "Utilities", category: "Stock" },
#  { symbol: "KLBN4", quantity: 7556, avg_price: 3.63, cost: 27428.28, market_value: 29241.72, sector: "Basic Materials", category: "Stock" },
#  { symbol: "ODPV3", quantity: 2581, avg_price: 12.02, cost: 31023.62, market_value: 29191.11, sector: "Healthcare", category: "Stock" },
#  { symbol: "TTEN3", quantity: 1460, avg_price: 15.79, cost: 23053.40, market_value: 23520.60, sector: "Utilities", category: "Stock" },
#  { symbol: "BBAS3", quantity: 480, avg_price: 22.28, cost: 10694.40, market_value: 12307.20, sector: "Finance", category: "Stock" },
#  { symbol: "RAPT4", quantity: 1300, avg_price: 6.15, cost: 7995.00, market_value: 8788.00, sector: "Industrials", category: "Stock" }
# ]
#
## Create operations and assets from portfolio data
# portfolio_data.each do |data|
#  # Create buy operation
#  Operation.create!(
#    symbol: data[:symbol],
#    quantity: data[:quantity],
#    cost: data[:cost],
#    op_type: "buy",
#    currency: "BRL"
#  )
#
#  # Create asset (market_value = cost for now, can be updated manually)
#  Asset.create!(
#    symbol: data[:symbol],
#    quantity: data[:quantity],
#    cost: data[:cost],
#    market_value: data[:cost], # Set to cost initially
#    sector: data[:sector],
#    category: data[:category]
#  )
# end
#
## Create sample income records based on actual portfolio
# Income.create!(
#  symbol: "BBDC3",
#  income_type: "jcp",
#  amount: 450.00,
#  payment_date: Date.new(2025, 8, 20),
#  quantity: 3226,
#  tax_withheld: 67.50,
#  notes: "JCP payment with 15% tax withheld"
# )
#
# Income.create!(
#  symbol: "RECV3",
#  income_type: "dividend",
#  amount: 285.50,
#  payment_date: Date.new(2025, 9, 15),
#  quantity: 3622,
#  notes: "Quarterly dividend"
# )
#
# Income.create!(
#  symbol: "BBAS3",
#  income_type: "dividend",
#  amount: 125.00,
#  payment_date: Date.new(2025, 7, 10),
#  quantity: 480
# )
#
# Income.create!(
#  symbol: "CMIG4",
#  income_type: "dividend",
#  amount: 320.00,
#  payment_date: Date.new(2025, 6, 5),
#  quantity: 2590,
#  notes: "Semi-annual dividend"
# )
#
# Income.create!(
#  symbol: "KLBN11",
#  income_type: "dividend",
#  amount: 180.00,
#  payment_date: Date.new(2025, 5, 18),
#  quantity: 1550
# )
#
# puts "✅ Seed data created successfully!"
# puts "   - #{Operation.count} operations"
# puts "   - #{Asset.count} assets"
# puts "   - #{Income.count} income records"
