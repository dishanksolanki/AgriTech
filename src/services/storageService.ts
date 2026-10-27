import { 
  User, Farm, Crop, FarmActivity, SoilReport, AgriculturalAlert, 
  Product, Order, Consultation, ForumPost, ForumComment, NotificationItem 
} from '../types';

const STORAGE_KEYS = {
  USERS: 'agritech_users_v1',
  CURRENT_USER: 'agritech_session_user_v1',
  FARMS: 'agritech_farms_v1',
  CROPS: 'agritech_crops_v1',
  ACTIVITIES: 'agritech_activities_v1',
  SOIL_REPORTS: 'agritech_soil_reports_v1',
  ALERTS: 'agritech_alerts_v1',
  PRODUCTS: 'agritech_products_v1',
  ORDERS: 'agritech_orders_v1',
  CONSULTATIONS: 'agritech_consultations_v1',
  FORUM_POSTS: 'agritech_forum_posts_v1',
  FORUM_COMMENTS: 'agritech_forum_comments_v1',
  NOTIFICATIONS: 'agritech_notifications_v1',
};

// Seed initial realistic data
function seedInitialData() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const initialUsers: User[] = [
      {
        id: 'usr-farmer-1',
        name: 'Ramesh Patel',
        email: 'ramesh.farmer@agritech.in',
        mobile: '+91 98250 12345',
        role: 'farmer',
        state: 'Gujarat',
        district: 'Anand',
        preferredLanguage: 'en',
        createdAt: '2026-08-10T09:00:00Z',
      },
      {
        id: 'usr-farmer-2',
        name: 'Priya Sharma',
        email: 'priya.sharma@agritech.in',
        mobile: '+91 98140 54321',
        role: 'farmer',
        state: 'Punjab',
        district: 'Ludhiana',
        preferredLanguage: 'hi',
        createdAt: '2026-09-01T10:30:00Z',
      },
      {
        id: 'usr-admin-1',
        name: 'Dr. Rajesh Verma',
        email: 'admin@agritech.in',
        mobile: '+91 94120 99887',
        role: 'admin',
        state: 'New Delhi',
        district: 'Central Delhi',
        preferredLanguage: 'en',
        createdAt: '2026-07-01T08:00:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(initialUsers[0]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FARMS)) {
    const initialFarms: Farm[] = [
      {
        id: 'farm-101',
        userId: 'usr-farmer-1',
        name: 'Surya Ganga Organic Plot',
        location: 'Plot 4B, Vasad Road, Anand',
        state: 'Gujarat',
        district: 'Anand',
        area: 6.5,
        areaUnit: 'Acres',
        soilType: 'Sandy Loam',
        irrigationMethod: 'Drip Irrigation',
        description: 'Certified organic acreage equipped with solar-powered drip system and vermicompost pits.',
        createdAt: '2026-08-12T10:00:00Z',
        updatedAt: '2026-10-15T14:00:00Z',
      },
      {
        id: 'farm-102',
        userId: 'usr-farmer-1',
        name: 'Sardar Vallabhbhai Field No. 2',
        location: 'Khambhat Road, Tarapur Tehsil',
        state: 'Gujarat',
        district: 'Anand',
        area: 12.0,
        areaUnit: 'Acres',
        soilType: 'Alluvial',
        irrigationMethod: 'Canal / Furrow',
        description: 'Primary cotton and pulse rotation field with Mahi canal water lift access.',
        createdAt: '2026-08-20T11:00:00Z',
        updatedAt: '2026-10-18T16:30:00Z',
      },
      {
        id: 'farm-201',
        userId: 'usr-farmer-2',
        name: 'Green Gold Basmati Farm',
        location: 'Village Jagraon, Ludhiana West',
        state: 'Punjab',
        district: 'Ludhiana',
        area: 18.0,
        areaUnit: 'Acres',
        soilType: 'Alluvial',
        irrigationMethod: 'Tube Well',
        description: 'High-yielding Basmati rice and wheat rotation field with laser-leveled terrain.',
        createdAt: '2026-09-05T09:00:00Z',
        updatedAt: '2026-10-20T12:00:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(initialFarms));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CROPS)) {
    const initialCrops: Crop[] = [
      {
        id: 'crop-301',
        farmId: 'farm-101',
        userId: 'usr-farmer-1',
        name: 'Sharbati Wheat',
        variety: 'GW-496 / WH-1105',
        sowingDate: '2026-09-12',
        expectedHarvestDate: '2027-01-25',
        cultivatedArea: 4.5,
        growthStage: 'Vegetative Growth',
        irrigationSchedule: 'Every 8 days via drip lateral (40 min per cycle)',
        fertilizerDetails: 'Neem-coated urea top-dress + liquid Bio-NPK via fertigation venturi',
        notes: 'Good germination rate of 92%. Tillering is dense with deep green leaf canopy.',
        healthStatus: 'Excellent',
        createdAt: '2026-09-12T12:00:00Z',
        updatedAt: '2026-10-24T10:00:00Z',
      },
      {
        id: 'crop-302',
        farmId: 'farm-102',
        userId: 'usr-farmer-1',
        name: 'BT Cotton',
        variety: 'Bollgard II Hybrid',
        sowingDate: '2026-07-28',
        expectedHarvestDate: '2026-12-15',
        cultivatedArea: 10.0,
        growthStage: 'Flowering & Tillering',
        irrigationSchedule: 'Canal release bi-weekly, supplemented with furrow soak',
        fertilizerDetails: 'Potash and DAP basal application, sprayed micronutrient chelated zinc',
        notes: 'Square formation stage. Pheromone traps installed at 5 units/acre for pink bollworm monitoring.',
        healthStatus: 'Good',
        createdAt: '2026-07-28T09:00:00Z',
        updatedAt: '2026-10-25T15:00:00Z',
      },
      {
        id: 'crop-401',
        farmId: 'farm-201',
        userId: 'usr-farmer-2',
        name: 'Pusa Basmati Rice',
        variety: 'Pusa 1509 Certified',
        sowingDate: '2026-07-10',
        expectedHarvestDate: '2026-11-05',
        cultivatedArea: 16.0,
        growthStage: 'Maturity / Ripening',
        irrigationSchedule: 'Alternate wetting and drying (AWD) water management',
        fertilizerDetails: 'Zinc sulphate basal dose with recommended potassium muriate',
        notes: 'Panicles turning golden yellow. Preparing combine harvester for early November.',
        healthStatus: 'Excellent',
        createdAt: '2026-07-10T08:00:00Z',
        updatedAt: '2026-10-26T17:00:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(initialCrops));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    const initialActivities: FarmActivity[] = [
      {
        id: 'act-1',
        cropId: 'crop-301',
        farmId: 'farm-101',
        userId: 'usr-farmer-1',
        activityType: 'Irrigation',
        description: 'Drip fertigation cycle executed for 45 minutes with humic acid booster.',
        activityDate: '2026-10-26',
        cost: 350,
        createdAt: '2026-10-26T16:00:00Z',
      },
      {
        id: 'act-2',
        cropId: 'crop-302',
        farmId: 'farm-102',
        userId: 'usr-farmer-1',
        activityType: 'Pesticide Spray',
        description: 'Preventive neem seed kernel extract (NSKE 5%) spray applied across boll area.',
        activityDate: '2026-10-24',
        cost: 1200,
        createdAt: '2026-10-24T11:00:00Z',
      },
      {
        id: 'act-3',
        cropId: 'crop-301',
        farmId: 'farm-101',
        userId: 'usr-farmer-1',
        activityType: 'Weeding',
        description: 'Manual inter-row hoeing and weed clearing in wheat rows.',
        activityDate: '2026-10-21',
        cost: 1800,
        createdAt: '2026-10-21T14:00:00Z',
      },
      {
        id: 'act-4',
        cropId: 'crop-301',
        farmId: 'farm-101',
        userId: 'usr-farmer-1',
        activityType: 'Fertilizer Application',
        description: 'Secondary top-dressing of vermicompost enriched with Trichoderma.',
        activityDate: '2026-10-18',
        cost: 950,
        createdAt: '2026-10-18T10:00:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SOIL_REPORTS)) {
    const initialSoilReports: SoilReport[] = [
      {
        id: 'soil-501',
        farmId: 'farm-101',
        userId: 'usr-farmer-1',
        testedDate: '2026-09-08',
        ph: 6.9,
        nitrogen: 310,
        phosphorus: 24,
        potassium: 220,
        moisturePercent: 36,
        organicCarbonPercent: 0.72,
        cropCultivated: 'Sharbati Wheat',
        soilType: 'Sandy Loam',
        notes: 'Tested at Anand Agricultural University (AAU) Soil Testing Lab. Balanced N-P-K profile.',
        createdAt: '2026-09-09T09:00:00Z',
      },
      {
        id: 'soil-502',
        farmId: 'farm-102',
        userId: 'usr-farmer-1',
        testedDate: '2026-07-15',
        ph: 7.8,
        nitrogen: 240,
        phosphorus: 14,
        potassium: 195,
        moisturePercent: 28,
        organicCarbonPercent: 0.45,
        cropCultivated: 'BT Cotton',
        soilType: 'Alluvial',
        notes: 'Mildly alkaline pH with lower organic carbon. Recommended green manuring with Dhaincha.',
        createdAt: '2026-07-16T11:00:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(initialSoilReports));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ALERTS)) {
    const initialAlerts: AgriculturalAlert[] = [
      {
        id: 'alert-601',
        title: 'Pink Bollworm (Pectinophora gossypiella) Threat',
        crop: 'Cotton',
        state: 'Gujarat',
        district: 'Anand & Vadodara',
        severity: 'High',
        symptoms: 'Rosetted flowers, premature boll dropping, boreholes with frass on young green bolls.',
        description: 'Agricultural monitoring stations report above-threshold catches in pheromone traps (more than 8 moths/trap/night for 3 consecutive nights).',
        preventiveMeasures: 'Install delta pheromone traps at 5 per acre. Avoid broad-spectrum synthetic pyrethroids. Apply neem oil 1500 ppm or release Trichogramma egg parasitoids.',
        isVerified: true,
        reportedBy: 'State Department of Agriculture & AAU Extension',
        reportedByRole: 'admin',
        reportedDate: '2026-10-24',
      },
      {
        id: 'alert-602',
        title: 'Yellow Rust (Puccinia striiformis) Vigilance',
        crop: 'Wheat',
        state: 'Punjab',
        district: 'Ludhiana & Hoshiarpur',
        severity: 'Medium',
        symptoms: 'Yellow-orange pustules arranged in linear stripes on the upper leaf surface; powder rubs off easily.',
        description: 'Recent cold morning dew and intermittent overcast skies create high humidity favorable for stripe rust spores spreading from sub-mountainous tracts.',
        preventiveMeasures: 'Regularly scout border rows. If yellow stripes appear on leaves, spray Propiconazole 25% EC @ 200 ml per 200 L of water on sunny afternoons.',
        isVerified: true,
        reportedBy: 'PAU Crop Protection Cell',
        reportedByRole: 'admin',
        reportedDate: '2026-10-22',
      },
      {
        id: 'alert-603',
        title: 'Aphid / Sucking Pest Infestation in Mustard',
        crop: 'Mustard & Brassica',
        state: 'Rajasthan',
        district: 'Jaipur & Alwar',
        severity: 'Low',
        symptoms: 'Curling of tender shoot tips, sticky honeydew secretion, sooty mold growth.',
        description: 'Mild temperature drop has initiated early aphid colony clustering on flower buds.',
        preventiveMeasures: 'Yellow sticky cards at 10-12 per acre. Spray botanical neem oil or soap solution before flowering peak.',
        isVerified: false,
        reportedBy: 'Harish Gehlot (Farmer, Chomu)',
        reportedByRole: 'farmer',
        reportedDate: '2026-10-25',
      },
      {
        id: 'alert-604',
        title: 'Blast Disease (Magnaporthe oryzae) Prevention',
        crop: 'Rice / Paddy',
        state: 'Andhra Pradesh',
        district: 'Guntur & Krishna',
        severity: 'Medium',
        symptoms: 'Spindle-shaped elliptical lesions with gray centers and brown borders on leaves and neck nodes.',
        description: 'Prolonged night leaf wetness exceeding 9 hours documented by local Krishi Vigyan Kendra.',
        preventiveMeasures: 'Avoid excessive nitrogen split doses. Ensure proper water drainage. Apply Tricyclazole 75 WP as preventive shield if humidity remains > 90%.',
        isVerified: true,
        reportedBy: 'ANGRAU Research Station',
        reportedByRole: 'admin',
        reportedDate: '2026-10-20',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(initialAlerts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const initialProducts: Product[] = [
      {
        id: 'prod-1',
        name: 'Certified Sharbati Wheat Seeds (WH-1105)',
        category: 'Seeds',
        price: 1850,
        unit: '40 kg bag',
        stock: 120,
        rating: 4.8,
        description: 'High-gluten premium wheat seed with 92% certified germination rate. Drought-tolerant variety suitable for North & West India.',
        sellerName: 'National Seeds Corporation (NSC)',
        certifiedOrganic: false,
      },
      {
        id: 'prod-2',
        name: 'Organic Neem Seed Cake Fertilizer',
        category: 'Fertilizers',
        price: 920,
        unit: '50 kg bag',
        stock: 85,
        rating: 4.9,
        description: 'Pure cold-pressed neem cake rich in natural Azadirachtin. Controls soil nematodes and acts as slow-release organic nitrogen source.',
        sellerName: 'Gujarat Agro Organic Federation',
        certifiedOrganic: true,
      },
      {
        id: 'prod-3',
        name: 'Precision Inline Drip Lateral Tubing (16mm)',
        category: 'Irrigation equipment',
        price: 3450,
        unit: '500 meter roll',
        stock: 45,
        rating: 4.7,
        description: 'UV-stabilized virgin polymer tubing with pressure-compensating emitters spaced at 40cm. Delivers 2.4 LPH uniform discharge.',
        sellerName: 'Jain Micro Irrigation Systems',
        certifiedOrganic: false,
      },
      {
        id: 'prod-4',
        name: 'Lithium-Ion Dual-Motor Knapsack Sprayer (18L)',
        category: 'Farming tools',
        price: 2890,
        unit: 'Each',
        stock: 30,
        rating: 4.6,
        description: 'Equipped with 12V 12Ah lithium battery delivering 6 hours continuous spray. Includes telescopic stainless steel lance and 4 brass nozzles.',
        sellerName: 'Kisan Power Equipment Ltd',
        certifiedOrganic: false,
      },
      {
        id: 'prod-5',
        name: 'Liquid Bio-NPK Consortium Microbial Culture',
        category: 'Fertilizers',
        price: 480,
        unit: '1 Litre bottle',
        stock: 200,
        rating: 4.8,
        description: 'Contains Azotobacter, PSB (Phosphate Solubilizing Bacteria), and KMB (Potash Mobilizing Bacteria). Reduces chemical fertilizer need by up to 25%.',
        sellerName: 'ICAR-IARI Biological Labs',
        certifiedOrganic: true,
      },
      {
        id: 'prod-6',
        name: 'Handheld Digital Soil pH & Moisture Meter',
        category: 'Farming tools',
        price: 1350,
        unit: 'Each',
        stock: 60,
        rating: 4.5,
        description: 'Instant 2-in-1 dual probe for root zone acidity and soil moisture percentage. Battery-free galvanic sensor designed for field testing.',
        sellerName: 'AgroSense Scientific Instruments',
        certifiedOrganic: false,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    const initialOrders: Order[] = [
      {
        id: 'ORD-2026-8812',
        userId: 'usr-farmer-1',
        farmerName: 'Ramesh Patel',
        shippingAddress: 'Plot 4B, Vasad Road, Taluka Anand, Gujarat - 388001',
        phone: '+91 98250 12345',
        items: [
          {
            productId: 'prod-2',
            productName: 'Organic Neem Seed Cake Fertilizer',
            price: 920,
            quantity: 2,
            unit: '50 kg bag',
          },
          {
            productId: 'prod-5',
            productName: 'Liquid Bio-NPK Consortium Microbial Culture',
            price: 480,
            quantity: 3,
            unit: '1 Litre bottle',
          },
        ],
        totalAmount: 3280,
        status: 'Dispatched',
        paymentMethod: 'Pay on Delivery (Demo)',
        orderDate: '2026-10-24T14:30:00Z',
        estimatedDeliveryDate: '2026-10-29',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONSULTATIONS)) {
    const initialConsultations: Consultation[] = [
      {
        id: 'cns-701',
        userId: 'usr-farmer-1',
        farmerName: 'Ramesh Patel',
        expertId: 'exp-1',
        expertName: 'Dr. Arvind Deshmukh',
        subject: 'Zinc deficiency vs early blight symptoms on WH-1105 wheat',
        cropRelated: 'Sharbati Wheat',
        question: 'Some leaves in plot 4 show yellow interveinal chlorosis near the middle leaf canopy. Should we spray chelated zinc EDTA or copper oxychloride?',
        status: 'Answered',
        response: 'Based on your soil report showing neutral pH (6.9) and typical mid-canopy yellowing without brown necrotic lesions, this matches classic zinc deficiency rather than fungal blight. Recommend foliar spray of 0.5% Zinc Sulphate heptahydrate (500g in 100L water) along with 0.25% lime to neutralize acidity. Apply in early morning when stomata are open.',
        answeredAt: '2026-10-23T15:00:00Z',
        createdAt: '2026-10-22T08:30:00Z',
      },
      {
        id: 'cns-702',
        userId: 'usr-farmer-1',
        farmerName: 'Ramesh Patel',
        expertId: 'exp-3',
        expertName: 'Prof. K. Ramanathan',
        subject: 'Drip operating pressure drop in sandy loam plot',
        cropRelated: 'Vegetable & Fruit Garden',
        question: 'Pressure gauge at filter exit dropped from 2.2 bar to 1.4 bar over the last two weeks. What is the standard descaling protocol?',
        status: 'In Review',
        createdAt: '2026-10-26T10:15:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(initialConsultations));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FORUM_POSTS)) {
    const initialPosts: ForumPost[] = [
      {
        id: 'post-1',
        authorId: 'usr-farmer-1',
        authorName: 'Ramesh Patel',
        authorRole: 'farmer',
        category: 'Irrigation',
        title: 'Experiences with solar powered sub-surface drip in sandy loam?',
        content: 'We transitioned 6 acres of wheat to drip lateral irrigation this rabi season. Power cuts were common, so we coupled a 3HP solar pump with an automated cyclic timer. Water savings so far are around 35% compared to furrow flood irrigation.',
        upvotes: 18,
        upvotedBy: ['usr-farmer-2'],
        commentsCount: 3,
        isReported: false,
        createdAt: '2026-10-21T11:20:00Z',
      },
      {
        id: 'post-2',
        authorId: 'usr-admin-1',
        authorName: 'Dr. Rajesh Verma',
        authorRole: 'admin',
        category: 'Soil Health',
        title: 'Guidelines on managing soil salinity in irrigated canal commands',
        content: 'Prolonged canal irrigation without underground drainage leads to secondary salinization. Farmers in Anand and Ludhiana are encouraged to incorporate gypsum based on soil test exchangeable sodium percentage (ESP) and grow Sesbania green manure.',
        upvotes: 32,
        upvotedBy: ['usr-farmer-1', 'usr-farmer-2'],
        commentsCount: 2,
        isReported: false,
        createdAt: '2026-10-19T09:45:00Z',
      },
      {
        id: 'post-3',
        authorId: 'usr-farmer-2',
        authorName: 'Priya Sharma',
        authorRole: 'farmer',
        category: 'Government Schemes',
        title: 'Direct Seeding of Rice (DSR) subsidy verification in Punjab',
        content: 'For fellow paddy farmers in Ludhiana: The verification portal for Rs 1,500/acre DSR incentive is open. Ensure your satellite remote sensing plot coordinates match the revenue record.',
        upvotes: 24,
        upvotedBy: ['usr-farmer-1'],
        commentsCount: 4,
        isReported: false,
        createdAt: '2026-10-23T14:10:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(initialPosts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FORUM_COMMENTS)) {
    const initialComments: ForumComment[] = [
      {
        id: 'com-1',
        postId: 'post-1',
        authorId: 'usr-admin-1',
        authorName: 'Dr. Rajesh Verma',
        authorRole: 'admin',
        content: 'Great initiative Ramesh ji. In sandy loam, ensure pulse irrigation (3 shorter cycles per day) so moisture does not leach beyond root depth.',
        createdAt: '2026-10-21T14:00:00Z',
      },
      {
        id: 'com-2',
        postId: 'post-1',
        authorId: 'usr-farmer-2',
        authorName: 'Priya Sharma',
        authorRole: 'farmer',
        content: 'Did you also apply for the state micro-irrigation subsidy (GGRC in Gujarat)? How long did the physical inspection take?',
        createdAt: '2026-10-22T08:15:00Z',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.FORUM_COMMENTS, JSON.stringify(initialComments));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    const initialNotifications: NotificationItem[] = [
      {
        id: 'notif-1',
        userId: 'usr-farmer-1',
        type: 'weather',
        title: 'Microclimate Weather Advisory',
        message: 'No rain expected for next 4 days in Anand. Ideal time for scheduled drip fertigation.',
        isRead: false,
        timestamp: '2 hours ago',
      },
      {
        id: 'notif-2',
        userId: 'usr-farmer-1',
        type: 'pest',
        title: 'Regional Pest Alert: Pink Bollworm',
        message: 'High severity alert issued for cotton growers in Anand/Vadodara district. Check pheromone traps.',
        isRead: false,
        timestamp: 'Yesterday',
      },
      {
        id: 'notif-3',
        userId: 'usr-farmer-1',
        type: 'consultation',
        title: 'Expert Consultation Answered',
        message: 'Dr. Arvind Deshmukh replied to your inquiry regarding wheat zinc deficiency.',
        isRead: true,
        timestamp: '3 days ago',
      },
      {
        id: 'notif-4',
        userId: 'usr-farmer-1',
        type: 'order',
        title: 'Order ORD-2026-8812 Dispatched',
        message: 'Your order for Neem Cake and Bio-NPK has been dispatched via Kisan Logistics.',
        isRead: true,
        timestamp: '3 days ago',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
}

// Initialize on import
seedInitialData();

export const StorageService = {
  // Authentication & Users
  getUsers(): User[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },

  getCurrentUser(): User | null {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  registerUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return newUser;
  },

  updateProfile(userId: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');
    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    const curr = this.getCurrentUser();
    if (curr && curr.id === userId) {
      this.setCurrentUser(users[idx]);
    }
    return users[idx];
  },

  // Farms
  getFarms(userId?: string): Farm[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.FARMS);
    const farms: Farm[] = data ? JSON.parse(data) : [];
    if (!userId) return farms;
    return farms.filter(f => f.userId === userId);
  },

  getFarmById(id: string): Farm | undefined {
    return this.getFarms().find(f => f.id === id);
  },

  addFarm(farm: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>): Farm {
    const farms = this.getFarms();
    const newFarm: Farm = {
      ...farm,
      id: `farm-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    farms.unshift(newFarm);
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));
    return newFarm;
  },

  updateFarm(id: string, updates: Partial<Farm>, userId: string): Farm {
    const farms = this.getFarms();
    const idx = farms.findIndex(f => f.id === id && (f.userId === userId || this.isAdmin()));
    if (idx === -1) throw new Error('Farm not found or unauthorized');
    farms[idx] = { ...farms[idx], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(farms));
    return farms[idx];
  },

  deleteFarm(id: string, userId: string): void {
    const farms = this.getFarms();
    const filtered = farms.filter(f => !(f.id === id && (f.userId === userId || this.isAdmin())));
    localStorage.setItem(STORAGE_KEYS.FARMS, JSON.stringify(filtered));
  },

  // Crops
  getCrops(userId?: string): Crop[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.CROPS);
    const crops: Crop[] = data ? JSON.parse(data) : [];
    if (!userId) return crops;
    return crops.filter(c => c.userId === userId);
  },

  getCropById(id: string): Crop | undefined {
    return this.getCrops().find(c => c.id === id);
  },

  addCrop(crop: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>): Crop {
    const crops = this.getCrops();
    const newCrop: Crop = {
      ...crop,
      id: `crop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    crops.unshift(newCrop);
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
    return newCrop;
  },

  updateCrop(id: string, updates: Partial<Crop>, userId: string): Crop {
    const crops = this.getCrops();
    const idx = crops.findIndex(c => c.id === id && (c.userId === userId || this.isAdmin()));
    if (idx === -1) throw new Error('Crop not found or unauthorized');
    crops[idx] = { ...crops[idx], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(crops));
    return crops[idx];
  },

  deleteCrop(id: string, userId: string): void {
    const crops = this.getCrops();
    const filtered = crops.filter(c => !(c.id === id && (c.userId === userId || this.isAdmin())));
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(filtered));
  },

  // Activities
  getActivities(userId?: string): FarmActivity[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const acts: FarmActivity[] = data ? JSON.parse(data) : [];
    if (!userId) return acts;
    return acts.filter(a => a.userId === userId);
  },

  addActivity(activity: Omit<FarmActivity, 'id' | 'createdAt'>): FarmActivity {
    const acts = this.getActivities();
    const newAct: FarmActivity = {
      ...activity,
      id: `act-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    acts.unshift(newAct);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(acts));
    return newAct;
  },

  // Soil Reports
  getSoilReports(userId?: string): SoilReport[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.SOIL_REPORTS);
    const reports: SoilReport[] = data ? JSON.parse(data) : [];
    if (!userId) return reports;
    return reports.filter(r => r.userId === userId);
  },

  addSoilReport(report: Omit<SoilReport, 'id' | 'createdAt'>): SoilReport {
    const reports = this.getSoilReports();
    const newReport: SoilReport = {
      ...report,
      id: `soil-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.SOIL_REPORTS, JSON.stringify(reports));
    return newReport;
  },

  // Agricultural Alerts
  getAlerts(): AgriculturalAlert[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.ALERTS);
    return data ? JSON.parse(data) : [];
  },

  addAlert(alert: Omit<AgriculturalAlert, 'id'>): AgriculturalAlert {
    const alerts = this.getAlerts();
    const newAlert: AgriculturalAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
    };
    alerts.unshift(newAlert);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    return newAlert;
  },

  verifyAlert(id: string, isVerified: boolean): void {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex(a => a.id === id);
    if (idx !== -1) {
      alerts[idx].isVerified = isVerified;
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    }
  },

  deleteAlert(id: string): void {
    const alerts = this.getAlerts();
    const filtered = alerts.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(filtered));
  },

  // Products & Orders
  getProducts(): Product[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  addProduct(product: Omit<Product, 'id'>): Product {
    const prods = this.getProducts();
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    };
    prods.unshift(newProd);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
    return newProd;
  },

  updateProduct(id: string, updates: Partial<Product>): Product {
    const prods = this.getProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    prods[idx] = { ...prods[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(prods));
    return prods[idx];
  },

  deleteProduct(id: string): void {
    const prods = this.getProducts();
    const filtered = prods.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  },

  getOrders(userId?: string): Order[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const orders: Order[] = data ? JSON.parse(data) : [];
    if (!userId) return orders;
    return orders.filter(o => o.userId === userId);
  },

  createOrder(orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString(),
      status: 'Confirmed',
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Also dispatch a notification
    this.addNotification({
      userId: orderData.userId,
      type: 'order',
      title: `Order Placed: ${newOrder.id}`,
      message: `Your order for ₹${orderData.totalAmount.toLocaleString('en-IN')} has been confirmed. Estimated delivery by ${orderData.estimatedDeliveryDate}.`,
      isRead: false,
    });

    return newOrder;
  },

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  },

  // Consultations
  getConsultations(userId?: string): Consultation[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    const list: Consultation[] = data ? JSON.parse(data) : [];
    if (!userId) return list;
    return list.filter(c => c.userId === userId);
  },

  createConsultation(data: Omit<Consultation, 'id' | 'createdAt' | 'status'>): Consultation {
    const list = this.getConsultations();
    const newCns: Consultation = {
      ...data,
      id: `cns-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    list.unshift(newCns);
    localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(list));
    return newCns;
  },

  answerConsultation(id: string, response: string): void {
    const list = this.getConsultations();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx].response = response;
      list[idx].status = 'Answered';
      list[idx].answeredAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(list));

      this.addNotification({
        userId: list[idx].userId,
        type: 'consultation',
        title: 'Consultation Answered',
        message: `${list[idx].expertName} has replied to: "${list[idx].subject}"`,
        isRead: false,
      });
    }
  },

  // Forum
  getForumPosts(): ForumPost[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.FORUM_POSTS);
    return data ? JSON.parse(data) : [];
  },

  createForumPost(data: Omit<ForumPost, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy' | 'commentsCount' | 'isReported'>): ForumPost {
    const posts = this.getForumPosts();
    const newPost: ForumPost = {
      ...data,
      id: `post-${Date.now()}`,
      upvotes: 0,
      upvotedBy: [],
      commentsCount: 0,
      isReported: false,
      createdAt: new Date().toISOString(),
    };
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(posts));
    return newPost;
  },

  toggleUpvotePost(postId: string, userId: string): void {
    const posts = this.getForumPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (post.upvotedBy.includes(userId)) {
        post.upvotedBy = post.upvotedBy.filter(id => id !== userId);
        post.upvotes = Math.max(0, post.upvotes - 1);
      } else {
        post.upvotedBy.push(userId);
        post.upvotes += 1;
      }
      localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(posts));
    }
  },

  reportPost(postId: string): void {
    const posts = this.getForumPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.isReported = true;
      localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(posts));
    }
  },

  deleteForumPost(postId: string): void {
    const posts = this.getForumPosts();
    const filtered = posts.filter(p => p.id !== postId);
    localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(filtered));
  },

  getForumComments(postId: string): ForumComment[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.FORUM_COMMENTS);
    const comments: ForumComment[] = data ? JSON.parse(data) : [];
    return comments.filter(c => c.postId === postId);
  },

  addForumComment(data: Omit<ForumComment, 'id' | 'createdAt'>): ForumComment {
    const allData = localStorage.getItem(STORAGE_KEYS.FORUM_COMMENTS);
    const comments: ForumComment[] = allData ? JSON.parse(allData) : [];
    const newComment: ForumComment = {
      ...data,
      id: `com-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.FORUM_COMMENTS, JSON.stringify(comments));

    // increment post count
    const posts = this.getForumPosts();
    const p = posts.find(item => item.id === data.postId);
    if (p) {
      p.commentsCount = (p.commentsCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.FORUM_POSTS, JSON.stringify(posts));
    }

    return newComment;
  },

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    seedInitialData();
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: NotificationItem[] = data ? JSON.parse(data) : [];
    return list.filter(n => n.userId === userId);
  },

  markNotificationAsRead(id: string): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: NotificationItem[] = data ? JSON.parse(data) : [];
    const item = list.find(n => n.id === id);
    if (item) {
      item.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    }
  },

  markAllNotificationsAsRead(userId: string): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: NotificationItem[] = data ? JSON.parse(data) : [];
    list.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  addNotification(data: Omit<NotificationItem, 'id' | 'timestamp'>): void {
    const all = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list: NotificationItem[] = all ? JSON.parse(all) : [];
    list.unshift({
      ...data,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  // Helpers
  isAdmin(): boolean {
    const curr = this.getCurrentUser();
    return curr?.role === 'admin';
  },

  resetToDefaults(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    seedInitialData();
  }
};
