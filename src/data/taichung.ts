import type { Entry, Profile, Source } from './records'

const V = '2026-10-13'
const pts = (id: number, title: string): Source => ({ outlet: '公視', url: `https://news.pts.org.tw/article/${id}`, title })
const cts = (path: string, title: string): Source => ({ outlet: '華視', url: `https://news.cts.com.tw/${path}`, title })

const e = (x: Omit<Entry, 'verified'>): Entry => ({ ...x, verified: V })

/** 江啟臣 */
const CHIANG: Profile = {
  collected: true,
  entries: [
    e({ date: '2026-08-26', summary: '時任立法院副院長的江啟臣率跨黨派立委赴日本東京出席亞太議員聯合會(APPU)大會,台灣提出的 3 項提案(民主供應鏈韌性、糧食安全供應鏈、亞太海洋環境保護合作)均獲通過。', category: '政績', domains: ['經濟', '環境能源'], context: '任內施政', source: cts('cna/politics/202608/202608263071848.html', '江啟臣率立院跨黨派代表團返台 3提案獲APPU通過') }),
    e({
      date: '2026-07-22',
      summary: '台中義消群組傳出訊息,要求各大隊動員 100 人出席挺江啟臣的後援會;副大隊長稱未強制,消防局否認干涉。',
      category: '爭議', domains: ['治安司法'], context: '其他',
      source: cts('cts/life/202607/202607223058608.html', '要求義消隊動員百人挺江啟臣？ 副大隊長澄清：未強制'),
      dispute: {
        status: '各方說法不一',
        claim: '訊息公告義消第一大隊預計 8 月 29 日成立「火鳳凰後援會」,要求每大隊動員 100 位義消、帶親友出席;雖備註不強迫,被批評違反行政中立、變相情勒;市議員陳俞融要求市府查明。',
        response: '義消副大隊長阮豐吉表示後援會是他在聯誼餐會提出,未強制也否認發布群組訊息;江啟臣辦公室表示感謝義消幹部自發,若沒有強制也不應強制。',
        official: { text: '台中市消防局發布聲明,否認有干涉或參與此事。', source: cts('cts/life/202607/202607223058608.html', '要求義消隊動員百人挺江啟臣？ 副大隊長澄清：未強制') },
        facts: ['報導未說明群組訊息的發布者。'],
        original: null,
      },
    }),
    e({ date: '2021-05', summary: '黃暐瀚母親遭酒駕撞死後,江啟臣提案在酒駕刑罰中增列死刑,該提案未通過;同年底高雄再傳酒駕悲劇,他再度呼籲持續提高酒駕刑罰。', category: '事蹟', domains: ['治安司法'], context: '議會或立法院提案', source: cts('cts/society/202112/202112272066924.html', '酒駕奪命頻傳 江啟臣籲修法提高刑責') }),
    e({ date: '2020-03-08', summary: '江啟臣以立委身分當選國民黨主席補選,48 歲成為該黨史上最年輕黨主席,宣示推動黨內改革年輕化,並提出「親美、和中、友日」立場。', category: '事蹟', domains: ['個人'], context: '其他', source: cts('cts/politics/202003/202003081992990.html', '國民黨新黨魁 江啟臣:推動改革年輕化') }),
  ],
  legal: [],
  kin: [],
}

/** 何欣純 */
const HO: Profile = {
  collected: true,
  entries: [
    e({
      date: '2026-09-19',
      summary: '民眾黨市議員江和樹質疑何欣純活動後發放的餐盒市值可能超過 30 元;何欣純競總稱活動依法辦理、適度簡便餐飲不構成賄選。',
      category: '爭議', domains: ['治安司法'], context: '其他',
      source: cts('cna/local/202609/202609193080705.html', '餐盒遭疑超過市值30元 何欣純競總：活動依法辦理'),
      dispute: {
        status: '各方說法不一',
        claim: '江和樹指餐盒內容含炒麵、香腸、滷蛋、三角豆乾,認為價格「一定超過 30 元」。',
        response: '競總發言人林俊裕引用法務部與最高檢察署《妨害選舉刑事案件例舉》,稱為造勢活動提供不逾社會常情的適度茶水、簡便餐飲不構成賄選,並稱質疑是把正常造勢活動污名化。',
        facts: ['報導未見機關針對此次餐盒事件的說明;競總引用的是既有例舉文件。'],
        original: null,
      },
    }),
    e({
      date: '2026-07-02',
      summary: '何欣純稱她 6 月 26 日在立法院會向主持會議的副院長江啟臣鞠躬 6 次、請求行政院版無人機特別條例順利通過,29 日才收到市府無人載具論壇邀請函;江啟臣辦公室稱勿淪為政治攻防工具。',
      category: '事蹟', domains: ['國安', '經濟'], context: '任內施政',
      source: cts('cts/general/202607/202607023050700.html', '何欣純為無人機6度鞠躬 江辦：勿淪政治攻防工具'),
      dispute: {
        status: '各方說法不一',
        claim: '何欣純表示鞠躬後才收到論壇邀請函,鞠躬是為請求行政院版無人機特別條例通過,該條例先前再次被擋。',
        response: '江啟臣辦公室表示「切莫淪為政治攻防的工具」;報導指江啟臣本人未對指控回應。',
        facts: ['朝野對條例版本有歧見:國民黨支持黨版 2400 億元條例、採常態公務預算,賴清德批評國民黨版侵犯行政權。'],
        original: null,
      },
    }),
    e({ date: '2025-10-22', summary: '民進黨中執會通過首波 4 名縣市長提名,何欣純獲提名參選台中市長;報導介紹她曾任 3 屆市議員,自 2012 年起連任台中市第 7 選區立委。', category: '事蹟', domains: ['個人'], context: '其他', source: pts(777637, '綠拍板4縣市長提名人選 何欣純出戰台中、律師林國漳選宜蘭') }),
    e({ date: '1998', summary: '何欣純 1998 年以無黨籍身分參選台中縣議員落選,經成大歷史系恩師林瑞明建議從基層做起,進入台中縣政府,先任縣政服務中心臨時人員,後任副縣長室約僱秘書,前後近兩年。', category: '事蹟', domains: ['個人'], context: '民間或公職前', source: cts('cna/local/202609/202609283083655.html', '迎接教師節 江啟臣、何欣純憶恩師話當年') }),
  ],
  legal: [],
  kin: [],
}

export const TAICHUNG: Record<string, Profile> = {
  '台中市/江啟臣': CHIANG,
  '台中市/何欣純': HO,
}
