import React from 'react';


// Define interfaces for company data and address
interface Address {
  _id: string;
  governorate: string;
  city: string;
  address: string;
  zipcode: number;
}

interface CompanyData {
  name: string;
  addresse: Address;
  email: string;
  phone: number;
}

// Fetcher function for useSWR
async function fetchCompanyData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/company/getCompany`);
  if (!res.ok) {
      throw new Error('Failed to fetch data');
  }
  return res.json();
}

const Headertop: React.FC = async () => {
  // Use useSWR to fetch company data
  const companyData = await fetchCompanyData();

  

  if (!companyData) {
    return <div>Loading...</div>;
  }

  const formatPhoneNumber = (phone: string | number): string => {
    // Convert number to string if needed
    const phoneStr = phone.toString().trim();

    // Format phone number as XX XXX XXX
    if (phoneStr.length === 8) {
      return `${phoneStr.slice(0, 2)} ${phoneStr.slice(2, 5)} ${phoneStr.slice(5)}`;
    }

    return phoneStr;
  };

  return (
    <header>
      <nav className='w-full h-[57px] justify-center flex bg-[#6A6A6A] max-lg:hidden'>
        <div className="flex text-white w-[90%] justify-between items-center max-2xl:text-base text-2xl">                                            
          <p className='flex gap-2 items-center uppercase'>
            Address: {companyData.addresse?.address}, {companyData.addresse?.zipcode} {companyData.addresse?.city}, {companyData.addresse?.governorate}, Tunisie
          </p>                    
          <div className="flex gap-16 items-center">                                                    
            <p className='flex gap-2 items-center'>TELE: +216 {formatPhoneNumber(companyData.phone)}</p>                                                                        
            <p className='flex gap-2 items-center'>EMAIL: {companyData.email}</p>                                                            
          </div> 
        </div>
      </nav>
    </header>
  );
};

export default Headertop;
