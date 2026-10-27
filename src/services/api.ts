import axios from 'axios';
import { StorageService } from './storageService';
import { 
  User, Farm, Crop, FarmActivity, SoilReport, AgriculturalAlert, 
  Product, Order, Consultation, ForumPost, ForumComment, NotificationItem 
} from '../types';

// Detect whether backend is reachable
const BACKEND_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: BACKEND_URL || '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('agritech_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Artificial delay for realistic UI loading states in demo/client mode
const delay = (ms = 180) => new Promise(res => setTimeout(res, ms));

export const Api = {
  // Auth
  async login(email: string, role: 'farmer' | 'admin'): Promise<{ user: User; token: string }> {
    await delay();
    const users = StorageService.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // If demo role chosen, select suitable demo user
      if (role === 'admin') {
        user = users.find(u => u.role === 'admin') || users[0];
      } else {
        user = users.find(u => u.role === 'farmer') || users[0];
      }
    }
    const token = `jwt_simulated_${user.id}_${Date.now()}`;
    localStorage.setItem('agritech_jwt_token', token);
    StorageService.setCurrentUser(user);
    return { user, token };
  },

  async register(userData: Omit<User, 'id' | 'createdAt'>): Promise<{ user: User; token: string }> {
    await delay();
    const user = StorageService.registerUser(userData);
    const token = `jwt_simulated_${user.id}_${Date.now()}`;
    localStorage.setItem('agritech_jwt_token', token);
    return { user, token };
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(50);
    return StorageService.getCurrentUser();
  },

  async logout(): Promise<void> {
    localStorage.removeItem('agritech_jwt_token');
    StorageService.setCurrentUser(null);
  },

  // Farms
  async getFarms(userId?: string): Promise<Farm[]> {
    await delay();
    return StorageService.getFarms(userId);
  },

  async createFarm(data: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Farm> {
    await delay();
    return StorageService.addFarm(data);
  },

  async updateFarm(id: string, updates: Partial<Farm>, userId: string): Promise<Farm> {
    await delay();
    return StorageService.updateFarm(id, updates, userId);
  },

  async deleteFarm(id: string, userId: string): Promise<void> {
    await delay();
    StorageService.deleteFarm(id, userId);
  },

  // Crops
  async getCrops(userId?: string): Promise<Crop[]> {
    await delay();
    return StorageService.getCrops(userId);
  },

  async createCrop(data: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>): Promise<Crop> {
    await delay();
    return StorageService.addCrop(data);
  },

  async updateCrop(id: string, updates: Partial<Crop>, userId: string): Promise<Crop> {
    await delay();
    return StorageService.updateCrop(id, updates, userId);
  },

  async deleteCrop(id: string, userId: string): Promise<void> {
    await delay();
    StorageService.deleteCrop(id, userId);
  },

  // Activities
  async getActivities(userId?: string): Promise<FarmActivity[]> {
    await delay();
    return StorageService.getActivities(userId);
  },

  async createActivity(data: Omit<FarmActivity, 'id' | 'createdAt'>): Promise<FarmActivity> {
    await delay();
    return StorageService.addActivity(data);
  },

  // Soil
  async getSoilReports(userId?: string): Promise<SoilReport[]> {
    await delay();
    return StorageService.getSoilReports(userId);
  },

  async createSoilReport(data: Omit<SoilReport, 'id' | 'createdAt'>): Promise<SoilReport> {
    await delay();
    return StorageService.addSoilReport(data);
  },

  // Alerts
  async getAlerts(): Promise<AgriculturalAlert[]> {
    await delay();
    return StorageService.getAlerts();
  },

  async createAlert(data: Omit<AgriculturalAlert, 'id'>): Promise<AgriculturalAlert> {
    await delay();
    return StorageService.addAlert(data);
  },

  async verifyAlert(id: string, isVerified: boolean): Promise<void> {
    await delay();
    StorageService.verifyAlert(id, isVerified);
  },

  async deleteAlert(id: string): Promise<void> {
    await delay();
    StorageService.deleteAlert(id);
  },

  // Products & Orders
  async getProducts(): Promise<Product[]> {
    await delay();
    return StorageService.getProducts();
  },

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    await delay();
    return StorageService.addProduct(data);
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    await delay();
    return StorageService.updateProduct(id, updates);
  },

  async deleteProduct(id: string): Promise<void> {
    await delay();
    StorageService.deleteProduct(id);
  },

  async getOrders(userId?: string): Promise<Order[]> {
    await delay();
    return StorageService.getOrders(userId);
  },

  async createOrder(data: Omit<Order, 'id' | 'orderDate' | 'status'>): Promise<Order> {
    await delay();
    return StorageService.createOrder(data);
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    await delay();
    StorageService.updateOrderStatus(orderId, status);
  },

  // Consultations
  async getConsultations(userId?: string): Promise<Consultation[]> {
    await delay();
    return StorageService.getConsultations(userId);
  },

  async createConsultation(data: Omit<Consultation, 'id' | 'createdAt' | 'status'>): Promise<Consultation> {
    await delay();
    return StorageService.createConsultation(data);
  },

  async answerConsultation(id: string, response: string): Promise<void> {
    await delay();
    StorageService.answerConsultation(id, response);
  },

  // Forum
  async getForumPosts(): Promise<ForumPost[]> {
    await delay();
    return StorageService.getForumPosts();
  },

  async createForumPost(data: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy' | 'commentsCount' | 'isReported'>): Promise<ForumPost> {
    await delay();
    return StorageService.createForumPost(data);
  },

  async toggleUpvotePost(postId: string, userId: string): Promise<void> {
    StorageService.toggleUpvotePost(postId, userId);
  },

  async reportPost(postId: string): Promise<void> {
    StorageService.reportPost(postId);
  },

  async deleteForumPost(postId: string): Promise<void> {
    StorageService.deleteForumPost(postId);
  },

  async getForumComments(postId: string): Promise<ForumComment[]> {
    await delay();
    return StorageService.getForumComments(postId);
  },

  async createForumComment(data: Omit<ForumComment, 'id' | 'createdAt'>): Promise<ForumComment> {
    await delay();
    return StorageService.addForumComment(data);
  },

  // Notifications
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    return StorageService.getNotifications(userId);
  },

  async markNotificationRead(id: string): Promise<void> {
    StorageService.markNotificationAsRead(id);
  },

  async markAllNotificationsRead(userId: string): Promise<void> {
    StorageService.markAllNotificationsAsRead(userId);
  },
};
