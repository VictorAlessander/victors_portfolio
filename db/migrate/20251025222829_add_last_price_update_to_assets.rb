class AddLastPriceUpdateToAssets < ActiveRecord::Migration[8.0]
  def change
    add_column :assets, :last_price_update, :datetime
    add_column :assets, :current_price, :decimal
  end
end
