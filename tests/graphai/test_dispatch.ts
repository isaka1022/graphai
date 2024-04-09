import { AgentFunction } from "@/graphai";
import { runTest } from "./runner";

import { sleep } from "~/utils";

import { testAgent } from "./agents";

import test from "node:test";
import assert from "node:assert";

const dispatchAgent: AgentFunction<{ delay: number; fail: boolean }> = async (context) => {
  const { nodeId, retry, params, payload } = context;
  console.log("executing", nodeId);
  await sleep(params.delay / (retry + 1));

  if (params.fail && retry < 2) {
    const result = { [nodeId]: "failed" };
    console.log("failed (intentional)", nodeId, retry);
    throw new Error("Intentional Failure");
  } else {
    const result = Object.keys(payload).reduce(
      (result, key) => {
        result = { ...result, ...payload[key] };
        return result;
      },
      { [nodeId]: "dispatch" },
    );
    console.log("completing", nodeId);
    return { output1: result };
  }
};

test("test dispatch", async () => {
  const result = await runTest("/graphs/test_dispatch.yml", { default: testAgent, alt: dispatchAgent });
  assert.deepStrictEqual(result, {
    node1: { node1: "output" },
    node20: { node2: "dispatch" },
    node3: { node3: "output", node1: "output", node2: "dispatch" },
    node4: { node4: "output", node3: "output", node1: "output", node2: "dispatch" },
    node5: { node5: "output", node4: "output", node3: "output", node1: "output", node2: "dispatch" },
  });
});
