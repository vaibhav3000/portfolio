/**
 * Case-study content for the three project detail pages.
 * Every number is traceable to committed artifacts in the project repos
 * (CV Update/<project>/results/, and results/SUMMARY.md for s4-to-mamba);
 * nothing invented. Live provider runs and judge agreement are provisional
 * in the repos and are deliberately not quoted here.
 */

export type CaseFigure = { src: string; caption: string; width?: number; height?: number };
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
      "Five sequence backbones written from first principles in pure PyTorch, checked against float64 references, trained at matched parameter counts over three to five seeds, and benchmarked for decoding up to 32K tokens.",
    period: "May - Sep 2026",
    role: "Solo project - design, implementation, benchmarks, test suite",
    repo: "https://github.com/vaibhav3000/s4-to-mamba",
    stack: ["Python", "PyTorch", "NumPy", "SciPy", "Hugging Face Datasets", "Matplotlib", "pytest", "uv"],
    overview: [
      "ssmbench is a from-scratch study of how efficient sequence models evolved: a causal Transformer (sinusoidal or RoPE positions) alongside S4D, Mamba-1, Mamba-2 and Mamba-3, all in pure PyTorch behind one interface with a parallel form for training and an O(1) recurrent step() for generation (a KV cache for the Transformer).",
      "The models are compared on controlled tasks at parameter counts matched within 10%, over three run seeds per task and five for parity, then benchmarked for training, prefill, decode, memory, reduced-precision error and torch.compile readiness on one 6 GB RTX 4050 Laptop GPU. Every table and figure is generated from committed JSON.",
    ],
    problem: [
      "Attention's cost grows quadratically with sequence length and its KV cache grows linearly. State-space models promise linear-time training and a fixed-size recurrent state, but each generation carries its own trade-off, and the claims are easy to repeat and hard to verify.",
      "The gap this project attacks: what survives when each generation is implemented from first principles, checked against an independent reference, trained at matched budgets over several seeds, and measured on real hardware, failures included.",
    ],
    architecture: [
      { name: "transformer_minimal.py + attention.py", what: "Pre-norm causal Transformer with sinusoidal or RoPE positions. Attention runs through SDPA with the backend pinned per variant and the kernel that actually ran recorded; a naive reference checks every backend. Decoding uses a preallocated KV cache." },
      { name: "s4_minimal.py", what: "S4D: complex diagonal A, LTI, exact zero-order hold computed as expm1(z)/z with a Taylor branch for small |z|, an FFT-convolution training form and an O(1) complex-state decode step." },
      { name: "mamba_minimal.py", what: "Mamba-1: input-dependent Δ, B and C as a sequential selective scan, with an O(1) state-plus-conv-history step() for decoding." },
      { name: "mamba2_minimal.py", what: "Mamba-2: a scalar decay per head turns the recurrence into chunked SSD matmuls with a carried state, computed in log space with direct segment sums; grouped B and C are expanded to heads explicitly." },
      { name: "mamba3_minimal.py", what: "Mamba-3: complex diagonal decay per head and state slot with the exponential-trapezoidal rule, as a recurrence and as a chunked parallel scan with a two-band correction. Static rotation frequencies, real B and C, no MIMO." },
      { name: "blocks.py + benchmarks/", what: "One decode interface (init_state, prefill, step) on every backbone, a seeded deterministic trainer with bitwise checkpoint resume, and the efficiency, inference, numerics and compile benchmarks." },
    ],
    approach: [
      { title: "Independent references", body: "Every model is checked against a naive float64 reference and with gradcheck, and prefill followed by single steps must reproduce the full forward pass. Comparing a model with itself is what let two real math bugs slip through the first version." },
      { title: "Matched parameters, several seeds", body: "Each SSM gets the width whose parameter count is closest to the Transformer's, all within 10%. A run seed varies initialization, dropout and batch order while a separate data seed keeps every run on the same examples; each test set is scored once." },
      { title: "Pinned attention kernels", body: "PyTorch picks an attention kernel at runtime, so the benchmark pins it with sdpa_kernel and records the kernel that actually ran. FlashAttention is not in the Windows torch wheel and is reported as unsupported, not skipped silently." },
      { title: "Decode as prefill, then step", body: "Prefill returns exactly the state the recurrence would hold after the prompt, so time to first token, per-token latency and decode state are measured the same way for all five backbones." },
      { title: "Spills recorded as data", body: "Points that run past free GPU memory are paged to system memory by the Windows display driver. They are flagged as spilled rather than reported as VRAM numbers, and longer lengths are skipped." },
    ],
    evaluation: [
      "Hardware: RTX 4050 Laptop GPU (6 GB), PyTorch 2.14.1 with CUDA 13.0 and deterministic algorithms; the environment and code revision are recorded with the results.",
      "Tasks: cumulative-XOR parity trained at length 128 and tested up to 2048; selective copying (T=64 with 3 to 5 pairs in distribution, T=128 with 5 to 10 out of distribution); exact copying trained at length 32 or on lengths 1 to 32; IMDb sentiment on 12,500 reviews at 512 tokens, scored on the 25,000-review test split.",
      "Seeds: 104 GPU training runs, three run seeds per task and five for parity. Results are mean ± sample standard deviation.",
      "Benchmarks at width 256 and two layers from 1K to 32K tokens: batch-8 training step and peak memory, batch-1 time to first token and per-token decode with 64 new tokens, bf16 and fp16 error against float64, and torch.compile graph breaks.",
    ],
    metrics: [
      { value: "89% / 99%", label: "parity on 2 of 5 Mamba-3 seeds (mean 72.6 ± 20.5%)" },
      { value: "≤57.3%", label: "parity mean of every rotation-free model, 5 seeds (chance 50%)" },
      { value: "0.39 MiB", label: "largest SSM decode state at 32K (fp32 KV cache: 128.25 MiB)" },
      { value: "585", label: "tests, including float64 references and gradcheck" },
    ],
    results: {
      columns: ["Model", "Parity, T=128 (n=5)", "Selective copy, OOD (n=3)", "Exact copy, L=32 (n=3)", "IMDb test (n=3)"],
      rows: [
        { label: "Transformer (sinusoidal)", values: ["52.5 ± 0.9", "12.1 ± 1.9", "87.4 ± 3.7", "81.6 ± 0.2"] },
        { label: "Transformer (RoPE)", values: ["51.7 ± 0.2", "7.5 ± 0.9", "98.6 ± 0.7", "81.9 ± 0.6"] },
        { label: "S4D", values: ["50.9 ± 0.5", "17.6 ± 3.4", "19.7 ± 1.0", "83.7 ± 0.2"] },
        { label: "Mamba-1", values: ["57.3 ± 2.3", "52.1 ± 20.4", "35.6 ± 8.3", "not trained"] },
        { label: "Mamba-2", values: ["56.8 ± 2.7", "49.6 ± 17.9", "29.0 ± 2.4", "84.5 ± 0.1"] },
        { label: "Mamba-3", values: ["72.6 ± 20.5", "14.4 ± 6.3", "61.4 ± 5.7", "82.5 ± 1.2"] },
        { label: "Mamba-3, no rotation", values: ["55.4 ± 1.2", "not run", "not run", "not run"] },
      ],
      note: "From results/SUMMARY.md, generated from results/train/. Accuracy in percent, mean ± sample standard deviation over n run seeds. Selective copy OOD is T=128 with 5 to 10 pairs (answer-token accuracy); exact copy is trained on lengths 1 to 32 and scored at 32. Chance: parity 50, selective copy 5.9, exact copy 3.8, IMDb 50. Parameters are matched within 10% per task (about 100K for parity, 0.37M to 0.40M for selective copy, 0.55M to 0.60M for exact copy, 3.0M to 3.4M for IMDb). Mamba-1 is not trained on IMDb because its sequential scan over 512 tokens is too slow on this GPU; the rotation ablation runs on parity only.",
    },
    figures: [
      { src: "/projects/s4-to-mamba/parity.png", width: 737, height: 583, caption: "Parity accuracy by test length, trained at 128, mean ± std over 5 seeds. Mamba-3's wide error bar is the seed split: two seeds learn the task (89.2% and 99.0%), three do not. No model extrapolates to longer sequences." },
      { src: "/projects/s4-to-mamba/selective-copy.png", width: 1384, height: 583, caption: "Selective copying over 3 seeds. In distribution every model except LTI S4D (28.4%) solves the task; with twice the length and pairs, only Mamba-1 and Mamba-2 keep about half the answers." },
      { src: "/projects/s4-to-mamba/exact-copy.png", width: 1383, height: 583, caption: "Exact copying over 3 seeds. Trained at one length, the task is a fixed delay that S4D's convolution represents exactly; trained on lengths 1 to 32, the Transformers copy best and Mamba-3 is the best SSM (61.4% at 32). Nothing generalizes to 64." },
      { src: "/projects/s4-to-mamba/inference.png", width: 2063, height: 583, caption: "Generation in bf16, batch 1, 64 new tokens. The SSM decode state stays flat with prompt length while the KV cache grows linearly to 64.12 MiB at 32K. The models share width 256 and two layers but not parameter counts, so compare each curve's growth, not timings between models." },
    ],
    findings: [
      "Rotation is what helps on parity, but only on some seeds: Mamba-3 reaches 89.2% and 99.0% on 2 of 5 seeds (mean 72.6 ± 20.5%); with its rotation removed it falls to 55.4%, and no seed exceeds 57.2%.",
      "Every rotation-free model stays near chance on parity at T=128 (Mamba-1 57.3%, Mamba-2 56.8%, RoPE Transformer 51.7%, S4D 50.9%), and every model is back to 50.1 to 51.5% at T=2048.",
      "Selectivity decides selective copying: Mamba-1/2/3 and the Transformers solve it in distribution (98 to 100%) while LTI S4D reaches 28.4%. Out of distribution only Mamba-1 and Mamba-2 keep about half the answers.",
      "On IMDb all five trained models land between 81.6% and 84.5%; Mamba-2 is best at 84.5 ± 0.1%.",
      "Decode state is the clearest systems difference: after a 32K prompt the SSM states take 0.14 to 0.39 MiB, while the Transformer's KV cache takes 128.25 MiB in fp32 (64.12 MiB in bf16).",
      "Every forward pass compiles to one torch.compile graph with zero breaks; S4D's decode step has 4 breaks, at a Tensor.item() call in its parameter-version check.",
    ],
    decisions: [
      { title: "One interface, five backbones", body: "init_state, prefill and step on every model make decoding comparable and testable: prefill plus single steps must reproduce the forward pass." },
      { title: "References before speed", body: "Naive float64 implementations and gradcheck are the source of truth for every fast form, including the chunked Mamba-3 scan (values, final state and gradients for chunk sizes 1 to 64)." },
      { title: "Seeds vary training, not data", body: "A run seed sets initialization, dropout and batch order; a separate data seed keeps the datasets fixed, so the spread comes from training alone." },
      { title: "Numbers come from generated tables", body: "make_tables.py writes every table and figure from committed JSON, and its --check mode fails when a document drifts from the results." },
      { title: "Honest scope", body: "Full S4 (NPLR), Mamba-3's MIMO form and input-dependent rotation frequencies are declared not implemented, and the benchmark sweeps are labelled as not parameter-matched." },
    ],
    validation: [
      "585 tests pass (one CUDA-only test skipped on CPU) with ruff and pyright clean. They check every backbone against a naive float64 reference, prefill plus single steps against the full forward pass, the chunked Mamba-3 scan against its recurrence for chunk sizes 1 to 64 and underflowing decays, gradcheck, RoPE against an independent complex rotation, and the attention backends against each other.",
      "The audit behind this version found two math bugs the earlier self-comparison tests could not catch: S4D's zero-order hold divided by 1 instead of z = Δ·A (gradients off by up to 7.8x), and Mamba-2/3 scrambled grouped B and C across heads. Every earlier result was re-run on the fixed code.",
      "Training is bitwise identical for equal seeds and after resuming from a checkpoint, and resume is refused across code versions.",
      "The environment (GPU, driver, PyTorch, CUDA and cuDNN versions, code revision) is recorded at the start of the GPU runs, and every attention result stores the kernel that actually ran.",
    ],
    limitations: [
      "Parity rests on a minority of seeds: two of five Mamba-3 seeds learn it, and the mean of 72.6 ± 20.5% hides that split.",
      "Nothing extrapolates in length: on exact copying every model is at most 13.1% beyond the longest training length, and every parity mean is 50.1 to 51.5% at length 2048.",
      "The benchmark sweeps are not parameter-matched: every model has width 256 and two layers (Transformer 1.58M parameters, S4D 183K, the Mamba variants about 876K), so no speed or memory ratio between architectures is like for like.",
      "Timing is one initialization on one laptop GPU with unlocked clocks. There are no fused kernels, and Inductor was not measured because Triton is not available on Windows.",
      "Small scale: 0.1M to 3.4M parameters and a few epochs. Full S4 (NPLR), Mamba-3's MIMO form and input-dependent rotation frequencies are not implemented.",
    ],
    interview: {
      built: "Five sequence backbones (Transformer, S4D, Mamba-1, Mamba-2, Mamba-3) from first principles in pure PyTorch behind one decode interface, trained over 104 GPU runs and benchmarked from 1K to 32K tokens on a 6 GB RTX 4050.",
      why: "To check each SSM generation's claims the only way that sticks: implement it, verify it against an independent reference, train at matched budgets over several seeds, and measure it.",
      how: "Naive float64 references and gradcheck for correctness, parameter matching within 10% and three to five seeds for the comparisons, pinned attention kernels and flagged spills for the benchmarks, and generated tables for every number.",
      decision: "Testing against independent float64 references instead of comparing a model with itself. That exposed two real math bugs in the first version and forced every result to be re-run.",
      strongest: "Mamba-3 reaches 89% and 99% on parity on 2 of 5 seeds, while every rotation-free model, including Mamba-3 with its rotation removed, stays near chance (means ≤57.3%).",
      limitation: "Only 2 of 5 Mamba-3 seeds learn parity, nothing extrapolates in length, and the benchmark sweeps are not parameter-matched.",
      next: "Fused scan kernels so the timings mean more, and more parity seeds to estimate how often the rotation is learned.",
      questions: [
        { q: "Why does Mamba-3 solve parity and Mamba-2 doesn't?", a: "Parity needs a sign flip for every 1-bit, which is a rotation by π. Real, non-negative decays can only shrink the state; a complex rotation can flip it. The rotation-free ablation (55.4%) isolates that factor." },
        { q: "Only 2 of 5 seeds learn it. Is the result real?", a: "The capability exists, but optimization is seed-sensitive at this scale. That is why the results report mean ± std and the per-seed values, not the best seed." },
        { q: "How did you find the bugs?", a: "Naive float64 reference implementations, equivalence tests between the parallel and recurrent forms, and gradcheck. The old tests compared a model with itself in ways that could not catch either bug." },
        { q: "Why is the SSM decode state constant?", a: "The recurrence carries a fixed heads × N × P state, while a KV cache grows linearly with the prompt. At 32K that is at most 0.39 MiB for the SSMs against 128.25 MiB for the fp32 KV cache here." },
        { q: "How do you keep zero-order hold stable?", a: "Exact ZOH for diagonal A gives B̄ = ΔB(e^z - 1)/z with z = ΔA. expm1 avoids the cancellation in e^z - 1, and below |z| = 1e-2 in float32 (1e-4 in float64) a Taylor series keeps the value and its gradient accurate." },
        { q: "Why pin the SDPA backend?", a: "PyTorch picks the attention kernel at runtime, so unpinned benchmarks can compare different kernels across runs. The kernel that actually ran is detected and stored with each result." },
      ],
    },
  },
  {
    slug: "aire",
    num: "02",
    short: "AIRE",
    title: "AIRE: AI Reliability & Evaluation Engine",
    tagline:
      "A trace-based evaluation engine that turns LLM/RAG behavior into replayable evidence: deterministic metrics, a failure taxonomy, and a statistical regression gate that runs in CI.",
    period: "Aug - Oct 2026",
    role: "Solo project - design, implementation, evaluation",
    repo: "https://github.com/vaibhav3000/aire",
    stack: ["Python", "asyncio", "OpenTelemetry", "pytest", "GitHub Actions", "Docker"],
    overview: [
      "AIRE runs a system under test once over a fixed JSONL suite, stores schema-validated traces, and scores the stored traces with deterministic metrics and pluggable judges, never re-running the system. Runs are compared metric by metric with paired significance tests, and every failure lands in one class of a fixed taxonomy.",
      "The core is zero-dependency and reproducible offline: a deterministic RAG stack (keyword retrieval and an extractive responder) produces every committed number. Adapters for Gemini, OpenAI, Anthropic and local OpenAI-compatible servers run through an async runner with its own rate limiter, retries and cache.",
    ],
    problem: [
      "AI systems are easy to build and hard to trust. Outputs are nondeterministic, reference answers are scarce and every call costs money, so most testing happens once, informally, and never again.",
      "The gap this project attacks: make evaluation an artifact, and make the gate trustworthy. Store the evidence, re-score it as metrics change, and call something a regression only when the change is beyond tolerance and a paired test supports it.",
    ],
    architecture: [
      { name: "runner/dataset.py", what: "EvalDataset: the fixed 150-case JSONL suite. Every run manifest embeds the dataset's SHA-256, so traces are attributable to an exact suite version." },
      { name: "llm/ + providers/", what: "The SystemUnderTest interface, a deterministic stack (KeywordRetriever with overlap or IDF weighting plus ExtractiveRAG), and adapters for Gemini, OpenAI, Anthropic and a stdlib OpenAI-compatible client, with SDK retries turned off." },
      { name: "providers/client.py + ratelimit.py", what: "ModelClient owns retries: a two-bucket AIMD rate limiter that halves on a 429, full-jitter backoff that honours Retry-After, a quota circuit breaker and an exact-request response cache." },
      { name: "runner/async_runner.py", what: "A worker pool with real cancellation. Harness sleeps (pacing and backoff) happen outside the timed region and are recorded separately, and cache hits are excluded from latency." },
      { name: "tracing/", what: "TraceRecorder and RunStore: traces are streamed to manifest.json plus traces.jsonl and written atomically, so an interrupted run keeps what it finished." },
      { name: "evaluator/", what: "Groundedness, citation precision and recall, Recall@K, MRR and abstention metrics; agent trajectory metrics; rubric and pairwise judges; and stats.py with seeded bootstrap CIs, a paired bootstrap, McNemar's exact test and Holm adjustment." },
      { name: "regression/compare.py + gate.py", what: "Direction-aware comparison with per-case attribution. aire-gate exits 0 on a pass, 1 on a regression and 2 when the inputs are unusable or the gate itself fails." },
      { name: "telemetry/ + report/", what: "OpenTelemetry GenAI span export (OTLP/HTTP and JSON lines), ingestion of foreign OTLP traces, and escaped static HTML diff reports." },
    ],
    approach: [
      { title: "Run once, replay forever", body: "Traces carry the dataset hash and full invocation records, so new metrics apply to old runs at zero API cost and comparisons never re-invoke the system." },
      { title: "Metrics that score what they claim", body: "An audit found that a citation placed after the period was attached to the next sentence, so verbatim quotes scored 0.5. With that fixed, faithful quoting scores 1.0, and a test asserts it." },
      { title: "Recall at a fixed K", body: "v1 returned one document and v2 three, so recall is now reported at K=1 and K=3. A retrieval ablation at a fixed K shows the v2 gain comes from retrieving three documents, not from IDF weighting." },
      { title: "Tolerance plus significance", body: "A metric regresses only when the change is beyond tolerance and a paired test supports it: McNemar's exact test for pass/fail metrics, a seeded paired bootstrap for continuous ones, Holm-adjusted. Anything else is inconclusive." },
      { title: "A gate that cannot be fooled", body: "Crashed cases score 0 instead of counting as correct abstentions, a metric missing from the candidate counts as a regression, and a gate crash exits 2 instead of looking like a block." },
      { title: "Rate limits measured, not guessed", body: "The runner is benchmarked against a local server that enforces 3000 requests per minute, so throughput and retry behavior are measured numbers." },
    ],
    evaluation: [
      "Suite: 150 JSONL cases over a 12-document corpus: 130 answerable (16 of them need two documents) and 20 unanswerable, which expect an abstention.",
      "Three deterministic RAG versions: v1 overlap retrieval, top 1, faithful quoting; v2 IDF retrieval, top 3; v3 is v2 with a fluent style that merges sentences and drops every citation, a planted regression.",
      "Statistics: every mean carries a seeded 95% bootstrap interval, and comparisons pair the two runs case by case (2000 resamples, α = 0.05).",
      "Runner benchmark: a local fake server at 3000 requests per minute with 0.1 s service time, 150 cases per configuration.",
      "Provider runs are not quoted yet: the first Gemini run stopped early on the free-tier daily quota, and the LLM judge is still being calibrated against reviewed labels.",
    ],
    metrics: [
      { value: "1.0→0.0", label: "groundedness regression blocked by the gate (130 answerable cases)" },
      { value: "0.72→0.86", label: "Recall@3, v1 to v2, paired bootstrap p < 0.001" },
      { value: "5.4×", label: "runner throughput over sequential, 0 failed cases" },
      { value: "361", label: "tests across metrics, statistics, runner and gate" },
    ],
    results: {
      columns: ["Metric", "n", "v1 baseline", "v2 improved", "v3 fluent"],
      rows: [
        { label: "Recall@1", values: ["130", "0.7154 [0.64, 0.78]", "0.7154 [0.64, 0.78]", "0.7154 [0.64, 0.78]"] },
        { label: "Recall@3", values: ["130", "0.7154 [0.64, 0.78]", "0.8615 [0.80, 0.91]", "0.8615 [0.80, 0.91]"] },
        { label: "MRR@3", values: ["130", "0.7769 [0.70, 0.85]", "0.8231 [0.77, 0.88]", "0.8231 [0.77, 0.88]"] },
        { label: "Groundedness", values: ["130", "1.0", "1.0", "0.0"] },
        { label: "Gold citation recall", values: ["130", "0.7154 [0.64, 0.78]", "0.7154 [0.64, 0.78]", "0.0"] },
        { label: "Citation precision", values: ["130", "1.0", "1.0", "not measurable"] },
        { label: "Abstention correct", values: ["20", "0.0", "0.1", "0.1"] },
        { label: "Success rate", values: ["150", "0.4267", "0.4667", "0.0133"] },
        { label: "Gate vs v1", values: ["", "baseline", "pass, exit 0", "blocked on 4 metrics, exit 1"] },
      ],
      note: "From results/*/eval_results.json and the two comparison JSONs. Means with seeded 95% bootstrap intervals; n is the number of cases each mean averages. v2 vs v1: Recall@3 and MRR@3 improve in the paired bootstrap (Recall@3 p < 0.001); success rate and abstention rise but stay inconclusive (McNemar p = 0.07 and 0.5). v3 vs v1: groundedness, gold citation recall, citation precision (nothing is cited, so it is missing) and success rate regress, with Holm-adjusted p < 0.001 wherever a test applies.",
    },
    figures: [],
    findings: [
      "Fluency destroyed grounding: v3 kept v2's retrieval (Recall@3 0.8615) while groundedness fell from 1.0 to 0.0 on all 130 answerable cases and gold citation recall from 0.7154 to 0.0, with 109 more ungrounded failures. A single composite score would have hidden it.",
      "The retrieval gain is K, not weighting: at a fixed top 3, plain overlap reaches Recall@3 0.8731 and IDF 0.8615, so v2's lift over v1 comes from retrieving three documents instead of one.",
      "Not every improvement is significant: v2 raises the success rate from 0.4267 to 0.4667, but McNemar's exact test gives p = 0.07, so the gate reports it as inconclusive instead of claiming a win.",
      "Abstention is an open gap the evaluator exposed: with IDF weighting the unanswerable questions' top retrieval scores reach 0.4596, and 84 of 130 answerable questions score no higher, so no score threshold separates them.",
      "The audit changed the baseline itself: the old groundedness baseline came from the citation-placement bug, and faithful quoting now scores 1.0 as it should.",
      "Rate limits are absorbed, not suffered: a client asking for twice the server's limit hit 18 rate-limit responses and still finished all 150 cases with 0 failures.",
    ],
    decisions: [
      { title: "Replay economics", body: "Run once, store traces, evaluate forever: new metrics apply to old runs at zero API cost, and comparisons never re-invoke the system." },
      { title: "A deterministic SUT exists", body: "Every committed number is reproducible offline, and evaluator bugs surface as metric changes instead of LLM noise." },
      { title: "Tolerance plus significance", body: "A change must exceed an absolute tolerance (0.02 for scores) and pass a paired test before it is a regression, so one flipped case in 150 cannot fail a build." },
      { title: "One owner for retries", body: "ModelClient is the only retry layer and provider SDK retries are off, so the limiter sees every 429 instead of two layers multiplying attempts." },
      { title: "No evaluation framework", body: "Not building on DeepEval or Ragas keeps every metric auditable line by line: the evaluation layer is the product." },
      { title: "The gate tests itself", body: "CI regenerates the demo, requires v2 to pass, requires the gate to block v3 for groundedness and gold citation recall, and fails if any regenerated artifact differs from the commit." },
      { title: "Fork-safe PR comments", body: "Evaluation runs read-only on pull_request; a separate privileged workflow_run job posts the sticky comment only when the PR head equals the evaluated SHA." },
    ],
    validation: [
      "361 tests pass with ruff and pyright clean; re-running the demo reproduces every committed result with zero drift, the gate passes v2 and blocks v3.",
      "Audit fixes: crashed cases now score 0 and are gated, a missing metric counts as a regression, a gate crash exits 2, harness sleeps stay out of latency, and verbatim quotes score groundedness 1.0.",
      "Dataset integrity: every run manifest embeds the SHA-256 of eval_set.jsonl, and the repo pins LF line endings so the hash is the same on Windows.",
      "Agent trajectory metrics (tool-selection accuracy, call precision, argument schema validity, step efficiency) run on real repo-engineer traces, and a seeded agent regression is caught on 4 metrics.",
    ],
    limitations: [
      "Lexical groundedness is a proxy, not entailment: paraphrases that share vocabulary can fool it, and it may undercount legitimate rewordings.",
      "The gate's statistics cover case sampling, not model noise: measuring how much a nondeterministic model's answers move needs repeated runs.",
      "The demo system under test is a deterministic extractive responder, not an LLM; its token counts are heuristic, and its sub-millisecond latency is reported but not gated.",
      "Keyword retrieval cannot decide answerability, so abstention remains an open gap for the deterministic stack.",
      "No comparable provider numbers yet: the first run stopped early on a free-tier quota, and the judge's agreement with human labels stays provisional until the labels are reviewed.",
      "Retrieval ground truth is hand-declared.",
    ],
    interview: {
      built: "A trace-based evaluation engine for LLM/RAG and agent systems: a 150-case suite, three deterministic RAG versions, bootstrap intervals and paired tests in a CI gate, an async runner with rate limiting, and provider adapters.",
      why: "AI systems are easy to build and hard to trust: nondeterminism, scarce references and call cost make point-in-time testing worthless. AIRE makes evaluation replayable evidence.",
      how: "Runs persist as validated traces; a deterministic engine scores them, classifies failures, and compares runs case by case with a tolerance and a paired significance test before calling anything a regression.",
      decision: "Tolerance plus significance: a metric is regressed only when the change is beyond tolerance and a paired test supports it, otherwise inconclusive. That keeps a 150-case gate from flapping.",
      strongest: "The gate blocks a planted citation-stripping regression (groundedness 1.0 → 0.0 on all 130 answerable cases) and passes a real retrieval improvement (Recall@3 0.72 → 0.86, p < 0.001).",
      limitation: "Groundedness is a lexical proxy, the demo system under test is not an LLM, and provider numbers are not comparable yet.",
      next: "A full provider run once the quota allows, judge calibration on reviewed labels, and a semantic answerability check, since keyword scores cannot separate unanswerable questions.",
      questions: [
        { q: "Your groundedness baseline changed. What happened?", a: "A citation placed after the period was attached to the next sentence, so verbatim quotes scored 0.5. I found it with a test asserting that verbatim extraction must score 1.0; with the fix, the true baseline is 1.0." },
        { q: "Why paired tests and not just compare means?", a: "Both versions answer the same cases, so pairing removes per-case difficulty. McNemar's exact test fits pass/fail metrics and a paired bootstrap fits continuous ones, with Holm adjustment across metrics." },
        { q: "How do you stop rate-limit failures?", a: "Client-side token buckets for requests and tokens with AIMD, Retry-After honoured, full jitter, fail fast on a daily quota, and an exact-request cache. Against a server enforcing the limit, an over-eager client absorbed 18 rate-limit responses with 0 failed cases." },
        { q: "Why not use the SDK retries?", a: "Two retry layers multiply attempts and hide 429s from the limiter. One owner, ModelClient, sees every attempt." },
        { q: "Why replay traces instead of evaluating live?", a: "Cost and determinism: the system runs once and the engine scores stored traces, so new metrics apply to old runs at zero API cost and comparisons never re-invoke the system." },
        { q: "Why is the PR comment fork-safe?", a: "Untrusted fork code never runs with a write token. The privileged job only reads an uploaded artifact, sanitizes it and checks the SHA before posting." },
      ],
    },
  },
  {
    slug: "repo-engineer",
    num: "03",
    short: "Repo Engineer",
    title: "Autonomous Repository Engineer",
    tagline:
      "A verified tool-using coding agent: the model only proposes tool calls, a deterministic state machine decides, code the agent writes runs in a sandbox, and completion requires the runtime's own passing tests.",
    period: "Sep - Oct 2026",
    role: "Solo project - design, implementation, benchmark, threat model",
    repo: "https://github.com/vaibhav3000/repo-engineer",
    stack: ["Python", "Docker", "MCP", "pytest", "uv"],
    overview: [
      "repo-engineer is a coding agent whose model only proposes. Every tool call, from the native tool-calling planner or an MCP client, is validated, permission-checked and confined to the workspace before it runs; tests run in a sandbox; and a task is complete only when the runtime's own verification passes.",
      "The project treats agent reliability and safety as runtime engineering rather than prompting: malformed calls, shell access, workspace escapes and unverified success claims are each handled by a mechanism with a regression test, and an adversarial attack suite tries to break all of them.",
    ],
    problem: [
      "Coding agents tend to fail in three ways: they break on a malformed tool call, they hand the model a shell, or they accept the model's word that the bug is fixed. And once an agent can write tests and run them, it can run arbitrary code.",
      "The gap this project attacks: where does the security boundary live when the model is untrusted? Here it lives in the runtime and the sandbox, never in the model, and every claim about it is backed by an attack that tries to break it.",
    ],
    architecture: [
      { name: "state.py", what: "A nine-state machine (INIT, ANALYZE_REPO, PLAN, ACT, OBSERVE, REPLAN, VERIFY, COMPLETE, FAILED) with an explicit transition table; any other edge raises. Step, replan and planner-error budgets end in FAILED." },
      { name: "tools.py", what: "Ten built-in tools (list_tree, search, read_file, find_symbol, repo_map, apply_edit, apply_patch, write_file, git_diff, run_tests) behind schema validation, AUTO/ASK/DENY policies and the path jail. run_tests accepts only python -m pytest with allowlisted flags." },
      { name: "sandbox/docker.py + local.py", what: "Docker: a fresh container per test run with no network, read-only root and workspace, tmpfs-only writes, all capabilities dropped, a non-root user and resource limits. Local fallback: scrubbed environment, POSIX rlimits or a Windows job object, and a process-tree kill." },
      { name: "native_planner.py + models/", what: "Native tool calling for Gemini, OpenAI, Anthropic and local OpenAI-compatible servers through one retry policy with SDK retries off; a planner-owned finish tool sends the run to VERIFY." },
      { name: "mcp_server.py + mcp_tools.py", what: "MCP both ways: the registry is served over MCP with the same gates, and external MCP servers start inside the sandbox with their tools registered under the same validation, policy, jail and trace." },
      { name: "patch.py + repo_map.py", what: "Strict unified-diff patches written all or nothing across files, and an ast-based symbol index with a ranked, size-limited repo map for the planner." },
      { name: "trace.py + replay.py", what: "A streamed JSONL audit trace (states, model calls with latency, tokens and cost, tool calls, verification) and a replay command that re-executes recorded decisions without calling a model." },
    ],
    approach: [
      { title: "Planner proposes, runtime disposes", body: "Planner output is only a tool-call proposal. The state machine alone transitions states, enforces budgets and decides verification, so it is the auditable safety boundary." },
      { title: "Argv parsing, not string prefixes", body: "The old allowlist was a string prefix, so python -m pytestfoo or pytest's -p, -c and --rootdir flags could run code outside the workspace. Commands are now parsed with shlex against a flag allowlist, and the runtime always adds --rootdir, --confcutdir and -p no:cacheprovider." },
      { title: "Exit codes, not output text", body: "Verification used to look for exit=0 in output the tests control. It now uses the structured exit code, restores protected test files before VERIFY, and treats zero collected tests as a failure." },
      { title: "Mutants for test-writing tasks", body: "On add-a-test tasks, seeded mutants must fail and behavior-preserving edits must pass, so a vacuous test cannot complete the task." },
      { title: "No git subprocess", body: "git_diff used to run git, which honours config inside the workspace (fsmonitor, textconv). It is now an in-process diff against a snapshot taken at the start." },
      { title: "Secrets stay out", body: "Test subprocesses get an explicit environment allowlist, and secrets and host paths are redacted from traces and prompts." },
    ],
    evaluation: [
      "Scripted benchmark: 12 multi-file tasks (bug fixes, tests checked with mutants, renames, refactors, signature changes), each run in a fresh workspace copy with recipes that already contain the fix. Results must match the committed goldens byte for byte under both sandboxes.",
      "Jail suite: scripts/run_jail_attacks.py replays hostile tool calls against a real registry and sandbox. Each attack is rejected, contained, a documented residual or breached, and any breach fails the tests.",
      "Live mode reports pass@1 and pass@k with the unbiased estimator; no live run with the native planner has been recorded yet.",
    ],
    metrics: [
      { value: "0", label: "breaches in 49 attacks on the Docker sandbox (1 documented residual)" },
      { value: "12/12", label: "multi-file tasks, scripted, byte-identical under both sandboxes" },
      { value: "10", label: "built-in tools behind schema, policy and path jail" },
      { value: "378", label: "tests, plus jail suites that must reproduce exactly" },
    ],
    results: {
      columns: ["Task", "Steps", "Replans", "Failed calls", "Files changed"],
      rows: [
        { label: "Fix an off-by-one loop", values: ["5", "0", "0", "1"] },
        { label: "Repair a failing test", values: ["5", "1", "0", "1"] },
        { label: "Add missing tests (mutants)", values: ["5", "0", "0", "1"] },
        { label: "Constrained rename", values: ["7", "0", "0", "2"] },
        { label: "Bug behind another module", values: ["6", "1", "0", "1"] },
        { label: "Rename across a package (one patch)", values: ["5", "0", "0", "3"] },
        { label: "Add tests for a parser (mutants)", values: ["4", "0", "0", "1"] },
        { label: "Extract a shared helper", values: ["4", "0", "0", "3"] },
        { label: "Signature change and its callers", values: ["4", "0", "0", "2"] },
        { label: "Shared mutable default", values: ["5", "1", "0", "1"] },
        { label: "Add tests for a validator (mutants)", values: ["4", "0", "0", "1"] },
        { label: "Stale imports after a move", values: ["4", "0", "0", "2"] },
      ],
      note: "Scripted mode, from results/benchmark_results.json: 12/12 verified, 58 steps, 3 replans, 0 failed tool calls. The recipes already contain the fix, so this validates the runtime, gates, sandboxes and verification, not a model's problem solving. Jail suite (results/jail_attack_evidence*.json): Docker 49 attacks, 29 rejected, 19 contained, 1 residual (report forging), 0 breached; local 47 attacks, 29 rejected, 13 contained, 5 documented residuals, 0 breached.",
    },
    figures: [],
    findings: [
      "The boundary holds under attack on Docker: 49 hostile tool calls produced 29 rejections, 19 contained runs, 1 documented residual and 0 breaches.",
      "The remaining residual is report forging: code under test can write a passing JUnit report and exit 0 inside its own process, which no sandbox can prevent. Protected tests, mutants, neutral edits and human review are the defences.",
      "Without Docker the local backend still has 0 breaches over 47 attacks, but agent-written test code runs as the host user, so 5 residuals are documented rather than hidden.",
      "Every security fix started as a reproduced exploit: a regression test showed the allowlist bypass, the git_diff hijack, verification spoofing and secret leakage before each was closed.",
      "12/12 scripted tasks verify with 0 failed tool calls and byte-identical results under both sandboxes. That shows the runtime is deterministic; it says nothing yet about a model's skill.",
    ],
    decisions: [
      { title: "A state machine around the planner", body: "The planner is the only non-deterministic component; wrapping it makes the safety boundary auditable and identical for every planner." },
      { title: "Security in the runtime, not the model", body: "The model only proposes; validation, permission policy, the jail and the container decide. Prompting is never the safety boundary." },
      { title: "Docker CLI with a local fallback", body: "One container per test run is simple to reason about; the local backend keeps the tool usable without Docker, with its weaker threat model written down." },
      { title: "Native tool calling, JSON as fallback", body: "Schema-constrained arguments and call ids cut parse failures and make multi-step bookkeeping exact; one retry policy covers every provider." },
      { title: "Strict all-or-nothing patches", body: "A unified diff must match exactly or at one unique offset, never with fuzz, and multi-file writes roll back together." },
      { title: "stdlib ast for the repo map", body: "The target repos are Python, so ast gives symbols with zero dependencies, and parse failures are listed instead of fatal." },
    ],
    validation: [
      "378 tests pass with ruff and pyright clean, including a regression test for each audited exploit that reproduced it before the fix.",
      "Both jail suites rerun in the tests and must match the committed evidence exactly; any breach fails the build.",
      "The scripted benchmark must reproduce its golden results byte for byte, and every generated number in the README, report and demo site is checked against results/ by sync_docs.py --check.",
      "The state machine is exhaustive: any transition outside the table raises, so COMPLETE is reachable only through VERIFY.",
    ],
    limitations: [
      "Live pass@k with the native planner has not been measured; the scripted benchmark validates the runtime, not a model.",
      "No sandbox makes a verdict trustworthy against code written to fool it, such as forged reports or objects that compare equal to anything.",
      "Without Docker, agent-written test code runs as the host user with the host's files and network, and some processes can outlive the tree kill.",
      "The repo map is Python only, and tests that need third-party packages need their own sandbox image.",
      "The CI workflows are written but have not run on GitHub yet; the same gate runs locally.",
    ],
    interview: {
      built: "A coding agent whose model only proposes tool calls: a nine-state machine validates, permission-gates and path-jails every call, tests run in a Docker sandbox, and completion requires restored, protected tests to pass.",
      why: "Coding agents break on malformed calls, hand the model a shell, or trust its claim of success, and once they can write and run tests they also run arbitrary code. This runtime treats each of those as a design constraint.",
      how: "The planner proposes a native tool call; the runtime validates it against the tool's schema, applies the AUTO/ASK/DENY policy and the path jail, runs tests in the sandbox, and VERIFY re-runs the suite on restored files before COMPLETE.",
      decision: "Putting the security boundary in the runtime and the sandbox instead of the model, and backing it with an attack suite rather than an argument.",
      strongest: "0 breaches across 49 attacks on the Docker sandbox with 1 documented residual, and 12/12 multi-file tasks verified byte-identically under both sandboxes.",
      limitation: "Live agent capability is not measured yet: the 12/12 is scripted, so it proves the runtime, not problem solving.",
      next: "A live pass@k run with the native planner, and the first CI run on GitHub.",
      questions: [
        { q: "Where is the security boundary?", a: "In the runtime and the sandbox, never in the model. The LLM only proposes; validation, permission policy, the jail and the container decide." },
        { q: "The agent can write tests and then run them. Isn't that arbitrary code execution?", a: "Yes, which is why tests run in a no-network, read-only container with resource limits. On the local backend this is a documented residual, and the threat model is explicit per backend." },
        { q: "How do you stop reward hacking?", a: "The exit code, not output text; protected files restored before VERIFY; control files such as conftest and pytest.ini unwritable; and mutants for test-writing tasks, so a vacuous test fails." },
        { q: "Why native tool calling over JSON in the prompt?", a: "Schema-constrained arguments, call ids for multi-step bookkeeping and fewer parse failures. JSON parsing stays as a fallback." },
        { q: "What does 12/12 prove?", a: "That the runtime, gates, sandboxes and verification work end to end with known recipes. Agent capability needs the live pass@k run, which has not been done yet." },
      ],
    },
  },
];
