import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { 
  User, Farm, Crop, Product, Order, Consultation, 
  AgriculturalAlert, ForumPost 
} from '../types';
import { 
  Shield, Users, MapPin, Wheat, ShoppingBag, 
  Clock, AlertTriangle, Check, Trash2, Edit2, 
  Plus, CheckCircle2, XCircle, Search 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const [usersList, setUsersList] = useState<User[]>([]);
  const [farmsList, setFarmsList] = useState<Farm[]>([]);
  const [cropsList, setCropsList] = useState<Crop[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [consultationsList, setConsultationsList] = useState<Consultation[]>([]);
  const [alertsList, setAlertsList] = useState<AgriculturalAlert[]>([]);
  const [postsList, setPostsList] = useState<ForumPost[]>([]);

  const [activeSection, setActiveSection] = useState<'overview' | 'orders' | 'alerts' | 'products' | 'forum'>('overview');

  // New product state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('Seeds');
  const [newProdPrice, setNewProdPrice] = useState<number>(1200);
  const [newProdUnit, setNewProdUnit] = useState('25 kg bag');
  const [newProdSeller, setNewProdSeller] = useState('IFFCO Agricultural Co-op');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [isNewProdOpen, setIsNewProdOpen] = useState(false);

  const loadAllData = () => {
    setUsersList(StorageService.getUsers());
    setFarmsList(StorageService.getFarms());
    setCropsList(StorageService.getCrops());
    setProductsList(StorageService.getProducts());
    setOrdersList(StorageService.getOrders());
    setConsultationsList(StorageService.getConsultations());
    setAlertsList(StorageService.getAlerts());
    setPostsList(StorageService.getForumPosts());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-800 space-y-3">
        <Shield className="w-10 h-10 text-red-600 mx-auto" />
        <h2 className="text-lg font-bold">Unauthorized Access</h2>
        <p className="text-xs text-red-600 max-w-md mx-auto">
          The Admin Control Center requires administrative role privileges. Switch to Dr. Rajesh Verma (Admin) using the top evaluation switcher to review this module.
        </p>
      </div>
    );
  }

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    StorageService.updateOrderStatus(orderId, status);
    loadAllData();
  };

  const handleVerifyAlert = (alertId: string, current: boolean) => {
    StorageService.verifyAlert(alertId, !current);
    loadAllData();
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Delete this forum post for violating guidelines?')) {
      StorageService.deleteForumPost(postId);
      loadAllData();
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    StorageService.addProduct({
      name: newProdName,
      category: newProdCategory,
      price: Number(newProdPrice),
      unit: newProdUnit,
      stock: 50,
      rating: 4.8,
      sellerName: newProdSeller,
      description: newProdDesc || 'Certified farm input supplied under standard agricultural quality standards.',
    });
    setIsNewProdOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    loadAllData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#14532D]">
            <Shield className="w-4 h-4 text-[#2E7D32]" />
            <span>Administrative Command Console</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight mt-0.5">
            AgriTech Central Administration
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            System moderation, agricultural alert verification, catalog logistics, and user accounts.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'overview' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Overview & Users
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'orders' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Orders ({ordersList.length})
          </button>
          <button
            onClick={() => setActiveSection('alerts')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'alerts' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Alerts & Verification
          </button>
          <button
            onClick={() => setActiveSection('products')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'products' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveSection('forum')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeSection === 'forum' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Forum Moderation
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] text-neutral-500">Farmers</div>
          <div className="text-xl font-bold text-neutral-900 tabular-nums">
            {usersList.filter(u => u.role === 'farmer').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] text-neutral-500">Farms Managed</div>
          <div className="text-xl font-bold text-neutral-900 tabular-nums">
            {farmsList.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] text-neutral-500">Active Crops</div>
          <div className="text-xl font-bold text-neutral-900 tabular-nums">
            {cropsList.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] text-neutral-500">Catalog SKUs</div>
          <div className="text-xl font-bold text-neutral-900 tabular-nums">
            {productsList.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] text-neutral-500">Total Orders</div>
          <div className="text-xl font-bold text-neutral-900 tabular-nums">
            {ordersList.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200">
          <div className="text-[11px] text-neutral-500">Inquiries</div>
          <div className="text-xl font-bold text-neutral-900 tabular-nums">
            {consultationsList.length}
          </div>
        </div>
      </div>

      {/* Dynamic Section Views */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Management Table (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">
              Registered Agricultural User Accounts ({usersList.length})
            </h3>
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                  <tr>
                    <th className="py-2.5 px-3">Name & Role</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Mobile</th>
                    <th className="py-2.5 px-3 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-neutral-900 block">{u.name}</span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-[#14532D]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600 font-mono text-[11px]">{u.email}</td>
                      <td className="py-2.5 px-3 text-neutral-600">{u.district}, {u.state}</td>
                      <td className="py-2.5 px-3 text-neutral-600">{u.mobile}</td>
                      <td className="py-2.5 px-3 text-right text-neutral-400 text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Consultations Review (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900">
              Agronomic Inquiries Queue
            </h3>
            <div className="space-y-3">
              {consultationsList.slice(0, 4).map((c) => (
                <div key={c.id} className="p-3 bg-[#F8F7F0] rounded-lg border border-neutral-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 truncate">{c.subject}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 rounded">{c.status}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-2">{c.question}</p>
                  <div className="text-[10px] text-neutral-400 pt-1">
                    By {c.farmerName} · {c.cropRelated}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Section */}
      {activeSection === 'orders' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">
            Marketplace Fulfillment & Order Status Management
          </h3>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Farmer</th>
                  <th className="py-2.5 px-3">Total Amount</th>
                  <th className="py-2.5 px-3">Current Status</th>
                  <th className="py-2.5 px-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {ordersList.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-neutral-900">{o.id}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-neutral-800">{o.farmerName}</div>
                      <div className="text-[10px] text-neutral-500">{o.phone}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#14532D] tabular-nums">
                      ₹{o.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                        className="text-xs px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts Verification Section */}
      {activeSection === 'alerts' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">
            Agricultural Alert Moderation & Verification Hub
          </h3>
          <div className="space-y-3">
            {alertsList.map((alt) => (
              <div key={alt.id} className="p-4 rounded-lg border border-neutral-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900">{alt.title}</span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-semibold">
                      {alt.severity}
                    </span>
                    {alt.isVerified ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                        Pending Verification
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600">{alt.description}</p>
                  <div className="text-[10px] text-neutral-400">
                    Reported by: {alt.reportedBy} ({alt.district}, {alt.state})
                  </div>
                </div>

                <button
                  onClick={() => handleVerifyAlert(alt.id, alt.isVerified)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors shrink-0 ${
                    alt.isVerified
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                      : 'bg-[#14532D] text-white hover:bg-[#0f3e22]'
                  }`}
                >
                  {alt.isVerified ? 'Revoke Verification' : 'Verify for Region'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      {activeSection === 'products' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900">
              Marketplace Supply Catalog
            </h3>
            <button
              onClick={() => setIsNewProdOpen(true)}
              className="px-3 py-1.5 bg-[#14532D] text-white text-xs font-semibold rounded hover:bg-[#0f3e22] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Catalog Item</span>
            </button>
          </div>

          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500">
                <tr>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Price</th>
                  <th className="py-2.5 px-3">Seller</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {productsList.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-3 font-bold text-neutral-900">{p.name}</td>
                    <td className="py-2.5 px-3 text-neutral-600">{p.category}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#14532D] tabular-nums">
                      ₹{p.price.toLocaleString('en-IN')} / {p.unit}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600">{p.sellerName}</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm('Delete catalog item?')) {
                            StorageService.deleteProduct(p.id);
                            loadAllData();
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Product Modal */}
          {isNewProdOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-neutral-200 p-6 space-y-4">
                <h3 className="text-base font-bold text-neutral-900">Add Supply Product</h3>
                <form onSubmit={handleCreateProduct} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Zinc Sulphate Heptahydrate"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 border border-neutral-300 rounded"
                      >
                        <option value="Seeds">Seeds</option>
                        <option value="Fertilizers">Fertilizers</option>
                        <option value="Farming tools">Farming tools</option>
                        <option value="Irrigation equipment">Irrigation equipment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs px-3 py-2 border border-neutral-300 rounded"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Packaging Unit</label>
                    <input
                      type="text"
                      required
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      placeholder="e.g. 50 kg bag / 1 Litre"
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Seller Organization</label>
                    <input
                      type="text"
                      required
                      value={newProdSeller}
                      onChange={(e) => setNewProdSeller(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsNewProdOpen(false)}
                      className="px-3 py-1.5 text-xs border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#14532D] text-white text-xs font-semibold rounded"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Forum Moderation Section */}
      {activeSection === 'forum' && (
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">
            Community Forum Moderation & Flagged Posts
          </h3>
          <div className="space-y-3">
            {postsList.map((p) => (
              <div key={p.id} className="p-4 rounded-lg border border-neutral-200 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900">{p.title}</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 rounded">{p.category}</span>
                    {p.isReported && (
                      <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                        Flagged by Farmer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{p.content}</p>
                  <div className="text-[10px] text-neutral-400 mt-1">
                    Author: {p.authorName} · {p.upvotes} upvotes · {p.commentsCount} comments
                  </div>
                </div>

                <button
                  onClick={() => handleDeletePost(p.id)}
                  className="px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold rounded flex items-center gap-1 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Post</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
