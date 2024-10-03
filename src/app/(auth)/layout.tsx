import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Ensure the path is correct
import SessionProviderWrapper from "@/components/ProviderComp/SessionProviderWrapper";
import { Poppins } from "next/font/google";
import "../globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StoreProviders from "@/components/ProviderComp/StoreProvider";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // Get the session from the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProviderWrapper session={session}>
          <StoreProviders>
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
          </StoreProviders>
        </SessionProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
