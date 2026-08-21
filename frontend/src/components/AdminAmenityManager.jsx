import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Tv, 
  Utensils, 
  Speaker, 
  Video, 
  Car, 
  Layers, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Search
} from 'lucide-react';
import { api } from '../api/client';

export default function AdminAmenityManager({ onAmenitiesUpdated }) {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Audio / Visual & Tech',
    flat_fee: 0,
    hourly_fee: 0,
    icon: 'Sparkles',
    description: ''
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const res = await api.getAmenities();
      setAmenities(res.data || []);
      if (onAmenitiesUpdated) onAmenitiesUpdated();
    } catch (err) {
      console.error('Failed to load amenities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      category: 'Audio / Visual & Tech',
      flat_fee: 250,
      hourly_fee: 50,
      icon: 'Sparkles',
      description: ''
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category || 'Audio / Visual & Tech',
      flat_fee: item.flat_fee || 0,
      hourly_fee: item.hourly_fee || 0,
      icon: item.icon || 'Sparkles',
      description: item.description || ''
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}" from MongoDB database?`)) return;

    try {
      await api.deleteAmenity(item.id);
      fetchAmenities();
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    try {
      if (editingItem) {
        await api.updateAmenity(editingItem.id, formData);
      } else {
        await api.createAmenity(formData);
      }
      setIsModalOpen(false);
      fetchAmenities();
    } catch (err) {
      setModalError(err.message || 'Failed to save booking item');
    } finally {
      setModalLoading(false);
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Tv': return <Tv className="w-5 h-5 text-blue-600" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'Speaker': return <Speaker className="w-5 h-5 text-purple-600" />;
      case 'Video': return <Video className="w-5 h-5 text-rose-600" />;
      case 'Car': return <Car className="w-5 h-5 text-emerald-600" />;
      case 'Layers': return <Layers className="w-5 h-5 text-indigo-600" />;
      default: return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  const categories = [
    'Audio / Visual & Tech',
    'Catering & Beverage',
    'Staging & Lighting',
    'Staffing & Security',
    'Furniture & Decor'
  ];

  const filteredItems = amenities.filter((item) => {
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch =
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header KPI / Quick Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Add-on Items</span>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {amenities.length}
          </div>
          <p className="text-[11px] text-slate-500">
            Active in booking builder & pricing engine
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold uppercase tracking-wider">
            <span>Equipment & AV Tech</span>
            <Tv className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-950 font-mono">
            {amenities.filter(a => a.category?.includes('Audio') || a.category?.includes('Tech')).length}
          </div>
          <p className="text-[11px] text-purple-700">
            Displays, sound systems & robotic cameras
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-700 text-xs font-bold uppercase tracking-wider">
            <span>Hospitality & Staffing</span>
            <Utensils className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-950 font-mono">
            {amenities.filter(a => a.category?.includes('Catering') || a.category?.includes('Staffing')).length}
          </div>
          <p className="text-[11px] text-amber-700">
            Catering, baristas & valet teams
          </p>
        </div>
      </div>

      {/* Main Items Grid & Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                categoryFilter === 'ALL' ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Items ({amenities.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px] sm:min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full bg-white pl-9 pr-3 py-1.5 rounded-xl text-xs text-slate-900 border border-slate-200 font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Item Cards Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/80 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                      {getCategoryIcon(item.icon)}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {item.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description || 'Professional event service and add-on module.'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pricing</span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">
                      ${item.flat_fee}{item.hourly_fee > 0 ? ` + $${item.hourly_fee}/hr` : ' (Flat)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-xl text-slate-600 hover:bg-white hover:text-purple-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                      title="Edit Item Rates & Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteDeleteItem(item)}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 border border-rose-100 transition-colors cursor-pointer"
                      title="Delete Item from MongoDB"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 space-y-1">
              <Package className="w-8 h-8 mx-auto opacity-30" />
              <p className="text-xs">No booking items found matching criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingItem ? 'Edit Booking Item' : 'Add New Booking Item'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saves directly to MongoDB Atlas collection
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Item / Amenity Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. 4K Cinema Projector & Truss"
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Flat Setup Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.flat_fee}
                    onChange={(e) => setFormData({ ...formData, flat_fee: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hourly Fee ($/hr)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hourly_fee}
                    onChange={(e) => setFormData({ ...formData, hourly_fee: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Icon Style</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900 cursor-pointer"
                >
                  <option value="Sparkles">✨ Sparkles (General)</option>
                  <option value="Tv">📺 Screen / LED Display</option>
                  <option value="Utensils">🍽️ Catering / Dining</option>
                  <option value="Speaker">🔊 Sound & Audio</option>
                  <option value="Video">📹 Robotic Video & Streaming</option>
                  <option value="Car">🚗 Valet & Attendants</option>
                  <option value="Layers">🏛️ Staging & Decor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe included hardware, services, or equipment specifications..."
                  className="w-full bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{modalLoading ? 'Saving in MongoDB...' : editingItem ? 'Save Changes' : 'Add Item'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
