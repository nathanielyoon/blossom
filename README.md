# blossom

Find an [undirect graph's minimum-cost perfect matching](https://w.wiki/8QHM).

```ts
import { Blossom, Edges } from "@nyoon/blossom";
import { assertEquals } from "jsr:@std/assert@^1.0.13";

const edges = [
  [0, 1, Math.random()],
  [0, 2, Math.random()],
  [0, 3, Math.random()],
  [1, 2, Math.random()],
  [1, 3, Math.random()],
  [2, 3, Math.random()],
] satisfies Edges;
const total = (sum: number, $: number, z: number) =>
  sum + (edges.find(([one, two]) => one === $ && two === z)?.[2] || 0);
assertEquals(
  new Blossom(edges, true).mate.reduce(total),
  Math.min(
    ...[[1, 0, 3, 2], [2, 3, 0, 1], [3, 2, 1, 0]].map((matching) =>
      matching.reduce(total)
    ),
  ),
);
```
