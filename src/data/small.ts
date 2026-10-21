import type { Entry, LegalRecord, Profile, Source } from './records'

const V = '2026-10-13'
const pts = (id: number, title: string): Source => ({ outlet: '公視', url: `https://news.pts.org.tw/article/${id}`, title })
const cts = (path: string, title: string): Source => ({ outlet: '華視', url: `https://news.cts.com.tw/${path}`, title })
const mnews = (path: string, title: string): Source => ({ outlet: '鏡新聞', url: `https://www.mnews.tw/story/${path}`, title })

const e = (x: Omit<Entry, 'verified'>): Entry => ({ ...x, verified: V })
const lg = (x: Omit<LegalRecord, 'verified'>): LegalRecord => ({ ...x, verified: V })
const EMPTY: Profile = { collected: true, entries: [], legal: [], kin: [] }

/** 郭璽(台灣麻將最大黨) */
const KUO: Profile = {
  collected: true,
  entries: [
    e({
      date: '2026-05-05',
      summary: '郭璽宣布參選台北市長;報導介紹他 1997 年自海軍退役後轉往證券市場、2016 年任潛艦國造無給職顧問、2022 年成立「台灣麻將最大黨」並任黨主席,2024 年帶領黨員登記參選台北市與高雄立委、兩人皆落選;並稱他因尹清楓案被列為關係人調查近 30 年,2020 年獲檢方不起訴處分。',
      category: '事蹟', domains: ['個人'], context: '民間或公職前',
      source: mnews('20260505nm011', '高雄立委失利再出發 「麻將最大黨」郭璽宣布選台北市長'),
    }),
    e({
      date: '2023-10-04',
      summary: '潛艦國造洩密風波:台北市議員徐巧芯公布錄音,稱前海軍顧問郭璽說得標廠商 GL 是「詐騙公司」並將潛艦建造時程透露給韓國廠商;郭璽稱徐偷錄他 8 個月、否認指控;國民黨立委馬文君與郭璽互告加重誹謗,高檢署以外患罪他字案傳喚郭璽。',
      category: '爭議', domains: ['國安', '法律制度'], context: '民間或公職前',
      source: cts('cts/general/202310/202310042235723.html', '徐巧芯再爆新錄音「GL是詐騙公司」 郭璽揚言提告'),
      others: [pts(659810, '潛艦國造洩密風波 郭璽、馬文君互告加重誹謗'), pts(667095, '潛艦洩密／今首度遭高檢署傳喚 郭璽：會提供完整音檔')],
      dispute: {
        status: '各方說法不一',
        claim: '徐巧芯稱郭璽向韓國廠商洩漏潛艦建造時程與後續預算,並稱至少還有 3 段未公布的錄音;馬文君稱郭璽點名她洩密並稱他是尹清楓案涉案人、曾轉往中國當軍火掮客。',
        response: '郭璽稱徐巧芯偷錄他 8 個月並交給他人散布,稱馬文君外洩潛艦國造資料、曾在機密會議拒簽保密協定,並否認叛國,稱徐引用的是剪輯過的錄音;台船 2022 年聲明稱「詐騙」之語是玩笑。',
        facts: [
          '郭璽 2023-10-02 赴北檢對馬文君提告加重誹謗並求償 300 萬元;馬文君則已先提告郭璽加重誹謗(報導未載告訴地點)。',
          '2023-11-16 高檢署以外患罪他字案傳喚郭璽,身分為證人兼被告。',
          '報導未載加重誹謗案或外患罪案的處分結果。',
        ],
        original: null,
      },
    }),
  ],
  legal: [
    lg({ date: '2023-11-16', summary: '潛艦國造洩密案:高檢署以外患罪他字案傳喚郭璽,身分為證人兼被告。郭璽否認叛國並稱將提供完整錄音。報導未載偵查結果。', stage: '偵查中(他字案)', result: '未判決', final: false, source: pts(667095, '潛艦洩密／今首度遭高檢署傳喚 郭璽：會提供完整音檔') }),
    lg({ date: '2023-10-02', summary: '郭璽與國民黨立委馬文君互告加重誹謗:馬文君控郭璽指她洩密並稱他是尹清楓案涉案人;郭璽赴北檢反告並提出民事求償 300 萬元。報導未載處分結果。', stage: '告訴(互告加重誹謗)', result: '未判決', final: false, source: pts(659810, '潛艦國造洩密風波 郭璽、馬文君互告加重誹謗') }),
    lg({ date: '2020', summary: '尹清楓案:郭璽被列為關係人調查近 30 年,2020 年獲檢方不起訴處分(依 2026 年報導轉述)。', stage: '偵查(尹清楓案關係人)', result: '不起訴', final: true, source: mnews('20260505nm011', '高雄立委失利再出發 「麻將最大黨」郭璽宣布選台北市長') }),
  ],
  kin: [],
}

/** 張靜(司法改革黨) */
const CHANG_J: Profile = {
  collected: true,
  entries: [
    e({ date: '2026-06-10', summary: '台灣工黨等 3 黨合推縣市長人選,司法改革黨主席張靜參選高雄市長,政見以司法改革為核心:陪審制度、司法退場機制、檢察長民選、強化司法問責;並稱要結盟理念相近的小黨、讓「第三勢力」在地方政治更有影響力。報導未載其他經歷。', category: '事蹟', domains: ['法律制度'], context: '其他', source: cts('cna/local/202606/202606103042203.html', '台灣工黨等3黨合推縣市長人選 參戰高雄、花蓮') }),
  ],
  legal: [],
  kin: [],
}

/** 羅佩秦(台灣工黨) */
const LUO: Profile = {
  collected: true,
  entries: [
    e({ date: '2026-06-10', summary: '台灣工黨推出羅佩秦參選花蓮縣長;報導稱她有卑南與魯凱族血統、在排灣族部落長大、長年關注原住民權益;政見主張嚴懲重大犯罪,例如毒駕故意致死者處「唯一死刑」並加鞭刑。', category: '事蹟', domains: ['個人', '治安司法'], context: '其他', source: cts('cna/local/202606/202606103042203.html', '台灣工黨等3黨合推縣市長人選 參戰高雄、花蓮') }),
  ],
  legal: [],
  kin: [],
}

export const SMALL: Record<string, Profile> = {
  '台北市/郭璽': KUO,
  '台北市/蕭文乾': EMPTY,
  '台北市/唐新民': EMPTY,
  '台中市/洪麗華': EMPTY,
  '高雄市/張靜': CHANG_J,
  '台南市/蕭燐洪': EMPTY,
  '花蓮縣/羅佩秦': LUO,
}
