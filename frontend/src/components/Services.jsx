

export default function Services() {
  return (
    <section className=" py-2 px-6 mb-24 text-center font-chewy">
      {/* Top small heading */}
      <p className="text-sm font-semibold  tracking-wide mb-2">
        How slice works
      </p>

      {/* Main heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
        Splitting bills made easy in just 4 steps
      </h2>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 max-w-5xl mx-auto">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center">
       <img src="/submit.png" alt="upload Icon" className="h-10 w-10 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Your Bill
          </h3>
       
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center">
            <img src="/friendship.png" alt="friends Icon" className="h-10 w-10 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select Friends
          </h3>
          
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center">
            <img src="/document.png" alt="split Icon" className="h-10 w-10 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Split the Amount
          </h3>

        </div>

             <div className="flex flex-col items-center text-center">
            <img src="/bill.png" alt="bill Icon" className="h-10 w-10 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Get Your Split Bill
          </h3>
       
        </div>
      </div>
    </section>
  );
}
