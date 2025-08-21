import { useState ,useEffect} from "react";
import api from "../api";

export default function FriendsCard({ friends, setFriends, setSelected, selected }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch friends on mount
  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await api.get("/friends", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFriends(data); // set friends from backend
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchFriends();
  }, [setFriends]);


    const add = async () => {
    if (!name.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add friends.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call backend
      const { data } = await api.post(
        "/friends/add",
        { name }, // request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // send token in headers
          },
        }
      );

      console.log("Friend added:", data);

      // Update local state
      setFriends([...friends, { id: data._id, name: data.name }]);
      setName("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Failed to add friend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold">2) Add friends</h2>
      <div className="mt-3 flex gap-2">
        <input className = "flex-1 border rounded-xl px-3 py-2"
          placeholder="Friend name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />
        <button onClick={add} className="px-4 py-2 rounded-xl bg-green-600 text-white">Add</button>
      </div>

     <ul className="mt-3 space-y-2">
  {friends.map(f => (
    <li key={f._id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selected?.some(s => s._id === f._id) || false}
          onChange={(e) => {
            if (e.target.checked) {
              // Add friend to selected
              setSelected(prev => [...prev, f]);
            } else {
              // Remove friend from selected
              setSelected(prev => prev.filter(s => s._id !== f._id));
            }
          }}
        />
        <span>{f.name}</span>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}

