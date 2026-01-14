
export type Currency = 'USD' | 'RMB';
export type CalculationType = 'per_container' | 'per_shipment' | 'parameter';

export interface FeeItem {
  id: string;
  type: CalculationType;
  code: string;
  name: string;
  unitPrice: number;
  currency: Currency;
  description?: string;
}

export interface Parameters {
  gp20Count: number;
  gp40Count: number;
  exchangeRate: number;
}

export interface Quote {
  id: string;
  supplierName: string;
  route: string;
  params: Parameters;
  items: FeeItem[];
  status: 'Draft' | 'Submitted' | 'Reviewed';
  createdAt: string;
}

export interface CalculationResult {
  originalAmount: number;
  rmbAmount: number;
}
