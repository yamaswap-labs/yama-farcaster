import api from '@/lib/api';
import { ETFDTO } from './get_etf_list';

export type CollectETFReqBody = {
  publicKey: string;
  signature: string;
  message: string;
  walletPublicKey: string;
  etfPublicKey: string;
  type: CollectType;
};

export type ResponseBody<T> = {
  code: number;
  data: T;
  success: boolean;
};

export enum CollectType {
  COLLECT = 1, // 收藏
  CANCEL = 0, // 取消收藏
}

export type CollectETFResponse = ResponseBody<void>;

export const postCollectETF = (data: CollectETFReqBody) => {
  return api.post<CollectETFResponse>('/main-api/etf_collect', { data });
};

export type CollectedETFsQuery = {
  walletPublicKey: string;
  from_timestamp: number;
  page: number; // 默认 1
  limit: number; // 默认 10，-1 表示所有
  sort?: string; // 默认 "id"
  order?: 'ASC' | 'DESC';
};

export type CollectedETFsResponse = ResponseBody<{
  items: ETFDTO[];
}>;

export const getCollectedETFs = (params: CollectedETFsQuery) => {
  return api.get<CollectedETFsResponse>('/main-api/etf_collect', { params });
};
