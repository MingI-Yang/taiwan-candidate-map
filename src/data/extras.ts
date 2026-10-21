import type { Entry, LegalRecord, Source } from './records'
import { ACHIEVEMENTS } from './achievements'
import { LEGISLATOR_ENTRIES } from './legislators'

const V = '2026-10-13'
const pts = (id: number, title: string): Source => ({ outlet: '公視', url: `https://news.pts.org.tw/article/${id}`, title })

const SRC = pts(795064, '議場內多次爆發肢體衝突 10名立委遭起訴')

const summary = (name: string) =>
  `台北地檢署 2026-02-12 偵結 2024 年 5 月起近一年間立法院審理《立法院職權行使法》《公職人員選舉罷免法》與兩公投等法案時的議場衝突案,以傷害、過失傷害罪起訴 10 名立委(國民黨 7 人、民進黨 3 人),起訴名單含${name}。`

/** 立法院議場衝突案被起訴者(僅限來源明列姓名者) */
const violenceEntry = (name: string): Entry => ({
  date: '2026-02-12',
  summary: summary(name),
  category: '爭議',
  domains: ['法律制度', '治安司法'],
  context: '議會或立法院提案',
  source: SRC,
  dispute: {
    status: '已有官方說明',
    claim: '檢方認為立委蓄意的肢體動作「不屬於必要的議事程序」,不符意見表達的適當情節、侵害他人法益,因此不受言論免責權保護。',
    response: '報導稱被起訴立委多主張屬政治性言論表達、不應受刑事追訴(為整體案件說法,非逐人說法)。',
    official: {
      text: '北檢調查 8 場議事衝突,以傷害、過失傷害罪起訴 10 人;洪孟楷、徐巧芯等 4 名藍委獲不起訴。',
      source: SRC,
    },
    facts: [
      '報導僅列出 6 位被起訴者姓名(謝龍介、柯建銘、王鴻薇、林楚茵、陳玉珍、林淑芬),其餘 4 人姓名未載,各人涉及的具體事件日期與罪名也未載。',
      '起訴不等於有罪,法院尚未判決。',
    ],
    original: null,
  },
  verified: V,
})

const violenceLegal = (name: string): LegalRecord => ({
  date: '2026-02-12',
  summary: `立法院議場衝突案(2024 年 5 月起):台北地檢署以傷害、過失傷害罪起訴 10 名立委,起訴名單含${name};各人涉及的具體事件與罪名報導未載。`,
  stage: '起訴',
  result: '未判決',
  final: false,
  source: SRC,
  verified: V,
})

const NAMES = ['台南市/謝龍介', '金門縣/陳玉珍']

export const EXTRA_ENTRIES: Record<string, Entry[]> = {}
export const EXTRA_LEGAL: Record<string, LegalRecord[]> = {}
for (const key of NAMES) {
  const name = key.split('/')[1]
  EXTRA_ENTRIES[key] = [violenceEntry(name)]
  EXTRA_LEGAL[key] = [violenceLegal(name)]
}

for (const src of [ACHIEVEMENTS, LEGISLATOR_ENTRIES]) {
  for (const [key, list] of Object.entries(src)) {
    EXTRA_ENTRIES[key] = [...(EXTRA_ENTRIES[key] ?? []), ...list]
  }
}
