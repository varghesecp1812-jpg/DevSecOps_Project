export default function Orders() {

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        My Orders
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg mb-4">

        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">
            Spice Garden
          </h2>

          <span className="text-green-600 font-bold">
            Delivered
          </span>
        </div>

        <p className="mt-4">
          Total: ₹360
        </p>

      </div>

    </div>
  );
}
