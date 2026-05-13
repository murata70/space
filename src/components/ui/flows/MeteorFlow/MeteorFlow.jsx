import "./MeteorFlow.css";

export default function MeteorFlow({ image }) {
  const top = Math.random() * 60;

  return (
    <img
      src={`/assets/image/collections/${image}`}
      className="meteor"
      style={{ top }}
    />
  );
}