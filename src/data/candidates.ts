export type CandidateStatus = 'nominated' | 'registered' | 'withdrawn'

export interface Candidate {
  name: string
  party: string
  status: CandidateStatus
  /** 抽籤後的號次;公告前省略 */
  number?: number
}

export interface County {
  /** 對應 TopoJSON 的 COUNTYNAME */
  name: string
  /** 現任縣市長 */
  incumbent: { name: string; party: string }
  candidates: Candidate[]
}

export const DATA_UPDATED = '2026-10-21'

const r = (name: string, party: string): Candidate => ({ name, party, status: 'registered' })

/**
 * 來源:公視新聞網〈2026九合一大選 22縣市長 候選人名單一次看〉(81 人登記),
 * 現任資料與維基百科交叉比對。號次待中選會公告後補上。
 */
export const COUNTIES: County[] = [
  { name: '基隆市', incumbent: { name: '謝國樑', party: 'kmt' }, candidates: [r('謝國樑', 'kmt'), r('童子瑋', 'dpp'), r('魏造文', 'ind')] },
  { name: '台北市', incumbent: { name: '蔣萬安', party: 'kmt' }, candidates: [r('蔣萬安', 'kmt'), r('沈伯洋', 'dpp'), r('郭璽', 'mj'), r('蕭文乾', 'sor'), r('唐新民', 'usa'), r('林志成', 'ind')] },
  { name: '新北市', incumbent: { name: '侯友宜', party: 'kmt' }, candidates: [r('李四川', 'kmt'), r('蘇巧慧', 'dpp'), r('蘇輝湟', 'ind')] },
  { name: '桃園市', incumbent: { name: '張善政', party: 'kmt' }, candidates: [r('張善政', 'kmt'), r('黃世杰', 'dpp')] },
  { name: '新竹縣', incumbent: { name: '楊文科', party: 'kmt' }, candidates: [r('徐欣瑩', 'kmt'), r('鄭朝方', 'dpp'), r('朱定瑀', 'ind')] },
  { name: '新竹市', incumbent: { name: '高虹安', party: 'ind' }, candidates: [r('高虹安', 'ind'), r('莊競程', 'dpp'), r('何志勇', 'ind')] },
  { name: '苗栗縣', incumbent: { name: '鍾東錦', party: 'kmt' }, candidates: [r('鍾東錦', 'kmt'), r('陳品安', 'dpp')] },
  { name: '台中市', incumbent: { name: '盧秀燕', party: 'kmt' }, candidates: [r('江啟臣', 'kmt'), r('何欣純', 'dpp'), r('洪麗華', 'jjp')] },
  { name: '彰化縣', incumbent: { name: '王惠美', party: 'kmt' }, candidates: [r('魏平政', 'kmt'), r('陳素月', 'dpp'), r('邱建富', 'ind'), r('陳重嘉', 'ind')] },
  { name: '南投縣', incumbent: { name: '許淑華', party: 'kmt' }, candidates: [r('許淑華', 'kmt'), r('溫世政', 'dpp')] },
  { name: '雲林縣', incumbent: { name: '張麗善', party: 'kmt' }, candidates: [r('張嘉郡', 'kmt'), r('劉建國', 'dpp'), r('吳炳輝', 'ind'), r('林佳瑜', 'ind')] },
  { name: '嘉義縣', incumbent: { name: '翁章梁', party: 'dpp' }, candidates: [r('蔡易餘', 'dpp'), r('吳品叡', 'ind')] },
  { name: '嘉義市', incumbent: { name: '黃敏惠', party: 'kmt' }, candidates: [r('王美惠', 'dpp'), r('張啓楷', 'tpp'), r('黃宏成', 'ind'), r('陳愷璜', 'ind'), r('王義成', 'ind')] },
  { name: '台南市', incumbent: { name: '黃偉哲', party: 'dpp' }, candidates: [r('陳亭妃', 'dpp'), r('謝龍介', 'kmt'), r('葉人文', 'ind'), r('蕭燐洪', 'sor')] },
  { name: '高雄市', incumbent: { name: '陳其邁', party: 'dpp' }, candidates: [r('賴瑞隆', 'dpp'), r('柯志恩', 'kmt'), r('張靜', 'jrp'), r('王肇民', 'ind'), r('洪方隆', 'ind')] },
  { name: '屏東縣', incumbent: { name: '周春米', party: 'dpp' }, candidates: [r('周春米', 'dpp'), r('蘇清泉', 'kmt')] },
  { name: '宜蘭縣', incumbent: { name: '林姿妙', party: 'kmt' }, candidates: [r('林國漳', 'dpp'), r('吳宗憲', 'kmt'), r('陳宏毅', 'ind'), r('劉燦輝', 'ind'), r('楊鉯婷', 'ind')] },
  { name: '花蓮縣', incumbent: { name: '徐榛蔚', party: 'kmt' }, candidates: [r('游淑貞', 'kmt'), r('張峻', 'ind'), r('魏嘉賢', 'ind'), r('羅佩秦', 'twp')] },
  { name: '台東縣', incumbent: { name: '饒慶鈴', party: 'kmt' }, candidates: [r('陳瑩', 'dpp'), r('吳秀華', 'kmt'), r('王志偉', 'ind'), r('李吳穎智', 'ind')] },
  { name: '澎湖縣', incumbent: { name: '陳光復', party: 'dpp' }, candidates: [r('吳淑瑾', 'dpp'), r('陳振中', 'kmt'), r('周倪安', 'tsu'), r('許智富', 'ind'), r('葉竹林', 'ind'), r('陳盡川', 'ind')] },
  { name: '金門縣', incumbent: { name: '陳福海', party: 'ind' }, candidates: [r('陳玉珍', 'kmt'), r('李文良', 'ind'), r('洪和成', 'ind'), r('黃世團', 'ind'), r('張國威', 'ind'), r('梁文韜', 'ind'), r('張火木', 'ind')] },
  { name: '連江縣', incumbent: { name: '王忠銘', party: 'kmt' }, candidates: [r('王忠銘', 'kmt'), r('曹爾元', 'ind')] },
]
