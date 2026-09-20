import Section from "@/components/Section";
import { SITE } from "@/lib/data";

const INTERESTS = [
  "efficient sequence modeling (SSMs)",
  "LLM evaluation & observability",
  "tool-using agents & sandboxing",
  "reproducible experimentation",
];

export default function About() {
  return (
    <Section
      id="about"
      index="01"
      cmd="cat profile.md"
      title={
        <>
          Engineering AI systems
          <br />
          that <span className="text-grad">earn trust.</span>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-7">
          <p className="text-lg leading-relaxed text-fog-mid">
            I&apos;m {SITE.name.split(" ")[0]}, an AI/ML engineer and B.Tech
            student in Mathematics and Computing at the Indian Institute of
            Science, Bangalore. I work across the full arc of an AI system:
            implementing model architectures from first principles, building the
            evaluation infrastructure that proves they behave, and shipping
            agents whose completion criteria are green tests rather than model
            claims.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-fog-mid">
            Recent work spans benchmarking state-space models against
            Transformers at Ericsson, reproducing Mamba-3&apos;s capability
            claims in pure PyTorch, and building a reliability engine for
            LLM/RAG systems. The common thread:{" "}
            <span className="text-fog-hi">
              measure first, then believe.
            </span>
          </p>
        </div>

        <div data-reveal style={{ "--rd": "120ms" } as React.CSSProperties} className="lg:col-span-5">
          <div className="term">
            <div className="term-bar">
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-title">interests · zsh</span>
            </div>
            <div className="p-5 font-mono text-xs leading-loose sm:text-[13px]">
              <p className="text-fog-low">
                <span className="text-acc-green">$</span> interests --list
              </p>
              {INTERESTS.map((it, i) => (
                <p key={it} className="text-fog-mid">
                  <span className="text-acc-cyan">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>{" "}
                  {it}
                </p>
              ))}
              <p className="text-fog-low">
                <span className="text-acc-green">$</span>
                <span className="blink ml-1 inline-block h-3 w-[6px] translate-y-[2px] bg-acc-green/80" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
