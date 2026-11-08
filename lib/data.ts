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
      "Evaluated geographic OOD transfer (Florida → San Diego) across 5 tasks, achieving a 0.9626 composite score (+16.6% over baseline) and 7.4–7.7 dB lower NMSE on channel estimation and interpolation.",
      "Explored a Soft Unfreezing Parameter-Efficient Fine-Tuning strategy using PyTorch linear probing, freezing 75% of parameters while retaining 98.5% of full fine-tuning performance.",
    ],
  },
  {
    id: "alignerr",
    index: "02",
    role: "Machine Learning Engineer (AI Data Trainer)",
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
      "Minimal S4D, Mamba, Mamba-2 and Mamba-3 implemented in pure PyTorch from first principles, with the benchmarks to show exactly where selective state spaces win.",
    points: [
      "Implemented minimal S4D, Mamba, Mamba-2 and Mamba-3 from first principles, including a chunked State-Space-Duality path test-verified against a sequential scan.",
      "Benchmarked latency, memory and throughput at 1K–32K sequence lengths on a 6 GB RTX 4050.",
      "Reproduced the Mamba-3 paper's capability claim: complex-valued transitions solve parity tracking (98.3%) where real-transition SSMs and Transformers stay at chance (≤56.3%); on selective copying, LTI S4D collapses (6%) vs 67% for Mamba-1/2.",
    ],
    metrics: [
      { value: "98.3%", label: "parity tracking solved" },
      { value: "≤56.3%", label: "real-transition / transformer baseline" },
      { value: "1K–32K", label: "sequence lengths benchmarked" },
      { value: "6 GB", label: "single RTX 4050 laptop GPU for every run" },
    ],
    stack: ["Python", "PyTorch", "NumPy", "SciPy", "Hugging Face", "Matplotlib", "pytest"],
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
      "A trace-based evaluation engine that turns LLM/RAG behavior into replayable evidence: deterministic metrics, a failure taxonomy, and direction-aware regression detection.",
    points: [
      "Built replayable run storage, deterministic metrics (groundedness, citation coverage, retrieval recall/MRR), a failure taxonomy, and a direction-aware regression engine with per-case attribution, plus an aire-gate CLI that fails CI on a regression.",
      "Evaluated three RAG versions over a 26-case suite; the CI gate blocks an intentional fluency-for-grounding regression (groundedness 0.57 → 0.00) on every push.",
      "Swapping in Gemini 2.5 Flash as the generator raised abstention 0.0 → 1.0 and groundedness 0.57 → 1.0, at a cost of 15 s/case and 7× tokens.",
    ],
    metrics: [
      { value: "26", label: "evaluation cases" },
      { value: "3", label: "RAG versions compared" },
      { value: "0.57→0.00", label: "regression blocked in CI" },
      { value: "15 s", label: "per case, live Gemini generator" },
    ],
    stack: ["Python", "pytest", "GitHub Actions", "Gemini API", "HTML/CSS"],
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
      "A verified tool-using coding agent: the planner only proposes actions; a deterministic state machine decides, and completion requires green test evidence, never model claims.",
    points: [
      "A deterministic state machine (PLAN → ACT → OBSERVE → VERIFY) wraps the planner, which only proposes actions.",
      "Seven validated tools with schema checks, a workspace path jail, AUTO/ASK/DENY permission policies and command allowlists.",
      "Benchmark: 4/4 repo tasks (bug fix, test writing, refactor) deterministically with zero failed tool calls; a live Gemini planner passes 2/2 on the same runtime.",
    ],
    metrics: [
      { value: "4/4", label: "repo tasks, deterministic" },
      { value: "0", label: "failed tool calls" },
      { value: "8/8", label: "adversarial tool calls rejected" },
      { value: "2/2", label: "live Gemini planner" },
    ],
    stack: ["Python", "pytest", "Git"],
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
    line: "Minimal S4D, Mamba, Mamba-2 and Mamba-3 in pure PyTorch with a test-verified chunked SSD path: complex-valued transitions solve parity tracking at 98.3% where real-transition SSMs and a Transformer stay at chance (≤56.3%).",
    meta: "Independent · s4-to-mamba",
    href: "https://github.com/vaibhav3000/s4-to-mamba",
  },
  {
    id: "evaluation-evidence",
    title: "Evaluation as replayable evidence",
    line: "A trace-based engine for LLM/RAG reliability: deterministic metrics, a failure taxonomy, and direction-aware regression detection with per-case attribution, enforced as a gate in CI.",
    meta: "Independent · AIRE",
    href: "https://github.com/vaibhav3000/aire",
  },
];
