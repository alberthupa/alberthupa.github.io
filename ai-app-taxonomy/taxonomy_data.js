/* AI app taxonomy — single source of truth for the unit-of-work × topology map.
   Units of work, control topologies, named families and pair rules.
   Plain JS instead of JSON so the page also works from disk (file://).

   Families marked `added: true` extend the original curated list with cells that are
   clearly occupied in practice. */
window.TAXONOMY = {
  meta: {
    title: 'Every AI app is a unit of work with a shape',
    author: 'Albert Hupa',
    email: 'hupa.albert@gmail.com',
    hinge: 'A unit of work contains one or more runs, and each run has a topology. Change the unit and you change what survives a crash. Change the topology and you change only how a run spends money and fails.',
    batch: 'Parallelism exists at two levels. Inside one unit ("split this task into parallel subtasks and merge") it is scatter–gather, a topology. Across units ("run five hundred rows at once") it is job scheduling, and not a topology at all. Batch job plus scatter–gather usually means the scheduler is being described in the wrong place.',
    silence: 'An empty cell means no named family is documented there and no rule is claimed for that pair. It does not mean the pair is impossible.'
  },

  axes: {
    unit: {title: 'Unit of work', q: 'what owns the work, and what survives a crash'},
    topology: {title: 'Control topology', q: 'the shape of one run'}
  },

  /* who decides what happens next */
  groups: [
    {id: 'human', name: 'Human in the centre', idea: 'a person decides the next step'},
    {id: 'loop', name: 'LLM in the centre', idea: 'the model\'s loop decides what happens next; code is the tools around it'},
    {id: 'process', name: 'Code in the centre · LLM is a part', idea: 'a process, queue or schedule decides what happens next; the model is called for one bounded step'}
  ],

  /* columns, ordered so the two hero columns meet at the seam */
  units: [
    {id: 'human', group: 'human', name: 'Interactive tool',
     centre: 'The model drafts; the person decides.',
     line: 'the human owns each step',
     owner: 'the person', persists: 'nothing the system must own',
     fail: 'No unattended throughput'},
    {id: 'identity', group: 'loop', name: 'Durable agent service',
     centre: 'The same loop, made durable: an identity plus an event log.',
     line: 'an addressable identity + log',
     owner: 'the durable agent runtime',
     persists: 'agent events, execution progress, pending permissions',
     fail: 'A log without claiming gives duplicate iterations'},
    {id: 'session', group: 'loop', hero: true, name: 'Agent session',
     centre: 'The model decides what happens next.',
     line: 'the harness owns the loop',
     owner: 'the harness and its session machinery',
     persists: 'transcript, artifacts, and any checkpoints the implementation chose to write',
     fail: 'A crash mid-tool-call is unrecoverable and often undetected'},
    {id: 'case', group: 'process', hero: true, name: 'Durable workflow',
     centre: 'Code decides what happens next. The model fills in one step.',
     line: 'the task record owns the lifecycle',
     owner: 'the workflow engine or task service',
     persists: 'process state, waits, decisions, approvals, action identities, receipts',
     fail: 'Durable state does not commit external effects'},
    {id: 'event', group: 'process', name: 'Event-driven worker',
     centre: 'A handler calls the model once per event.',
     line: 'the queue + receipt own each event',
     owner: 'the subscription plus a durable work queue',
     persists: 'the queue and its receipts, not the agent',
     fail: 'Duplicate handling after redelivery'},
    {id: 'corpus', group: 'process', name: 'Batch job',
     centre: 'The model is a function mapped over rows.',
     line: 'the scheduler owns the run; rerun = recovery',
     owner: 'the data pipeline or job scheduler',
     persists: 'almost nothing; a rerun is the recovery story',
     fail: 'Silent per-item degradation'}
  ],

  /* rows, ordered fewer → more coordination, in four buckets */
  buckets: [
    {id: 'solo', name: 'Solo', idea: 'one loop, one plan'},
    {id: 'linear', name: 'Linear', idea: 'fixed path'},
    {id: 'supervised', name: 'Supervised', idea: 'one dispatches to many'},
    {id: 'shared', name: 'Shared', idea: 'no single owner'}
  ],
  topologies: [
    {id: 'single', bucket: 'solo', name: 'Single loop', sub: 'one plan, own tools',
     what: 'One agent loop keeps the plan and calls its own tools.',
     fail: 'Context and attention dilute as the task grows; no separation of concerns.'},
    {id: 'loop', bucket: 'solo', name: 'Retry loop', sub: 'iterate to a test',
     what: 'One agent iterates until a completion test passes.',
     fail: 'No guaranteed termination; silent budget burn on non-converging loops.'},
    {id: 'sequential', bucket: 'linear', name: 'Pipeline', sub: 'chain of stages',
     what: 'A fixed chain of stages, each handing a typed artifact to the next.',
     fail: 'One bad stage poisons the rest; latency adds up.'},
    {id: 'review', bucket: 'linear', name: 'Generator–critic', sub: 'evaluator / optimizer',
     what: 'A generator and a critic alternate until the artifact survives review.',
     fail: 'The critic inherits the producer blind spots; roughly doubles cost.'},
    {id: 'coordinator', bucket: 'supervised', name: 'Router', sub: 'dispatch to specialists',
     what: 'A router classifies each request and dispatches it to a specialist.',
     fail: 'The router becomes bottleneck and single point of failure.'},
    {id: 'parallel', bucket: 'supervised', name: 'Scatter–gather', sub: 'fan-out then merge',
     what: 'Work is fanned out to independent workers and merged by a reducer.',
     fail: 'Merge conflicts and duplicated work; needs a real reducer.'},
    {id: 'hierarchy', bucket: 'supervised', name: 'Hierarchical supervisor', sub: 'managers of managers',
     what: 'A supervisor decomposes, delegates to sub-supervisors and assembles results.',
     fail: 'Errors compound across levels; nobody owns the whole.'},
    {id: 'handoff', bucket: 'shared', name: 'Delegation chain', sub: 'control moves',
     what: 'Control moves between specialists with no central plan.',
     fail: 'No global plan; context is lost or duplicated at each hop.'},
    {id: 'swarm', bucket: 'shared', name: 'Peer choreography', sub: 'handoff swarm',
     what: 'Peers hand off directly and nobody holds the global plan.',
     fail: 'Hard to audit: nobody can explain why it ended.'},
    {id: 'groupchat', bucket: 'shared', name: 'Blackboard', sub: 'shared transcript',
     what: 'Agents read and write a shared transcript until a convergence rule fires.',
     fail: 'Token burn; convergence is social, not guaranteed.'}
  ],

  /* named families at their (unit, topology) coordinates */
  families: [
    /* single loop */
    {n: 'Copilot / inline assistant', u: 'human', t: 'single',
     why: 'The operator owns continuation; the model drafts and edits.',
     ex: ['Cursor', 'GitHub Copilot']},
    {n: 'Coding harness', u: 'session', t: 'single',
     why: 'One loop, one repository, files and shell as the effect boundary.',
     ex: ['Claude Code', 'Codex CLI', 'OpenCode', 'Pi']},
    {n: 'Framework single agent', u: 'session', t: 'single',
     why: 'You own the loop and the prompts; the default tool-calling agent.',
     ex: ['OpenAI Agents SDK', 'LangChain', 'Vercel AI SDK']},
    {n: 'Durable event-driven agent', u: 'identity', t: 'single',
     why: 'Identity plus log is the object; workers advance it between events.',
     ex: ['Omnara', 'Cloudflare Agents']},
    {n: 'Agent as a virtual object', u: 'identity', t: 'single',
     why: 'One durable instance per key, single writer, serialised access.',
     ex: ['Restate virtual objects', 'Cloudflare Durable Objects']},
    {n: 'Persistent harness agent', u: 'identity', t: 'single',
     why: 'A harness loop promoted into an addressable identity.',
     ex: ['Pi', 'OpenCode server sessions']},
    {n: 'Durable workflow', u: 'case', t: 'single', note: 'bounded agent step',
     why: 'One bounded loop inside a task record: the model is a decision point inside an explicit state machine.',
     ex: ['Temporal + agent activity', 'Inngest']},
    {n: 'Ambient inbox agent', u: 'event', t: 'single',
     why: 'Event in, one run per event, decisions surfaced through an inbox.',
     ex: ['LangChain ambient email', 'Agent Inbox'],
     warn: 'Without a durable inbox this becomes untraceable noise.'},
    {n: 'Heartbeat agent', u: 'event', t: 'single', note: 'scheduled',
     why: 'A tick starts the worker; idle has to be cheap.',
     ex: ['Hermes cron jobs']},
    {n: 'Event-driven UI agent', u: 'event', t: 'single',
     why: 'A signal triggers an agent that has to click.',
     ex: ['monitoring bots with browser agents'],
     warn: 'Pixels are not idempotent; demand a receipt per action.'},
    {n: 'Batch agentic ETL', u: 'corpus', t: 'single', note: 'per row',
     why: 'Map the loop over rows; recovery is a rerun.',
     ex: ['Databricks AI functions'],
     warn: 'Silent per-item degradation: the control is evaluation and sampling, not durability.'},

    /* retry loop */
    {n: 'Fix-until-green loop', u: 'session', t: 'loop', added: true,
     why: 'The harness reruns the agent until an executable test passes or the budget runs out.',
     ex: ['Claude Code with a test gate', 'Ralph loop']},
    {n: 'Issue-to-PR agent', u: 'event', t: 'loop', added: true,
     why: 'An assigned issue or a failed check wakes an agent that iterates until the checks pass.',
     ex: ['GitHub Copilot coding agent', 'CI fix bots']},
    {n: 'Validate-and-retry extraction', u: 'corpus', t: 'loop', added: true,
     why: 'Each row is retried until the output passes a schema check; failures are counted per item.',
     ex: ['Instructor', 'Pydantic AI output retries']},

    /* pipeline */
    {n: 'Prompt chain', u: 'session', t: 'sequential', added: true,
     why: 'Fixed steps in code, each one a model call; the classic retrieve-then-answer chain.',
     ex: ['LangChain LCEL', 'LlamaIndex pipelines', 'DSPy']},
    {n: 'Builder-owned triage flow', u: 'case', t: 'sequential',
     why: 'Fixed process, a few model decisions, process owners edit it.',
     ex: ['n8n', 'Zapier', 'Copilot Studio'],
     warn: 'Vendor churn: visual builders get shut down or sunset; check what happens to a waiting run.'},
    {n: 'Map-reduce document pipeline', u: 'corpus', t: 'sequential', added: true,
     why: 'Extract per item, then reduce in real code: a sweep is a pipeline of map and reduce.',
     ex: ['Spark or dbt-triggered LLM steps', 'map-reduce summarisation']},

    /* generator–critic */
    {n: 'Evaluator–optimizer loop', u: 'session', t: 'review', added: true,
     why: 'A second prompt criticises the draft and the first revises, for a capped number of rounds.',
     ex: ['LangGraph reflection', 'reviewer subagents']},
    {n: 'Review and rework gate', u: 'case', t: 'review', added: true,
     why: 'The task card cannot advance until a reviewer passes it; rework goes back to the producer.',
     ex: ['Nova sprint']},
    {n: 'Reviewed event pipeline', u: 'event', t: 'review',
     why: 'Generator and critic per event on a durable runtime.',
     ex: ['Temporal ambient-agent pattern']},
    {n: 'Graded corpus run', u: 'corpus', t: 'review',
     why: 'Generator plus judge per item, score stored with the row.',
     ex: ['LLM-as-judge pipelines']},

    /* router */
    {n: 'Intent-routed assistant', u: 'session', t: 'coordinator', added: true,
     why: 'A cheap classifier picks the specialist prompt, toolset or model for each request.',
     ex: ['LlamaIndex router query engine', 'support bots with intent routing']},
    {n: 'Routed specialists on a workflow', u: 'case', t: 'coordinator',
     why: 'Workflow state is authoritative; a router picks the specialist and replay keeps the spine recoverable.',
     ex: ['Temporal agent activities']},
    {n: 'Event triage router', u: 'event', t: 'coordinator', added: true,
     why: 'Classify each event first (act, notify, ask or drop), then dispatch to a specialist.',
     ex: ['ticket triage', 'alert routing']},

    /* scatter–gather */
    {n: 'Parallel research agent', u: 'session', t: 'parallel', added: true,
     why: 'A lead agent splits the question, runs subagents in parallel and merges their findings.',
     ex: ['Claude Research', 'OpenAI Deep Research', 'Claude Code subagents']},
    {n: 'Fan-out / fan-in workflow', u: 'case', t: 'parallel', added: true,
     why: 'The workflow spawns child steps, waits for the required results and runs an explicit join.',
     ex: ['Temporal child workflows', 'LangGraph Send API']},

    /* hierarchical supervisor */
    {n: 'Agent org chart', u: 'identity', t: 'hierarchy',
     why: 'Supervisors delegating to agents that are themselves durable.',
     ex: ['enterprise agent platforms']},
    {n: 'Supervisor crew', u: 'session', t: 'hierarchy', added: true,
     why: 'A manager agent plans, delegates to worker agents and assembles their results.',
     ex: ['CrewAI hierarchical process', 'LangGraph supervisor']},
    {n: 'Hierarchical workflow', u: 'case', t: 'hierarchy',
     why: 'Workflow state at the top, growing delegation underneath.',
     ex: ['LangGraph hierarchical teams']},

    /* shared */
    {n: 'Escalation handoff', u: 'session', t: 'handoff', added: true,
     why: 'The conversation moves from a front-line agent to a specialist, and control moves with it.',
     ex: ['LangChain handoffs', 'support bot → specialist → human']},
    {n: 'Peer handoff swarm', u: 'session', t: 'swarm',
     why: 'Routing lives in the task, not in a central plan.',
     ex: ['OpenAI Agents SDK handoffs']},
    {n: 'Blackboard debate', u: 'session', t: 'groupchat',
     why: 'Shared state, a coordinator picks the next speaker.',
     ex: ['AutoGen GroupChat', 'Magentic-One']}
  ],

  /* not a column: it displaces the map */
  displaced: {
    n: 'Trained policy',
    line: 'Control flow lives in the weights',
    why: 'There is no outer loop to make durable: control flow was trained into the policy, so the design object becomes the environment, the reward and the sandbox.',
    shift: 'Topology collapses: the policy learned its own decomposition, so the shape of a run stops being a design choice. The environment becomes the architecture.',
    owner: 'the training pipeline at design time, the runtime at inference',
    persists: 'the environment and the rollout record',
    ex: ['Agent Lightning v1.0', 'SoL-Pi'],
    fails: ['Capability that does not transfer outside the training harness', 'Reward hacking against the verifier']
  },

  /* hand-written pair rules. A blank pair is silence, not a verdict. */
  rel: [
    {u: 'session', t: 'single', k: 'fit', why: 'The default shape: one harness, one plan, one toolset.'},
    {u: 'case', t: 'single', k: 'fit', why: 'One bounded loop inside a task record is the normal composition.'},
    {u: 'case', t: 'coordinator', k: 'fit', why: 'A router choosing the specialist inside a workflow is common; the task record still owns state.'},
    {u: 'event', t: 'coordinator', k: 'fit', why: 'Classify then dispatch per event; keep the router cheap.'},
    {u: 'human', t: 'single', k: 'fit', why: 'The operator drives one loop, step by step.'},
    {u: 'identity', t: 'coordinator', k: 'note', why: 'Fine, but every routing decision becomes an event in the log.'},
    {u: 'corpus', t: 'single', k: 'fit', why: 'One loop per row is the default. Parallelism across rows belongs to the job scheduler, not to topology.'},
    {u: 'corpus', t: 'parallel', k: 'note', why: 'Only pays off if the work for a single item decomposes. Fanning out across rows is scheduling, not topology.'},
    {u: 'corpus', t: 'sequential', k: 'note', why: 'A sweep is a pipeline of map and reduce; the reduce step has to be real code, not a prompt.'},
    {u: 'corpus', t: 'review', k: 'fit', why: 'Generator plus judge per item, with the score stored beside the row, is the honest batch design.'},
    {u: 'corpus', t: 'groupchat', k: 'clash', why: 'A blackboard over a corpus has no per-item economics.'},
    {u: 'event', t: 'single', k: 'fit', why: 'One worker run per event is the normal shape; scale comes from the queue.'},
    {u: 'event', t: 'groupchat', k: 'clash', why: 'A debate per event multiplies token cost by concurrency and nobody reads the transcripts.'},
    {u: 'human', t: 'swarm', k: 'clash', why: 'A copilot does not need peer-agent negotiation.'},
    {u: 'session', t: 'swarm', k: 'note', why: 'Legal to build, but session state then has to be reconstructed from the swarm trace.'},
    {u: 'case', t: 'swarm', k: 'clash', why: 'A swarm has no authoritative workflow state, so audit becomes reconstruction.'},
    {u: 'case', t: 'handoff', k: 'note', why: 'Handoffs are legal inside a workflow, but the task record must own state at every hop.'},
    {u: 'identity', t: 'groupchat', k: 'note', why: 'A blackboard assumes one transcript owner; per-agent logs give you N logs and no shared truth.'}
  ],
  relLabel: {fit: 'fits', note: 'works, with a caveat', clash: 'tension'},

  /* example links: names only, no logos */
  links: {
    'Claude Code': 'https://claude.com/claude-code',
    'Codex CLI': 'https://github.com/openai/codex',
    'OpenCode': 'https://opencode.ai/',
    'OpenAI Agents SDK': 'https://openai.github.io/openai-agents-python/',
    'OpenAI Agents SDK handoffs': 'https://openai.github.io/openai-agents-python/handoffs/',
    'LangChain': 'https://www.langchain.com/',
    'Vercel AI SDK': 'https://ai-sdk.dev/',
    'Cursor': 'https://cursor.com/',
    'GitHub Copilot': 'https://github.com/features/copilot',
    'AutoGen GroupChat': 'https://microsoft.github.io/autogen/',
    'Temporal + agent activity': 'https://temporal.io/',
    'Temporal agent activities': 'https://temporal.io/',
    'Temporal ambient-agent pattern': 'https://temporal.io/',
    'Inngest': 'https://www.inngest.com/',
    'LangGraph hierarchical teams': 'https://www.langchain.com/langgraph',
    'n8n': 'https://n8n.io/',
    'Zapier': 'https://zapier.com/',
    'Omnara': 'https://github.com/omnara-ai/omnara',
    'Cloudflare Agents': 'https://developers.cloudflare.com/agents/',
    'Restate virtual objects': 'https://docs.restate.dev/ai/patterns/sessions',
    'Cloudflare Durable Objects': 'https://developers.cloudflare.com/durable-objects/',
    'Agent Inbox': 'https://github.com/langchain-ai/agent-inbox',
    'Agent Lightning v1.0': 'https://github.com/microsoft/agent-lightning',
    'Nova sprint': 'https://github.com/mas-bandwidth/nova-tools/blob/main/docs/ARCHITECTURE.md'
  },

  sources: [
    {name: 'Anthropic · Building effective agents', url: 'https://www.anthropic.com/engineering/building-effective-agents'},
    {name: 'Google Cloud · Agentic AI design patterns', url: 'https://docs.cloud.google.com/architecture/choose-design-pattern-agentic-ai-system'},
    {name: 'Azure · AI agent orchestration patterns', url: 'https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns'}
  ]
};
