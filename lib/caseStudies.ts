/**
 * Case-study content for the three project detail pages.
 * Every number is traceable to committed artifacts in the project repos
 * (CV Update/<project>/results/*.json) or the KT documents; nothing invented.
 */

export type CaseFigure = { src: string; caption: string };
export type CaseMetric = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  num: string;
  short: string;
  title: string;
  tagline: string;
  period: string;
  role: string;
  repo: string;
  stack: string[];
  overview: string[];
  problem: string[];
  architecture: { name: string; what: string }[];
  approach: { title: string; body: string }[];
  evaluation: string[];
  metrics: CaseMetric[];
  results: {
    columns: string[];
    rows: { label: string; values: string[] }[];
    note?: string;
  };
  archFigure?: CaseFigure;
  figures: CaseFigure[];
  findings: string[];
  decisions: { title: string; body: string }[];
  validation: string[];
  limitations: string[];
  interview: {
    built: string;
    why: string;
    how: string;
    decision: string;
    strongest: string;
    limitation: string;
    next: string;
    questions: { q: string; a: string }[];
  };
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "s4-to-mamba",
    num: "01",
    short: "S4 → Mamba-3",
    title: "Efficient Sequence Modeling: From S4 to Mamba-3",
    tagline:
      "Five sequence architectures implemented from first principles, trained at matched budgets, and measured against their own papers' claims - OOM points included.",
    period: "May 2026",
    role: "Solo project - design, implementation, benchmarks, test suite",
    repo: "https://github.com/vaibhav3000/s4-to-mamba",
    stack: ["Python", "PyTorch", "NumPy", "SciPy", "Hugging Face", "Matplotlib", "pytest"],
    overview: [
      "ssmbench is a from-scratch experimental study of how efficient sequence models evolved: a causal Transformer baseline alongside S4D, Mamba, Mamba-2 and Mamba-3, all implemented in pure PyTorch behind one shared training skeleton, then trained and benchmarked on three designed tasks plus a 1K-32K token efficiency sweep on a single 6 GB RTX 4050.",
      "Every architecture shares the same block plumbing, so a benchmark difference isolates the mixer, not the scaffolding. Every number is committed as JSON with its environment block, and every dual compute form (FFT convolution vs recurrent step, chunked vs sequential scan) is paired with an equivalence test at 1e-3 tolerance.",
    ],
    problem: [
      "Attention scales quadratically with sequence length, and long context is where it becomes unusable. State-space models promise O(T) computation with a fixed-size recurrent state - but each generation of SSM architecture carries its own trade-off, and the claims are easy to repeat and hard to verify.",
      "The gap this project attacks: what survives when you implement each generation from first principles, train the models at matched budgets, and measure the claims yourself - including the wall-clock cost that operation-count notation hides.",
    ],
    architecture: [
      { name: "transformer_minimal.py", what: "Pre-norm causal Transformer with SDPA attention; the quality and scaling baseline. No KV cache: decode recomputes the full prefix, which the efficiency sweep measures." },
      { name: "s4_minimal.py", what: "S4D: complex diagonal A with S4D-Lin initialization, exact ZOH via a numerically safe (e^z-1)/z, FFT-convolution training form and an O(1)-state recurrent decode step." },
      { name: "mamba_minimal.py", what: "Mamba-1: input-dependent Δ, B, C (selectivity) as an explicit time-loop selective scan, with a verified incremental step() for decoding." },
      { name: "mamba2_minimal.py", what: "Scalar-per-head A reduces the recurrence to SSD: chunked decayed-attention matmuls with a carried (N, P) state, plus a sequential_scan reference used by the equivalence tests." },
      { name: "mamba3_minimal.py", what: "Complex diagonal transitions A = -exp(a) + iθ with a data-dependent exponential-trapezoidal rule; reduces exactly to Mamba-1/2 when λ = 1." },
      { name: "shared skeleton", what: "blocks.py (classifier heads), synthetic + IMDb data pipelines, a config-driven trainer that emits JSON, and a CUDA-event efficiency harness." },
    ],
    approach: [
      { title: "Math-verified discretization", body: "Exact ZOH with a Taylor fallback keeps (e^z-1)/z stable for tiny z. The recurrence is asserted against its parallel form, never eyeballed." },
      { title: "Chunked SSD with a sequential reference", body: "Mamba-2's decayed-attention form is computed block-wise in chunk groups to bound transient memory (about 1 GB saved at 32K), and tested equivalent to the naive sequential scan for aligned (32) and misaligned (64) chunk sizes at atol/rtol 1e-3." },
      { title: "Complex transitions for state tracking", body: "Mamba-3 pairs A = -exp(a) + iθ with a data-dependent trapezoidal λ. The rotation phase is what lets the state track parity; a test pins the reduction to exponential-Euler when λ = 1, θ = 0." },
      { title: "OOM as data", body: "The efficiency sweep records out-of-memory points as first-class results (oom_train: true) instead of hiding them, including the WDDM shared-memory spill past the 6 GB card." },
      { title: "Slow on purpose", body: "The selective scans are plain Python loops. That turns the gap between O(T) operation counts and real GPU execution into a measured, teachable finding." },
    ],
    evaluation: [
      "Hardware: RTX 4050 Laptop (6 GB), CUDA 13; seed 42 for every run; all numbers committed under results/ with environment blocks.",
      "Tasks: cumulative-XOR parity (L=128), selective copying (train L=64, test L=128), IMDb sentiment (12.5k samples, max_len 512), each at matched training budgets per config.",
      "Efficiency sweep: CUDA-event timing, 5 repeats, batch 8, d_model 256 / 2 layers, sequence lengths 1K to 32K; per-model training-step latency, peak memory, throughput and decode cost, with the Python-loop models capped at 4K.",
    ],
    metrics: [
      { value: "0.983", label: "parity accuracy, Mamba-3 (baselines 0.51-0.56)" },
      { value: "67%", label: "selective copying, Mamba-2 (S4D 6.4%)" },
      { value: "0.836", label: "IMDb accuracy, Mamba-2 (AUC 0.917)" },
      { value: "186 s", label: "Transformer train step at 32K (S4D 13.5 s)" },
    ],
    results: {
      columns: ["Model", "Parity acc", "Sel. copy", "IMDb acc", "1K step", "Long-context limit"],
      rows: [
        { label: "Transformer", values: ["0.533", "0.205", "0.813", "30 ms", "32K · 186 s/step"] },
        { label: "S4D", values: ["0.506", "0.064", "0.827", "19.5 ms", "32K · 13.5 s/step"] },
        { label: "Mamba", values: ["0.559", "0.649", "skipped", "2 632 ms", "4K · 248 s/step"] },
        { label: "Mamba-2", values: ["0.563", "0.670", "0.836", "78.5 ms", "16K · OOM at 32K"] },
        { label: "Mamba-3", values: ["0.983", "0.215", "skipped", "10 880 ms", "OOM at 2K"] },
      ],
      note: "All values from results/*.json (parity_*, selective_copy_*, imdb_*, efficiency_gpu.json). IMDb rows for Mamba-1/3 were skipped on wall-clock budget, documented in the README. Points past 6 GB VRAM ran via WDDM shared-memory spill, which also distorts near-OOM timings - recorded as data.",
    },
    archFigure: { src: "/projects/s4-to-mamba/task-formulation.png", caption: "The three task formulations (from the report): cumulative-XOR parity, selective copying, and exact copying - each probes a different state capability." },
    figures: [
      { src: "/projects/s4-to-mamba/parity.png", caption: "Cumulative-XOR parity accuracy. Only the complex-transition model clears chance; every real-transition baseline sits near 0.5." },
      { src: "/projects/s4-to-mamba/selcopy.png", caption: "Selective copying, train L=64 / test L=128. Selective SSMs learn the task; LTI S4D collapses to 6%." },
      { src: "/projects/s4-to-mamba/efficiency.png", caption: "Training-step latency and peak memory vs sequence length. Attention's curves steepen quadratically; markers mark where models exhausted the 6 GB card." },
    ],
    findings: [
      "Complex input-dependent transitions are what restore state tracking: Mamba-3 is the only model above chance on cumulative parity (0.983 vs 0.51-0.56).",
      "LTI fails selectively even when complex: S4D's fixed rotation cannot encode per-bit rotations, collapsing to 6.4% on selective copying.",
      "Ranking flips with the task: selective SSMs win selective copying, but the Transformer and S4D win exact copying in distribution (1.00 at L=32) - the task formulation, not the architecture, decides.",
      "O(T) operations are not fast wall-clock: the Python-loop selective scan is 87x slower than S4D's FFT at 1K (2 632 ms vs 19.5 ms) - kernel launches and autograd dominate.",
      "The absolute-PE Transformer reproduces the published copying failure exactly: 1.00 in distribution at L=32, 0.036 at L=64.",
    ],
    decisions: [
      { title: "One skeleton, five mixers", body: "Every backbone shares blocks.py, so a benchmark difference isolates the mixer rather than the plumbing." },
      { title: "Slow scans on purpose", body: "Keeping the selective scan as a Python loop turns the theory-vs-wall-clock gap into a measured, teachable result." },
      { title: "Verify math, not shapes", body: "Each dual compute form has an equivalence test at atol/rtol 1e-3: FFT vs recurrent, chunked vs sequential, and the λ=1 reduction." },
      { title: "Chunk-grouped SSD", body: "Processing decay matrices in bounded groups cut roughly 1 GB of transient memory at 32K." },
      { title: "Honest failures", body: "Full S4 (NPLR), fused kernels and Mamba-3's MIMO form are declared not-implemented; OOM is recorded as data, not a crash." },
    ],
    validation: [
      "A 14-test suite (tests/test_models.py) asserts S4D's FFT-convolution equals its recurrent step; Mamba-2's chunked scan equals the sequential reference for aligned (32) and misaligned (64) chunk sizes at atol/rtol 1e-3; Mamba-3 reduces to exponential-Euler exactly when λ=1, θ=0; and Mamba's step() equals a full forward.",
      "Dataset contract tests pin task semantics: parity is cumulative XOR, selective-copy masking, exact-copy BOS/SEP/EOS structure.",
      "Every benchmark JSON embeds its environment block (GPU, torch, CUDA version) and the seed, so numbers are attributable.",
    ],
    limitations: [
      "Single seed (42) on one 6 GB laptop GPU: rankings are measured, not statistical.",
      "No fused CUDA/Triton kernels: wall-clock results reflect the Python-loop implementations by design.",
      "Full S4 (NPLR/Cauchy) is not implemented - S4D only; Mamba-3's MIMO form and chunked dual are documented but not implemented.",
      "IMDb skips Mamba-1/3 on wall-clock budget; no language-modeling/perplexity evaluation.",
      "Near-OOM timings on Windows are distorted by WDDM shared-memory spill (documented in the README).",
    ],
    interview: {
      built: "Five sequence models (Transformer, S4D, Mamba, Mamba-2, Mamba-3) from first principles in pure PyTorch, trained on three designed tasks and swept 1K-32K on a 6 GB RTX 4050.",
      why: "To verify each SSM generation's claims the only way that sticks: implement them, train at matched budgets, and measure - including the wall-clock cost the papers omit.",
      how: "One shared block skeleton with swappable mixers; every dual compute form paired with an equivalence test; every number committed as JSON with its environment block.",
      decision: "Deliberately slow Python-loop scans, which turned the O(T)-ops vs wall-clock gap into a measured finding (87x) instead of a footnote.",
      strongest: "Mamba-3's complex transitions are the only thing above chance on cumulative parity (98.3% vs 51-56%), while LTI S4D collapses to 6% on selective copying.",
      limitation: "Single seed on one laptop GPU with no fused kernels - rankings are measured, not statistical.",
      next: "Fused selective-scan kernels to close the wall-clock gap, and multi-seed runs for error bars.",
      questions: [
        { q: "Why does ZOH produce (e^z-1)/z, and how do you keep it stable?", a: "Exact ZOH for diagonal A gives B-bar = ΔB(e^z-1)/z with z = Δa. For |z| < 1e-4 the code switches to a Taylor series (1 + z/2 + z²/6) to avoid 0/0." },
        { q: "Why can't LTI models do parity?", a: "Cumulative parity needs input-dependent state rotations. S4D is complex but its rotation is fixed; real-transition eigenvalues cannot rotate at all. Only input-dependent complex transitions (Mamba-3) encode per-bit rotations." },
        { q: "How do you prove chunked SSD equals the sequential scan?", a: "A test runs both forms on identical inputs and asserts allclose at atol/rtol 1e-3, for aligned (32) and misaligned (64) chunk sizes." },
        { q: "If Mamba is O(T), why is it 87x slower than S4D?", a: "Operation count is not wall-clock. The Python-loop scan pays per-step kernel launches and autograd graph overhead, while S4D trains as one FFT convolution." },
        { q: "What happens to the Transformer at 32K?", a: "30 ms becomes 186 s per training step with ~9.9 GB peak memory (via WDDM spill): the quadratic term dominates, while O(T)-state models hold longer or OOM on the 6 GB card." },
      ],
    },
  },
  {
    slug: "aire",
    num: "02",
    short: "AIRE",
    title: "AIRE: AI Reliability & Evaluation Engine",
    tagline:
      "A trace-based evaluation engine that turns LLM/RAG behavior into replayable evidence: deterministic metrics, a failure taxonomy, and direction-aware regression detection.",
    period: "Aug 2026",
    role: "Solo project - design, implementation, evaluation",
    repo: "https://github.com/vaibhav3000/aire",
    stack: ["Python", "pytest", "HTML/CSS"],
    overview: [
      "AIRE runs a system under test once over a fixed JSONL suite, persists schema-validated per-invocation traces, and evaluates the recorded traces with deterministic metrics - never re-running the system. Runs are compared with a direction-aware, relative-threshold regression engine that attaches per-case attribution to every regression, and every failure lands in a mutually exclusive taxonomy.",
      "The framework is zero-dependency and fully reproducible offline: a deterministic RAG stack (keyword retrieval + extractive responder) provides the calibration harness, and a separate recorded run evaluates real Gemini generation against the same suite. Both live in the same trace format, so the comparison is apples-to-apples.",
    ],
    problem: [
      "AI systems are easy to build and hard to trust. Evaluation is nondeterministic, reference answers are scarce, and every LLM call costs money - so most testing happens once, informally, at build time, and never again.",
      "The gap this project attacks: make evaluation an artifact. Run once, store the evidence, and let metrics, failure analysis and regression detection be re-run forever against stored traces - including on runs collected months earlier from a different system.",
    ],
    architecture: [
      { name: "runner/dataset.py", what: "EvalDataset: the fixed JSONL suite. Every run manifest embeds the dataset's SHA-256, so traces are attributable to an exact suite version." },
      { name: "llm/base.py + deterministic.py + openai_compat.py", what: "The SystemUnderTest interface with two implementations: a deterministic stack (KeywordRetriever + ExtractiveRAG with faithful/fluent styles) and a real LLM via an OpenAI-compatible endpoint." },
      { name: "runner/runner.py", what: "ExperimentRunner: per-invocation timeout watchdog (30 s default, 150 s for LLM runs), retries, and error propagation - SUT failures become trace errors, never silent empty answers." },
      { name: "tracing/", what: "TraceRecorder + RunStore: schema-validated traces persisted as manifest.json + traces.jsonl per run directory." },
      { name: "evaluator/engine.py", what: "EvaluationEngine: applies metrics and the first-match-wins failure taxonomy to stored traces. It never re-runs the system under test." },
      { name: "regression/compare.py", what: "Direction-aware run comparison with relative thresholds and per-case attribution, sorted worst-first." },
      { name: "report/html.py", what: "Static HTML comparison reports generated from the stored runs." },
    ],
    approach: [
      { title: "Run once, replay forever", body: "Traces carry the dataset hash and full invocation records, so new metrics apply to old runs at zero API cost and comparisons never re-invoke the system." },
      { title: "Deterministic metrics, defined in code", body: "Keyword recall, citation coverage, a lexical groundedness proxy (at least 50% content-keyword overlap with the cited document), abstention correctness, and recall@k/MRR - each metric's blind spots documented in its docstring rather than oversold." },
      { title: "Direction-aware regression", body: "A metric registry declares higher/lower-is-better per metric; thresholds are relative to the baseline (2% default) so one setting spans metrics of wildly different scales, with a looser override for latency." },
      { title: "First-match-wins failure taxonomy", body: "Invocation error, then abstention errors, then ungrounded, incomplete, retrieval miss, success. The ordering encodes causality, so each case lands in exactly one bucket and counts sum to the suite." },
      { title: "Honest operational data", body: "Timeouts, retries, token provenance (api vs heuristic) and rate-limit failures all land in traces as invocation_error records - reliability is measured, not excused." },
    ],
    evaluation: [
      "Suite: 26 JSONL cases over a 12-document corpus - 22 answerable, 4 unanswerable (expecting abstention), 2 requiring multi-doc synthesis.",
      "Three deterministic RAG versions: v1 overlap retrieval top-1 with faithful quoting; v2 IDF-weighted top-3 retrieval; v3 = v2 plus a fluent style that merges sentences and drops citations - a planted regression.",
      "Live run: gemini-2.5-flash through an OpenAI-compatible endpoint, temperature 0, local IDF top-3 retrieval, 5 s pacing between calls, 150 s runner timeout. The API key is read from the environment and never written to traces.",
    ],
    metrics: [
      { value: "0.57→0.00", label: "groundedness collapse caught (planted v3 regression)" },
      { value: "0.91", label: "retrieval recall after v2 (v1: 0.73)" },
      { value: "1.00", label: "abstention + grounding on the live run (0.0 / 0.57 before)" },
      { value: "17/26", label: "clean cases on live Gemini (6 quota errors recorded)" },
    ],
    results: {
      columns: ["Metric", "v1 baseline", "v2 improved", "v3 fluent", "Live Gemini"],
      rows: [
        { label: "Retrieval recall", values: ["0.7273", "0.9091", "0.9545", "0.9091"] },
        { label: "Citation coverage", values: ["0.7273", "0.7273", "0.0", "0.6818"] },
        { label: "Groundedness", values: ["0.5682", "0.5682", "0.0", "1.0"] },
        { label: "Abstention correct", values: ["0.0", "0.0", "0.0", "1.0"] },
        { label: "Latency / case", values: ["0.22 ms", "0.22 ms", "0.20 ms", "15 320 ms"] },
        { label: "Clean cases", values: ["12/26", "13/26", "0/26", "17/26"] },
      ],
      note: "All values from results/*/eval_results.json, llm_eval_results.json and the two comparison JSONs. The live run recorded 6/26 cases as invocation_error traces (HTTP 429 quota errors), one wrong abstention on an answerable case, and exact API token totals (12 374 prompt + 756 completion).",
    },
    figures: [
      { src: "/projects/aire/aire_versions.png", caption: "Deterministic three-version comparison over the 26-case suite: v3's fluent style lifts retrieval (0.95) while citation coverage and groundedness drop to zero." },
      { src: "/projects/aire/aire_live.png", caption: "Live Gemini vs deterministic v2: quality gains on the left (abstention, grounding); log-scale operational cost on the right (latency and tokens per case)." },
    ],
    findings: [
      "Fluency destroyed grounding: v3 read better and retrieved better (recall 0.95) while every citing case became ungrounded (groundedness 0.57→0.00, citation coverage 0.73→0.0). A composite score would have called v3 fine.",
      "Better is a trade-off table, not a number: the live responder fixed abstention (0.0→1.0) and grounding (0.57→1.0) but cost 15.3 s vs 0.3 ms per case and 7.3x the tokens.",
      "The evaluator exposed a capability gap: unanswerable retrieval scores (0.18-0.46) overlap answerable minimums (0.19-0.26), so no score threshold can fix abstention - it needs semantic matching.",
      "Operational reliability is measured, not excused: 6/26 quota failures are recorded as invocation_error traces, and 17/26 clean is reported as-is.",
      "Groundedness is a documented proxy: it catches uncited claims but cannot certify entailment - the README states the blind spot instead of overselling.",
    ],
    decisions: [
      { title: "Replay economics", body: "Run once, store traces, evaluate forever: new metrics apply to old runs at zero API cost, and comparisons never re-invoke the system." },
      { title: "A deterministic SUT exists", body: "Every committed number is reproducible offline, and evaluator bugs surface as metric changes instead of LLM noise." },
      { title: "Relative thresholds", body: "Delta over baseline makes the default 2% scale-free across metrics of wildly different ranges: +0.58 tokens on ~83 is noise; -0.57 groundedness is a catastrophe." },
      { title: "No evaluation framework", body: "Not building on DeepEval/Ragas keeps every metric auditable line-by-line - the evaluation layer is the product." },
      { title: "Errors propagate", body: "SUT-internal failures surface as trace errors and classify as invocation_error, so provider failures cannot masquerade as wrong answers." },
    ],
    validation: [
      "A 20-test suite covers metric definitions (supported/unsupported/uncited sentences), recall@k and MRR, trace schema validation and round-trip, RunStore rejection of invalid traces, retriever ranking, faithful-cites/fluent-drops behavior, taxonomy priority, regression direction on the fluent run, and HTML report rendering.",
      "Three real bugs found by the harness are documented in-repo: dropped SUT errors misclassifying provider failures, a 30 s watchdog that consumed 14/26 live cases (raised to 150 s), and a citation-attachment parsing bug.",
      "Dataset integrity: every run manifest embeds the SHA-256 of eval_set.jsonl, so results are attributable to an exact suite version.",
    ],
    limitations: [
      "Lexical groundedness is a proxy, not entailment: faithful paraphrase scores zero and vocabulary reuse can fool it.",
      "The deterministic responder is a reproducible harness, not a real LLM; the live Gemini run is a 26-case single sweep with 6 quota failures - a demonstration, not a leaderboard.",
      "Keyword retrieval cannot decide answerability (the measured score distributions overlap); abstention remains an open gap for the deterministic stack.",
      "Token counts for the deterministic runs are heuristic (about 4 chars/token), and the thread-based watchdog cannot kill hung workers.",
      "Retrieval ground truth is hand-declared.",
    ],
    interview: {
      built: "A trace-based evaluation engine for LLM/RAG systems: one 26-case suite, three deterministic RAG versions, a live Gemini run, and a regression engine with per-case attribution.",
      why: "AI systems are easy to build and hard to trust - nondeterminism, scarce references and call cost make point-in-time testing worthless. AIRE makes evaluation replayable evidence.",
      how: "System runs persist as schema-validated traces; a deterministic engine scores them, classifies failures first-match-wins, and compares runs with direction-aware relative thresholds.",
      decision: "Run once, replay forever: traces carry a dataset hash, so new metrics apply to old runs at zero API cost.",
      strongest: "The planted v3 fluent regression: retrieval improved to 0.95 while groundedness fell 0.57→0.00 - caught, and attributed to 17 specific cases.",
      limitation: "Groundedness is a lexical proxy, and the live LLM run is a small-n single sweep (17/26 clean, 6 quota errors).",
      next: "A semantic-entailment second-tier judge, and a score-free abstention path, since the measured score distributions overlap.",
      questions: [
        { q: "Why replay traces instead of evaluating live?", a: "Cost and determinism: the SUT runs once and the engine scores stored traces, so new metrics apply to old runs at zero API cost and comparisons never re-invoke the system." },
        { q: "What does your groundedness metric actually measure?", a: "A lexical proxy: per cited sentence, at least 50% content-keyword overlap with the cited document. It catches uncited claims but is not entailment - faithful paraphrase scores zero, and the README documents that." },
        { q: "How does the regression engine avoid crying wolf?", a: "Thresholds are relative to the baseline (2% default), direction-aware per metric, with a looser latency override; every regression ships with per-case attribution sorted worst-first." },
        { q: "Why a first-match-wins failure taxonomy?", a: "It encodes causality - an invocation error cannot also be an ungrounded answer - so each case lands in exactly one bucket and the counts sum to the suite." },
        { q: "Why not use DeepEval or Ragas?", a: "The evaluation layer is the product. I want every metric auditable line-by-line, and the deterministic mode lets evaluator bugs surface as metric changes instead of LLM noise." },
      ],
    },
  },
  {
    slug: "repo-engineer",
    num: "03",
    short: "Repo Engineer",
    title: "Autonomous Repository Engineer",
    tagline:
      "A verified tool-using coding agent: the planner only proposes actions, a deterministic state machine decides, and completion requires green test evidence - never model claims.",
    period: "Sep 2026",
    role: "Solo project - design, implementation, benchmark",
    repo: "https://github.com/vaibhav3000/repo-engineer",
    stack: ["Python", "pytest", "Git"],
    overview: [
      "repo-engineer is a tool-using coding agent in pure-stdlib Python. Given a small repository and a task, it inspects the code, plans, edits through validated tools, runs tests, replans on failure, and only declares success when the verification suite is green. The core rule: the planner proposes, the runtime disposes.",
      "The project treats agent reliability as an engineering problem rather than a prompting problem: malformed tool calls, arbitrary shell access and unverified success claims are made structurally impossible by the runtime, for scripted and LLM planners alike.",
    ],
    problem: [
      "Three failures dominate tool-using coding agents: malformed tool calls that crash the loop, arbitrary shell access that is unsafe by construction, and the model claiming a fix without proof.",
      "The gap this project attacks: what does an agent runtime look like if none of those three are possible - where every call is validated, every mutation is jailed and allowlisted, and completion is a state reachable only through test evidence?",
    ],
    architecture: [
      { name: "state.py", what: "A ten-state machine (INIT, ANALYZE_REPO, PLAN, ACT, OBSERVE, REPLAN, VERIFY, COMPLETE, HUMAN_REVIEW, FAILED) with an explicit TRANSITIONS table - illegal transitions raise. Serializable AgentState plus dual budgets: max_steps 40, max_replans 4." },
      { name: "tools.py", what: "Seven validated tools (list_tree, search, read_file, apply_edit, write_file, git_diff, run_tests) with ToolSpec schema validation, READ_ONLY/MUTATING/EXECUTION permission classes, AUTO/ASK/DENY policies, the workspace path jail, and the run_tests command allowlist." },
      { name: "planner.py", what: "Three interchangeable planners: ScriptedPlanner (deterministic recipes for the reproducible benchmark), LLMPlanner (gemini-2.5-flash via an OpenAI-compatible client), RecordedPlanner (test double)." },
      { name: "agent.py", what: "The AgentRuntime loop: executes proposals, observes results, triggers verification and replanning, and exports a full JSON trace per run." },
      { name: "benchmark/", what: "Harness plus four self-contained mini-repos, each run from a fresh copytree workspace with its own task.json and failing or missing tests." },
    ],
    approach: [
      { title: "Planner proposes, runtime disposes", body: "Planner output is only a tool-call proposal. The state machine alone transitions states, enforces budgets and decides verification - the planner is the only non-deterministic part, and the machine is the auditable safety boundary." },
      { title: "Schema-validated tools", body: "ToolSpec.validate rejects malformed calls with structured errors that return as rejected Observations. Hallucinated calls become feedback in the agent's history, never crashes." },
      { title: "Workspace path jail", body: "Every path argument is resolved and must land inside the workspace: ../, absolute paths and drive-letter escapes are rejected with PermissionError." },
      { title: "Fail-closed permissions", body: "Tools are classified READ_ONLY, MUTATING or EXECUTION with AUTO/ASK/DENY policies. ASK without a callback denies - the headless default is safe." },
      { title: "Allowlisted execution", body: "run_tests accepts only python -m pytest / unittest prefixes, shell=False, a 120 s timeout and capped output. rm -rf and curl-pipe-shell are test-proven rejections." },
      { title: "Unambiguous edits", body: "apply_edit requires exactly one match (zero or multiple occurrences is an error) and write_file refuses overwrites, so every mutation path is explicit." },
    ],
    evaluation: [
      "Four self-contained mini-repos, each with a task.json and a failing or missing suite: an off-by-one loop, a wrong tax constant with a pre-failing test, a slugify function with no coverage, and a rename across two files.",
      "Each run starts from a fresh copytree workspace; success is decided only by a VERIFY re-run of the full suite exiting 0. Budgets: 40 steps, 4 replans.",
      "Deterministic mode uses ScriptedPlanner recipes (byte-stable, no network, no keys); live mode swaps in gemini-2.5-flash at temperature 0 through the identical gates.",
    ],
    metrics: [
      { value: "4/4", label: "SWE tasks, deterministic, zero failed tool calls" },
      { value: "2/2", label: "live Gemini tasks (2 mid-run 429s absorbed)" },
      { value: "0", label: "failed tool calls across every run" },
      { value: "7", label: "validated tools behind schema + policy + jail" },
    ],
    results: {
      columns: ["Task", "Change required", "Steps", "Replans", "Failed calls"],
      rows: [
        { label: "Off-by-one loop fix", values: ["one-line range fix", "5", "0", "0"] },
        { label: "Repair failing test", values: ["wrong constant 0.20→0.25", "5", "1", "0"] },
        { label: "Add missing tests", values: ["write tests/test_slug.py", "5", "0", "0"] },
        { label: "Constrained rename", values: ["rename across 2 files", "7", "0", "0"] },
      ],
      note: "Deterministic results from results/benchmark_results.json (success_rate 1.0, 1 total replan). Live run from results/llm_benchmark_results.json: gemini-2.5-flash completed task_01 and task_03 with two HTTP 429 quota errors absorbed as recoverable planner errors; the committed per-task counters are cumulative snapshots (7 LLM calls true total), an accounting caveat the report itself documents.",
    },
    figures: [],
    findings: [
      "The safety boundary is planner-agnostic: live LLM proposals flow through the identical validate, policy, jail and execute gates as scripted ones.",
      "Provider failures were absorbed mid-run: two HTTP 429 quota errors surfaced as recoverable planner errors and the task still ended verified - resilience lives in the runtime, not the model.",
      "Zero failed tool calls across all runs: rejections return as observations fed back into history, not exceptions.",
      "Completion is unreachable by claim: only a VERIFY re-run exiting 0 opens the COMPLETE transition.",
    ],
    decisions: [
      { title: "A state machine around the planner", body: "The planner is the only non-deterministic component; wrapping it makes the safety boundary auditable and identical for scripted and LLM planners." },
      { title: "apply_edit, not diffs", body: "Exact-once string matching rejects ambiguity mechanically (zero or multiple matches are errors) without a diff parser." },
      { title: "Scripted planner for the benchmark", body: "Byte-stable recipes with no keys or network mean the benchmark measures the runtime, not model intelligence." },
      { title: "No framework", body: "Zero third-party runtime dependencies: the validation, jail and policy layer is the actual engineering, and a framework would hide exactly those parts." },
      { title: "Completion needs test evidence", body: "A planner claiming success changes nothing: VERIFY re-runs the suite and requires exit 0." },
    ],
    validation: [
      "14 test functions (17 collected with a four-task parametrization): illegal transitions raise; unknown tools and wrong-typed arguments are rejected; ../ and drive-letter jail escapes fail; apply_edit ambiguity errors; write_file refuses overwrites; EXECUTION under DENY is blocked; rm -rf and curl-pipe-shell are allowlist-rejected; ASK without a callback fails closed in both directions; LLMPlanner refuses without credentials; budget exhaustion ends in FAILED.",
      "Benchmark JSONs commit per-task steps, replans, wall time and failed-call counters; the live run records token totals and its 429 recovery events.",
      "The state machine itself is exhaustive: any transition outside the table raises, so the agent cannot reach COMPLETE except through VERIFY.",
    ],
    limitations: [
      "The scripted planner is a fixture: the benchmark measures the runtime, not model intelligence.",
      "The live LLM benchmark is n=2, one run each - a demonstration, not a leaderboard.",
      "The jail is per-path-argument, not an OS-level sandbox, and there is no transactional rollback for multi-file edits.",
      "The LLM planner's context includes file content, so prompt injection is mitigated by prompting only - a documented residual risk.",
    ],
    interview: {
      built: "A pure-stdlib tool-using coding agent: a ten-state machine around pluggable planners, seven schema-validated tools inside a workspace jail, and completion decided only by green tests.",
      why: "Three failures dominate coding agents - malformed tool calls, arbitrary shell access, and 'the model says it's fixed' without proof. This runtime makes all three structurally impossible.",
      how: "The planner only proposes tool calls; the state machine validates, jails, executes and observes; VERIFY re-runs the suite and COMPLETE requires exit 0.",
      decision: "Wrapping the planner in a deterministic state machine: the planner is the only non-deterministic part, the machine is the auditable safety boundary.",
      strongest: "4/4 benchmark tasks with zero failed tool calls, plus a live Gemini run that absorbed two mid-run HTTP 429s and still finished verified.",
      limitation: "The scripted planner is a fixture, the LLM run is n=2, and the jail is per-path rather than an OS sandbox.",
      next: "OS-level sandboxing and transactional rollback for multi-file edits.",
      questions: [
        { q: "The model says it fixed the bug but tests fail - what happens?", a: "Nothing: COMPLETE is only reachable from VERIFY, which re-runs the full suite and requires exit 0. A planner claiming success changes nothing." },
        { q: "Why a state machine around the planner?", a: "The planner is the only non-deterministic component. Wrapping it makes the safety boundary auditable: every call passes validate, policy, jail and execute identically for scripted and LLM planners." },
        { q: "Why apply_edit with exact-once matching instead of diffs?", a: "Ambiguity is rejected mechanically: zero or multiple matches are errors. That gives edits an unambiguous contract without a diff parser." },
        { q: "What happens when a tool call is malformed?", a: "Schema validation returns a structured rejection as an Observation, which enters the agent's history - the loop continues instead of crashing. Zero failed tool calls across all runs." },
        { q: "Why not LangChain?", a: "The validation, jail and policy layer is the actual engineering; a framework would hide exactly the parts that matter. The whole runtime is stdlib Python." },
      ],
    },
  },
];
