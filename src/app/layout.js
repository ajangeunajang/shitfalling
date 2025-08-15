import './globals.css';
import './multilingual.css';

export const metadata = {
  title: '유명해지는 법',
  description: '(1)똥을 싸다 (2)유명해진다 (1)유명해진다 (2)똥을 싸다',
  openGraph: {
    title: '유명해지는 법',
    description: '(1)똥을 싸다 (2)유명해진다 (1)유명해진다 (2)똥을 싸다',
    siteName: '유명해지는 법',
    images: [
      {
        url: '/img/og_shitfalling.png',
        width: 1200,
        height: 630,
        alt: '유명해지는 법 OG 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '유명해지는 법',
    description: '(1)똥을 싸다 (2)유명해진다 (1)유명해진다 (2)똥을 싸다',
    images: ['/img/og_shitfalling.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 폰트 프리로드 */}
        <link
          rel="preload"
          href="/font/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/font/LazybonesD.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`antialiased bg-[url('/img/bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed min-h-screen scrollbar-hide`}
      >
        {children}
      </body>
    </html>
  );
}
