class CreateAssets < ActiveRecord::Migration[8.0]
  def change
    create_table :assets do |t|
      t.string :symbol
      t.integer :quantity
      t.decimal :cost
      t.decimal :market_value
      t.string :sector
      t.string :category

      t.timestamps
    end
  end
end
