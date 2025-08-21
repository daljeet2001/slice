import { useEffect, useState } from "react";
import api from "../api";

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchBills = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setError("You must be logged in.");

    try {
      const { data } = await api.get("/bills", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(data || []);
    } catch (err) {
      console.error("Failed to fetch bills:", err);
      setError(err.response?.data?.msg || "Failed to load bills");
    } finally {
      setLoading(false);
    }
  };

  // Fetch immediately
  fetchBills();

  // Set interval to fetch every 2 seconds
  const intervalId = setInterval(fetchBills, 2000);

  // Cleanup interval on unmount
  return () => clearInterval(intervalId);
}, []);


  if (loading) return <p className="text-center mt-4">Loading bills...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (bills.length === 0) return <p className="text-center mt-4">No bills found.</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Bills</h2>
      <div className="space-y-4">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md"
          >
            <p className="font-semibold text-lg">Total Amount: ${bill.totalAmount}</p>
            <p className="text-sm text-gray-500 mb-2">
              Created: {new Date(bill.createdAt).toLocaleString()}
            </p>
            <div className="space-y-1">
              <p className="font-medium">Participants:</p>
              <ul className="ml-4 list-disc text-gray-700 dark:text-gray-300">
                {bill.participants.map((p) => (
                  <li key={p._id}>
                    {p.friendId.name}: ${p.amountOwed}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
