import "@/app/ui/global.css";
import Header from "./ui/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="text-darkBg dark:text-lightBg">
        <Header />
        <div className="flex min-h-screen bg-lightBg dark:bg-darkBg">
          {/* 좌측 광고 */}
          <aside className="hidden lg:flex w-[200px] flex-shrink-0 justify-center items-start py-8">
            {/* 광고 자리 */}
          </aside>
          {/* 메인 콘텐츠 */}
          <main className="flex-1 flex flex-col items-center px-4 py-8 max-w-6xl mx-auto w-full">
            {children}
          </main>
          {/* 우측 광고 */}
          <aside className="hidden lg:flex w-[200px] flex-shrink-0 justify-center items-start py-8">
            {/* 광고 자리 */}
          </aside>
        </div>
      </body>
    </html>
  );
}
