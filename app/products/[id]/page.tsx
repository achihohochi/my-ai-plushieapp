import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  stock_quantity: number;
  status: string;
}

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`http://localhost:3002/api/products/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.data;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const inStock = product.stock_quantity > 0;
  const lowStock = product.stock_quantity < 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/shop"
            className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative h-96 lg:h-full bg-gray-100">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-pink-600">
                  ${product.price}
                </span>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {inStock ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">
                      In Stock ({product.stock_quantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}

                {lowStock && inStock && (
                  <p className="text-orange-600 text-sm mt-1">
                    ⚠️ Hurry! Only {product.stock_quantity} left in stock!
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  About this plushie
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Features
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">✓</span>
                    Super soft and huggable
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">✓</span>
                    High-quality materials
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">✓</span>
                    Perfect for all ages
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-pink-500">✓</span>
                    Makes a great gift!
                  </li>
                </ul>
              </div>

              {/* Add to Cart Button (Placeholder for Phase 3) */}
              <button
                disabled={!inStock}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  inStock
                    ? 'bg-pink-600 hover:bg-pink-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {inStock ? '🛒 Add to Cart (Coming in Phase 3!)' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
