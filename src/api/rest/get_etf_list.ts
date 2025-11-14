import api from '@/lib/api';

export type GetETFsQuery = {
  from_timestamp: number;
  page: number; // 默认 1
  limit: number; // 默认 10，-1 表示所有
  sort: string; // 默认 "id"
  order: 'ASC' | 'DESC';
};

export type ETFsResponse = {
  items: ETFDTO[];
  meta: {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
};

export type ETFDTO = {
  id: number;
  name: string;
  image: string;
  symbol: string;
  description: string;
  public_key: string;
  creator: string;
  create_at: number;
  status: string;
  latest_price: string;
  oldest_price: string;
  price_change: string;
  latest_supply: string;
  latest_holders: string;
  ytd: string;
};

export const getETFList = (params: GetETFsQuery) => {
  return api.get<ETFsResponse>('/main-api/get_etf_list', { params });
};
