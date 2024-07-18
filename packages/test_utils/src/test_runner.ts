import { GraphAI, GraphData, AgentFunctionInfoDictionary, AgentFunctionInfo, defaultTestContext, DefaultResultData, ValidationError } from "graphai";
import * as defaultTestAgents from "@graphai/vanilla";
import { namedInputValidatorFilter } from "@graphai/agent_filters";

import { readGraphaiData, mkdirLogDir, fileBaseName } from "./file_utils";
import { callbackLog } from "./utils";

import path from "path";
import * as fs from "fs";

import assert from "node:assert";
import test from "node:test";

export const readGraphData = (baseDir: string, file: string) => {
  const file_path = path.resolve(baseDir) + "/.." + file;
  return readGraphaiData(file_path);
};

export const fileTestRunner = async (
  baseDir: string,
  file: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary,
  callback: (graph: GraphAI) => void = () => {},
) => {
  return await graphDataTestRunner(baseDir, file, readGraphData(baseDir, file), agentFunctionInfoDictionary, callback);
};

export const graphDataTestRunner = async <T = DefaultResultData>(
  logBaseDir: string,
  logFileName: string,
  graph_data: GraphData,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary,
  callback: (graph: GraphAI) => void = () => {},
  all: boolean = true,
) => {
  const agentFilters = [
    {
      name: "namedInputValidatorFilter",
      agent: namedInputValidatorFilter,
    },
  ];

  const baseDir = path.resolve(logBaseDir) + "/../logs/";
  mkdirLogDir(baseDir);
  const log_path = baseDir + fileBaseName(logFileName) + ".log";
  const graph = new GraphAI(graph_data, { ...defaultTestAgents, ...agentFunctionInfoDictionary }, { agentFilters });

  if (process.argv[2] === "-v") {
    graph.onLogCallback = callbackLog;
  }

  callback(graph);

  const results = await graph.run<T>(all);
  fs.writeFileSync(log_path, JSON.stringify(graph.transactionLogs(), null, 2));
  return results;
};

export const rejectFileTest = async (
  baseDir: string,
  file: string,
  errorMessage: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary = {},
  validationError: boolean = true,
) => {
  return await rejectTest(baseDir, readGraphData(baseDir, file), errorMessage, agentFunctionInfoDictionary, validationError);
};
export const rejectTest = async (
  logBaseDir: string,
  graphdata: GraphData,
  errorMessage: string,
  agentFunctionInfoDictionary: AgentFunctionInfoDictionary = {},
  validationError: boolean = true,
) => {
  await assert.rejects(
    async () => {
      await graphDataTestRunner(logBaseDir, __filename, graphdata, { ...defaultTestAgents, ...agentFunctionInfoDictionary });
    },
    { name: "Error", message: validationError ? new ValidationError(errorMessage).message : errorMessage },
  );
};

// for agent
export const agentTestRunner = async (agentInfo: AgentFunctionInfo) => {
  const { agent, samples, inputs: inputSchema } = agentInfo;
  if (samples.length === 0) {
    console.log(`test ${agentInfo.name}: No test`);
  } else {
    for await (const sampleKey of samples.keys()) {
      test(`test ${agentInfo.name} ${sampleKey}`, async () => {
        const { params, inputs, result, graph } = samples[sampleKey];
        const flatInputs = Array.isArray(inputs) ? inputs : [];
        const namedInputs = Array.isArray(inputs) ? {} : inputs;

        const actual = await agent({
          ...defaultTestContext,
          params,
          inputs: flatInputs,
          inputSchema,
          namedInputs,
          graphData: graph,
        });
        assert.deepStrictEqual(actual, result);
      });
    }
  }
};
