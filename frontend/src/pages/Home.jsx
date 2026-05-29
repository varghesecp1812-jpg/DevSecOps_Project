import { Link } from 'react-router-dom';

const restaurants = [
  {
    id: 1,
    name: 'Spice Garden',
    cuisine: 'North Indian',
    rating: 4.5,
    delivery: '35 mins',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    slug: 'spice-garden',
  },
  {
    id: 2,
    name: 'Dosa Express',
    cuisine: 'South Indian',
    rating: 4.3,
    delivery: '25 mins',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    slug: 'dosa-express',
  },
  {
    id: 3,
    name: 'Pizza Palace',
    cuisine: 'Italian',
    rating: 4.2,
    delivery: '40 mins',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    slug: 'pizza-palace',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">

      <nav className="bg-orange-500 text-white p-4 flex justify-between">
        <h1 className="text-3xl font-bold">FoodApp</h1>

        <div className="flex gap-5">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/orders">Orders</Link>
        </div>
      </nav>

      <div className="bg-orange-500 text-white py-20 text-center">

        <h1 className="text-6xl font-bold mb-4">
          Delicious Food Delivered Fast
        </h1>

        <p className="text-xl">
          Order from your favorite restaurants
        </p>

      </div>

      <div className="p-8">

        <h2 className="text-4xl font-bold mb-8">
          Popular Restaurants
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {restaurants.map((restaurant) => (

            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.slug}`}
            >

              <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition duration-300">

                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-60 w-full object-cover"
                />

                <div className="p-5">

                  <h3 className="text-2xl font-bold">
                    {restaurant.name}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {restaurant.cuisine}
                  </p>

                  <div className="flex justify-between mt-5">

                    <span className="font-bold">
                      ⭐ {restaurant.rating}
                    </span>

                    <span>
                      {restaurant.delivery}
                    </span>

                  </div>

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </div>
  );
}
