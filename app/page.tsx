import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Experience } from '@/components/experience'
import { GithubActivity } from '@/components/github-activity'
import { Hero } from '@/components/hero'
import { PageLoader } from '@/components/page-loader'
import { Projects } from '@/components/projects'
import { ScrollProgress } from '@/components/scroll-progress'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { Skills } from '@/components/skills'
/**
 * The page is static apart from the GitHub panel, which refreshes hourly.
 * Must be a literal: Next parses segment config statically and rejects an
 * imported constant.
 */
export const revalidate = 3600

export default function Page() {
  return (
    <>
      <PageLoader />
      <ScrollProgress />
      <SiteNav />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <GithubActivity />
        <Experience />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
