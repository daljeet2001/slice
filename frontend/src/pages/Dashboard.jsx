import { useState } from "react";
import UploadCard from "../components/UploadCard";
import FriendsCard from "../components/FriendsCard";
import SplitCard from "../components/SplitCard";
import Bills from "../components/Bills";

export default function Dashboard() {
  const [rawText, setRawText] = useState("");
  const [total, setTotal] = useState(0);
  const [friends, setFriends] = useState([]);
  const [selectedfriends, setSelectedFriends] = useState([]);
  console.log("Dashboard rendered with friends:", friends);
    console.log("Dashboard rendered with total:", total);


  return (
    <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8  bg-white"
    >

      <h1 className=" text-4xl font-chewy text-center">A quick guide to go from receipt to fair shares</h1>
      <UploadCard onTotalDetected={setTotal} onRawText={setRawText} />

      <div className="space-y-6">
        <FriendsCard friends={friends} setFriends={setFriends} setSelected={setSelectedFriends} selected={selectedfriends} />
    
       

    
       <SplitCard total={total} friends={selectedfriends} />

           <Bills />
      </div>

      {/* Optional raw text viewer */}
      {/* {rawText && (
        <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold">OCR Text</h2>
          <pre className="mt-2 max-h-64 overflow-auto text-xs bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">
            {rawText}
          </pre>
        </div>
      )} */}
    </main>
  );
}

