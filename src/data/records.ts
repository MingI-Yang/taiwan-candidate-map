export type Category = '政績' | '爭議' | '事蹟'
export type Domain =
  | '個人' | '國安' | '教育' | '文化' | '公衛' | '經濟'
  | '交通建設' | '治安司法' | '環境能源' | '社福' | '財政' | '法律制度'
export type Context = '任內施政' | '議會或立法院提案' | '民間或公職前' | '其他'
export type Outlet = '華視' | '公視' | '公視台語台' | '民視' | '鏡新聞' | '自由時報' | '三立新聞網' | '東森新聞' | '官方' | 'MyGoPen' | '原文'
export type DisputeStatus = '各方說法不一' | '已有官方說明' | '經查核為不實'

export const CATEGORIES: Category[] = ['政績', '爭議', '事蹟']
export const DOMAINS: Domain[] = [
  '個人', '國安', '教育', '文化', '公衛', '經濟', '交通建設', '治安司法', '環境能源', '社福', '財政', '法律制度',
]
export const MAX_ENTRIES = 50

export interface Source {
  outlet: Outlet
  url: string
  /** 來源標題或機關名稱 */
  title: string
  /** 無法開啟原文(例如民視回傳 403),內容僅依搜尋結果的標題與摘要 */
  unopened?: boolean
}

/** 爭議紀事的各方說法;不下結論 */
export interface Dispute {
  /** 僅在有依據時標示:官方說明、司法判決或查核機構結論;沒有依據用「各方說法不一」;雙方無歧見時省略 */
  status?: DisputeStatus
  /** 質疑方說法 */
  claim: string
  /** 回應方說法 */
  response?: string
  /** 可查證事實,含「未能取得原文」這類查證限制 */
  facts?: string[]
  /** 官方說明(機關聲明、司法文書) */
  official?: { text: string; source: Source }
  /** 查核機構結論(僅用於查證狀態) */
  factcheck?: { text: string; source: Source }
  /** 爭議核心的原文;null 表示未能取得 */
  original?: Source | null
}

export interface Entry {
  /** YYYY-MM-DD;只知年月用 YYYY-MM,只知年用 YYYY */
  date: string
  /** 一句話事實摘要,不用評價用語 */
  summary: string
  category: Category
  /** 一至兩個領域 */
  domains: [Domain] | [Domain, Domain]
  context: Context
  source: Source
  /** 同一事件的其他報導 */
  others?: Source[]
  dispute?: Dispute
  /** 查證日期 */
  verified: string
}

export type LegalResult = '未判決' | '有罪' | '無罪' | '不起訴' | '其他'

export interface LegalRecord {
  date: string
  summary: string
  /** 例如:偵查中、起訴、一審、二審、三審、確定 */
  stage: string
  result: LegalResult
  final: boolean
  source: Source
  others?: Source[]
  verified: string
}

export interface KinRecord extends LegalRecord {
  relation: '配偶' | '父母'
}

export interface Profile {
  /** 僅含部分資料(例如只有立法院表決紀錄),其餘仍在蒐集 */
  partial?: boolean
  /** false 表示尚未蒐集;true 且全空表示查無符合來源的資料 */
  collected: boolean
  entries: Entry[]
  legal: LegalRecord[]
  kin: KinRecord[]
}

export const EMPTY_PROFILE: Profile = { collected: false, entries: [], legal: [], kin: [] }

import { TAIPEI } from './taipei'
import { NEWTAIPEI } from './newtaipei'
import { TAOYUAN } from './taoyuan'
import { TAICHUNG } from './taichung'
import { SOUTH } from './south'
import { NORTH } from './north'
import { CENTRAL } from './central'
import { EAST } from './east'
import { ISLANDS } from './islands'
import { SMALL } from './small'
import { INDEPENDENTS } from './independents'
import { EXTRA_ENTRIES, EXTRA_LEGAL } from './extras'
import { VOTE_ENTRIES } from './votes'

/** 鍵為「縣市/姓名」 */
export const PROFILES: Record<string, Profile> = {
  ...TAIPEI,
  ...NEWTAIPEI,
  ...TAOYUAN,
  ...TAICHUNG,
  ...SOUTH,
  ...NORTH,
  ...CENTRAL,
  ...EAST,
  ...ISLANDS,
  ...SMALL,
  ...INDEPENDENTS,
}

export function profileOf(county: string, name: string): Profile {
  const key = `${county}/${name}`
  const base = PROFILES[key] ?? EMPTY_PROFILE
  const extraEntries = [...(VOTE_ENTRIES[key] ?? []), ...(EXTRA_ENTRIES[key] ?? [])]
  const extraLegal = EXTRA_LEGAL[key] ?? []
  const hasData = extraEntries.length + extraLegal.length + base.entries.length + base.legal.length + base.kin.length > 0
  if (!hasData) return base
  return {
    ...base,
    collected: true,
    partial: !base.collected,
    entries: [...base.entries, ...extraEntries],
    legal: [...base.legal, ...extraLegal],
  }
}
