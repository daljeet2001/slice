import { useState, useEffect } from "react";
import { Upload } from "lucide-react"; 
import api from "../api";


export default function UploadCard({ onTotalDetected, onRawText }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError("");
    }
  };

  const extract = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("billImage", file);

      const { data } = await api.post("/ocr/extract", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onRawText?.(data.rawText || "");
      onTotalDetected?.(data.sourceTotals.seenTotalFromText || 0);
    } catch (e) {
      setError("Couldn’t read the bill. Try a clearer picture.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file) extract();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className=" p-6   text-center font-chewy">
      <h2 className="text-xl font-semibold mb-2"> Step 1: Upload Your Bill</h2>
      <p className="text-gray-500 mb-6">
         we’ll instantly calculate the total for you.
      </p>

      {/* Upload box */}
      <label className="block border-2 border-dashed border-gray-300 rounded-xl p-12 cursor-pointer hover:border-blue-400 transition">
        <input type="file" className="hidden" accept="image/*" onChange={pick} />

        {!preview ? (
          <div className="flex flex-col items-center">
            {/* <Upload className="w-12 h-12 text-blue-500 mb-3" /> */}
            <img src="/cloud.png" alt="App Icon" className="w-8 h-8" />

        
            <p className="text-gray-700 font-medium">Choose a File</p>
            <p className="text-xs text-gray-400 mt-1">
              Supported: JPG, PNG (Max 10MB). Clear photos work best!
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Bill Preview"
              className="max-h-64 rounded-xl shadow-md"
            />
          </div>
        )}
      </label>

      {/* Loading/Error messages */}
      {loading && <p className="text-blue-600 text-sm mt-3">Analyzing your bill...</p>}
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  );
}
