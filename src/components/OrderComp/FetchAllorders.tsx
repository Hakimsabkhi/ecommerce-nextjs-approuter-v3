"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import DeletePopup from "../Popup/DeletePopup";
import LoadingSpinner from "../LoadingSpinner";
import Pagination from "../Pagination";

type User = {
  _id: string;
  username: string;
  // other user fields
};

interface Address {
  _id: string;
  governorate: string;
  city: string;
  zipcode: string;
  address: string;
}

interface Order {
  _id: string;
  user: User;
  ref: string;
  address: Address;
  paymentMethod: string;
  deliveryMethod:string;
  createdAt:string;
  total: number;
  orderStatus: string;
}

const ListOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]); // Filtered orders
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 5;
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState({ id: "", name: "" });
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const handleDeleteClick = (order:Order) => {

    setLoadingOrderId(order._id); 
    
    setSelectedOrder({ id: order._id, name: order.ref });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingOrderId(null); 
  };
  const DeleteOrder = async (id: string) => {
        
    try {
        const response = await fetch(`/api/order/deleteorderbyid/${id}`, {
            method: 'DELETE',
            
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        handleClosePopup();
        toast.success("order delete successfully!" );
       
       
        await getOrders();

    } catch (err: any) {
        
        toast.error(`[order_DELETE] ${err.message}` );
    }finally{
        setLoadingOrderId(null); 
      }
};
  const getOrders = useCallback(async () => {
  
    try {
      const response = await fetch("/api/order/getallorder", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data); // Store all orders
      setFilteredOrders(data); // Initially, filteredOrders are the same as orders
    } catch (err: any) {
      setError(`[Orders_GET] ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoadingOrderId(orderId);
    try {
      const updateFormData = new FormData();
      updateFormData.append("status", newStatus);

      const response = await fetch(`/api/order/updateStatusorder/${orderId}`, {
        method: "PUT",
        body: updateFormData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Order status updated successfully:", data);

      getOrders(); // Refresh the orders
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setLoadingOrderId(null);
    }
  };

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    // Apply search filter
    const filtered = orders.filter((order) =>
      order.ref ? order.ref.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page
  }, [searchTerm, orders]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-auto w-[85%] py-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">ALL Orders</p>
      </div>
      <input
        type="text"
        placeholder="Search orders"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <table className="table-auto w-full mt-4">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-4 py-2">REF</th>
            <th className="px-4 py-2">Customer Name</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Delivery Method</th>
            <th className="px-4 py-2">Payment Method</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 text-center py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((item) => (
            <tr key={item._id} className="bg-white text-black">
              <td className="border px-4 py-2">{item.ref}</td>
              <td className="border px-4 py-2">{item.user.username}</td>
              <td className="border px-4 py-2 text-end">{item.total} TND</td>
              <td className="border px-4 py-2">{item.paymentMethod}</td>
              <td className="border px-4 py-2 uppercase">{item.deliveryMethod}</td>
              <td className="border px-4 py-2 ">{new Date(item.createdAt).toLocaleDateString('en-GB')} - {new Date(item.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
              <td className="border px-4 py-2">
                <div className="flex items-center justify-center gap-2">
                  <select
                    className={`w-50 text-black rounded-md p-2 ${
                      item.orderStatus === "Processing"
                        ? "bg-gray-800 text-white"
                        : "bg-red-700 text-white"
                    }`}
                    value={item.orderStatus}
                    onChange={(e) =>
                      updateOrderStatus(item._id, e.target.value)
                    }
                  >
                    <option value="Processing">Processing</option>
                    <option value="Pack">Pack</option>
                    <option value="Deliver">Deliver</option>
                    <option value="Receive">Receive</option>
                  </select>
                  <Link href={`/admin/orderlist/${item.ref}`}>
                    <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                      View
                    </button>
                  </Link>
                  <Link href={`/admin/invoice/${item.ref}`}>
                    <button className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md uppercase">
                      Invoice
                    </button>
                  </Link>
                  <button
                  onClick={()=>handleDeleteClick(item)}
                    className="bg-gray-800 text-white w-28 h-10 hover:bg-gray-600 rounded-md"
                    disabled={loadingOrderId === item._id}
                  >
                    {loadingOrderId === item._id ? "Processing..." : "DELETE"}
                  </button>
                  {isPopupOpen &&     < DeletePopup  handleClosePopup={handleClosePopup} Delete={DeleteOrder}  id={selectedOrder.id} // Pass selected user's id
                    name={selectedOrder.name} />}      
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalPages)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListOrders;
