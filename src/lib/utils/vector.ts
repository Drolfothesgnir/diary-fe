export class Vector {
  x1: number;
  y1: number;
  x2: number;
  y2: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  length() {
    return Math.sqrt((this.x1 - this.x2) ** 2 + (this.y1 - this.y2) ** 2);
  }

  shiftBy(x: number, y: number) {
    return new Vector(this.x1 + x, this.y1 + y, this.x2 + x, this.y2 + y);
  }

  translate(x: number, y: number) {
    return new Vector(x, y, this.x2 - this.x1 + x, this.y2 - this.y1 + y);
  }

  rotate(theta: number) {
    const v1 =
      (this.x2 - this.x1) * Math.cos(theta) -
      (this.y2 - this.y1) * Math.sin(theta);
    const v2 =
      (this.x2 - this.x1) * Math.sin(theta) +
      (this.y2 - this.y1) * Math.cos(theta);
    return Vector.New(v1, v2).translate(this.x1, this.y1);
  }

  scale(c: number) {
    const v1 = (this.x2 - this.x1) * c;
    const v2 = (this.y2 - this.y1) * c;
    return new Vector(this.x1, this.y1, this.x1 + v1, this.y1 + v2);
  }

  rotate_Levy(theta: number = -Math.PI / 4) {
    const v1 =
      0.5 * (this.x2 - this.x1) - 0.5 * Math.tan(theta) * (this.y2 - this.y1);
    const v2 =
      0.5 * Math.tan(theta) * (this.x2 - this.x1) + 0.5 * (this.y2 - this.y1);
    return Vector.New(v1, v2).translate(this.x1, this.y1);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }

  static New(x2: number, y2: number, x1 = 0, y1 = 0) {
    return new Vector(x1, y1, x2, y2);
  }
}
