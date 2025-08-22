import { useEffect, useState } from "react";
import { Share2 } from "lucide-react"; // share icon
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

        // ✅ Sort latest first
        const sorted = (data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBills(sorted);
      } catch (err) {
        console.error("Failed to fetch bills:", err);
        setError(err.response?.data?.msg || "Failed to load bills");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
    const intervalId = setInterval(fetchBills, 2000);
    return () => clearInterval(intervalId);
  }, []);

  // if (loading) return <p className="text-center mt-4 font-chewy">Loading bills...</p>;
  // if (error) return <p className="text-center mt-4 text-red-500 font-chewy">{error}</p>;
  // if (bills.length === 0) return <p className="text-center mt-4 font-chewy">No bills found.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto text-center font-chewy">
      <h2 className="text-xl font-semibold mb-4">Step 4: Your Bills</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-md relative"
          >
    
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{bill.title || "Untitled Bill"}</h3>
              <Share2 className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>

        
            <p className="text-sm text-gray-500">Total Bill</p>
            <p className="text-2xl font-bold mb-3">
              ${Number(bill.totalAmount).toFixed(2)}
            </p>

    
            <div className="flex items-center justify-between mb-2">
              <div className="flex -space-x-2">
                {bill.participants.slice(0, 4).map((p) => (
                  <div
                    key={p._id}
                    className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-semibold"
                  >
                    {p.friendId?.name?.charAt(0).toUpperCase()}
                  </div>
                ))}
                {bill.participants.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                    +{bill.participants.length - 4}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500">
                {bill.participants.length} persons
              </span>
            </div>

 
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-3">
              {bill.participants.map((p) => (
                <li key={p._id} className="flex justify-between">
                  <span>{p.friendId?.name || "Unknown"}</span>
                  <span>${Number(p.amountOwed).toFixed(2)}</span>
                </li>
              ))}
            </ul>

     
            {/* <button className="w-full mt-2 bg-black text-white py-2 rounded-xl cursor-not-allowed opacity-50">
              Split Now
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}


