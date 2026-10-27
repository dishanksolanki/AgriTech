import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { StorageService } from '../services/storageService';
import { Product, ProductCategory, Order } from '../types';
import { 
  ShoppingBag, Search, Filter, Plus, Check, Star, 
  Truck, PackageCheck, AlertCircle, ShoppingCart, Clock 
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const loadData = () => {
    setProducts(StorageService.getProducts());
    if (user) {
      setOrders(StorageService.getOrders(user.role === 'admin' ? undefined : user.id));
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Seeds',
    'Fertilizers',
    'Farming tools',
    'Irrigation equipment',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (p: Product) => {
    addToCart(p, 1);
    setAddedItemNotice(p.name);
    setTimeout(() => setAddedItemNotice(null), 2500);
  };

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dispatched':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t.nav.market}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Certified seeds, balanced bio-fertilizers, solar micro-irrigation kits, and sprayers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Catalog vs Orders Toggle */}
          <div className="bg-neutral-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'catalog' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Browse Catalog
            </button>
            <button
              onClick={() => {
                loadData();
                setActiveTab('orders');
              }}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              My Orders ({orders.length})
            </button>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Open Cart</span>
          </button>
        </div>
      </div>

      {addedItemNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center justify-between">
          <span>Added <strong>{addedItemNotice}</strong> to your farm cart.</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="font-bold underline text-[#14532D] hover:text-[#0f3e22] cursor-pointer"
          >
            View Cart & Checkout
          </button>
        </div>
      )}

      {activeTab === 'catalog' ? (
        <>
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search seeds, fertilizers, drip lines..."
                className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#14532D] text-white border-[#14532D] font-bold'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#14532D] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1">
                    Seller: {product.sellerName}
                  </p>

                  <p className="text-xs text-neutral-600 leading-relaxed mt-2.5 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-extrabold text-[#14532D] tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      per {product.unit}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-3.5 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Orders & Tracking Tab */
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-xs text-neutral-400">
              No orders placed yet. Add items to your cart to test the simulated checkout.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                      <span>Order #{order.id}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getOrderStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </span>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Placed on {new Date(order.orderDate).toLocaleDateString('en-IN')} · Payment: {order.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-neutral-500">Order Total:</span>
                    <div className="text-base font-bold text-[#14532D] tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-neutral-100 text-xs">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-neutral-900">{it.productName}</span>
                        <span className="text-neutral-500 ml-2">({it.quantity} × {it.unit})</span>
                      </div>
                      <span className="tabular-nums font-medium text-neutral-800">
                        ₹{(it.price * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery details */}
                <div className="bg-[#F8F7F0] p-3 rounded-lg border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-600">
                  <div>
                    <span className="font-semibold text-neutral-800">Delivery Address: </span>
                    <span>{order.shippingAddress} (Ph: {order.phone})</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-[#14532D] shrink-0">
                    <Truck className="w-4 h-4" />
                    <span>Est. Delivery: {order.estimatedDeliveryDate}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
