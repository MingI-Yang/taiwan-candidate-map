export interface Party {
  id: string
  name: string
  short: string
  color: string
  /** 黨徽圖檔(public/logos);缺少時以色塊加簡稱代替 */
  logo?: string
}

export const PARTIES: Record<string, Party> = {
  dpp: { id: 'dpp', name: '民主進步黨', short: '民進', color: '#1b9431', logo: 'dpp.svg' },
  kmt: { id: 'kmt', name: '中國國民黨', short: '國民', color: '#1c4aa3', logo: 'kmt.svg' },
  tpp: { id: 'tpp', name: '台灣民眾黨', short: '民眾', color: '#28c8c8', logo: 'tpp.svg' },
  tsu: { id: 'tsu', name: '台灣團結聯盟', short: '台聯', color: '#c8731a' },
  jjp: { id: 'jjp', name: '司法正義黨', short: '正義', color: '#7a4fa3' },
  jrp: { id: 'jrp', name: '司法改革黨', short: '改革', color: '#a34f7a' },
  twp: { id: 'twp', name: '台灣工黨', short: '工黨', color: '#d14040' },
  mj: { id: 'mj', name: '台灣麻將最大黨', short: '麻將', color: '#8a8a3c' },
  sor: { id: 'sor', name: '臺灣SoR無法黨', short: 'SoR', color: '#4f7aa3' },
  usa: { id: 'usa', name: '三勢團結促進聯盟', short: '三勢', color: '#a37a4f' },
  ind: { id: 'ind', name: '無黨籍', short: '無', color: '#9aa0a6' },
}

/** 排序權重:政黨規模順序,其餘依此陣列順序,無黨籍最後 */
export const PARTY_ORDER = ['dpp', 'kmt', 'tpp', 'tsu', 'jjp', 'jrp', 'twp', 'mj', 'sor', 'usa', 'ind']
