import { assertEquals } from "jsr:@std/assert@^1.0.13";
import { Blossom, Edges } from "@nyoon/blossom";

Deno.test("mwmatching", () =>
  fetch("https://jorisvr.nl/files/graphmatching/20130407/mwmatching.py").then(
    ($) => $.text(),
  ).then(($) =>
    $.replace(/^(?:True|False)$/, ($) => $.toLowerCase())
      .replace("math.pi", `${Math.PI}`)
      .replace("math.exp(1)", `${Math.exp(1)}`)
      .replace("math.sqrt(2.0)", `${Math.SQRT2}`)
      .matchAll(/\(\[([^\]]+)\]\), \[([^\]]+)\].*?(True)?/g)
      .forEach(($) =>
        assertEquals(
          new Blossom(
            $[1].slice(2, -2).split("), (").map(($) =>
              $.split(",").map(Number)
            ) as Edges,
            !!$[3],
          ).mate,
          Int32Array.from($[2].trim().split(", ")),
        )
      )
  ));
