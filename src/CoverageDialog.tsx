import { useEffect, useMemo, useRef, useState } from 'react'
import {
  COLUMNS, CORE_OUTLETS, EVENTS, JUDGE, OTHER_OUTLETS, OUTLETS, PILOT_QUERY_DATE, REPORTS,
} from './data/coverage'
import type { Camp, Report } from './data/coverage'

const COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
  '#bcbd22', '#17becf', '#393b79', '#e6550d', '#31a354', '#756bb1', '#636363',
]
const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'cross'] as const
const STAR = Array.from({ length: 10 }, (_, i) => {
  const a = (Math.PI / 5) * i - Math.PI / 2
  const r = i % 2 ? 4 : 9
  return `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`
}).join(' L')
type Shape = (typeof SHAPES)[number] | 'star'

const styleOf = (outlet: string) => {
  if (outlet === JUDGE) return { color: 'var(--fg)', shape: 'star' as Shape }
  const i = OUTLETS.indexOf(outlet)
  return { color: COLORS[i % COLORS.length], shape: SHAPES[i % SHAPES.length] as Shape }
}

function Mark({ shape, r = 6 }: { shape: Shape; r?: number }) {
  switch (shape) {
    case 'circle': return <circle r={r} />
    case 'square': return <rect x={-r} y={-r} width={2 * r} height={2 * r} />
    case 'triangle': return <path d={`M0 ${-r - 1} L${r + 1} ${r} L${-r - 1} ${r} Z`} />
    case 'diamond': return <path d={`M0 ${-r - 1} L${r + 1} 0 L0 ${r + 1} L${-r - 1} 0 Z`} />
    case 'star': return <path d={`M${STAR} Z`} />
    case 'cross': return <path d={`M${-r} ${-2} H${-2} V${-r} H2 V${-2} H${r} V2 H2 V${r} H${-2} V2 H${-r} Z`} />
  }
}

const W = 720
const H = 380
const M = { l: 44, r: 16, t: 14, b: 34 }
const Y_LEVELS = [4, 3, 2, 1, 0, -1, -2, -3, -4]

interface Point {
  key: string
  outlet: string
  col: number
  score: number
  evTitle: string
  evColumn: string
  base: number
  baseReason: string
  /** 畫成這一點的報導;事實分析點沒有 */
  rep?: Report
  /** 同一家對同一事件的全部報導 */
  all: Report[]
}

/** 以網址決定的固定亂數(0~1),重新整理後位置不變 */
function rand(seed: string, salt: number) {
  let h = 2166136261 ^ salt
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  h ^= h >>> 15
  h = Math.imul(h, 2246822507)
  h ^= h >>> 13
  return ((h >>> 0) % 10000) / 10000
}

/** 同一家對同一事件只畫一點,另加每個事件一個「事實分析」點 */
function buildPoints(): Point[] {
    const evs = new Map(EVENTS.map((e) => [e.id, e]))
    const groups = new Map<string, Report[]>()
    for (const r of REPORTS) groups.set(`${r.event}|${r.outlet}`, [...(groups.get(`${r.event}|${r.outlet}`) ?? []), r])
    const out: Point[] = []
    for (const all of groups.values()) {
      const ev = evs.get(all[0].event)
      if (!ev) continue
      // 同一家對同一事件只畫一點:取最多則所在的欄(平手以事件所屬欄優先),分數取該欄各則平均並四捨五入
      const cnt = new Map<string, number>()
      for (const r of all) cnt.set(r.column, (cnt.get(r.column) ?? 0) + 1)
      const top = Math.max(...cnt.values())
      const col = [...cnt].filter(([, n]) => n === top).map(([c]) => c).includes(ev.column) ? ev.column : [...cnt].find(([, n]) => n === top)![0]
      const inCol = all.filter((r) => r.column === col)
      const mean = inCol.reduce((a, r) => a + r.score, 0) / inCol.length
      const score = Math.sign(mean) * Math.round(Math.abs(mean))
      const rep = [...inCol].sort((x, y) => Math.abs(x.score - mean) - Math.abs(y.score - mean))[0]
      out.push({ key: rep.url, outlet: rep.outlet, col: COLUMNS.indexOf(col as never), score, evTitle: ev.title, evColumn: ev.column, base: ev.base, baseReason: ev.baseReason, rep, all })
    }
    for (const ev of EVENTS) {
      out.push({ key: `judge|${ev.id}`, outlet: JUDGE, col: COLUMNS.indexOf(ev.column), score: ev.base, evTitle: ev.title, evColumn: ev.column, base: ev.base, baseReason: ev.baseReason, all: [] })
    }
    return out
}

function Scatter() {
  const [hover, setHover] = useState<string | null>(null)
  const [locked, setLocked] = useState<string | null>(null)
  const [picked, setPicked] = useState<Point | null>(null)
  const [tip, setTip] = useState<Point | null>(null)
  const active = hover ?? locked

  const points = useMemo<Point[]>(() => buildPoints(), [])

  const cw = (W - M.l - M.r) / COLUMNS.length
  const ch = (H - M.t - M.b) / (Y_LEVELS.length - 1)
  /** 點離格子中心的隨機偏移,限制在格子內,不會跳到相鄰的欄或分數 */
  const px = (p: Point) => M.l + cw * (p.col + 0.5) + (rand(p.key, 1) - 0.5) * cw * 0.6
  const py = (p: Point) => M.t + (4 - p.score) * ch + (rand(p.key, 2) - 0.5) * ch * 0.6

  const shown = points.filter((p) => !active || p.outlet === active)

  const legendItem = (o: string) => {
    const { color, shape } = styleOf(o)
    const n = points.filter((p) => p.outlet === o).length
    return (
      <li key={o}>
        <button
          type="button"
          className={`cov-leg${locked === o ? ' on' : ''}`}
          onMouseEnter={() => setHover(o)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(o)}
          onBlur={() => setHover(null)}
          onClick={() => setLocked(locked === o ? null : o)}
          aria-pressed={locked === o}
        >
          <svg width="16" height="16" viewBox="-8 -8 16 16" fill={color} aria-hidden><Mark shape={shape} r={5} /></svg>
          {o}
          {n > 0 && <small>{n}</small>}
        </button>
      </li>
    )
  }

  return (
    <div>
      <div className="cov-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="cov-chart" role="img" aria-label="報導評分散點圖">
        {Y_LEVELS.map((y) => (
          <g key={y}>
            <line x1={M.l} x2={W - M.r} y1={M.t + (4 - y) * ch} y2={M.t + (4 - y) * ch} className={y === 0 ? 'cov-zero' : 'cov-grid'} />
          </g>
        ))}
        <text x={M.l - 6} y={M.t + (H - M.t - M.b) / 4} textAnchor="end" className="cov-tick">↑ 正向</text>
        <text x={M.l - 6} y={M.t + ((H - M.t - M.b) * 3) / 4} textAnchor="end" className="cov-tick">↓ 負向</text>
        {COLUMNS.map((c, i) => (
          <g key={c}>
            {i > 0 && <line x1={M.l + cw * i} x2={M.l + cw * i} y1={M.t} y2={H - M.b} className="cov-grid" />}
            <text x={M.l + cw * (i + 0.5)} y={H - 10} textAnchor="middle" className="cov-tick">{c}</text>
          </g>
        ))}
        {shown.map((p, i) => {
          const { color, shape } = styleOf(p.outlet)
          return (
            <g
              key={`${p.key}|${i}`}
              transform={`translate(${px(p)},${py(p)})`}
              style={{ fill: color }}
              fillOpacity={p.outlet === JUDGE ? 0.9 : 0.75}
              stroke="var(--card)"
              strokeWidth={0.8}
              className="cov-point"
              tabIndex={0}
              onMouseEnter={() => { setPicked(p); setTip(p) }}
              onMouseLeave={() => setTip(null)}
              onFocus={() => { setPicked(p); setTip(p) }}
              onBlur={() => setTip(null)}
              onClick={() => setPicked(p)}
            >
              <Mark shape={shape} />
              <title>{`${p.outlet}|${p.score > 0 ? '+' : ''}${p.score}|${p.rep?.title ?? p.evTitle}`}</title>
            </g>
          )
        })}
      </svg>
      {tip && (
        <div className="cov-tip" style={{ left: `${(px(tip) / W) * 100}%`, top: `${(py(tip) / H) * 100}%` }}>
          <strong>{tip.outlet}</strong> {tip.score > 0 ? '+' : ''}{tip.score}<br />{tip.rep?.title ?? tip.evTitle}
        </div>
      )}
      </div>

      <ul className="cov-legend" aria-label="媒體圖例,點選只顯示該家">
        <li>
          <button type="button" className={`cov-leg cov-all${!active ? ' on' : ''}`} onClick={() => { setLocked(null); setHover(null) }}>
            全部
          </button>
        </li>
        <li className="cov-group">作者的判斷</li>
        {legendItem(JUDGE)}
        <li className="cov-group">來源 7 家</li>
        {CORE_OUTLETS.map(legendItem)}
        <li className="cov-group">比對的其他媒體</li>
        {OTHER_OUTLETS.map(legendItem)}
      </ul>

      <div className="cov-detail" aria-live="polite">
        {picked ? (
          <>
            <p><strong>{picked.evTitle}</strong></p>
            {picked.rep ? (
              <>
                <p>
                  {picked.outlet}:<a href={picked.rep.url} target="_blank" rel="noreferrer">{picked.rep.title}</a>
                </p>
                <p>
                  標題帶給「{COLUMNS[picked.col]}」的印象分:{picked.score > 0 ? '+' : ''}{picked.score}(只依標題判定)。
                  {COLUMNS[picked.col] !== picked.evColumn
                    ? <>事件本身歸在「{picked.evColumn}」,但標題的寫法把印象導向「{COLUMNS[picked.col]}」,所以畫在這一欄。</>
                    : <>事件本身的最終裁決分 {picked.base > 0 ? '+' : ''}{picked.base}({picked.baseReason})。</>}
                </p>
                {picked.all.length > 1 && (
                  <details>
                    <summary>{picked.outlet}對這個事件共 {picked.all.length} 則報導,只畫一點(取平均後四捨五入)</summary>
                    <ul>
                      {picked.all.map((r) => (
                        <li key={r.url}>
                          <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>({r.column} {r.score > 0 ? '+' : ''}{r.score})
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </>
            ) : (
              <p>
                事實分析(作者判斷):這個事件歸在「{picked.evColumn}」,事件本身的分數 {picked.base > 0 ? '+' : ''}{picked.base}。理由:{picked.baseReason}。
                這是只看事件本身、不看任何媒體標題的判斷,可能有誤。
              </p>
            )}
          </>
        ) : (
          <p className="cov-hint">移到或點選圖上的點,這裡顯示該則報導與評分理由;星形是作者對事件本身的判斷。</p>
        )}
      </div>
    </div>
  )
}

/** 各媒體與「事實分析」的比較:只看該媒體有報導的事件 */
function compare(points: Point[], outlet: string) {
  const judge = new Map(points.filter((p) => p.outlet === JUDGE).map((p) => [p.evTitle, p]))
  const mine = points.filter((p) => p.outlet === outlet)
  const pairs = mine.map((p) => ({ p, j: judge.get(p.evTitle)! })).filter((x) => x.j)
  if (!pairs.length) return null
  const same = pairs.filter(({ p, j }) => p.col === j.col)
  const dir = same.filter(({ p, j }) => Math.sign(p.score) === Math.sign(j.score)).length
  const bias = same.length ? same.reduce((a, { p, j }) => a + (p.score - j.score), 0) / same.length : 0
  // 分布相似度:把(政黨欄,分數)當格子,比較兩邊各格子的點數,取重疊比例
  const cell = (x: Point) => `${x.col}|${x.score}`
  const hm = new Map<string, number>()
  const hj = new Map<string, number>()
  for (const { p, j } of pairs) {
    hm.set(cell(p), (hm.get(cell(p)) ?? 0) + 1)
    hj.set(cell(j), (hj.get(cell(j)) ?? 0) + 1)
  }
  let overlap = 0
  for (const [k, v] of hm) overlap += Math.min(v, hj.get(k) ?? 0)
  return { n: pairs.length, overlap: overlap / pairs.length, dir: dir / pairs.length, bias }
}

/** 各媒體標題語氣統計與和事實分析的相似度 */
function ToneTable() {
  const points = useMemo(() => buildPoints(), [])
  const rows = OUTLETS.map((o) => {
    const rs = REPORTS.filter((r) => r.outlet === o)
    const byCol = (c: string) => {
      const xs = rs.filter((r) => r.column === c)
      return { n: xs.length, avg: xs.length ? xs.reduce((a, r) => a + r.score, 0) / xs.length : 0 }
    }
    const d = byCol('民進黨')
    const k = byCol('國民黨')
    let verdict = '樣本不足'
    if (d.n >= 5 && k.n >= 5) {
      const diff = d.avg - k.avg
      verdict = Math.abs(diff) < 0.15
        ? '看不出明顯差異'
        : diff < 0 ? '對民進黨相關事件較負面' : '對國民黨相關事件較負面'
    }
    return { o, n: rs.length, d, k, verdict, c: compare(points, o) }
  }).filter((r) => r.n > 0)
  const f = (x: { n: number; avg: number }) => (x.n ? `${x.avg > 0 ? '+' : ''}${x.avg.toFixed(2)}(${x.n})` : '—')
  const pct = (x: number) => `${Math.round(x * 100)}%`
  return (
    <div className="cov-scroll">
      <table className="cov-table">
        <thead>
          <tr>
            <th>媒體</th><th>則數</th><th>民進黨事件平均</th><th>國民黨事件平均</th>
            <th title="把(政黨欄,分數)當格子,比較該媒體與事實分析在各格的點數重疊比例,100% 為完全相同">分布相似度</th>
            <th title="與事實分析在同一政黨欄、且正負方向相同的事件比例">方向一致</th>
            <th title="同一政黨欄內,媒體分數減事實分析分數的平均;正值代表比事實更正面">平均偏差</th>
            <th>判斷</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.o}>
              <td>{r.o}</td><td>{r.n}</td><td>{f(r.d)}</td><td>{f(r.k)}</td>
              <td>{r.c ? `${pct(r.c.overlap)}(${r.c.n})` : '—'}</td>
              <td>{r.c ? pct(r.c.dir) : '—'}</td>
              <td>{r.c ? `${r.c.bias > 0 ? '+' : ''}${r.c.bias.toFixed(2)}` : '—'}</td>
              <td>{r.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CampTable() {
  const camps: Camp[] = ['民主陣營', '威權陣營']
  const events = EVENTS.filter((e) => e.camp)
  return (
    <table className="cov-table">
      <thead>
        <tr><th>事件</th><th>涉及陣營</th><th>各媒體評分</th></tr>
      </thead>
      <tbody>
        {events.map((e) => (
          <tr key={e.id}>
            <td>{e.title}</td>
            <td>{camps.find((c) => c === e.camp)}</td>
            <td>
              {REPORTS.filter((r) => r.event === e.id).map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noreferrer" className="cov-chip" title={r.title}>
                  {r.outlet} {r.score > 0 ? '+' : ''}{r.score}
                </a>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function CoverageDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    ref.current?.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="dialog cov-dialog"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className="dialog-head">
        <h2>為什麼選擇這些新聞</h2>
        <button type="button" onClick={() => ref.current?.close()} aria-label="關閉">×</button>
      </div>

      <p className="cov-note">
        <strong>作者個人判斷,非事實認定。</strong>
        下列分數與「事實分析」是作者依公開資料所做的主觀判斷,可能有誤,也不代表任何媒體或候選人的實際立場。發現錯誤請回報。
      </p>

      <p className="cov-lead">
        本站收錄 {OUTLETS.length} 家媒體的報導,採用標題語氣與事實一致程度最高的新聞。
        下面把 {EVENTS.length} 個事件、{REPORTS.length} 則報導(查詢日期 {PILOT_QUERY_DATE})畫成圖,看各家標題留給人的印象。
        樣本有限,不可據此判斷任何媒體是否偏頗。
      </p>

      <section>
        <h3>圖一:各家報導的印象 × 事件所屬政黨</h3>
        <p className="cov-sub">
          一點是一家媒體對一個事件的報導(同家多則合併為一點)。星形是作者只看事實的判斷。點選下方名稱只看該家,按「全部」恢復。
        </p>
        <Scatter />
      </section>

      <section>
        <h3>各家平均語氣與和事實分析的相似度</h3>
        <p className="cov-sub">
          平均為標題分數的平均,括號為則數。相似度只比較該媒體有報導的事件;滑鼠移到欄名看算法。只描述這批資料,不代表媒體整體立場。
        </p>
        <ToneTable />
      </section>

      <details>
        <summary>評分方式</summary>
        <ul>
          <li>報導的點:這則標題的寫法讓觀眾對某個政黨欄產生多大的正面或負面印象,−3 到 +3。與事實對錯無關。</li>
          <li>標題平鋪直敘就是 0;只有用字帶引導(如「慘了」「挨轟」「捷報」「打臉」)才給分。標題可把矛頭轉向另一陣營,那一點就畫在另一欄。</li>
          <li>星形(事實分析):只看事件本身。有官方認定、當事人承認或判決才給負分;只有質疑、當事人否認、尚無結論,給 0。</li>
          <li>主詞不是該政黨的事件(被害、被攻擊、不起訴、駁回、互批)不算該黨負面。</li>
          <li>分數由作者逐則判定,可能有誤。</li>
        </ul>
      </details>

      <details>
        <summary>圖二:涉及外國或境外政權的事件({EVENTS.filter((e) => e.camp).length} 件)</summary>
        <p className="cov-sub">事件少於 10 個,改用表格。陣營分類的公開指標尚未選定,暫依事件對象判定。</p>
        <CampTable />
      </details>

      <details>
        <summary>方法與限制</summary>
        <ul>
          <li>以搜尋引擎限定各媒體網域查詢事件關鍵字,查到標題才收錄;查不到不代表沒有報導。</li>
          <li>中視、年代查不到任何結果,已從圖中移除。</li>
          <li>事件取自本站已收錄的紀事,這些紀事當初主要依少數幾家媒體蒐集,所以那幾家的覆蓋會偏高,這是樣本造成的偏差。</li>
          <li>評分只依標題,沒有逐篇讀內文。事件取自本站已收錄的紀事,已排除提名、登記、個人經歷介紹等非事件性紀事。</li>
        </ul>
      </details>
    </dialog>
  )
}
