import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, nestedAgent, copyAgent } from "@/experimental_agents";
import input from "@inquirer/input";

const tools = [
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "get wether information of the specified location",
      parameters: {
        type: "object",
        properties: {
          latitude: {
            type: "number",
            description: "The latitude of the location.",
          },
          longitude: {
            type: "number",
            description: "The longitude of the location.",
          },
        },
        required: ["latitude", "longitude"],
      },
    },
  },
];

const graph_data = {
  version: 0.2,
  loop: {
    while: "continue",
  },
  nodes: {
    continue: {
      value: true,
      update: "checkInput",
    },
    messages: {
      // This node holds the conversation, array of messages.
      value: [ {role: "system", content:"You are a meteorologist. Use getWeather API, only when the user ask for the weather information."} ],
      update: "reducer",
      isResult: true,
    },
    userInput: {
      // This node receives an input from the user.
      agent: () => input({ message: "You:" }),
    },
    checkInput: {
      agent: (query: string) => query !== "/bye",
      inputs: ["userInput"],
    },
    appendedMessages: {
      // This node appends the user's input to the array of messages.
      agent: (content: string, messages: Array<any>) => [...messages, { role: "user", content }],
      inputs: ["userInput", "messages"],
      if: "checkInput",
    },
    groq: {
      // This node sends those messages to Llama3 on groq to get the answer.
      agent: "groqAgent",
      params: {
        model: "Llama3-8b-8192",
        tools,
      },
      inputs: [undefined, "appendedMessages"],
    },
    tool_calls: {
      agent: "copyAgent",
      inputs: ["groq.choices.$0.message.tool_calls"],
      if: "groq.choices.$0.message.tool_calls"
    },
    debug: {
      agent: (args: any) => console.log(`Tools: ${JSON.stringify(args)}`),
      inputs: ["tool_calls.$0"]
    },

    output: {
      // This node displays the responce to the user.
      agent: (answer: string) => console.log(`Llama3: ${answer}\n`),
      inputs: ["groq.choices.$0.message.content"],
      if: "groq.choices.$0.message.content",
    },
    reducer: {
      // This node append the responce to the messages.
      agent: "pushAgent",
      inputs: ["appendedMessages", "groq.choices.$0.message"],
    },
  },
};

export const main = async () => {
  const result = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      copyAgent,
      nestedAgent,
    },
    () => {},
    false,
  );
  console.log("Complete", result);
};

if (process.argv[1] === __filename) {
  main();
}
