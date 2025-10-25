class PortfolioAnalyticsService
  def initialize
    @assets = Asset.all
    @operations = Operation.all
  end

  def portfolio_summary
    {
      total_invested: total_invested,
      total_market_value: total_market_value,
      total_profit_loss: total_profit_loss,
      total_profit_loss_percentage: total_profit_loss_percentage,
      number_of_assets: @assets.count,
      number_of_operations: @operations.count,
      allocation_by_symbol: allocation_by_symbol,
      allocation_by_sector: allocation_by_sector,
      allocation_by_category: allocation_by_category,
      recent_operations: recent_operations,
      top_performers: top_performers,
      portfolio_distribution: portfolio_distribution
    }
  end

  private

  def total_invested
    @assets.sum(:cost).to_f.round(2)
  end

  def total_market_value
    @assets.sum(:market_value).to_f.round(2)
  end

  def total_profit_loss
    (total_market_value - total_invested).round(2)
  end

  def total_profit_loss_percentage
    return 0 if total_invested.zero?
    ((total_profit_loss / total_invested) * 100).round(2)
  end

  def allocation_by_symbol
    total = total_market_value
    return [] if total.zero?

    @assets.map do |asset|
      percentage = ((asset.market_value.to_f / total) * 100).round(2)
      {
        symbol: asset.symbol,
        value: asset.market_value.to_f.round(2),
        percentage: percentage,
        quantity: asset.quantity,
        cost: asset.cost.to_f.round(2),
        profit_loss: (asset.market_value.to_f - asset.cost.to_f).round(2),
        profit_loss_percentage: asset.cost.to_f.zero? ? 0 : (((asset.market_value.to_f - asset.cost.to_f) / asset.cost.to_f) * 100).round(2)
      }
    end.sort_by { |a| -a[:percentage] }
  end

  def allocation_by_sector
    total = total_market_value
    return [] if total.zero?

    sector_data = @assets.group_by(&:sector).map do |sector, assets|
      sector_value = assets.sum { |a| a.market_value.to_f }
      {
        name: sector || 'Unknown',
        value: sector_value.round(2),
        percentage: ((sector_value / total) * 100).round(2)
      }
    end

    sector_data.sort_by { |s| -s[:percentage] }
  end

  def allocation_by_category
    total = total_market_value
    return [] if total.zero?

    category_data = @assets.group_by(&:category).map do |category, assets|
      category_value = assets.sum { |a| a.market_value.to_f }
      {
        name: category || 'Unknown',
        value: category_value.round(2),
        percentage: ((category_value / total) * 100).round(2)
      }
    end

    category_data.sort_by { |c| -c[:percentage] }
  end

  def recent_operations
    @operations.order(created_at: :desc).limit(5).map do |op|
      {
        id: op.id,
        op_type: op.op_type,
        symbol: op.symbol,
        quantity: op.quantity,
        cost: op.cost.to_f,
        currency: op.currency,
        date: op.created_at.strftime('%Y-%m-%d')
      }
    end
  end

  def top_performers
    allocation_by_symbol.select { |a| a[:profit_loss_percentage] > 0 }
                        .sort_by { |a| -a[:profit_loss_percentage] }
                        .first(5)
  end

  def portfolio_distribution
    # For pie chart visualization
    allocation_by_symbol.map do |asset|
      {
        name: asset[:symbol],
        value: asset[:value]
      }
    end
  end
end
