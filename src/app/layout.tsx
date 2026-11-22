import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "@fontsource/open-sauce-one/400.css";
import "@fontsource/open-sauce-one/700.css";
import "@fontsource/open-sauce-one/800.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import EdgeColumns from "@/components/EdgeColumns";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// Versão gratuita de uso pessoal (TCC). Para uso comercial, licenciar (MyFonts/Fontspring).
const swungNote = localFont({
  src: "./fonts/SwungNote.otf",
  variable: "--font-swung-note",
});

export const metadata: Metadata = {
  title: "Bambolina | Teatro além do palco",
  description:
    "Experiência teatral imersiva e interativa que revela aos jovens as possibilidades dentro e fora do palco. Leve a Bambolina para a sua escola.",
  openGraph: {
    title: "Bambolina | Teatro além do palco",
    description: "O teatro é só o começo. Leve a Bambolina para a sua escola.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#1d1d1b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${swungNote.variable} antialiased`}>
      <body className="min-h-dvh bg-palco text-creme">
        <a
          href="#conteudo"
          className="fixed left-4 top-4 z-[80] -translate-y-20 rounded-full bg-limao px-5 py-2 font-display text-sm font-bold text-palco transition focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme"
        >
          Pular para o conteúdo
        </a>
        <EdgeColumns />
        <Nav />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
