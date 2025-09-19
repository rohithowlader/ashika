import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h3>404</h3>
      <Link to="/revenue">Go to Revenue</Link>
    </div>
  );
}
