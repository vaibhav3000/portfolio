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
      "Benchmarked WiMamba vs. Transformer on AWS A10G GPUs, proving O(T) linear scaling with 10.7× lower latency (30ms vs 327ms) and 42.6× less GPU memory (113MB vs 4.8GB) at 4×4 patch size.",
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
      "Reproduced the Mamba-3 paper's capability claim: complex-valued transitions solve parity tracking (98.3%) where real-transition SSMs and Transformers stay at chance (≤56%); on selective copying, LTI S4D collapses (6%) vs 67% for selective SSMs.",
    ],
    metrics: [
      { value: "98.3%", label: "parity tracking solved" },
      { value: "≤56%", label: "real-transition / transformer baseline" },
      { value: "1K–32K", label: "sequence lengths benchmarked" },
      { value: "6 GB", label: "RTX 4050, full test suite" },
    ],
    stack: ["Python", "PyTorch", "NumPy", "SciPy", "Hugging Face", "Matplotlib", "pytest"],
    repo: "https://github.com/vaibhav3000/s4-to-mamba",
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
      "Built replayable run storage, deterministic metrics (groundedness, citation coverage, retrieval recall/MRR), a failure taxonomy, and a direction-aware regression engine with per-case attribution.",
      "Evaluated three RAG versions over a 26-case suite, flagging an intentional fluency-for-grounding regression (groundedness 0.57 → 0.00).",
      "A live Gemini responder then fixed abstention (0.0 → 1.0) and grounding (1.0) at 15 s/case.",
    ],
    metrics: [
      { value: "26", label: "evaluation cases" },
      { value: "3", label: "RAG versions compared" },
      { value: "0.57→0.00", label: "regression caught" },
      { value: "15 s", label: "per case, live responder" },
    ],
    stack: ["Python", "pytest", "HTML/CSS"],
    repo: "https://github.com/vaibhav3000/aire",
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
      "Benchmark: 4/4 SWE tasks deterministically with zero failed tool calls; a live Gemini planner passes 2/2 on the same runtime.",
    ],
    metrics: [
      { value: "4/4", label: "SWE tasks, deterministic" },
      { value: "0", label: "failed tool calls" },
      { value: "7", label: "validated tools" },
      { value: "2/2", label: "live Gemini planner" },
    ],
    stack: ["Python", "pytest", "Git"],
    repo: "https://github.com/vaibhav3000/repo-engineer",
    visual: "agent",
  },
];

export const SKILLS: { slug: string; name: string; items: string[] }[] = [
  {
    slug: "languages",
    name: "Languages",
    items: ["Python", "C++", "Basic SQL"],
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
    items: ["Docker", "AWS (EC2, S3)", "Linux", "Git/GitHub"],
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
  { n: "01", id: "about", label: "about" },
  { n: "02", id: "experience", label: "experience" },
  { n: "03", id: "projects", label: "projects" },
  { n: "04", id: "skills", label: "skills" },
  { n: "05", id: "education", label: "education" },
  { n: "06", id: "contact", label: "contact" },
] as const;
