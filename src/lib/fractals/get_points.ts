import type { Vector } from "../utils/vector";

export default function get_points(V: Vector[]) {
  const points = new Float64Array(V.length * 2 + 2);
  points[0] = V[0].x1;
  points[1] = V[0].y1;

  let idx = 2;

  for (let i = 0; i < V.length; i++) {
    const v = V[i];
    points[idx++] = v.x2;
    points[idx++] = v.y2;
  }
  return points;
}
