class CreateIncomes < ActiveRecord::Migration[8.0]
  def change
    create_table :incomes do |t|
      t.string :symbol
      t.string :income_type
      t.decimal :amount
      t.date :payment_date
      t.integer :quantity
      t.decimal :tax_withheld
      t.text :notes

      t.timestamps
    end
  end
end
