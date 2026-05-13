import "./FastCrossFlow.css";

export default function FastCrossFlow({ image }) {
  return (
    <img
      src={`/assets/image/collections/${image}`}
      className="fast"
    />
  );
}