import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/storageService';
import { NotificationItem } from '../types';
import { 
  Bell, CheckCheck, CloudSun, AlertTriangle, 
  ShoppingBag, Users2, Info, ChevronRight 
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifs = () => {
    if (!user) return;
    setNotifications(StorageService.getNotifications(user.id));
  };

  useEffect(() => {
    loadNotifs();
  }, [user]);

  const handleMarkAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    loadNotifs();
  };

  const handleMarkAllRead = () => {
    if (!user) return;
    StorageService.markAllNotificationsAsRead(user.id);
    loadNotifs();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'weather':
        return <CloudSun className="w-4 h-4 text-blue-600" />;
      case 'pest':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'consultation':
        return <Users2 className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-neutral-500" />;
    }
  };

  const filtered = notifications.filter(n => filter === 'all' || !n.isRead);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Notifications & Advisories
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Real-time microclimate alerts, consultation replies, and order dispatch tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filter === 'unread' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Unread ({notifications.filter(n => !n.isRead).length})
            </button>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-lg hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden divide-y divide-neutral-100 shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-400">
            No notifications to display.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleMarkAsRead(item.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !item.isRead ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-white border border-neutral-200 shadow-2xs mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-neutral-900">{item.title}</h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#14532D]" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">{item.message}</p>
                  <span className="text-[10px] text-neutral-400 block pt-0.5">{item.timestamp}</span>
                </div>
              </div>

              {!item.isRead && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(item.id);
                  }}
                  className="text-[11px] text-[#14532D] font-semibold hover:underline shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
