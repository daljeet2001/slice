import { useState, useEffect } from "react";
import api from "../api";

export default function FriendsCard({ friends, setFriends, setSelected, selected }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newFriend, setNewFriend] = useState("");

  // Fetch friends on mount
  useEffect(() => {
    const fetchFriends = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await api.get("/friends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(data);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    };

    fetchFriends();
  }, [setFriends]);

  // Add friend logic (using input field)
  const addFriend = async (e) => {
    e.preventDefault();
    if (!newFriend.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add friends.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post(
        "/friends/add",
        { name: newFriend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFriends([...friends, { _id: data._id, name: data.name }]);
      setNewFriend(""); // clear field after adding
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add friend");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="p-4 font-chewy text-center">
  <h2 className="text-xl font-semibold mb-4">Step 2: Add Friends</h2>

  {/* Friends Avatars */}
  <div className="flex flex-wrap gap-3 sm:gap-6 items-center justify-center">
    {/* Friend Avatars */}
    {friends.map((f) => (
      <div
        key={f._id}
        className="flex flex-col items-center cursor-pointer"
        onClick={() =>
          setSelected((prev) =>
            prev.some((s) => s._id === f._id)
              ? prev.filter((s) => s._id !== f._id)
              : [...prev, f]
          )
        }
      >
        <div
          className={`w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-white text-base sm:text-lg font-semibold ${
            selected?.some((s) => s._id === f._id)
              ? "bg-black"
              : "bg-gray-400"
          }`}
        >
          {f.name.charAt(0).toUpperCase()}
        </div>
        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-700 truncate max-w-[70px]">
          {f.name}
        </p>
      </div>
    ))}

    {/* Add Friend Input */}
    <div className="flex flex-col items-center mt-9 sm:mt-13  pt-2 sm:pt-3">
      <form onSubmit={addFriend}>
        <input
          id="friendInput"
          type="text"
          value={newFriend}
          onChange={(e) => setNewFriend(e.target.value)}
          placeholder="Add more"
          className="w-20 sm:w-28 px-2 py-1 text-xs sm:text-sm outline-none  text-center"
        />
      </form>
    </div>
  </div>

  {error && <p className="text-red-500 mt-3">{error}</p>}
</div>

  );
}
