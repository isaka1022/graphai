!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).graphai={})}(this,(function(t){"use strict";var e;t.NodeState=void 0,(e=t.NodeState||(t.NodeState={})).Waiting="waiting",e.Queued="queued",e.Executing="executing",e.ExecutingServer="executing-server",e.Failed="failed",e.TimedOut="timed-out",e.Abort="abort",e.Completed="completed",e.Injected="injected",e.Skipped="skipped";const s=(t,e=!1)=>{if(e){if("string"==typeof t&&"."===t[0]){return{nodeId:"self",propIds:t.split(".").slice(1)}}return{value:t}}if("string"==typeof t){const e=/^:(.*)$/,s=t.match(e);if(!s)return{value:t};const i=s[1].split(".");return 1==i.length?{nodeId:i[0]}:{nodeId:i[0],propIds:i.slice(1)}}return{value:t}};function i(t,e,s=!1){if(!t){if(!s)throw new Error(e);console.warn("warn: "+e)}}const n=t=>null!==t&&"object"==typeof t,o=t=>null==t,r="Intentional Error for Debugging",a={name:"defaultAgentInfo",samples:[{inputs:[],params:{},result:{}}],description:"",category:[],author:"",repository:"",license:""},h=t=>{const e=[];return Object.keys(t).forEach((s=>{e.push([s]),Object.keys(t[s]).length>0&&h(t[s]).forEach((t=>{e.push([s,...t])}))})),e},u=(t,e)=>h({[t]:d(e)}).map((t=>":"+t.join("."))),d=t=>null==t||"string"==typeof t?{}:Array.isArray(t)?Array.from(t.keys()).reduce(((e,s)=>(e["$"+String(s)]=d(t[s]),e)),{}):Object.keys(t).reduce(((e,s)=>(e[s]=d(t[s]),e)),{}),c=t=>!!(Array.isArray(t)?0!==t.length:t),l={debugInfo:{nodeId:"test",retry:0,verbose:!0,state:t.NodeState.Executing,subGraphs:new Map},params:{},filterParams:{},agents:{},log:[]},p=t=>n(t)&&!Array.isArray(t)&&Object.keys(t||{}).length>0,g=t=>"agent"in t,f=t=>!("agent"in t),y=t=>{if(Array.isArray(t))return t.map((t=>y(t))).flat();if(n(t))return Object.values(t).map((t=>y(t))).flat();if("string"==typeof t){const e=[...t.matchAll(/\${(:[^}]+)}/g)].map((t=>t[1]));if(e.length>0)return y(e)}return s(t)},m=t=>t.filter((t=>t.nodeId)).map((t=>t.nodeId));class I{constructor(e){this.nodeId=e,this.state=t.NodeState.Waiting}initForComputedNode(t,e){this.agentId=t.getAgentId(),this.params=t.params,e.appendLog(this)}onInjected(t,e,s){const i="endTime"in this;this.result=t.result,this.state=t.state,this.endTime=Date.now(),this.injectFrom=s,e.setLoopLog(this),i?e.updateLog(this):e.appendLog(this)}onComplete(t,e,s){this.result=t.result,this.resultKeys=u(this.agentId||"",t.result),this.state=t.state,this.endTime=Date.now(),e.setLoopLog(this),s.length>0&&(this.log=s),e.updateLog(this)}beforeExecute(t,e,s,i){this.state=t.state,this.retryCount=t.retryCount>0?t.retryCount:void 0,this.startTime=s,this.inputs=m(t.dataSources),this.inputsData=i.length>0?i:void 0,e.setLoopLog(this),e.appendLog(this)}beforeAddTask(t,e){this.state=t.state,e.setLoopLog(this),e.appendLog(this)}onError(t,e,s){this.state=t.state,this.errorMessage=s,this.endTime=Date.now(),e.setLoopLog(this),e.updateLog(this)}onSkipped(t,e){this.state=t.state,e.setLoopLog(this),e.updateLog(this)}}const b=/^[a-zA-Z]+\([^)]*\)$/,w=[(t,e)=>{if(Array.isArray(t)){if("length()"===e)return t.length;if("flat()"===e)return t.flat();if("toJSON()"===e)return JSON.stringify(t);if("isEmpty()"===e)return 0===t.length;const s=e.match(/^join\(([,-\s]?)\)$/);if(s&&Array.isArray(s))return t.join(s[1]??"")}},(t,e)=>{if(n(t)){if("keys()"===e)return Object.keys(t);if("values()"===e)return Object.values(t);if("toJSON()"===e)return JSON.stringify(t)}},(t,e)=>{if("string"==typeof t){if("codeBlock()"===e){const e=("\n"+t).match(/\n```[a-zA-z]*([\s\S]*?)\n```/);if(e)return e[1]}if("jsonParse()"===e)return JSON.parse(t);if("toNumber()"===e){const e=Number(t);if(!isNaN(e))return e}if("trim()"===e)return t.trim();if("toLowerCase()"===e)return t.toLowerCase();if("toUpperCase()"===e)return t.toUpperCase();const s=e.match(/^split\(([-_:;.,\s\n]+)\)$/);if(s)return t.split(s[1])}},(t,e)=>{if(void 0!==t&&Number.isFinite(t)){if("toString()"===e)return String(t);const s=/^add\((-?\d+)\)$/,i=e.match(s);if(i)return Number(t)+Number(i[1])}},(t,e)=>{if("boolean"==typeof t&&"not()"===e)return!t}],N=(t,e,s)=>{if(!o(t)&&e&&e.length>0){const i=((t,e,s)=>{if(e.match(b))for(const i of s){const s=i(t,e);if(!o(s))return s}if(Array.isArray(t)){const s=/^\$(\d+)$/,i=e.match(s);if(i)return t[parseInt(i[1],10)];if("$last"===e)return t[t.length-1]}else if(n(t)&&e in t)return t[e]})(t,e[0],s);return void 0===i&&console.error(`prop: ${e.join(".")} is not hit`),e.length>1?N(i,e.slice(1),s):i}return t},S=(t,e,s=[])=>e.nodeId?N(t,e.propIds,s):e.value,k=(t,e,i,n=!1)=>{if(Array.isArray(t))return t.map((t=>k(t,e,i,n)));if(p(t))return v(t,e,i,n);if("string"==typeof t){const s=[...t.matchAll(/\${(:[^}]+)}/g)].map((t=>t[1]));if(s.length>0){const o=k(s,e,i,n);return Array.from(s.keys()).reduce(((t,e)=>t.replaceAll("${"+s[e]+"}",o[e])),t)}}return A(s(t,n),e,i)},v=(t,e,s,i=!1)=>Object.keys(t).reduce(((n,o)=>{const r=t[o];return n[o]=p(r)?v(r,e,s,i):k(r,e,s,i),n}),{}),A=(t,e,s)=>{const{result:i}=t.nodeId?e[t.nodeId]:{result:void 0};return S(i,t,s)},C=t=>Array.isArray(t)?t.map((t=>C(t))).filter((t=>!o(t))):n(t)?Object.keys(t).reduce(((e,s)=>{const i=C(t[s]);return o(i)||(e[s]=i),e}),{}):t;class E{constructor(e,s){this.waitlist=new Set,this.state=t.NodeState.Waiting,this.result=void 0,this.nodeId=e,this.graph=s,this.log=new I(e),this.console={}}asString(){return`${this.nodeId}: ${this.state} ${[...this.waitlist]}`}onSetResult(){this.waitlist.forEach((t=>{const e=this.graph.nodes[t];e.isComputedNode&&(e.removePending(this.nodeId),this.graph.pushQueueIfReadyAndRunning(e))}))}afterConsoleLog(t){!1!==this.console&&(!0===this.console||!0===this.console.after?console.log("string"==typeof t?t:JSON.stringify(t,null,2)):this.console.after&&(n(this.console.after)?console.log(JSON.stringify(v(this.console.after,{self:{result:t}},this.graph.propFunctions,!0),null,2)):console.log(this.console.after)))}}class j extends E{constructor(t,e,n,o){if(super(e,o),this.retryCount=0,this.dataSources=[],this.isSkip=!1,this.isStaticNode=!1,this.isComputedNode=!0,this.graphId=t,this.params=n.params??{},this.console=n.console??{},this.filterParams=n.filterParams??{},this.passThrough=n.passThrough,this.retryLimit=n.retry??o.retryLimit??0,this.timeout=n.timeout,this.isResult=n.isResult??!1,this.priority=n.priority??0,i(["function","string"].includes(typeof n.agent),"agent must be either string or function"),"string"==typeof n.agent)this.agentId=n.agent;else{const t=n.agent;this.agentFunction=async({namedInputs:e,params:s})=>t(e,s)}if(this.anyInput=n.anyInput??!1,this.inputs=n.inputs,this.output=n.output,this.dataSources=[...n.inputs?y(n.inputs).flat(10):[],...n.params?y(n.params).flat(10):[],...this.agentId?[s(this.agentId)]:[]],n.inputs&&Array.isArray(n.inputs))throw new Error(`array inputs have been deprecated. nodeId: ${e}: see https://github.com/receptron/graphai/blob/main/docs/NamedInputs.md`);this.pendings=new Set(m(this.dataSources)),n.graph&&(this.nestedGraph="string"==typeof n.graph?this.addPendingNode(n.graph):n.graph),n.graphLoader&&o.graphLoader&&(this.nestedGraph=o.graphLoader(n.graphLoader)),n.if&&(this.ifSource=this.addPendingNode(n.if)),n.unless&&(this.unlessSource=this.addPendingNode(n.unless)),n.defaultValue&&(this.defaultValue=n.defaultValue),this.isSkip=!1,this.log.initForComputedNode(this,o)}getAgentId(){return this.agentId??"__custom__function"}getConfig(t,e){if(e){if(t)return this.graph.config;const s=this.graph.config??{};return{...s.global??{},...s[e]??{}}}return{}}addPendingNode(t){const e=s(t);return i(!!e.nodeId,`Invalid data source ${t}`),this.pendings.add(e.nodeId),e}updateState(t){this.state=t,this.debugInfo&&(this.debugInfo.state=t)}resetPending(){this.pendings.clear(),this.state===t.NodeState.Executing&&this.updateState(t.NodeState.Abort),this.debugInfo&&this.debugInfo.subGraphs&&this.debugInfo.subGraphs.forEach((t=>t.abort()))}isReadyNode(){return this.state===t.NodeState.Waiting&&0===this.pendings.size&&(this.isSkip=!!(this.ifSource&&!c(this.graph.resultOf(this.ifSource))||this.unlessSource&&c(this.graph.resultOf(this.unlessSource))),!this.isSkip||void 0!==this.defaultValue||(this.updateState(t.NodeState.Skipped),this.log.onSkipped(this,this.graph),!1))}retry(t,e){this.updateState(t),this.log.onError(this,this.graph,e.message),this.retryCount<this.retryLimit?(this.retryCount++,this.execute()):(this.result=void 0,this.error=e,this.transactionId=void 0,this.graph.onExecutionComplete(this))}checkDataAvailability(){return Object.values(this.graph.resultsOf(this.inputs)).flat().some((t=>void 0!==t))}beforeAddTask(){this.updateState(t.NodeState.Queued),this.log.beforeAddTask(this,this.graph)}removePending(t){this.anyInput?this.checkDataAvailability()&&this.pendings.clear():this.pendings.delete(t)}isCurrentTransaction(t){return this.transactionId===t}executeTimeout(e){this.state===t.NodeState.Executing&&this.isCurrentTransaction(e)&&(console.warn(`-- timeout ${this.timeout} with ${this.nodeId}`),this.retry(t.NodeState.TimedOut,Error("Timeout")))}shouldApplyAgentFilter(t,e){return!!(t.agentIds&&Array.isArray(t.agentIds)&&t.agentIds.length>0&&e&&t.agentIds.includes(e))||(!!(t.nodeIds&&Array.isArray(t.nodeIds)&&t.nodeIds.length>0&&t.nodeIds.includes(this.nodeId))||!t.agentIds&&!t.nodeIds)}agentFilterHandler(t,e,s){let i=0;const n=t=>{const o=this.graph.agentFilters[i++];return o?this.shouldApplyAgentFilter(o,s)?(o.filterParams&&(t.filterParams={...o.filterParams,...t.filterParams}),o.agent(t,n)):n(t):e(t)};return n(t)}async execute(){if(this.isSkip)return void this.afterExecute(this.defaultValue,[]);const t=this.graph.resultsOf(this.inputs,this.anyInput),e=this.agentId?this.graph.resultOf(s(this.agentId)):this.agentId;"function"==typeof e&&(this.agentFunction=e);const i=Boolean(this.nestedGraph)||Boolean(e&&this.graph.getAgentFunctionInfo(e).hasGraphData),n=this.getConfig(i,e),o=Date.now();this.prepareExecute(o,Object.values(t)),this.timeout&&this.timeout>0&&setTimeout((()=>{this.executeTimeout(o)}),this.timeout);try{const s=this.agentFunction??this.graph.getAgentFunctionInfo(e).agent,r=[],a=this.getContext(t,r,e,n);i&&(this.graph.taskManager.prepareForNesting(),a.forNestedGraph={graphData:this.nestedGraph?"nodes"in this.nestedGraph?this.nestedGraph:this.graph.resultOf(this.nestedGraph):{version:0,nodes:{}},agents:this.graph.agentFunctionInfoDictionary,graphOptions:{agentFilters:this.graph.agentFilters,taskManager:this.graph.taskManager,bypassAgentIds:this.graph.bypassAgentIds,config:n,graphLoader:this.graph.graphLoader},onLogCallback:this.graph.onLogCallback,callbacks:this.graph.callbacks}),this.beforeConsoleLog(a);const h=await this.agentFilterHandler(a,s,e);if(this.afterConsoleLog(h),i&&this.graph.taskManager.restoreAfterNesting(),!this.isCurrentTransaction(o))return void console.log(`-- transactionId mismatch with ${this.nodeId} (probably timeout)`);this.afterExecute(h,r)}catch(e){this.errorProcess(e,o,t)}}afterExecute(e,s){this.state!=t.NodeState.Abort&&(this.updateState(t.NodeState.Completed),this.result=this.getResult(e),this.output&&(this.result=v(this.output,{self:this},this.graph.propFunctions,!0)),this.log.onComplete(this,this.graph,s),this.onSetResult(),this.graph.onExecutionComplete(this))}prepareExecute(e,s){this.updateState(t.NodeState.Executing),this.log.beforeExecute(this,this.graph,e,s),this.transactionId=e}errorProcess(e,s,i){e instanceof Error&&e.message!==r&&(console.error(`<-- NodeId: ${this.nodeId}, Agent: ${this.agentId}`),console.error({namedInputs:i}),console.error(e),console.error("--\x3e")),this.isCurrentTransaction(s)?e instanceof Error?this.retry(t.NodeState.Failed,e):(console.error(`-- NodeId: ${this.nodeId}: Unknown error was caught`),this.retry(t.NodeState.Failed,Error("Unknown"))):console.warn(`-- transactionId mismatch with ${this.nodeId} (not timeout)`)}getContext(t,e,s,i){this.debugInfo=this.getDebugInfo(s);return{params:this.graph.resultsOf(this.params),namedInputs:t,inputSchema:this.agentFunction?void 0:this.graph.getAgentFunctionInfo(s)?.inputs,debugInfo:this.debugInfo,cacheType:this.agentFunction?void 0:this.graph.getAgentFunctionInfo(s)?.cacheType,filterParams:this.filterParams,config:i,log:e}}getResult(t){if(t&&this.passThrough){if(n(t)&&!Array.isArray(t))return{...t,...this.passThrough};if(Array.isArray(t))return t.map((t=>n(t)&&!Array.isArray(t)?{...t,...this.passThrough}:t))}return t}getDebugInfo(t){return{nodeId:this.nodeId,agentId:t,retry:this.retryCount,state:this.state,subGraphs:new Map,verbose:this.graph.verbose,version:this.graph.version,isResult:this.isResult}}beforeConsoleLog(t){!1!==this.console&&(!0===this.console||!0===this.console.before?console.log(JSON.stringify(t.namedInputs,null,2)):this.console.before&&console.log(this.console.before))}}class L extends E{constructor(t,e,i){super(t,i),this.isStaticNode=!0,this.isComputedNode=!1,this.value=e.value,this.update=e.update?s(e.update):void 0,this.isResult=e.isResult??!1,this.console=e.console??{}}injectValue(e,s){this.state=t.NodeState.Injected,this.result=e,this.log.onInjected(this,this.graph,s),this.onSetResult()}consoleLog(){this.afterConsoleLog(this.result)}}const O=["nodes","concurrency","agentId","loop","verbose","version","metadata"],F=["inputs","output","anyInput","params","retry","timeout","agent","graph","graphLoader","isResult","priority","if","unless","defaultValue","filterParams","console","passThrough"],R=["value","update","isResult","console"];class T extends Error{constructor(t){super(`[41m${t}[0m`),Object.setPrototypeOf(this,T.prototype)}}const $=(t,e)=>{(t=>{if(void 0===t.nodes)throw new T("Invalid Graph Data: no nodes");if("object"!=typeof t.nodes)throw new T("Invalid Graph Data: invalid nodes");if(Array.isArray(t.nodes))throw new T("Invalid Graph Data: nodes must be object");if(0===Object.keys(t.nodes).length)throw new T("Invalid Graph Data: nodes is empty");Object.keys(t).forEach((t=>{if(!O.includes(t))throw new T("Graph Data does not allow "+t)}))})(t),(t=>{if(t.loop){if(void 0===t.loop.count&&void 0===t.loop.while)throw new T("Loop: Either count or while is required in loop");if(void 0!==t.loop.count&&void 0!==t.loop.while)throw new T("Loop: Both count and while cannot be set")}if(void 0!==t.concurrency){if(!Number.isInteger(t.concurrency))throw new T("Concurrency must be an integer");if(t.concurrency<1)throw new T("Concurrency must be a positive integer")}})(t);const i=[],n=[],o=new Set;return Object.keys(t.nodes).forEach((e=>{const s=t.nodes[e],r=f(s);(t=>{if(t.agent&&t.value)throw new T("Cannot set both agent and value")})(s);const a=r?"":s.agent;var h;r&&(h=s,Object.keys(h).forEach((t=>{if(!R.includes(t))throw new T("Static node does not allow "+t)})),1)&&n.push(e),!r&&(t=>(Object.keys(t).forEach((t=>{if(!F.includes(t))throw new T("Computed node does not allow "+t)})),!0))(s)&&i.push(e)&&"string"==typeof a&&o.add(a)})),((t,e)=>{t.forEach((t=>{if(!e.has(t)&&":"!==t[0])throw new T("Invalid Agent : "+t+" is not in AgentFunctionInfoDictionary.")}))})(o,new Set(e)),((t,e,i)=>{const n=new Set(Object.keys(t.nodes)),o={},r={};i.forEach((e=>{const s=t.nodes[e];o[e]=new Set;const i=(t,s)=>{s.forEach((s=>{if(s){if(!n.has(s))throw new T(`${t} not match: NodeId ${e}, Inputs: ${s}`);void 0===r[s]&&(r[s]=new Set),o[e].add(s),r[s].add(e)}}))};s&&g(s)&&(s.inputs&&i("Inputs",m(y(s.inputs))),s.params&&i("Params",m(y(s.params))),s.if&&i("If",m(y({if:s.if}))),s.unless&&i("Unless",m(y({unless:s.unless}))),s.graph&&"string"==typeof s?.graph&&i("Graph",m(y({graph:s.graph}))),"string"==typeof s.agent&&":"===s.agent[0]&&i("Agent",m(y({agent:s.agent}))))})),e.forEach((e=>{const i=t.nodes[e];if(f(i)&&i.update){const t=i.update,o=s(t).nodeId;if(!o)throw new T("Update it a literal");if(!n.has(o))throw new T(`Update not match: NodeId ${e}, update: ${t}`)}}));const a=t=>{t.forEach((t=>{(r[t]||[]).forEach((e=>{o[e].delete(t)}))}));const e=[];return Object.keys(o).forEach((t=>{0===o[t].size&&(e.push(t),delete o[t])})),e};let h=a(e);if(0===h.length)throw new T("No Initial Runnning Node");do{h=a(h)}while(h.length>0);if(Object.keys(o).length>0)throw new T("Some nodes are not executed: "+Object.keys(o).join(", "))})(t,n,i),!0};class x{constructor(t){this.taskQueue=[],this.runningNodes=new Set,this.concurrency=t}dequeueTaskIfPossible(){if(this.runningNodes.size<this.concurrency){const t=this.taskQueue.shift();t&&(this.runningNodes.add(t.node),t.callback(t.node))}}addTask(t,e,s){const n=this.taskQueue.filter((e=>e.node.priority>=t.priority)).length;i(n<=this.taskQueue.length,"TaskManager.addTask: Something is really wrong."),this.taskQueue.splice(n,0,{node:t,graphId:e,callback:s}),this.dequeueTaskIfPossible()}isRunning(t){return[...this.runningNodes].filter((e=>e.graphId==t)).length>0||Array.from(this.taskQueue).filter((e=>e.graphId===t)).length>0}onComplete(t){i(this.runningNodes.has(t),`TaskManager.onComplete node(${t.nodeId}) is not in list`),this.runningNodes.delete(t),this.dequeueTaskIfPossible()}prepareForNesting(){this.concurrency++}restoreAfterNesting(){this.concurrency--}getStatus(t=!1){const e=Array.from(this.runningNodes).map((t=>t.nodeId)),s=this.taskQueue.map((t=>t.node.nodeId)),i=t?{runningNodes:e,queuedNodes:s}:{};return{concurrency:this.concurrency,queue:this.taskQueue.length,running:this.runningNodes.size,...i}}}const D=.5;t.GraphAI=class{createNodes(t){const e=Object.keys(t.nodes).reduce(((e,s)=>{const i=t.nodes[s];return g(i)?e[s]=new j(this.graphId,s,i,this):e[s]=new L(s,i,this),e}),{});return Object.keys(e).forEach((t=>{const s=e[t];s.isComputedNode&&s.pendings.forEach((s=>{if(!e[s])throw new Error(`createNode: invalid input ${s} for node, ${t}`);e[s].waitlist.add(t)}))})),e}getValueFromResults(t,e){return S(t.nodeId?e[t.nodeId]:void 0,t,this.propFunctions)}initializeStaticNodes(t=!1){Object.keys(this.graphData.nodes).forEach((e=>{const s=this.nodes[e];if(s?.isStaticNode){const i=s?.value;void 0!==i&&this.injectValue(e,i,e),t&&s.consoleLog()}}))}updateStaticNodes(t,e=!1){Object.keys(this.graphData.nodes).forEach((s=>{const i=this.nodes[s];if(i?.isStaticNode){const n=i?.update;if(n&&t){const e=this.getValueFromResults(n,t);this.injectValue(s,e,n.nodeId)}e&&i.consoleLog()}}))}constructor(t,e,s={taskManager:void 0,agentFilters:[],bypassAgentIds:[],config:{},graphLoader:void 0}){this.logs=[],this.config={},this.onLogCallback=(t,e)=>{},this.callbacks=[],this.repeatCount=0,t.version||s.taskManager||console.warn("------------ missing version number"),this.version=t.version??D,this.version<D&&console.warn("------------ upgrade to 0.5!"),this.retryLimit=t.retry,this.graphId=`${Date.now().toString(36)}-${Math.random().toString(36).substr(2,9)}`,this.graphData=t,this.agentFunctionInfoDictionary=e,this.propFunctions=w,this.taskManager=s.taskManager??new x(t.concurrency??8),this.agentFilters=s.agentFilters??[],this.bypassAgentIds=s.bypassAgentIds??[],this.config=s.config,this.graphLoader=s.graphLoader,this.loop=t.loop,this.verbose=!0===t.verbose,this.onComplete=t=>{throw new Error("SOMETHING IS WRONG: onComplete is called without run()")},$(t,[...Object.keys(e),...this.bypassAgentIds]),(t=>{Object.keys(t).forEach((e=>{if("default"!==e){const s=t[e];if(!s||!s.agent)throw new T("No Agent: "+e+" is not in AgentFunctionInfoDictionary.")}}))})(e),this.nodes=this.createNodes(t),this.initializeStaticNodes(!0)}getAgentFunctionInfo(t){if(t&&this.agentFunctionInfoDictionary[t])return this.agentFunctionInfoDictionary[t];if(t&&this.bypassAgentIds.includes(t))return{agent:async()=>null,hasGraphData:!1,inputs:null,cacheType:void 0};throw new Error("No agent: "+t)}asString(){return Object.values(this.nodes).map((t=>t.asString())).join("\n")}results(t){return Object.keys(this.nodes).filter((e=>t||this.nodes[e].isResult)).reduce(((t,e)=>{const s=this.nodes[e];return void 0!==s.result&&(t[e]=s.result),t}),{})}errors(){return Object.keys(this.nodes).reduce(((t,e)=>{const s=this.nodes[e];return s.isComputedNode&&void 0!==s.error&&(t[e]=s.error),t}),{})}pushReadyNodesIntoQueue(){Object.keys(this.nodes).forEach((t=>{const e=this.nodes[t];e.isComputedNode&&this.pushQueueIfReady(e)}))}pushQueueIfReady(t){t.isReadyNode()&&this.pushQueue(t)}pushQueueIfReadyAndRunning(t){this.isRunning()&&this.pushQueueIfReady(t)}pushQueue(t){t.beforeAddTask(),this.taskManager.addTask(t,this.graphId,(e=>{i(t.nodeId===e.nodeId,"GraphAI.pushQueue node mismatch"),t.execute()}))}async run(t=!1){if(Object.values(this.nodes).filter((t=>t.isStaticNode)).some((t=>void 0===t.result&&void 0===t.update)))throw new Error("Static node must have value. Set value or injectValue or set update");if(this.isRunning())throw new Error("This GraphAI instance is already running");return this.pushReadyNodesIntoQueue(),this.isRunning()?new Promise(((e,s)=>{this.onComplete=(i=!1)=>{const n=this.errors(),o=Object.keys(n);o.length>0||i?s(n[o[0]]):e(this.results(t))}})):(console.warn("-- nothing to execute"),{})}abort(){this.isRunning()&&this.resetPending(),Object.values(this.nodes).forEach((t=>t.isComputedNode&&(t.transactionId=void 0))),this.onComplete(this.isRunning())}resetPending(){Object.values(this.nodes).map((t=>{t.isComputedNode&&t.resetPending()}))}isRunning(){return this.taskManager.isRunning(this.graphId)}onExecutionComplete(t){this.taskManager.onComplete(t),this.isRunning()||this.processLoopIfNecessary()||this.onComplete(!1)}processLoopIfNecessary(){this.repeatCount++;const t=this.loop;if(!t)return!1;const e=this.results(!0);if(this.updateStaticNodes(e),void 0===t.count||this.repeatCount<t.count){if(t.while){const e=s(t.while),i=this.getValueFromResults(e,this.results(!0));if(!c(i))return!1}return this.initializeGraphAI(),this.updateStaticNodes(e,!0),this.pushReadyNodesIntoQueue(),!0}return!1}initializeGraphAI(){if(this.isRunning())throw new Error("This GraphAI instance is running");this.nodes=this.createNodes(this.graphData),this.initializeStaticNodes()}setPreviousResults(t){this.updateStaticNodes(t)}setLoopLog(t){t.isLoop=!!this.loop,t.repeatCount=this.repeatCount}appendLog(t){this.logs.push(t),this.onLogCallback(t,!1),this.callbacks.forEach((e=>e(t,!1)))}updateLog(t){this.onLogCallback(t,!0),this.callbacks.forEach((e=>e(t,!1)))}registerCallback(t){this.callbacks.push(t)}clearCallbacks(){this.callbacks=[]}transactionLogs(){return this.logs}injectValue(t,e,s){const i=this.nodes[t];if(!i||!i.isStaticNode)throw new Error(`injectValue with Invalid nodeId, ${t}`);i.injectValue(e,s)}resultsOf(t,e=!1){const s=v(t??[],this.nodes,this.propFunctions);return e?(t=>Object.keys(t).reduce(((e,s)=>{const i=C(t[s]);return o(i)||(e[s]=i),e}),{}))(s):s}resultOf(t){return A(t,this.nodes,this.propFunctions)}},t.ValidationError=T,t.agentInfoWrapper=t=>({agent:t,mock:t,...a}),t.assert=i,t.debugResultKey=u,t.defaultAgentInfo=a,t.defaultConcurrency=8,t.defaultTestContext=l,t.graphDataLatestVersion=D,t.inputs2dataSources=y,t.isComputedNodeData=g,t.isObject=n,t.isStaticNodeData=f,t.parseNodeName=s,t.sleep=async t=>await new Promise((e=>setTimeout(e,t))),t.strIntentionalError=r}));
//# sourceMappingURL=bundle.umd.js.map
