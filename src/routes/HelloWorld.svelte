<script lang="ts">
  import { onMount } from "svelte";
  import { Vector } from "../lib/utils/vector";

  let canvasRef: HTMLCanvasElement;
  let n = 0;
  let ctx: CanvasRenderingContext2D | null = null;

  const WIDTH = 1000;
  const HEIGHT = 800;
  const v1 = Vector.New(WIDTH / 4, HEIGHT / 4, -WIDTH / 4, HEIGHT / 4);

  const initCanvas = () => {
    canvasRef.width = WIDTH;
    canvasRef.height = HEIGHT;

    ctx = canvasRef.getContext("2d")!;
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.scale(1, -1);

    draw(ctx);
  };

  function transform_Levy(V: Vector[], theta?: number): Vector[] {
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

  function get_points(V: Vector[]) {
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

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT);
    let V = [v1];

    for (let i = 0; i < n; i++) {
      V = transform_Levy(V);
    }

    const points = get_points(V);

    const path = new Path2D();
    path.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) {
      path.lineTo(points[i], points[i + 1]);
    }
    ctx.stroke(path);
  };

  onMount(() => {
    initCanvas();
  });

  const increase_i = () => {
    n += 1;
    draw(ctx!);
  };

  const decrease_i = () => {
    n = Math.max(0, n - 1);
    draw(ctx!);
  };
</script>

<div class="wrapper">
  <canvas bind:this={canvasRef}></canvas>
  <button on:click={increase_i}> Add transformation </button>

  <button disabled={n == 0} on:click={decrease_i}>
    Remove transformation
  </button>
  <span>
    Number of iterations: {n}
  </span>
</div>

<style lang="scss">
  .wrapper {
    canvas {
      border: 1px solid #000;
    }
  }
</style>
