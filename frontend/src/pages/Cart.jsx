export default function Cart() {

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Cart
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-lg">

        <div className="flex justify-between mb-4">
          <span>Butter Chicken x 1</span>
          <span>₹320</span>
        </div>

        <div className="flex justify-between mb-4">
          <span>Delivery</span>
          <span>₹40</span>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹360</span>
        </div>

        <button
          className="mt-6 w-full bg-orange-500 text-white p-4 rounded-xl"
        >
          Place Order
        </button>

      </div>

    </div>
  );
}
