interface Asset {
  id: number;
  symbol: string;
  quantity: number;
  currency?: string;
  cost: number;
  market_value?: number;
  marketCost?: number;
  marketValue?: number;
  sector: string;
  category: string;
}

export default Asset;
