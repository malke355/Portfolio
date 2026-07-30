import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Education } from '@/components/education'
import { Hero } from '@/components/hero'
import { PageLoader } from '@/components/page-loader'
import { Projects } from '@/components/projects'
import { ScrollProgress } from '@/components/scroll-progress'
import { SiteFooter } from '@/components/site-footer'
import { SiteNav } from '@/components/site-nav'
import { Skills } from '@/components/skills'

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
        <Education />
        <Contact />
      </main>
      <SiteFooter />
    </>
  )
}
