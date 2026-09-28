import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Metrics from "@/components/Metrics";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Research from "@/components/Research";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import RevealObserver from "@/components/RevealObserver";
import { SITE } from "@/lib/data";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  email: `mailto:${SITE.email}`,
  telephone: SITE.phone,
  sameAs: [SITE.links.github, SITE.links.linkedin, SITE.links.leetcode],
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Indian Institute of Science (IISc), Bangalore",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressCountry: "IN",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-scene" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Metrics />
        <Experience />
        <Projects />
        <Research />
        <Skills />
        <Education />
        <Contact />
      </main>
      <RevealObserver />
    </>
  );
}
