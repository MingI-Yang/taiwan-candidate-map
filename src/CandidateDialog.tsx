import { useEffect, useMemo, useRef, useState } from 'react'
import type { Candidate, County } from './data/candidates'
import { PARTIES, PARTY_ORDER } from './data/parties'
import { CATEGORIES, DOMAINS, MAX_ENTRIES, profileOf } from './data/records'
import type { Category, Domain, Dispute, Entry, KinRecord, LegalRecord, Source } from './data/records'

const collator = new Intl.Collator('zh-Hant-u-co-stroke')
/** 錯誤回報入口 */
const REPORT_URL = 'https://github.com/MingI-Yang/taiwan-candidate-map/issues/new'

function sortCandidates(list: Candidate[]) {
  return list
    .filter((c) => c.status !== 'withdrawn')
    .sort((a, b) => {
      if (a.number != null && b.number != null) return a.number - b.number
      const pa = PARTY_ORDER.indexOf(a.party)
      const pb = PARTY_ORDER.indexOf(b.party)
      return pa - pb || collator.compare(a.name, b.name)
    })
}

function Emblem({ partyId }: { partyId: string }) {
  const p = PARTIES[partyId]
  if (partyId === 'ind') return <span className="emblem emblem-ind" aria-hidden="true" />
  if (p.logo) {
    return <img className="emblem" src={`${import.meta.env.BASE_URL}logos/${p.logo}`} alt="" />
  }
  return (
    <span className="emblem emblem-text" style={{ background: p.color }} aria-hidden="true">
      {p.short}
    </span>
  )
}

function SourceLinks({ source, others, verified }: { source: Source; others?: Source[]; verified: string }) {
  return (
    <p className="entry-source">
      <a href={source.url} target="_blank" rel="noreferrer">{source.outlet}:{source.title}</a>
      {source.unopened && <span className="tag tag-unopened">未開啟原文</span>}
      {others?.map((o) => (
        <span key={o.url}> · <a href={o.url} target="_blank" rel="noreferrer">{o.outlet}</a>{o.unopened && '(未開啟原文)'}</span>
      ))}
      <span className="entry-verified"> · 查證 {verified}</span>
      <a className="entry-report" href={REPORT_URL} target="_blank" rel="noreferrer">回報錯誤</a>
    </p>
  )
}

function SourceLink({ source }: { source: Source }) {
  return (
    <a href={source.url} target="_blank" rel="noreferrer">
      {source.outlet}:{source.title}{source.unopened ? '(未開啟原文)' : ''}
    </a>
  )
}

function DisputeBlock({ d }: { d: Dispute }) {
  return (
    <details className="dispute">
      <summary>查看各方說法與查證</summary>
      <dl>
        <dt>質疑方說法</dt>
        <dd>{d.claim}</dd>
        {d.response && (<><dt>回應方說法</dt><dd>{d.response}</dd></>)}
        {d.facts && d.facts.length > 0 && (
          <>
            <dt>可查證事實</dt>
            <dd><ul>{d.facts.map((f) => <li key={f}>{f}</li>)}</ul></dd>
          </>
        )}
        {d.official && (
          <>
            <dt>官方說明</dt>
            <dd>{d.official.text} <SourceLink source={d.official.source} /></dd>
          </>
        )}
        {d.factcheck && (
          <>
            <dt>查核機構</dt>
            <dd>{d.factcheck.text} <SourceLink source={d.factcheck.source} /></dd>
          </>
        )}
        <dt>原文</dt>
        <dd>{d.original ? <SourceLink source={d.original} /> : '未能取得原文'}</dd>
      </dl>
    </details>
  )
}

function LegalList({ title, items, note }: { title: string; items: (LegalRecord | KinRecord)[]; note?: string }) {
  return (
    <section className="legal">
      <h4>{title}</h4>
      {note && <p className="legal-note">{note}</p>}
      {items.length === 0 ? (
        <p className="empty">查無符合來源的資料</p>
      ) : (
        <ul className="entries">
          {items.map((r) => (
            <li key={`${r.date}|${r.summary}`}>
              <div className="entry-meta">
                <span>{r.date}</span>
                {'relation' in r && <span className="tag">親屬:{r.relation}</span>}
                <span className="tag">{r.stage}</span>
                <span className="tag">{r.result}{r.final ? '(確定)' : ''}</span>
              </div>
              <p className="entry-summary">{r.summary}</p>
              <SourceLinks source={r.source} others={r.others} verified={r.verified} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Profile({ county, candidate, onBack }: { county: County; candidate: Candidate; onBack: () => void }) {
  const profile = profileOf(county.name, candidate.name)
  const [cat, setCat] = useState<Category | null>(null)
  const [domain, setDomain] = useState<Domain | ''>('')

  const entries = useMemo(
    () =>
      profile.entries
        .filter((e: Entry) => (!cat || e.category === cat) && (!domain || e.domains.includes(domain)))
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, MAX_ENTRIES),
    [profile, cat, domain],
  )

  return (
    <div>
      <button type="button" className="back" onClick={onBack}>← 返回名單</button>
      <h3 className="profile-name">
        <Emblem partyId={candidate.party} />
        {candidate.name}
        <span className="cand-party">{PARTIES[candidate.party].name}</span>
      </h3>
      <p className="notice">本頁內容僅整理公開來源,不代表任何評價。來源限官方紀錄與華視、公視、民視、鏡新聞、自由時報、三立、東森。</p>

      {!profile.collected ? (
        <p className="empty">資料蒐集中,尚未收錄。</p>
      ) : (
        <>
          {profile.partial && <p className="notice">目前僅收錄部分資料,其餘仍在蒐集中。</p>}
          <LegalList title="司法紀錄" items={profile.legal} />
          <LegalList
            title="親屬紀錄"
            items={profile.kin}
            note="僅列配偶或父母已有判決、且來源提及與該候選人相關的案件。"
          />
          <section>
            <h4>紀事</h4>
            <div className="filters">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`chip${cat === c ? ' on' : ''}`}
                  aria-pressed={cat === c}
                  onClick={() => setCat(cat === c ? null : c)}
                >
                  {c}
                </button>
              ))}
              <select value={domain} onChange={(e) => setDomain(e.target.value as Domain | '')} aria-label="領域">
                <option value="">全部領域</option>
                {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            {entries.length === 0 ? (
              <p className="empty">查無符合來源的資料</p>
            ) : (
              <ul className="entries">
                {entries.map((e) => (
                  <li key={`${e.date}|${e.summary}`}>
                    <div className="entry-meta">
                      <span>{e.date}</span>
                      <span className={`tag cat-${e.category}`}>{e.category}</span>
                      {e.domains.map((d) => <span key={d} className="tag">{d}</span>)}
                      <span className="tag">{e.context}</span>
                      {e.dispute?.status && (
                        <span className={`tag tag-status${e.dispute.status === '已有官方說明' ? ' status-official' : ''}`}>{e.dispute.status}</span>
                      )}
                    </div>
                    <p className="entry-summary">{e.summary}</p>
                    {e.dispute && <DisputeBlock d={e.dispute} />}
                    <SourceLinks source={e.source} others={e.others} verified={e.verified} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export function CandidateDialog({ county, onClose }: { county: County; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [picked, setPicked] = useState<Candidate | null>(null)

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  const candidates = sortCandidates(county.candidates)

  return (
    <dialog
      ref={ref}
      className="dialog"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div className="dialog-head">
        <h2>{county.name}長候選人</h2>
        <button type="button" onClick={() => ref.current?.close()} aria-label="關閉">×</button>
      </div>
      {picked ? (
        <Profile county={county} candidate={picked} onBack={() => setPicked(null)} />
      ) : (
        <>
          <p className="dialog-sub">共 {candidates.length} 人,點選姓名查看紀事</p>
          <ul className="candidates">
            {candidates.map((c) => (
              <li key={c.name}>
                <button type="button" className="cand-row" onClick={() => setPicked(c)}>
                  <Emblem partyId={c.party} />
                  <span className="cand-name">{c.name}</span>
                  <span className="cand-party">{PARTIES[c.party].name}</span>
                  {c.name === county.incumbent.name && c.party === county.incumbent.party && (
                    <span className="tag tag-incumbent">現任</span>
                  )}
                  {c.status === 'nominated' && <span className="tag">待登記</span>}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </dialog>
  )
}
