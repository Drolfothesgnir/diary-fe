<script lang="ts">
  import { Vector } from "../lib/utils/vector";
  import transform_Levy from "../lib/fractals/Levy";
  import Canvas from "../lib/components/Canvas.svelte";
  import regularPolygon from "../lib/utils/polygon";
  import transform_Minkowski from "../lib/fractals/Minkowski";

  const WIDTH = 2000;
  const HEIGHT = 1600;
  const v1 = Vector.New(WIDTH / 4, HEIGHT / 4, -WIDTH / 4, HEIGHT / 4);
</script>

<div class="wrapper">
  <!-- <Canvas
    canvasWidth={WIDTH}
    canvasHeight={HEIGHT}
    initialState={[v1]}
    transform={transform_Levy}
  />
  <Canvas
    canvasWidth={WIDTH}
    canvasHeight={HEIGHT}
    initialState={regularPolygon(600, 16)}
    transform={transform_Levy}
  /> -->
  <Canvas
    canvasWidth={WIDTH}
    canvasHeight={HEIGHT}
    initialState={[v1]}
    transform={transform_Minkowski}
  />
  <Canvas
    canvasWidth={WIDTH}
    canvasHeight={HEIGHT}
    initialState={regularPolygon(600, 10)}
    transform={transform_Minkowski}
  />
</div>
