export const SITE = {
  name: "Vaibhav Mahore",
  role: "AI/ML Engineer",
  email: "mvaibhav@iisc.ac.in",
  phone: "+91-9284782375",
  phoneHref: "tel:+919284782375",
  location: "Bangalore, India",
  links: {
    github: "https://github.com/vaibhav3000",
    linkedin: "https://www.linkedin.com/in/vaibhav-mahore/",
    leetcode: "https://leetcode.com/u/NINJA3000",
    resume: "resume.pdf",
  },
} as const;

export type ExperienceItem = {
  id: string;
  index: string;
  role: string;
  company: string;
  location: string;
  period: string;
  tags: string[];
  bullets: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "ericsson",
    index: "01",
    role: "AI/ML Research Intern",
    company: "Ericsson India Private Limited",
    location: "Bangalore",
    period: "May 2026 - Jul 2026",
    tags: ["WiMamba", "OOD Transfer", "Parameter-Efficient Fine-Tuning", "PyTorch"],
    bullets: [
      "Benchmarked WiMamba vs. Transformer on AWS A10G GPUs, showing O(T) linear scaling with 10.7× lower latency (30ms vs 327ms) and 42.6× less GPU memory (113MB vs 4.8GB) at 4×4 patch size.",
      "Evaluated geographic OOD transfer (Florida → San Diego) across 5 tasks, achieving a 0.9626 composite score (+16.6% over baseline) and 7.4 to 7.7 dB lower NMSE on channel estimation and interpolation.",
      "Explored a Soft Unfreezing Parameter-Efficient Fine-Tuning strategy using PyTorch linear probing, freezing 75% of parameters while retaining 98.5% of full fine-tuning performance.",
    ],
  },
  {
    id: "alignerr",
    index: "02",
    role: "Machine Learning Engineer",
    company: "Alignerr",
    location: "Remote",
    period: "May 2025 - Aug 2025",
    tags: ["LLM Training Data", "Reasoning Traces"],
    bullets: [
      "Authored structured reasoning traces and high-quality training data to improve LLM decision-making, tool selection, and step-by-step problem-solving across complex technical tasks.",
    ],
  },
  {
    id: "micro1",
    index: "03",
    role: "Machine Learning Engineer",
    company: "micro1",
    location: "Remote",
    period: "May 2025 - Aug 2025",
    tags: ["Data Annotation", "Model Validation", "TensorFlow", "Scikit-learn"],
    bullets: [
      "Contributed high-quality data annotation, evaluation, and model validation workflows for frontier AI systems.",
      "Performed data preprocessing and supported machine learning model development using TensorFlow and Scikit-learn.",
    ],
  },
];

export type Project = {
  id: string;
  num: string;
  name: string;
  domain: string;
  tagline: string;
  points: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
  repo: string;
  demo: string;
  report: string;
  visual: "mamba" | "aire" | "agent";
};

export const PROJECTS: Project[] = [
  {
    id: "s4-to-mamba",
    num: "01",
    name: "Efficient Sequence Modeling: From S4 to Mamba-3",
    domain: "sequence modeling · architectures",
    tagline:
      "S4D, Mamba-1/2/3 and a RoPE Transformer implemented in pure PyTorch from first principles, checked against float64 references, and measured over three to five seeds at matched parameter counts.",
    points: [
      "Implemented S4D, Mamba-1/2/3 (including a chunked parallel Mamba-3 scan) and a RoPE Transformer in pure PyTorch, verified against float64 references and gradcheck, which caught two real math bugs in the first version; 585 tests.",
      "Parity over 5 seeds at matched ~100K parameters: Mamba-3 reaches 89% and 99% on 2 of 5 seeds (mean 72.6 ± 20.5%), while every rotation-free model, including a Mamba-3 ablation, stays near chance (means ≤57.3%); 104 GPU runs in total.",
      "Decoding from 1K to 32K tokens on a 6 GB RTX 4050 with pinned SDPA kernels: the SSMs keep a 0.14 to 0.39 MiB state, against a 128 MiB fp32 KV cache at 32K.",
    ],
    metrics: [
      { value: "89% / 99%", label: "parity on 2 of 5 Mamba-3 seeds (mean 72.6 ± 20.5%)" },
      { value: "≤57.3%", label: "parity mean of every rotation-free model (chance 50%)" },
      { value: "0.39 MiB", label: "largest SSM decode state at 32K (KV cache: 128 MiB)" },
      { value: "585", label: "tests, float64 references and gradcheck" },
    ],
    stack: ["Python", "PyTorch", "NumPy", "SciPy", "Hugging Face Datasets", "Matplotlib", "pytest", "uv"],
    repo: "https://github.com/vaibhav3000/s4-to-mamba",
    demo: "https://vaibhav3000.github.io/s4-to-mamba/",
    report: "https://github.com/vaibhav3000/s4-to-mamba/blob/main/reports/Efficient_Sequence_Modeling_S4_to_Mamba3.pdf",
    visual: "mamba",
  },
  {
    id: "aire",
    num: "02",
    name: "AIRE: AI Reliability & Evaluation Engine",
    domain: "LLM evaluation · reliability",
    tagline:
      "A trace-based evaluation engine that turns LLM/RAG behavior into replayable evidence: deterministic metrics, a failure taxonomy, and a statistical regression gate that runs in CI.",
    points: [
      "Built a trace-based LLM/RAG evaluation engine with a statistical CI gate (paired bootstrap and McNemar tests, 95% CIs) over a 150-case suite: groundedness, citation precision and recall, Recall@K, MRR and abstention; 377 tests.",
      "Async runner with an AIMD rate limiter, jittered retries and an exact-request cache: 5.4× throughput over sequential with 0 failed cases against a rate-limited test server.",
      "The gate blocks a seeded citation-stripping regression (groundedness 1.0 → 0.0) and passes a retrieval change (Recall@3 0.72 → 0.86, p < 0.001); Gemini, OpenAI and Anthropic adapters, agent-trajectory metrics and OpenTelemetry traces.",
    ],
    metrics: [
      { value: "150", label: "evaluation cases, paired tests and 95% CIs" },
      { value: "1.0→0.0", label: "groundedness regression blocked in CI" },
      { value: "0.72→0.86", label: "Recall@3 gain passed, p < 0.001" },
      { value: "5.4×", label: "runner throughput, 0 failed cases" },
    ],
    stack: ["Python", "asyncio", "OpenTelemetry", "pytest", "GitHub Actions", "Docker"],
    repo: "https://github.com/vaibhav3000/aire",
    demo: "https://vaibhav3000.github.io/aire/",
    report: "https://github.com/vaibhav3000/aire/blob/main/reports/AIRE_AI_Reliability_Evaluation_Engine.pdf",
    visual: "aire",
  },
  {
    id: "repo-engineer",
    num: "03",
    name: "Autonomous Repository Engineer",
    domain: "autonomous agents · verification",
    tagline:
      "A verified tool-using coding agent: the model only proposes tool calls, a deterministic state machine decides, and completion requires green test evidence, never model claims.",
    points: [
      "A 9-state machine validates and permission-gates (AUTO/ASK/DENY) every tool call the model proposes, natively or over MCP, jails every path argument to the workspace, and accepts a task only when a re-run of the restored, protected tests exits 0.",
      "Docker sandbox for every test run (no network, read-only, dropped capabilities, resource limits): 0 breaches in a 49-attack adversarial suite; the 1 documented residual is code under test forging a passing test report.",
      "12/12 multi-file tasks pass in scripted mode under both sandboxes with byte-identical results, which validates the runtime rather than a model's problem solving; 378 tests.",
    ],
    metrics: [
      { value: "0", label: "breaches in 49 Docker attacks; 1 residual, a forged test report" },
      { value: "12/12", label: "multi-file tasks, scripted, both sandboxes" },
      { value: "10", label: "built-in tools behind schema, policy and jail" },
      { value: "378", label: "tests, plus jail suites that must reproduce" },
    ],
    stack: ["Python", "Docker", "MCP", "pytest", "uv"],
    repo: "https://github.com/vaibhav3000/repo-engineer",
    demo: "https://vaibhav3000.github.io/repo-engineer/",
    report: "https://github.com/vaibhav3000/repo-engineer/blob/main/reports/Autonomous_Repository_Engineer.pdf",
    visual: "agent",
  },
];

export const SKILLS: { slug: string; name: string; items: string[] }[] = [
  {
    slug: "languages",
    name: "Languages",
    items: ["Python", "C++", "SQL", "Bash"],
  },
  {
    slug: "ai-ml",
    name: "AI / ML",
    items: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "NumPy",
      "SciPy",
      "Pandas",
      "Hugging Face Datasets",
      "Matplotlib",
      "pytest",
    ],
  },
  {
    slug: "llm-systems",
    name: "LLM & AI Systems",
    items: [
      "LLM evaluation & observability (tracing, judges, regression testing)",
      "RAG",
      "tool-using agents",
      "sequence modeling (Transformers, State Space Models)",
    ],
  },
  {
    slug: "mlops-cloud",
    name: "MLOps & Cloud",
    items: ["Docker", "GitHub Actions (CI)", "Playwright (E2E)", "AWS (EC2, S3)", "Linux", "Git/GitHub"],
  },
  {
    slug: "core-concepts",
    name: "Core Concepts",
    items: [
      "Deep Learning",
      "Model Architecture",
      "Experiment Design & Reproducibility",
      "Software Engineering Practice (testing, sandboxing, CI-style verification)",
    ],
  },
];

export const COURSES = [
  "Data Structures and Algorithms",
  "Linear Algebra",
  "Probability",
  "Machine Learning",
  "Deep Learning",
  "NLP",
  "Optimization",
];

export const ORACLE = {
  genai: {
    name: "Generative AI Professional",
    url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=C8C59C8EE1F738F93AE1E79B0F626F32159AB49DFD29856207D8FD1DC48277DA",
  },
  dataScience: {
    name: "Data Science Professional",
    url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=E89DD81DBC3358706048B3C0BE990728217104E5BF4E7543F6D15C4D60EFF669",
  },
};

export const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

/** The four headline numbers, all taken verbatim from CV experience bullets. */
export const METRICS = [
  {
    value: "10.7×",
    label: "lower latency",
    context:
      "WiMamba vs Transformer at 4×4 patch size on AWS A10G GPUs: 30 ms vs 327 ms, with O(T) linear scaling in sequence length.",
  },
  {
    value: "42.6×",
    label: "less GPU memory",
    context:
      "113 MB vs 4.8 GB of GPU memory for the same workload at 4×4 patch size.",
  },
  {
    value: "0.9626",
    label: "composite score",
    context:
      "Geographic OOD transfer from Florida to San Diego across 5 tasks, +16.6% over the baseline.",
  },
  {
    value: "98.5%",
    label: "performance retained",
    context:
      "Soft Unfreezing parameter-efficient fine-tuning with 75% of parameters frozen, retaining 98.5% of full fine-tuning performance.",
  },
] as const;

/** Research notes: every line traceable to CV experience or project bullets. */
export type ResearchNote = {
  id: string;
  title: string;
  line: string;
  meta: string;
  href?: string;
};

export const RESEARCH: ResearchNote[] = [
  {
    id: "s4-mamba3",
    title: "S4 → Mamba-3, implemented from first principles",
    line: "S4D, Mamba-1/2/3 and a RoPE Transformer in pure PyTorch, checked against float64 references: over 5 seeds, Mamba-3's complex rotation learns parity on 2 seeds (89% and 99%) while every rotation-free model stays near chance (means ≤57.3%).",
    meta: "Independent · s4-to-mamba",
    href: "https://github.com/vaibhav3000/s4-to-mamba",
  },
  {
    id: "evaluation-evidence",
    title: "Evaluation as replayable evidence",
    line: "A trace-based engine for LLM/RAG reliability: deterministic metrics, a failure taxonomy, and regression detection with paired significance tests and per-case attribution, enforced as a gate in CI.",
    meta: "Independent · AIRE",
    href: "https://github.com/vaibhav3000/aire",
  },
];
