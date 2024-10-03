"use client"
import Image from 'next/image';
import React, { Key, useEffect, useRef, useState } from 'react'
import LoadingSpinner from './LoadingSpinner';
import { useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



// Define interfaces
interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface OrderItem {
  _id: Key | null | undefined;
  refproduct:string;
  product: string;
  name: string;
  quantity: number;
  image: string;
  discount: number;
  price: number;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  orderItems: OrderItem[];
  paymentMethod: string;
  deliveryCost:number;
  total: number;
  orderStatus: string;
  createdAt:string
}
interface User{
  username:string
  phone:number
}


const Invoice=()=>{
  const params = useParams() as { id: string }; // Explicitly type the params object
  const [order, setOrder] = useState<Order | null>(null); 
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
      // Fetch category data by ID
      const fetchOrderData = async () => {
        try {
          const response = await fetch(`/api/order/getorderbyref/${params.id}`);
    
          if (!response.ok) {
            throw new Error('Failed to fetch order data');
          }
    
          const data = await response.json();
          setOrder(data);
          setLoading(false);
    
        } catch (error) {
          console.error("Error fetching order data:", error);
        }
      };
      
      fetchOrderData();
     
    }, [params.id]);

    const handlePrint = () => {
      const content = document.getElementById('invoice-content');
  if (content) {
    
    html2canvas(content ).then((canvas) => {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      const pdfHeight = 297; // A4 height in mm
      const totalPages = Math.ceil(imgHeight / pdfHeight);

      // Add pages and content
      for (let page = 0; page < totalPages; page++) {
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
        if (page < totalPages - 1) {
          pdf.addPage();
        }
      }

      // Save the PDF and open it in a new window
      const pdfOutput = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfOutput);
      window.open(pdfUrl);
    }).catch((error) => {
      console.error('Error generating PDF:', error);
    });
  } else {
    console.error('Invoice content is not found');
  }
  };

   const generatePDF = () => {
  const content = document.getElementById('invoice-content');
  if (content) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Use html2canvas to render the content
    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      // Calculate image size in mm
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      // Calculate the total number of pages needed
      const pdfHeight = 297; // A4 height in mm
      const totalPages = Math.ceil(imgHeight / pdfHeight);

      // Add pages and content
      for (let page = 0; page < totalPages; page++) {
        const yOffset = -page * pdfHeight;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
        if (page < totalPages - 1) {
          pdf.addPage();
        }
      }

      // Save the PDF
      pdf.save('invoice.pdf');
    });
  } else {
    console.error('Invoice content is not found');
  }
  };
    
if(!order){
    <div>no data</div>
}
if (loading) {
  return <LoadingSpinner />;
}
  return (
<div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
  <div className="sm:w-11/12 lg:w-3/4 mx-auto">

    <div   id="invoice-content" className="flex flex-col p-4 sm:p-10 bg-white  rounded-xl dark:bg-neutral-800">

      <div className="flex justify-between">
        <div>
        <Image src={`https://res.cloudinary.com/dx499gc6x/image/upload/v1726668655/luxehome_o59kp7.webp`} alt='logo' width={200} height={200} className='bg-primary'/>
          <h1 className="mt-2 text-lg md:text-xl font-semibold text-primary dark:text-white">LuxeHome Inc.</h1>
        </div>
  

        <div className="text-end">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-neutral-200">Invoice #</h2>
          <span className="mt-1 block text-gray-500 dark:text-neutral-500">{order?.ref.replace('ORDER-', '')}</span>

          <p className="mt-4 not-italic text-gray-800 dark:text-neutral-200">
            45 Roker Terrace<br/>
            Latheronwheel<br/>
            KW5 8NW, London<br/>
            United Kingdom<br/>
          </p>
        </div>
  
      </div>
   


      <div className="mt-8 grid sm:grid-cols-2 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">Bill to:</h3>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">{order?.user.username}</h3>
          <p className="mt-2 not-italic text-gray-500 dark:text-neutral-500">
            {order?.address.address}<br/>
           {order?.address.city}, OR {order?.address.zipcode},<br/>
           {order?.address.governorate}<br/>
          </p>
        </div>
   

        <div className="sm:text-end space-y-2">
      
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Invoice date:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
})}</dd>
            </dl>
           
          </div>
    
        </div>
 
      </div>



      <div className="mt-6">
        <div className="border border-gray-200 p-4 rounded-lg space-y-4 dark:border-neutral-700">
          <div className="hidden sm:grid sm:grid-cols-5">
            <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Item</div>
            <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Qty</div>
            <div className="text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Rate</div>
            <div className="text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Amount</div>
          </div>

          {order?.orderItems.map((item, index) => (
  <div key={index} >
    <div className="hidden sm:block border-b border-gray-200 dark:border-neutral-700"></div>

    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 ">
      <div className="col-span-full sm:col-span-2">
        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Item</h5>
        <p className="font-medium text-gray-800 dark:text-neutral-200">{item.name}</p>
      </div>
      <div>
        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Qty</h5>
        <p className="text-gray-800 dark:text-neutral-200">{item.quantity}</p>
      </div>
      <div>
        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Rate</h5>
        <p className="text-gray-800 dark:text-neutral-200">{item.discount != null && item.discount > 0 ? (
  <p>
    {(item.price - (item.price * item.discount) / 100).toFixed(2)} TND 
  </p>
) : (
  <p>{item.price.toFixed(2)} TND</p>
)}</p>
      </div>
      <div>
        <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Amount</h5>
        <p className="sm:text-end text-gray-800 dark:text-neutral-200"> {item.discount != null && item.discount > 0 ? (
    // If discount exists, calculate the discounted price multiplied by the quantity
    ((item.price - (item.price * item.discount) / 100) * item.quantity).toFixed(2)
  ) : (
    // If no discount, simply multiply the price by the quantity
    (item.price * item.quantity).toFixed(2)
  )} TND</p>
      </div>
    </div>
  </div>
))}

        
        

        
          
        </div>
      </div>

      <div className="mt-8 flex sm:justify-end">
        <div className="w-full max-w-2xl sm:text-end space-y-2">
   
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
         <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Fee Shopping:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{order?.deliveryCost ? Number(order.deliveryCost).toFixed(2) : '0.00'}

              TND</dd>
            </dl>
{/*
            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Total:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">$2750.00</dd>
            </dl>

            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Tax:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">$39.00</dd>
            </dl> */}

            <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Amount paid:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">{order?.total.toFixed(2)} TND</dd>
            </dl>

           {/*  <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800 dark:text-neutral-200">Due balance:</dt>
              <dd className="col-span-2 text-gray-500 dark:text-neutral-500">$0.00</dd>
            </dl> */}
          </div>
    
        </div>
      </div>


      
    </div>
<div className='flex gap-2 justify-between'>
    <div className="mt-6 flex justify-s gap-x-3">
    <button onClick={()=>history.back()} type='button' className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
<path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
</svg>
       close
      </button>
    </div>
    <div className="mt-6 flex justify-end gap-x-3">
      
      <button onClick={  generatePDF} type='button' className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" >
      <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
        Invoice PDF
      </button>
      <button onClick={ handlePrint} type='button'  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-white hover:bg-[#15335E] focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" >
        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
        Print
      </button>
    </div>
    </div>
  </div>
</div>

 
  );
};

export default Invoice;