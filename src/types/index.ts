export type UserRole = 'farmer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  state: string;
  district: string;
  preferredLanguage: 'en' | 'hi';
  createdAt: string;
}

export type SoilType = 'Alluvial' | 'Black (Regur)' | 'Red & Yellow' | 'Laterite' | 'Sandy Loam' | 'Clay';
export type IrrigationMethod = 'Drip Irrigation' | 'Sprinkler System' | 'Canal / Furrow' | 'Tube Well' | 'Rainfed';

export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  state: string;
  district: string;
  area: number;
  areaUnit: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
  soilType: SoilType;
  irrigationMethod: IrrigationMethod;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type CropGrowthStage = 'Sowing / Germination' | 'Vegetative Growth' | 'Flowering & Tillering' | 'Maturity / Ripening' | 'Harvest Ready';

export interface Crop {
  id: string;
  farmId: string;
  userId: string;
  name: string;
  variety: string;
  sowingDate: string;
  expectedHarvestDate: string;
  cultivatedArea: number;
  growthStage: CropGrowthStage;
  irrigationSchedule: string;
  fertilizerDetails: string;
  notes: string;
  healthStatus: 'Excellent' | 'Good' | 'Attention Needed' | 'Critical';
  imagePlaceholder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmActivity {
  id: string;
  cropId?: string;
  farmId: string;
  userId: string;
  activityType: 'Irrigation' | 'Fertilizer Application' | 'Pesticide Spray' | 'Weeding' | 'Pruning' | 'Harvesting' | 'Soil Tillage';
  description: string;
  activityDate: string;
  cost?: number;
  createdAt: string;
}

export interface SoilReport {
  id: string;
  farmId: string;
  userId: string;
  testedDate: string;
  ph: number; // reference: 6.0 - 7.5
  nitrogen: number; // kg/ha (low < 280, medium 280-560, high > 560)
  phosphorus: number; // kg/ha (low < 10, medium 10-25, high > 25)
  potassium: number; // kg/ha (low < 120, medium 120-280, high > 280)
  moisturePercent: number; // %
  organicCarbonPercent: number; // % (low < 0.5, medium 0.5-0.75, high > 0.75)
  cropCultivated: string;
  soilType: SoilType;
  notes?: string;
  createdAt: string;
}

export type AlertSeverity = 'Informational' | 'Low' | 'Medium' | 'High';

export interface AgriculturalAlert {
  id: string;
  title: string;
  crop: string;
  state: string;
  district: string;
  severity: AlertSeverity;
  symptoms: string;
  description: string;
  preventiveMeasures: string;
  isVerified: boolean;
  reportedBy: string;
  reportedByRole: UserRole;
  reportedDate: string;
}

export type ProductCategory = 'Seeds' | 'Fertilizers' | 'Farming tools' | 'Irrigation equipment' | 'Crop Protection';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  stock: number;
  rating: number;
  description: string;
  imageUrl?: string;
  sellerName: string;
  certifiedOrganic?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  farmerName: string;
  shippingAddress: string;
  phone: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Pay on Delivery (Demo)' | 'Kisan Credit / UPI (Simulated)';
  orderDate: string;
  estimatedDeliveryDate: string;
}

export type ExpertSpecialization = 'Soil Science' | 'Crop Management' | 'Horticulture' | 'Irrigation & Water' | 'Pest & Disease Control';

export interface Expert {
  id: string;
  name: string;
  specialization: ExpertSpecialization;
  organization: string;
  experienceYears: number;
  qualification: string;
  location: string;
  languages: string[];
  avatarUrl?: string;
  isAvailable: boolean;
}

export interface Consultation {
  id: string;
  userId: string;
  farmerName: string;
  expertId: string;
  expertName: string;
  subject: string;
  cropRelated?: string;
  question: string;
  status: 'Pending' | 'In Review' | 'Answered' | 'Closed';
  response?: string;
  answeredAt?: string;
  createdAt: string;
}

export type ForumCategory = 
  | 'Crop Management'
  | 'Soil Health'
  | 'Irrigation'
  | 'Pest Control'
  | 'Farming Equipment'
  | 'Government Schemes'
  | 'General Discussion';

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  category: ForumCategory;
  title: string;
  content: string;
  upvotes: number;
  upvotedBy: string[];
  commentsCount: number;
  isReported: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'weather' | 'pest' | 'crop' | 'order' | 'consultation' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface WeatherDayForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  weatherDescription: string;
  rainProbability: number;
  precipitationMm: number;
  windSpeedKmh: number;
  humidityPercent: number;
}

export interface LiveWeatherData {
  locationName: string;
  state: string;
  latitude: number;
  longitude: number;
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  condition: string;
  conditionCode: number;
  soilMoistureEst: number;
  lastUpdated: string;
  forecast: WeatherDayForecast[];
  advisory: string[];
}
