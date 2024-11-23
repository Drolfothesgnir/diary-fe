<script lang="ts">
  import { onMount } from "svelte";
  import { Vector } from "../utils/vector";
  import get_points from "../fractals/get_points";

  const WIDTH = 2000;
  const HEIGHT = 1600;
  const DISPLAY_WIDTH = 1000;
  const DISPLAY_HEIGHT = 800;
  const PIXEL_RATIO = window.devicePixelRatio || 1;

  export let onLoad: (ctx: CanvasRenderingContext2D) => void = () => {};
  export let transform: ((V: Vector[]) => Vector[]) | undefined = undefined;
  export let extractPoints: (V: Vector[]) => Float64Array = get_points;
  export let initialState: Vector[];
  export let canvasWidth: number = WIDTH;
  export let canvasHeight: number = HEIGHT;

  function setupHiDPICanvas(canvas: HTMLCanvasElement) {
    // Set display size
    canvas.style.width = DISPLAY_WIDTH + "px";
    canvas.style.height = DISPLAY_HEIGHT + "px";

    // Set actual size in memory
    canvas.width = canvasWidth * PIXEL_RATIO;
    canvas.height = canvasHeight * PIXEL_RATIO;

    // Get context
    const context = canvas.getContext("2d")!;

    // Scale all drawing operations by the dpr
    context.scale(PIXEL_RATIO, PIXEL_RATIO);

    return context;
  }

  let canvasRef: HTMLCanvasElement;
  let n = 0;
  let ctx: CanvasRenderingContext2D | null = null;

  const initCanvas = () => {
    ctx = setupHiDPICanvas(canvasRef);

    // Apply transformations after setting up HiDPI
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.scale(1, -1);

    draw(ctx);
    onLoad(ctx);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    if (!transform) {
      return;
    }
    // Clear the entire canvas using the transformed coordinates
    ctx.save();
    ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvasWidth * PIXEL_RATIO, canvasHeight * PIXEL_RATIO);
    ctx.restore();

    // Fill with white background
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(
      -canvasWidth / 2,
      -canvasHeight / 2,
      canvasWidth,
      canvasHeight
    );
    ctx.restore();

    let V = initialState;

    for (let i = 0; i < n; i++) {
      V = transform(V);
    }

    const points = extractPoints(V);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.lineCap = "square";
    ctx.lineJoin = "miter";

    const path = new Path2D();
    path.moveTo(points[0], points[1]);
    for (let i = 2; i < points.length; i += 2) {
      path.lineTo(points[i], points[i + 1]);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

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
  <div class="controls">
    <button on:click={increase_i}> Add transformation </button>
    <button disabled={n == 0} on:click={decrease_i}>
      Remove transformation
    </button>
    <span>Number of iterations: {n}</span>
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    canvas {
      border: 1px solid #000;
      display: block;
      background: white;
    }

    .controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
  }
</style>
