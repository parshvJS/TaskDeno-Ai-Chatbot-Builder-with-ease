import PageIllustration from '@/components/page-illustration'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main >

      <PageIllustration />

      {children}

    </main>
  )
}
