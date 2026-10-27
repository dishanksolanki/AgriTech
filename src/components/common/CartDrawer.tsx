import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../services/storageService';
import { X, Trash2, ShoppingBag, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [address, setAddress] = useState(
    user ? `${user.district}, ${user.state} (Registered Farm Address)` : 'Plot 4B, Vasad Road, Anand, Gujarat'
  );
  const [phone, setPhone] = useState(user?.mobile || '+91 98250 12345');
  const [paymentOption, setPaymentOption] = useState<'Pay on Delivery (Demo)' | 'Kisan Credit / UPI (Simulated)'>('Pay on Delivery (Demo)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !user) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 4);

      const newOrder = StorageService.createOrder({
        userId: user.id,
        farmerName: user.name,
        shippingAddress: address,
        phone,
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
        })),
        totalAmount: cartTotal,
        paymentMethod: paymentOption,
        estimatedDeliveryDate: deliveryDate.toISOString().split('T')[0],
      });

      setIsSubmitting(false);
      setOrderSuccessId(newOrder.id);
      clearCart();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#14532D]" />
            <h2 className="text-lg font-bold text-neutral-900">
              {t.nav.cart} ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setOrderSuccessId(null);
            }}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {orderSuccessId ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">Demo Order Confirmed!</h3>
              <p className="text-sm text-neutral-600">
                Order Reference: <span className="font-mono font-semibold text-[#14532D]">{orderSuccessId}</span>
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 text-left">
                <strong>Simulated Checkout Notice:</strong> This is an educational demonstration. No actual funds were deducted, and dispatch tracking has been added to your dashboard.
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setOrderSuccessId(null);
                }}
                className="w-full py-2.5 px-4 bg-[#14532D] text-white text-sm font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors"
              >
                Back to Farm Dashboard
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-16 text-neutral-500 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-1 text-neutral-400" />
              <p className="text-base font-medium text-neutral-800">Your agricultural cart is empty</p>
              <p className="text-xs text-neutral-500">Explore certified seeds, fertilizers, and irrigation tools in the marketplace.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Item List */}
              <div className="divide-y divide-neutral-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900">{item.product.name}</h4>
                      <p className="text-xs text-neutral-500">
                        {item.product.unit} · {item.product.category}
                      </p>
                      <p className="text-sm font-medium text-[#14532D] tabular-nums mt-1">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-neutral-200 rounded">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-400 hover:text-red-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-900">Delivery & Demo Settlement</h4>
                
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Delivery Address (Village / Taluka)
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Farmer Contact Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Payment Mode (Simulated)
                  </label>
                  <select
                    value={paymentOption}
                    onChange={(e) => setPaymentOption(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    <option value="Pay on Delivery (Demo)">Pay on Delivery at Village Center (Demo)</option>
                    <option value="Kisan Credit / UPI (Simulated)">Kisan Credit Card / UPI (Simulated)</option>
                  </select>
                </div>

                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex items-start gap-2 text-xs text-neutral-600">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <span>Transparent Demo: No real monetary transaction. Order will immediately log to order tracker.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-[#14532D] text-white text-sm font-semibold rounded-lg hover:bg-[#0f3e22] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Processing Order...' : `Confirm Demo Order · ₹${cartTotal.toLocaleString('en-IN')}`}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {!orderSuccessId && cart.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <div className="flex justify-between items-center text-sm font-bold text-neutral-900">
              <span>Total Estimated Amount</span>
              <span className="tabular-nums text-[#14532D]">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
