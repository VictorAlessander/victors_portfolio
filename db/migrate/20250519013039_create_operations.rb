class CreateOperations < ActiveRecord::Migration[8.0]
  def change
    create_table :operations do |t|
      t.string :op_type
      t.integer :quantity
      t.string :symbol
      t.string :cost
      t.string :currency

      t.timestamps
    end
  end
end
