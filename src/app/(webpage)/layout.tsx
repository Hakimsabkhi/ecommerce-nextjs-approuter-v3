import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Ensure the path is correct
import { Poppins } from "next/font/google";
import "../globals.css";
import UserMenu from "@/components/userComp/UserMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StoreProviders from "@/components/ProviderComp/StoreProvider";
import Footer from "@/components/menu/Footer";
import HeaderFirstSection from "@/components/menu/HeaderFirstSection";
import Headertop from "@/components/menu/Headertop";
import HeaderBottom from "@/components/menu/Headerbottom";

// Load the Google font
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

// Define metadata for the page
export const metadata = {
  title: "Your Website Title",
  description: "Your website description",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // Get the session from the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={poppins.className}>
        <StoreProviders>
          <Headertop />
          <div className="w-full h-[109px] bg-[#15335E] flex justify-center items-center gap-4">
            <HeaderFirstSection />
            <UserMenu session={session} />
          </div>
          <HeaderBottom />
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {children}
          <Footer />
        </StoreProviders>
      </body>
    </html>
  );
};

export default RootLayout;
