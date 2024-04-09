import { GraphAI } from "@/graphai";
import { testAgent } from "./agents";
import { runTest } from "./runner";

import test from "node:test";
import assert from "node:assert";

test("test base", async () => {
  const result = await runTest("/graphs/test_base.yml", testAgent);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
});

test("test retry", async () => {
  const result = await runTest("/graphs/test_retry.yml", testAgent);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "output" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "output" },
  });
});

test("test error", async () => {
  const result = await runTest("/graphs/test_error.yml", testAgent);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
  });
});

test("test timeout", async () => {
  const result = await runTest("/graphs/test_timeout.yml", testAgent);
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "output" },
    node3: { node3: "output", node1: "output", node2: "output" },
  });
});

test("test source", async () => {
  const result = await runTest("/graphs/test_source.yml", testAgent, (graph: GraphAI) => {
    graph.injectResult("node2", { node2: "injected" });
  });
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node2: { node2: "injected" },
    node3: { node3: "output", node1: "output", node2: "injected" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "injected" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "injected" },
  });
});

test("test source2", async () => {
  const result = await runTest("/graphs/test_source2.yml", testAgent, (graph: GraphAI) => {
    graph.injectResult("node1", { node1: "injected" });
    graph.injectResult("node2", { node2: "injected" });
  });
  assert.deepStrictEqual(result, {
    node1: { node1: "injected" },
    node2: { node2: "injected" },
    node3: { node3: "output", node1: "injected", node2: "injected" },
    node4: { node4: "output", node3: "output", node1: "injected", node2: "injected" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "injected", node2: "injected" },
  });
});
