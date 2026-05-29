import { useParams } from 'react-router-dom';

const foods = [
  {
    id: 1,
    name: 'Butter Chicken',
    price: 320,
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398',
  },
  {
    id: 2,
    name: 'Paneer Tikka',
    price: 220,
    image:
      'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8',
  },
];

export default function Restaurant() {

  const { slug } = useParams();

  const addToCart = () => {
    alert('Added to cart');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8 capitalize">
        {slug.replace('-', ' ')}
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {foods.map((food) => (

          <div
            key={food.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >

            <img
              src={food.image}
              className="h-56 w-full object-cover"
            />

            <div className="p-4">

              <h2 className="text-2xl font-bold">
                {food.name}
              </h2>

              <div className="flex justify-between items-center mt-4">

                <span className="text-orange-500 font-bold text-xl">
                  ₹{food.price}
                </span>

                <button
                  onClick={addToCart}
                  className="bg-orange-500 text-white px-5 py-2 rounded-xl"
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
