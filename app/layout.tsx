import "@/app/ui/global.css";
import Header from "./ui/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>빅리지지 | 빅뱅리턴즈.GG</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="text-darkBg dark:text-lightBg">
        <Header />
        <div className="flex flex-col md:flex-row min-h-screen bg-lightBg dark:bg-darkBg">
          {/* 좌측 광고 */}
          <aside className="hidden lg:flex w-full md:w-[200px] flex-shrink-0 justify-center items-start py-4 md:py-8">
            {/* 광고 자리 */}
          </aside>
          {/* 메인 콘텐츠 */}
          <main className="flex-1 flex flex-col items-center md:items-start px-2 md:px-4 py-4 md:py-8 max-w-6xl mx-auto w-full">
            {/* 상단 광고/여백 */}
            <div className="w-full h-16 md:h-20 flex items-center justify-center mb-4">
              {/* 상단 광고 자리 */}
            </div>
            {children}
          </main>
          {/* 우측 광고 */}
          <aside className="hidden lg:flex w-full md:w-[200px] flex-shrink-0 justify-center items-start py-4 md:py-8">
            {/* 광고 자리 */}
          </aside>
        </div>
      </body>
    </html>
  );
}
