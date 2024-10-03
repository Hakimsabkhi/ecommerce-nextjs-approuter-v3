import NavAdmin from "@/components/NavAdmin";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  // Fetch the session server-side

  return (
    <>
      <NavAdmin  />
      {children}    
    </>
  );
};

export default RootLayout;
