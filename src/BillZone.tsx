import { BILLS } from './data/bills'

export function BillZone() {
  return (
    <section className="bill-zone" id="bills" aria-labelledby="bill-zone-title">
      <h2 id="bill-zone-title">立法院法案爭議專區</h2>
      <p className="bill-intro">
        候選人名下若有「立法院表決」的紀事,說明如下:為何該法案被列為爭議,各方怎麼說,以及官方已作出的認定。內容僅整理公開來源,不代表任何評價;個人的投票只有「記名表決」才有官方名單。
      </p>
      {BILLS.map((b) => (
        <details key={b.name} className="bill">
          <summary>
            <strong>{b.name}</strong>
            <span className="bill-dates">{b.dates}</span>
          </summary>
          <p className="bill-what">{b.what}</p>
          <ul className="bill-points">
            {b.points.map((p) => (
              <li key={p.kind + p.text.slice(0, 12)}>
                <span className={`bill-kind kind-${p.kind}`}>{p.kind}</span> {p.text}
              </li>
            ))}
          </ul>
          <p className="bill-votes"><strong>個人表決紀錄:</strong>{b.voteRecord}</p>
          <p className="bill-links">
            {b.links.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </p>
        </details>
      ))}
    </section>
  )
}
