"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast} from 'react-toastify';
import DeletePopup from "@/components/Popup/DeletePopup";
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Pagination';

type Brand = {
    _id: string;
    name: string;
    place: string;
    imageUrl: string;
    logoUrl: string;
    user:user;
    createdAt: Date;
    updatedAt: Date;

};
interface user{
 _id:string;
 username:string;
}

const AddedBrands: React.FC = () => {
    const [addedBrand, setAddedBrand] = useState<Brand[]>([]);
    const [filteredBrand, setFilteredBrand] = useState<Brand[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const BrandesPerPage = 5; // Number of categories to display per page
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState({ id: '', name: '' });
    const [loadingBrandId, setLoadingBrandId] = useState<string | null>(null);
    const handleDeleteClick = (brand:Brand) => {

        setLoadingBrandId(brand._id); 
        
        setSelectedBrand({ id: brand._id, name: brand.name });
        setIsPopupOpen(true);
      };
    
      const handleClosePopup = () => {
        setIsPopupOpen(false);
        setLoadingBrandId(null); 
      };
    const Deletebrand = async (brandId: string) => {
        
        try {
            const response = await fetch(`/api/brand/deleteBrand/${brandId}`, {
                method: 'DELETE',
                
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            handleClosePopup();
            toast.success("Brand delete successfully!" );
           
           
            await getBrand();

        } catch (err: any) {
            
            toast.error(`[Brand_DELETE] ${err.message}` );
        }finally{
            setLoadingBrandId(null); 
          }
    };
    const getBrand = async () => {
        try {
            const response = await fetch(`/api/brand/getAllBrand`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAddedBrand(data);
            setFilteredBrand(data);
        } catch (err: any) {
            setError(`[Brand_GET] ${err.message}`);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        getBrand();
    }, []);

    useEffect(() => {
        const filtered = addedBrand.filter(brand =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())             
        );
        setFilteredBrand(filtered);
        setCurrentPage(1); // Reset to the first page when search term changes
    }, [searchTerm, addedBrand]);

    const indexOfLastBrand = currentPage * BrandesPerPage;
    const indexOfFirstBrand = indexOfLastBrand - BrandesPerPage;
    const currentBrands = filteredBrand.slice(indexOfFirstBrand, indexOfLastBrand);
    const totalPages = Math.ceil(filteredBrand.length / BrandesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

   
    if (loading) {
        return (/* loading start */
       <LoadingSpinner/>
      /*  loading end  */)
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='mx-auto w-[90%] py-8 flex flex-col gap-8'>
            <div className="flex items-center justify-between">
                <p className='text-3xl font-bold'>ALL Brand</p>
           
                <Link href="/admin/brandlist/addbrand" className="w-[15%]">
                    <button className='bg-gray-800 font-bold hover:bg-gray-600 text-white rounded-lg w-full h-10'>
                        Add a new Brand
                    </button>
                </Link>
            </div>
            <input
                type="text"
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='mt-4 p-2 border border-gray-300 rounded'
            />
            <table className="table-auto w-full mt-4">
                <thead>
                    <tr className='bg-gray-800'>
                        <th className="px-4 py-2">Icon</th>
                        <th className=" px-4 py-2">ImageURL</th>
                        <th className=" px-4 py-2">Name</th>
                        <th className="px-4 py-2">                        
                            Place                                                                                                                   
                        </th>
                        <th className="px-4 py-2">                        
                        Created By                                                                                                               
                        </th>
                        <th className="px-4 py-2 text-center">                        
                            Action                                                                                                                  
                        </th>
                        
                    </tr>
                </thead>
                <tbody>
                    {currentBrands.map((item, index) => (
                        <tr key={index} className='bg-white text-balck '>
                            <td className="border px-4 py-2 "><Image src={item.logoUrl} width={30} height={30} alt="icon"/></td>
                            <td className="border px-4 py-2"><Link href={item.imageUrl}>{item.imageUrl.split('/')[item.imageUrl.split('/').length - 1]}</Link></td>
                            <td className="border px-4 py-2">{item.name}</td>
                            <td className="border-b px-4 py-2   ">{item.place}</td>
                            <td className="border-b px-4 py-2  ">{item?.user?.username}</td>
                            <td className="border-b flex items-center justify-center gap-2 ">                                
                                    <Link href={`/admin/brandlist/${item._id}`}>
                                        <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md">
                                            Modify
                                        </button>
                                    </Link>
                                    <button onClick={()=>handleDeleteClick(item)}  className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md">
                                    {loadingBrandId ===item._id ? "Processing..." : "DELETE"}
                                    </button>
                                    {isPopupOpen &&     < DeletePopup  handleClosePopup={handleClosePopup} Delete={Deletebrand}  id={selectedBrand.id} // Pass selected user's id
                    name={selectedBrand.name} />}                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-center mt-4'>
                
          <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}/>
            </div>
          
        </div>
    );
};

export default AddedBrands;
