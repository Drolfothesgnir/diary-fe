import { Vector } from "./vector";

export default function regularPolygon(
  radius: number,
  n: number = 3,
  x = 0,
  y = 0,
  theta = 0
) {
  if (n < 3) {
    throw Error("Polygon must have at least 3 sides");
  }

  const vectors = new Array(n);
  const points = new Float64Array(n * 2);

  const dtheta = (2 * Math.PI) / n;
  let idx = 0;
  for (let i = 0; i < n; i++) {
    points[idx++] = x + Math.cos(theta + i * dtheta) * radius;
    points[idx++] = y + Math.sin(theta + i * dtheta) * radius;
  }

  idx = 0;
  for (let j = 0; j < points.length - 2; j += 2) {
    const v = new Vector(
      points[j],
      points[j + 1],
      points[j + 2],
      points[j + 3]
    );
    vectors[idx++] = v;
  }

  vectors[idx] = new Vector(
    points[points.length - 2],
    points[points.length - 1],
    points[0],
    points[1]
  );

  return vectors;
}
