const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fs = require("fs");

const router = express.Router();

// Temp storage (not permanent)
const upload = multer({ dest: "uploads/" });


// OCR route (no storage)
router.post("/extract", upload.single("billImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");

    const parsed = parseReceipt(text);

    fs.unlinkSync(req.file.path); // delete temp file

    res.json({
      rawText: text,
      ...parsed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "OCR failed", error: error.message });
  }
});


module.exports = router;

function cleanAndExtractBill(ocrText) {
  // Step 1: Normalize text
  let text = ocrText
    .toLowerCase()
    .replace(/\s+/g, " ") // collapse spaces
    .replace(/totel/g, "total")
    .replace(/sbtotal|sub totl|net sbtotal/g, "subtotal")
    .replace(/tx|taxe|ta\%/g, "tax")
    .replace(/amount due|to pay/g, "total");

  // Step 2: Extract numbers with their context
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  let subtotal = null;
  let tax = null;
  let total = null;

  for (const line of lines) {
    // Try to capture subtotal
    if (/subtotal/.test(line)) {
      const num = line.match(/[\d]+[.,]?\d*/g);
      if (num) subtotal = parseFloat(num[num.length - 1]);
    }

    // Capture tax
    if (/tax/.test(line)) {
      const num = line.match(/[\d]+[.,]?\d*/g);
      if (num) tax = parseFloat(num[num.length - 1]);
    }

    // Capture total (last fallback)
    if (/total/.test(line)) {
      const num = line.match(/[\d]+[.,]?\d*/g);
      if (num) total = parseFloat(num[num.length - 1]);
    }
  }

  // Step 3: Fallback → pick largest number as total if not found
  if (!total) {
    const allNums = text.match(/[\d]+[.,]?\d*/g)?.map(n => parseFloat(n)) || [];
    if (allNums.length > 0) {
      total = Math.max(...allNums);
    }
  }

  return {
    subtotal,
    tax,
    total
  };
}

// --- Helpers ---------------------------------------------------------------
const DIGIT_LIKE = { o: "0", O: "0", i: "1", I: "1", l: "1", L: "1", s: "5", S: "5", B: "8" };

// Turn a noisy token like "i28", "599", "19%", "0.49" into a float
function fixNumberToken(token) {
  if (!token) return null;
  let s = token
    .replace(/[oOiIlLsSB]/g, (ch) => DIGIT_LIKE[ch] || ch)
    .replace(/[^0-9.]/g, "")            // keep digits & dots
    .replace(/(\..*)\./g, "$1")         // at most one dot
    .replace(/^0+(\d)/, "$1");          // trim leading zeros (keep single zero)

  if (!s) return null;

  // If no dot and >= 3 digits, assume last two are decimals: "599" -> "5.99", "290" -> "2.90"
  if (!s.includes(".") && s.length >= 3) {
    s = s.slice(0, -2) + "." + s.slice(-2);
  }

  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

// Very light fuzzy check for keywords (handles small OCR typos)
function fuzzyIncludes(hay, needle) {
  hay = hay.toLowerCase();
  needle = needle.toLowerCase();
  // allow a few common OCR typos
  const variants = {
    total: ["total", "totel", "toal", "tota1"],
    subtotal: ["subtotal", "sub total", "sbtotal", "subtotl", "net subtotal", "net sbtotal"],
    tax: ["tax", "tx", "taz", "t a x"],
  };
  const list = variants[needle] || [needle];
  return list.some((v) => hay.includes(v));
}

// Parse the whole OCR blob into items, taxes, and computed totals
function parseReceipt(ocrText) {
  const lines = ocrText
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const items = [];
  const taxLines = [];
  let seenSubtotalFromText = null;
  let seenTotalFromText = null;

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Capture explicit subtotal/total numbers if present (but we won't trust them blindly)
    if (fuzzyIncludes(lower, "subtotal")) {
      const nums = (line.match(/[0-9oOiIlLsS.,%]+/g) || []).map(fixNumberToken).filter((n) => n != null);
      if (nums.length) seenSubtotalFromText = nums[nums.length - 1];
    }
    if (fuzzyIncludes(lower, "total")) {
      const nums = (line.match(/[0-9oOiIlLsS.,%]+/g) || []).map(fixNumberToken).filter((n) => n != null);
      if (nums.length) seenTotalFromText = nums[nums.length - 1];
    }

    // TAX lines
    if (fuzzyIncludes(lower, "tax")) {
      const nums = (line.match(/[0-9oOiIlLsS.,%]+/g) || []).map(fixNumberToken).filter((n) => n != null);
      if (nums.length) taxLines.push({ label: line, amount: nums[nums.length - 1] });
      continue;
    }

    // Try to detect an item row: begins with a small integer (qty), has at least one more number
    const numTokens = (line.match(/[0-9oOiIlLsS.,%]+/g) || []).map((t) => fixNumberToken(t)).filter((n) => n != null);

    // Heuristic: first number is qty (<= 20). Then expect unit price and maybe amount.
if (numTokens.length >= 2) {
  const qtyRaw = numTokens[0];
  const qty = Math.round(qtyRaw);

  // ✅ Qty must be small integer
  if (!Number.isInteger(qty) || qty <= 0 || qty > 20) continue;

  // ✅ Line must contain some letters (not just numbers/dashes)
  if (!/[a-zA-Z]/.test(line)) continue;

  // 🚫 Skip known false-positives
  if (/cashier|table|balance|ref|phone|authentic|market|today|subtotal|total|tax/i.test(line)) continue;

  // ✅ Proceed with unit price parsing as before…
  const unit = numTokens[1];
  const amountFromLine = numTokens[2] ?? null;
  const computedAmount = +(qty * unit).toFixed(2);

  let amount = computedAmount;
  if (amountFromLine != null && Math.abs(amountFromLine - computedAmount) <= 0.11) {
    amount = amountFromLine;
  }

  const name = line
    .replace(/^\s*\d+\s*/, "")
    .replace(/[0-9oOiIlLsS.,%]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  items.push({
    name: name || "item",
    qty,
    unitPrice: +unit.toFixed(2),
    amount: +amount.toFixed(2),
    source: line,
  });
}

  }

  // Compute totals from parsed data
  const subtotalFromItems = +items.reduce((s, it) => s + it.amount, 0).toFixed(2);
  const taxTotal = +taxLines.reduce((s, t) => s + t.amount, 0).toFixed(2);

  // Prefer computed values; fall back to OCR-captured ones only if we have no items
  const subtotal = items.length ? subtotalFromItems : (seenSubtotalFromText ?? null);
  const totalComputed = (subtotal != null ? +(subtotal + taxTotal).toFixed(2) : null);
  const total = (totalComputed != null ? totalComputed : seenTotalFromText ?? null);

  return {
    items,
    taxes: taxLines,
    subtotal,
    tax: taxTotal,
    total,
    sourceTotals: { seenSubtotalFromText, seenTotalFromText },
    strategy: items.length ? "computed_from_items_plus_taxes" : "from_text_fallback",
  };
}


