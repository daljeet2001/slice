import { useState } from "react";
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
      fd.append("billImage", file); // <— MUST match multer field name

      const { data } = await api.post("/ocr/extract", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onRawText?.(data.rawText || "");
      onTotalDetected?.(data.sourceTotals.seenTotalFromText || 0);
    } catch (e) {
      setError("Failed to extract. Try a clearer photo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold">1 Upload bill</h2>
      <input className="mt-3" type="file" accept="image/*" onChange={pick} />
      {preview && <img src={preview} alt="preview" className="mt-3 rounded-xl" />}
      <button onClick= {extract}
        disabled={!file || loading}
        className="mt-4 w-full py-2 rounded-xl bg-blue-600 text-white disabled:bg-gray-400"
      >
        {loading ? "Extracting..." : "Extract Total"}
      </button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}

