import "./globals.css";
import type { Metadata } from "next";
import { QuestionnaireProvider } from "@/lib/state/questionnaire";

export const metadata: Metadata = {
  title: "Deep Ground Training",
  description: "Build your foundation. Improve your game.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[#0b0f0d] text-white antialiased">
        <QuestionnaireProvider>{children}</QuestionnaireProvider>
      </body>
    </html>
  );
}