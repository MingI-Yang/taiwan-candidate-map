/** 媒體比對(試點):事件、各家媒體的報導與評分。有查到才收,查不到不列點。 */

export type Column = '民進黨' | '其他黨' | '民眾黨' | '國民黨'
export type Camp = '民主陣營' | '威權陣營'

export const COLUMNS: Column[] = ['民進黨', '其他黨', '民眾黨', '國民黨']

/** 紀事來源的 5 家與其他比對媒體 */
export const CORE_OUTLETS = ['華視', '公視', '民視', '鏡新聞', '自由', '三立', '東森'] as const
export const OTHER_OUTLETS = ['台視', '中天', '聯合報', '中時', 'ETtoday', '壹電視'] as const
/** 圖上代表「作者對事件本身的判斷」的點,不是媒體 */
export const JUDGE = '事實分析'
export const OUTLETS: string[] = [...CORE_OUTLETS, ...OTHER_OUTLETS]

export interface CoverageEvent {
  id: string
  title: string
  date: string
  column: Column
  /** 事件本身的最終裁決分,−3 到 +3(不看標題) */
  base: number
  baseReason: string
  /** 涉及外國或境外政權時填,圖二使用 */
  camp?: Camp
}

export interface Report {
  event: string
  outlet: string
  title: string
  url: string
  /** 這則標題讓觀眾對哪個政黨欄產生印象;多數同事件所屬欄,標題把矛頭指向另一陣營時改欄 */
  column: Column
  /** 標題給該政黨欄的印象分,−3(嚴重負面)到 +3(重大正面),只依標題判定 */
  score: number
}

import { GEN_EVENTS, GEN_REPORTS } from './coverageGen'

export const EVENTS: CoverageEvent[] = GEN_EVENTS
export const REPORTS: Report[] = GEN_REPORTS

export const PILOT_QUERY_DATE = '2026-10-14'
