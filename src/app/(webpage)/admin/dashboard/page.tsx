"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdOutlineDeleteOutline } from "react-icons/md";
import DeletePopup from "@/components/Popup/DeletePopup";
import { toast } from "react-toastify";

interface User {
  _id: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState({ id: "", email: "" });
  const handleDeleteClick = (user: User) => {
    setLoadingUserId(user._id); 
    setSelectedUser({ id: user._id, email: user.email });
    setIsPopupOpen(true);
 
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingUserId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch(`/api/users/userdashboard`);
    const data = await res.json();
    setUsers(data);
  };

  const handleDeleteUser = async (id: string) => {
    
    try {
      const response = await fetch(`/api/users/deleteuserbyid/${id}`, {
        method: "DELETE",
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`Failed to delete user. Status: ${response.status}`);
      }

      fetchUsers();
      toast.success("User delete successfully!");
      handleClosePopup();
    } catch (error) {
      toast.error("[User_DELETE] ");
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    try {
      // Ensure the session and user ID are available
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      // Perform the API request
      const response = await fetch(`/api/users/updateuserrole/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      // Check for HTTP errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }
      setDropdownOpen(null); // Close the dropdown

      // Refresh the user list or update the UI
      fetchUsers();
    } catch (error) {
      // Handle errors, e.g., show a notification or log the error
      console.error("Error changing role:", error);
      // Optionally, show a user-friendly error message
    } finally {
      setLoadingUserId(null); 
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>
      <div className="relative  shadow-lg rounded-lg ">
        <table className="w-full text-sm text-left rtl:text-right ">
          <thead className="text-xl uppercase ">
            <tr className=" bg-gray-800">
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-2   font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {user.email}
                </th>
                <td className="px-6 py-2  text-center">
                  <div className="flex items-center justify-center">
                    <select
                      className={`w-[50%]  text-center border-2  p-2  `}
                      value={user.role} // Set the default value
                      onChange={(e) =>
                        handleChangeRole(user._id, e.target.value)
                      }
                      disabled={loadingUserId === user._id}
                    >
                      <option value="Consulter" className="">
                        Consulter
                      </option>
                      {session?.user?.role === "SuperAdmin" && (
                        <option value="Admin" className="">
                          Admin
                        </option>
                      )}
                      <option value="Visiteur" className="">
                        Visiteur
                      </option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-2 relative text-center">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="bg-red-500 w-[50%] text-white  py-2 rounded"
                    disabled={loadingUserId === user._id}
                  >
                    {loadingUserId ===user._id ? "Processing..." : "DELETE"}
                  </button>
                  {isPopupOpen && (
                    <DeletePopup
                      handleClosePopup={handleClosePopup}
                      Delete={handleDeleteUser}
                      id={selectedUser.id} // Pass selected user's id
                      name={selectedUser.email}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
