import { CardFace } from './Card.jsx';

function SupporterFace({ data }) {
  return (
    <div className="pack-supporter">
      <div className="ps-top"><span>Trainer</span><span>Supporter</span></div>
      <div className="ps-body">
        <h4>{data.name}</h4>
        <div className="ps-meta">{data.sub} · {data.dates}</div>
        <p>{data.text}</p>
        <div className="ps-rule">{data.rule}</div>
      </div>
    </div>
  );
}

function EnergyFace({ data }) {
  return (
    <div className="pack-energy">
      <div className="pe-orb" style={{ background: data.color }}>{data.code}</div>
      <h5>{data.name}</h5>
      <span>{data.sub}</span>
    </div>
  );
}

export default function PackCard({ item, index, total }) {
  if (item.kind === 'project') return <CardFace project={item.data} index={index} total={total} />;
  if (item.kind === 'supporter') return <SupporterFace data={item.data} />;
  return <EnergyFace data={item.data} />;
}
