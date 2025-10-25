class OperationsController < ApplicationController
  before_action :set_operation, only: [:update, :destroy]

  def index
    @operations = Operation.recent
    render inertia: "Transactions/index", props: { data: @operations.as_json }
  end

  def create
    @operation = Operation.new(operation_params)

    if @operation.save
      # Update or create corresponding asset
      update_asset_from_operation(@operation)

      render json: { success: true, operation: @operation }, status: :created
    else
      render json: { success: false, errors: @operation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @operation.update(operation_params)
      # Recalculate assets after update
      recalculate_assets_for_symbol(@operation.symbol)

      render json: { success: true, operation: @operation }
    else
      render json: { success: false, errors: @operation.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    symbol = @operation.symbol
    @operation.destroy

    # Recalculate assets after deletion
    recalculate_assets_for_symbol(symbol)

    render json: { success: true }
  end

  private

  def set_operation
    @operation = Operation.find(params[:id])
  end

  def operation_params
    params.require(:operation).permit(:op_type, :quantity, :symbol, :cost, :currency)
  end

  def update_asset_from_operation(operation)
    recalculate_assets_for_symbol(operation.symbol)
  end

  def recalculate_assets_for_symbol(symbol)
    operations = Operation.by_symbol(symbol)

    total_quantity = 0
    total_cost = 0.0

    operations.each do |op|
      cost_value = op.cost.to_f
      if op.op_type == 'buy'
        total_quantity += op.quantity
        total_cost += cost_value
      elsif op.op_type == 'sell'
        total_quantity -= op.quantity
        # Calculate average cost reduction proportionally
        if total_quantity > 0
          cost_per_share = total_cost / (total_quantity + op.quantity)
          total_cost -= (cost_per_share * op.quantity)
        else
          total_cost = 0
        end
      end
    end

    asset = Asset.find_or_initialize_by(symbol: symbol)

    if total_quantity > 0
      asset.assign_attributes(
        quantity: total_quantity,
        cost: total_cost.round(2),
        market_value: total_cost.round(2), # Will be updated with real prices later
        sector: asset.sector || 'Unknown',
        category: asset.category || 'Stock'
      )
      asset.save!
    elsif asset.persisted?
      # If no more holdings, delete the asset
      asset.destroy
    end
  end
end
