import { assertEquals, assertLessOrEqual } from "@std/assert";
import { Blossom } from "../main.ts";

const A = await Deno.readTextFile(
  import.meta.url.slice(7, -8) + "/mwmatching.py",
);
const B = 0x100000000, C = 0x39e2d;
const edges = (size: number, seed_1: number, seed_2: number) => {
  const a: [number, number, number][] = [], b = Array<Float64Array>(size);
  for (let y = 0; y < size; ++y) b[y] = new Float64Array(size);
  for (let y = 0; y < size; ++y) {
    for (let x = y + 1; x < size; ++x) {
      seed_1 = seed_1 * C >>> 0, seed_2 = seed_2 * C >>> 0;
      const f = +(seed_1 + seed_2 / B).toFixed(1);
      const [g, h] = seed_1 > seed_2 ? [x, y] : [y, x], i = y ^ x;
      a.push([g, h, b[y][x] = b[x][y] = i % 11 ? 0 : i & 1 ? -f : f]);
    }
  }
  return [a, b] satisfies [unknown, unknown];
};
const mwmatching = async (size: number, seed_1: number, seed_2: number) =>
  JSON.parse(
    await new Deno.Command("python3", {
      args: [
        "-c",
        `import json
DEBUG = None
CHECK_DELTA = False
CHECK_OPTIMUM = False
${A.slice(1189, A.indexOf("# Unit tests"))}
one, two = ${seed_1}, ${seed_2}
edges = []
for vertex_1 in range(${size}):
    for vertex_2 in range(vertex_1 + 1, ${size}):
        one = one * ${C} % ${B}
        two = two * ${C} % ${B}
        weight = round(one + two / ${B}, 1)
        xor = vertex_1 ^ vertex_2
        if xor % 11: weight = 0
        elif xor & 1: weight *= -1
        edges.append([vertex_1, vertex_2, weight])
print(json.dumps([
    maxWeightMatching(edges, True),
    maxWeightMatching(edges, False),
], separators=(",",":")))`,
      ],
    }).output().then((Z) => new TextDecoder().decode(Z.stdout)),
  );
Deno.test(async function python_blossom() {
  for (let z = 2; z < 0x80; z += (Math.random() * 32 | 0) + 32) {
    const a = new Int32Array(2);
    crypto.getRandomValues(new Uint8Array(a.buffer));
    const c = a[0], d = a[1], [e, f] = edges(z, c, d);
    const g = await mwmatching(z, c, d);
    for (let y = 0; y < 2; ++y) {
      const h = [...new Blossom(e, !y).mate];
      try {
        assertEquals(h, g[y], `blossom ${z} same`);
      } catch {
        let i = 0, j = 0;
        for (let x = 0; x < z; ++x) i += f[x][h[x]], j += f[x][g[y][x]];
        try {
          assertLessOrEqual(i, j, `blossom ${z} weight`);
        } catch (Y) {
          console.log([z, c, d]);
          throw Y;
        }
      }
    }
  }
});
