class RemoveOperationFromAssets < ActiveRecord::Migration[8.0]
  def change
    remove_reference :assets, :operation, foreign_key: true, if_exists: true
  end
end
