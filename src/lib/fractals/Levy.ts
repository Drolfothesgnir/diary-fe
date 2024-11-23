import { Vector } from "../utils/vector";

export default function transform_Levy(V: Vector[], theta?: number): Vector[] {
  const result: Vector[] = new Array(V.length * 2);
  let idx = 0;

  for (let i = 0; i < V.length; i++) {
    const v = V[i];
    const v1 = v.rotate_Levy(theta);
    const v2 = new Vector(v1.x2, v1.y2, v.x2, v.y2);
    result[idx++] = v1;
    result[idx++] = v2;
  }
  return result;
}
