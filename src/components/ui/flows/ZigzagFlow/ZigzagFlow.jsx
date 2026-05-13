import "./ZigZagFlow.css";

export default function ZigZagFlow({ image }) {
  return (
    <img
      src={`/assets/image/collections/${image}`}
      className="zigzag"
    />
  );
}