class IncomeAnalyticsService
  def initialize
    @incomes = Income.all
  end

  def income_summary
    {
      total_income: total_income,
      income_this_year: income_this_year,
      income_this_month: income_this_month,
      average_monthly_income: average_monthly_income,
      income_count: @incomes.count,
      income_by_symbol: income_by_symbol,
      income_by_type: income_by_type,
      income_over_time: income_over_time,
      recent_incomes: recent_incomes,
      total_tax_withheld: total_tax_withheld
    }
  end

  private

  def total_income
    @incomes.sum(:amount).to_f.round(2)
  end

  def income_this_year
    Income.this_year.sum(:amount).to_f.round(2)
  end

  def income_this_month
    Income.this_month.sum(:amount).to_f.round(2)
  end

  def average_monthly_income
    return 0 if @incomes.empty?

    first_income = @incomes.minimum(:payment_date)
    return income_this_month if first_income.nil?

    months_count = ((Date.current - first_income).to_f / 30).ceil
    months_count = [months_count, 1].max

    (total_income / months_count).round(2)
  end

  def total_tax_withheld
    @incomes.sum(:tax_withheld).to_f.round(2)
  end

  def income_by_symbol
    income_data = @incomes.group_by(&:symbol).map do |symbol, incomes|
      total = incomes.sum { |i| i.amount.to_f }
      {
        symbol: symbol,
        total: total.round(2),
        count: incomes.count,
        percentage: total_income.zero? ? 0 : ((total / total_income) * 100).round(2)
      }
    end

    income_data.sort_by { |i| -i[:total] }
  end

  def income_by_type
    type_labels = {
      'dividend' => 'Dividends',
      'jcp' => 'JCP',
      'bonus' => 'Bonuses',
      'subscription_rights' => 'Subscription Rights'
    }

    income_data = @incomes.group_by(&:income_type).map do |type, incomes|
      total = incomes.sum { |i| i.amount.to_f }
      {
        name: type_labels[type] || type.titleize,
        value: total.round(2),
        count: incomes.count,
        percentage: total_income.zero? ? 0 : ((total / total_income) * 100).round(2)
      }
    end

    income_data.sort_by { |i| -i[:value] }
  end

  def income_over_time
    # Group by month
    income_data = @incomes.group_by { |i| i.payment_date.beginning_of_month }.map do |month, incomes|
      {
        month: month.strftime('%b %Y'),
        amount: incomes.sum { |i| i.amount.to_f }.round(2),
        count: incomes.count
      }
    end

    income_data.sort_by { |i| Date.parse("01 #{i[:month]}") }
  end

  def recent_incomes
    @incomes.order(payment_date: :desc).limit(10).map do |income|
      {
        id: income.id,
        symbol: income.symbol,
        income_type: income.income_type,
        amount: income.amount.to_f,
        payment_date: income.payment_date.strftime('%Y-%m-%d'),
        quantity: income.quantity,
        tax_withheld: income.tax_withheld&.to_f || 0,
        notes: income.notes
      }
    end
  end

  def dividend_yield_by_asset
    # Calculate dividend yield for each asset
    # Yield = (Annual Income / Cost Basis) * 100
    assets = Asset.all
    one_year_ago = Date.current - 1.year

    assets.map do |asset|
      annual_income = Income.where(symbol: asset.symbol)
                            .where('payment_date >= ?', one_year_ago)
                            .sum(:amount)
                            .to_f

      yield_percentage = asset.cost.to_f.zero? ? 0 : ((annual_income / asset.cost.to_f) * 100).round(2)

      {
        symbol: asset.symbol,
        annual_income: annual_income.round(2),
        cost: asset.cost.to_f.round(2),
        dividend_yield: yield_percentage
      }
    end.select { |a| a[:annual_income] > 0 }
       .sort_by { |a| -a[:dividend_yield] }
  end
end
