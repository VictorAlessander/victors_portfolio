class IncomesController < ApplicationController
  before_action :set_income, only: [:update, :destroy]

  def index
    @incomes = Income.recent
    analytics = IncomeAnalyticsService.new
    income_data = analytics.income_summary

    render inertia: "Income/index", props: {
      data: @incomes.as_json,
      summary: income_data
    }
  end

  def create
    @income = Income.new(income_params)

    if @income.save
      render json: { success: true, income: @income }, status: :created
    else
      render json: { success: false, errors: @income.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @income.update(income_params)
      render json: { success: true, income: @income }
    else
      render json: { success: false, errors: @income.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @income.destroy
    render json: { success: true }
  end

  private

  def set_income
    @income = Income.find(params[:id])
  end

  def income_params
    params.require(:income).permit(:symbol, :income_type, :amount, :payment_date, :quantity, :tax_withheld, :notes)
  end
end
