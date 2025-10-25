export enum TickerTypeEnum {
  STOCK_BR = "Stock BR",
  ETF_BR = "ETF BR",
  ETF_EUA = "ETF EUA",
  STOCK_EUA = "Stock EUA",
  BOND = "Bond",
  RF_BR = "RF BR",
}

export enum AssetCurrencyEnum {
  USD = "USD",
  BRL = "BRL",
}

export enum AssetSectorEnum {
  FINANCE = "Finance",
  BASIC_MATERIALS = "Basic Materials",
}

interface Transaction {
  id: number;
  op_type: "buy" | "sell";
  quantity: number;
  created_at: string;
  symbol: string;
  cost: string;
  currency: AssetCurrencyEnum | string;
}

export default Transaction;
