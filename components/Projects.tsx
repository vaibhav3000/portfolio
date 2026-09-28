import Section from "@/components/Section";
import ProjectScene from "@/components/ProjectScene";
import { PROJECTS } from "@/lib/data";

export default function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      label="Selected work"
      title={
        <>
          Selected systems I built,
          <br className="hidden md:block" /> tested, and verified.
        </>
      }
      lede="Three deep dives. Every claim traces to a benchmark, a test suite, or a public repository."
    >
      <div>
        {PROJECTS.map((p, i) => (
          <ProjectScene key={p.id} project={p} alt={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
