import "./globals.css";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";

export const metadata = {
    title: "テスト対策アプリ",
    description: "現在作成中です"
};

export default function RootLayout({ children }) {
    const gaId = "G-9EM0X7ZXLQ";

    return (
        <html lang="ja">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />

                <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" async />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}');
                `}
                </Script>
            </head>
            <body>
                {children}
                <Toaster richColors />
            </body>
        </html>
    );
}
