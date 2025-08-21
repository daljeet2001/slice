import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-heading font-bold">Scan bills. Split fairly.</h1>
      <p className="mt-4 text-gray-600 text-lg">
        Upload a bill, let OCR find the total, add friends, and split—equally or custom.
      </p>
      <Link to="/dashboard" className="inline-block mt-8 px-6 py-3 rounded-xl bg-blue-600 text-white">
        Get Started
      </Link>
      <section className="grid sm:grid-cols-3 gap-4 mt-16">
        <Feature title="Upload" desc="Image → text via OCR" />
        <Feature title="Smart Total" desc="Detects 'Total to Pay'" />
        <Feature title="Split" desc="Equal or custom per friend" />
      </section>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </div>
  );
}

