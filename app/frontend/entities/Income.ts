export enum IncomeTypeEnum {
  DIVIDEND = "dividend",
  JCP = "jcp",
  BONUS = "bonus",
  SUBSCRIPTION_RIGHTS = "subscription_rights",
}

export interface Income {
  id: number;
  symbol: string;
  income_type: IncomeTypeEnum | string;
  amount: number;
  payment_date: string;
  quantity?: number;
  tax_withheld?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IncomeSummary {
  total_income: number;
  income_this_year: number;
  income_this_month: number;
  average_monthly_income: number;
  income_count: number;
  total_tax_withheld: number;
  income_by_symbol: Array<{
    symbol: string;
    total: number;
    count: number;
    percentage: number;
  }>;
  income_by_type: Array<{
    name: string;
    value: number;
    count: number;
    percentage: number;
  }>;
  income_over_time: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  recent_incomes: Income[];
}

export default Income;
