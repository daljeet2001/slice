import { useEffect, useMemo, useState } from "react";
import { splitEven } from "../utils/split";
import api from "../api";

export default function SplitCard({ total, friends }) {
  const [mode, setMode] = useState("equal"); // 'equal' | 'custom'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [custom, setCustom] = useState(() =>
    Object.fromEntries(friends.map(f => [f._id, 0]))
  );


  // Sync custom state if friends change
useEffect(() => {
  setCustom(prev => {
    const newCustom = { ...prev };
    friends.forEach(f => {
      if (!(f._id in newCustom)) newCustom[f._id] = 0;
    });
    return newCustom;
  });
}, [friends]);


 const createBill = async () => {
    console.log("Creating bill with total:", total);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a bill.");
      return;
    }

    setLoading(true);
    setError("");

    try {
const body = {
  totalAmount: total,
  participants: friends.map(f => ({
    friendId: f._id, // make sure this is the actual Mongo _id of the friend
    amountOwed: mode === "equal" ? equalShares[friends.indexOf(f)] : custom[f._id] || 0
  }))
};

console.log("Bill body:", body);


      const { data } = await api.post("/bills/add", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Bill created:", data);

    } catch (err) {
      console.error("Failed to create bill:", err);
      setError(err.response?.data?.msg || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  const equalShares = useMemo(() => {
    if (!total || friends.length === 0) return [];
    return splitEven(total, friends.length);
  }, [total, friends.length]);

  const customTotal = useMemo(
    () => Object.values(custom).reduce((s,v)=>s + Number(v||0), 0),
    [custom]
  );

  const remaining = (Number(total || 0) - Number(customTotal)).toFixed(2);

  return (
    <div className=" p-4 text-center font-chewy">
    <h2 className="text-xl font-semibold mb-4">Step 3: Split</h2>
      <p className="text-sm text-gray-600 mt-1">
        Total detected: <b>${Number(total||0).toFixed(2)}</b>
      </p>

      <div className="mt-3 flex gap-2 justify-center">
        <button
          onClick={()=>setMode("equal")}
          className={`px-3 py-1 rounded-xl border ${mode==="equal"?"bg-blue-600 text-white border-blue-600":"bg-white"}`}
        >Equal</button>
        <button
          onClick={()=>setMode("custom")}
          className={`px-3 py-1 rounded-xl border ${mode==="custom"?"bg-blue-600 text-white border-blue-600":"bg-white"}`}
        >Custom</button>
      </div>


      {mode === "equal" && (
        <ul className="mt-3 space-y-2">
          {friends.map((f, i) => (
            <li key={f.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
              
              <span>{f.name}</span>
              <span>${equalShares[i]?.toFixed(2) ?? "0.00"}</span>
            </li>
          ))}
        </ul>
      )}

    {mode === "custom" && (
  <div className="mt-3">
    <ul className="space-y-2">
      {friends.map((f) => (
        <li key={f.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
          <span className="mr-3">{f.name}</span>
          <div className="flex items-center gap-2">
            <span>$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={custom[f._id] ?? 0}
             onChange={(e) => setCustom({ ...custom, [f._id]: Number(e.target.value) })}

              className="w-28 border rounded-lg px-2 py-1 text-right"
            />
          </div>
        </li>
      ))}
    </ul>
    <div className="flex items-center justify-between mt-3 text-sm">
      <span>Assigned total</span>
      <b>${customTotal.toFixed(2)}</b>
    </div>
    <div className={`flex items-center justify-between ${Number(remaining)===0?'text-green-600':'text-amber-600'} mt-1 text-sm`}>
      <span>Remaining to assign</span>
      <b>${remaining}</b> 

    </div>

  </div>
)}
     <button
        onClick={createBill}
        className={`rounded-md p-2 mt-4  
    ${loading || (mode === "custom" && Number(remaining) !== 0) 
      ? "bg-gray-400 text-white cursor-not-allowed" 
      : "bg-black text-white hover:bg-gray-900"}`}
  disabled={loading || (mode === "custom" && Number(remaining) !== 0)}
      >
        {loading ? "Creating..." : "Create"}

      </button>

    </div>
  );
}
