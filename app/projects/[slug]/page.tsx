import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import CaseStudyPage from "@/components/CaseStudyPage";
import RevealObserver from "@/components/RevealObserver";
import { CASE_STUDIES } from "@/lib/caseStudies";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) return {};
  const title = `${study.title} - Case Study`;
  return {
    title,
    description: study.tagline,
    alternates: {
      canonical: new URL(`${basePath}/projects/${study.slug}/`, siteUrl).toString(),
    },
    openGraph: { title, description: study.tagline, type: "article" },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  return (
    <>
      <div className="bg-scene" aria-hidden="true" />
      <Nav />
      <CaseStudyPage study={study} />
      <RevealObserver />
    </>
  );
}
