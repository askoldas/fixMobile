import "./globals.scss";
import ReduxProvider from "../store/ReduxProvider";
import Header from "@/global/components/Header"; // Import Header Component

export const metadata = {
  title: "FixMobile",
  description: "Your trusted mobile repair and parts shop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          <Header /> 
          <main>{children}</main>
        </ReduxProvider>
      </body>
    </html>
  );
}
