import { Vector } from "../utils/vector";

export default function transform_Minkowski(V: Vector[]): Vector[] {
  // const result: Vector[] = new Array(V.length * 8);
  const result = [];
  let idx = 0;

  for (let i = 0; i < V.length; i++) {
    const v = V[i];
    const v1 = v.scale(0.25);
    const v2 = v1.rotate(-Math.PI / 2).translate(v1.x2, v1.y2);
    const v3 = v1.translate(v2.x2, v2.y2);
    const v4 = v3.rotate(Math.PI / 2).translate(v3.x2, v3.y2);
    const v5 = v4.translate(v4.x2, v4.y2);
    const v6 = v1.translate(v5.x2, v5.y2);
    const v7 = v2.translate(v6.x2, v6.y2);

    result[idx++] = v1;
    result[idx++] = v2;
    result[idx++] = v3;
    result[idx++] = v4;
    result[idx++] = v5;
    result[idx++] = v6;
    result[idx++] = v7;
    result[idx++] = v1.translate(v7.x2, v7.y2);
  }
  return result;
}
