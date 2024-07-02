import PageIllustration from '@/components/page-illustration'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="w-full h-full">

      {/* <PageIllustration /> */}

      {children}

    </main>
  )
}
