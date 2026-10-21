import { useMemo, useState } from 'react'
import { geoArea, geoCentroid, geoDistance, geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson'
import countiesTopo from 'taiwan-atlas/counties-10t.json'
import { COUNTIES, DATA_UPDATED } from './data/candidates'
import type { County } from './data/candidates'
import { PARTIES } from './data/parties'
import { CandidateDialog } from './CandidateDialog'
import { BillZone } from './BillZone'
import { CoverageDialog } from './CoverageDialog'
import './App.css'

type CountyFeature = Feature<Geometry, { COUNTYNAME: string }>

const W = 640
const H = 820
const ISLANDS = ['連江縣', '金門縣', '澎湖縣']
const INSET_BOX = 150

/** 離島縣只保留主要島嶼,去掉離群小島,避免插圖縮得太小 */
function mainIslands(f: CountyFeature): CountyFeature {
  if (f.geometry.type !== 'MultiPolygon') return f
  const polys = (f.geometry as MultiPolygon).coordinates.map(
    (coordinates) => ({ coordinates, area: geoArea({ type: 'Polygon', coordinates }) }),
  )
  const biggest = polys.reduce((a, b) => (b.area > a.area ? b : a))
  const anchor = geoCentroid({ type: 'Polygon', coordinates: biggest.coordinates })
  const kept = polys.filter(
    (p) =>
      p.area >= biggest.area * 0.05 &&
      geoDistance(anchor, geoCentroid({ type: 'Polygon', coordinates: p.coordinates })) < 0.006,
  )
  return { ...f, geometry: { type: 'MultiPolygon', coordinates: kept.map((p) => p.coordinates) } }
}

const byName = new Map(COUNTIES.map((c) => [c.name, c]))

function fillFor(county: County | undefined) {
  return PARTIES[county?.incumbent.party ?? 'ind'].color
}

export default function App() {
  const [selected, setSelected] = useState<County | null>(null)
  const [showCoverage, setShowCoverage] = useState(false)

  const { main, insets } = useMemo(() => {
    const topo = countiesTopo as unknown as Topology
    const fc = feature(topo, topo.objects.counties) as FeatureCollection<Geometry, { COUNTYNAME: string }>
    const features = fc.features as CountyFeature[]
    const mainFeatures = features.filter((f) => !ISLANDS.includes(f.properties.COUNTYNAME))
    const mainProj = geoMercator().fitExtent(
      [[INSET_BOX + 30, 10], [W - 10, H - 10]],
      { type: 'FeatureCollection', features: mainFeatures },
    )
    const mainPath = geoPath(mainProj)
    const main = mainFeatures.map((f) => ({ name: f.properties.COUNTYNAME, d: mainPath(f) ?? '' }))
    const insets = ISLANDS.map((name, i) => {
      const f = mainIslands(features.find((x) => x.properties.COUNTYNAME === name)!)
      const pad = 14
      const proj = geoMercator().fitExtent(
        [[pad, pad + 20], [INSET_BOX - pad, INSET_BOX - pad]],
        f,
      )
      return { name, d: geoPath(proj)(f) ?? '', x: 10, y: 20 + i * (INSET_BOX + 20) }
    })
    return { main, insets }
  }, [])

  const open = (name: string) => {
    const c = byName.get(name)
    if (c) setSelected(c)
  }

  const activate = (name: string) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': `${name}縣市長候選人`,
    onClick: () => open(name),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        open(name)
      }
    },
  })

  return (
    <main className="page">
      <header>
        <h1>2026 九合一選舉 縣市長候選人地圖</h1>
        <p>點選地圖上的縣市,查看該縣市的縣市長候選人。底色為現任縣市長所屬政黨。</p>
      </header>

      <svg viewBox={`0 0 ${W} ${H}`} className="map" aria-label="台灣縣市地圖">
        {main.map((m) => (
          <path key={m.name} d={m.d} fill={fillFor(byName.get(m.name))} className="county" {...activate(m.name)}>
            <title>{m.name}</title>
          </path>
        ))}
        {insets.map((s) => (
          <g key={s.name} transform={`translate(${s.x},${s.y})`} className="inset" {...activate(s.name)}>
            <rect width={INSET_BOX} height={INSET_BOX} rx={8} className="inset-box" />
            <text x={INSET_BOX / 2} y={16} textAnchor="middle" className="inset-label">{s.name}</text>
            <path d={s.d} fill={fillFor(byName.get(s.name))} stroke="var(--bg)" />
          </g>
        ))}
      </svg>

      <div className="map-foot">
      <ul className="legend" aria-label="圖例">
        {['dpp', 'kmt', 'tpp', 'ind'].map((id) => (
          <li key={id}>
            <span className="swatch" style={{ background: PARTIES[id].color }} />
            現任{PARTIES[id].name}
          </li>
        ))}
      </ul>
      <button type="button" className="why-news" onClick={() => setShowCoverage(true)}>為什麼選擇這些新聞</button>
      </div>

      <BillZone />

      <footer>
        <p>
          非官方網站。資料來源:
          <a href="https://news.pts.org.tw/article/801606" target="_blank" rel="noreferrer">公視新聞網</a>、
          <a href="https://zh.wikipedia.org/zh-hant/2026%E5%B9%B4%E4%B8%AD%E8%8F%AF%E6%B0%91%E5%9C%8B%E7%9B%B4%E8%BD%84%E5%B8%82%E9%95%B7%E5%8F%8A%E7%B8%A3%E5%B8%82%E9%95%B7%E9%81%B8%E8%88%89" target="_blank" rel="noreferrer">維基百科</a>;
          正式名單與號次以中央選舉委員會公告為準。
        </p>
        <p>紀事的新聞來源僅限華視、公視、民視、鏡新聞、自由時報、三立、東森與官方紀錄。</p>
        <p>
          本站由個人作者製作與維護,非政黨、候選人或媒體所設,不是民調,不推薦或反對任何候選人;
          各頁分數與判斷為作者個人判斷,不是事實認定,也不具官方效力。
        </p>
        <p>
          發現錯誤或不實,請至
          <a href="https://github.com/MingI-Yang/taiwan-candidate-map/issues/new" target="_blank" rel="noreferrer">GitHub 回報</a>。
          查證屬實後,我們會在 7 日內更正或移除,並更新下方日期。
        </p>
        <p>最後更新:{DATA_UPDATED}</p>
      </footer>

      {showCoverage && <CoverageDialog onClose={() => setShowCoverage(false)} />}
      {selected && <CandidateDialog county={selected} onClose={() => setSelected(null)} />}
    </main>
  )
}
