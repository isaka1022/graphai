import { GraphAI } from "@/graphai";
import { AgentFilterFunction, AgentFunction } from "@/type";

import { defaultTestContext, agentFilterRunnerBuilder } from "@/utils/test_utils";

import test from "node:test";
import assert from "node:assert";

const simpleAgentFilter1: AgentFilterFunction = async (context, next) => {
  if (!context.filterParams["httpHeaders"]) {
    context.filterParams["httpHeaders"] = {};
  }
  context.filterParams["httpHeaders"]["Authorization"] = "Bearer xxxxxx";
  return next(context);
};
const simpleAgentFilter2: AgentFilterFunction = async (context, next) => {
  if (!context.filterParams["httpHeaders"]) {
    context.filterParams["httpHeaders"] = {};
  }
  context.filterParams["httpHeaders"]["Content-Type"] = "application/json";
  return next(context);
};

export const echoAgent: AgentFunction = async ({ filterParams }) => {
  return filterParams;
};


test("test agent filter", async () => {
  const agentFilters = [
    {
      name: "simpleAgentFilter1",
      agent: simpleAgentFilter1,
    },
    {
      name: "simpleAgentFilter2",
      agent: simpleAgentFilter2,
    },
  ];
  const agentFilterRunner = agentFilterRunnerBuilder(agentFilters);
  const result = await agentFilterRunner({ ...defaultTestContext, inputs: [] }, echoAgent);
  // console.log(JSON.stringify(result));
  assert.deepStrictEqual(result, { httpHeaders: { Authorization: "Bearer xxxxxx", "Content-Type": "application/json" } });
});
