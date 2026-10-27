export type Language = 'en' | 'hi';

export const translations = {
  en: {
    appName: 'AgriTech',
    appTagline: 'Grow Smarter. Farm Better.',
    appSubhead: 'Digital technology to empower Indian farmers with precision weather insights, soil fertility analysis, crop monitoring, pest alerts, and peer-to-peer knowledge sharing.',
    
    // Navigation
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      farms: 'My Farms',
      crops: 'Crops',
      weather: 'Weather',
      soil: 'Soil Health',
      pests: 'Pest Alerts',
      market: 'Marketplace',
      expert: 'Consult Experts',
      forum: 'Community',
      notifications: 'Notifications',
      admin: 'Admin Console',
      docs: 'Project Specs & API',
      login: 'Sign In',
      register: 'Register',
      logout: 'Sign Out',
      profile: 'Farmer Profile',
      cart: 'Cart',
      modeLiveDemo: 'Demo Mode (Simulated DB)',
    },

    // Landing Page
    landing: {
      heroTitle: 'Grow Smarter. Farm Better.',
      heroDesc: 'India’s modern agricultural intelligence platform. Bridge ancient farming wisdom with digital soil analysis, micro-climate weather forecasts, and certified farm resource procurement.',
      getStarted: 'Get Started Free',
      exploreFeatures: 'Explore Features',
      viewDemoFarmer: 'Explore Demo Farmer Dashboard',
      viewAdmin: 'Switch to Admin View',
      
      kpiFarmers: '18,500+',
      kpiFarmersLabel: 'Indian Farmers Supported',
      kpiAcres: '42,000+',
      kpiAcresLabel: 'Acres Managed Digitally',
      kpiYield: '28%',
      kpiYieldLabel: 'Average Yield Loss Prevented',
      kpiAccuracy: '94%',
      kpiAccuracyLabel: 'Forecast & Advisory Relevance',

      featuresHeading: 'Engineered for Real Indian Agricultural Challenges',
      featuresSub: 'From smallholders in Maharashtra to wheat cultivators in Punjab, every tool is designed for practical farm viability.',

      featWeatherTitle: 'Hyper-Local Weather Forecasts',
      featWeatherDesc: 'Live hourly temperatures, monsoon rain probabilities, and humidity alerts directly keyed to your taluka/district coordinates.',

      featSoilTitle: 'Laboratory Soil Health Interpretation',
      featSoilDesc: 'Enter N-P-K, pH, and organic carbon test values. Receive clear educational management guides without misleading diagnostic promises.',

      featCropTitle: 'Crop Growth & Stage Monitoring',
      featCropDesc: 'Track days since sowing, growth milestones (vegetative, flowering, ripening), and schedule irrigation & fertilization logs.',

      featPestTitle: 'Verified Regional Pest Alerts',
      featPestDesc: 'Early alerts for Fall Armyworm, Yellow Rust, and Bollworm. Distinguish between official agricultural university notices and peer observations.',

      howItWorksTitle: 'How AgriTech Works',
      step1Title: '1. Register Your Farms',
      step1Desc: 'Add plot dimensions, soil profile, and irrigation system (drip, canal, tube well).',
      step2Title: '2. Track Active Crops',
      step2Desc: 'Monitor sowing dates, variety genetics, and receive timely developmental alerts.',
      step3Title: '3. Optimize Inputs & Market',
      step3Desc: 'Analyze soil values, book verified agricultural scientists, and buy genuine certified farm supplies.',

      sustainableTitle: 'Commitment to Sustainable Indian Agriculture',
      sustainableDesc: 'AgriTech actively promotes water-use efficiency through drip scheduling, balanced NPK application to preserve soil microbiomes, and biological pest deterrence.',

      footerTagline: 'Empowering India’s farming backbone through accessible, evidence-backed software.',
      footerRights: 'All rights reserved. Designed for academic and mentor review.',
      footerDemoNotice: 'Demo Mode: All data persisted in client storage. Standalone MongoDB backend included in /backend.',
    },

    // Dashboard
    dashboard: {
      title: 'Farmer Dashboard',
      subtitle: 'Welcome back',
      totalFarms: 'Total Farms',
      activeCrops: 'Active Crops',
      upcomingTasks: 'Pending Activities',
      activeAlerts: 'Pest Warnings',
      soilSummary: 'Soil Status',
      quickActions: 'Quick Farm Actions',
      addFarm: 'Add Farm',
      registerCrop: 'Register Crop',
      testSoil: 'Log Soil Test',
      checkWeather: 'Check Weather',
      cropHealthOverview: 'Crop Health Overview',
      recentActivities: 'Recent Farm Log',
      weeklyForecast: '7-Day Rain & Temperature Trend',
      viewAll: 'View All',
      noCropsYet: 'No active crops logged yet. Add your first crop to track progress.',
    },

    // Common Buttons & Labels
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      submit: 'Submit',
      search: 'Search...',
      filter: 'Filter',
      status: 'Status',
      actions: 'Actions',
      date: 'Date',
      all: 'All',
      loading: 'Loading...',
      confirmDelete: 'Are you sure you want to delete this record?',
      yes: 'Yes, Delete',
      no: 'Cancel',
      success: 'Operation completed successfully.',
      error: 'An error occurred. Please try again.',
    }
  },

  hi: {
    appName: 'एग्रीटेक (AgriTech)',
    appTagline: 'स्मार्ट खेती, बेहतर पैदावार।',
    appSubhead: 'भारतीय किसानों के लिए डिजिटल कृषि प्रबंधन प्रणाली: सटीक मौसम पूर्वानुमान, मिट्टी की उर्वरता विश्लेषण, फसल निगरानी, कीट चेतावनी और विशेषज्ञ सलाह।',
    
    // Navigation
    nav: {
      home: 'होम',
      dashboard: 'डैशबोर्ड',
      farms: 'मेरे खेत',
      crops: 'फसलें',
      weather: 'मौसम',
      soil: 'मृदा स्वास्थ्य',
      pests: 'कीट चेतावनियाँ',
      market: 'कृषि बाज़ार',
      expert: 'विशेषज्ञ सलाह',
      forum: 'किसान चौपाल',
      notifications: 'सूचनाएं',
      admin: 'व्यवस्थापक',
      docs: 'प्रोजेक्ट विवरण',
      login: 'लॉग इन',
      register: 'पंजीकरण',
      logout: 'लॉग आउट',
      profile: 'प्रोफ़ाइल',
      cart: 'कार्ट',
      modeLiveDemo: 'डेमो मोड (सुरक्षित स्टोरेज)',
    },

    // Landing Page
    landing: {
      heroTitle: 'स्मार्ट खेती, बेहतर पैदावार।',
      heroDesc: 'भारत का अग्रणी डिजिटल कृषि मंच। वैज्ञानिक मिट्टी परीक्षण, स्थानीय मौसम पूर्वानुमान और समय पर कीट रोकथाम के साथ फसल की उपज बढ़ाएँ।',
      getStarted: 'शुरुआत करें',
      exploreFeatures: 'सुविधाएं देखें',
      viewDemoFarmer: 'किसान डेमो डैशबोर्ड देखें',
      viewAdmin: 'एडमिन कंसोल देखें',
      
      kpiFarmers: '18,500+',
      kpiFarmersLabel: 'संबद्ध भारतीय किसान',
      kpiAcres: '42,000+',
      kpiAcresLabel: 'डिजिटल रूप से प्रबंधित रकबा (एकड़)',
      kpiYield: '28%',
      kpiYieldLabel: 'फसल नुकसान में कमी',
      kpiAccuracy: '94%',
      kpiAccuracyLabel: 'पूर्वानुमान एवं सलाह सटीकता',

      featuresHeading: 'भारतीय किसानों की वास्तविक ज़रूरतों के लिए निर्मित',
      featuresSub: 'पंजाब के गेहूँ उत्पादकों से लेकर महाराष्ट्र के बागवानों तक, हर सुविधा जमीनी स्तर पर व्यावहारिक है।',

      featWeatherTitle: 'सटीक स्थानीय मौसम पूर्वानुमान',
      featWeatherDesc: 'अपने ज़िले और तहसील के अनुसार बारिश की संभावना, तापमान और हवा की गति का लाइव विवरण।',

      featSoilTitle: 'मृदा स्वास्थ्य कार्ड एवं सुझाव',
      featSoilDesc: 'नाइट्रोजन, फास्फोरस, पोटाश और पीएच दर्ज करें। उर्वरक प्रबंधन के वैज्ञानिक सुझाव प्राप्त करें।',

      featCropTitle: 'फसल विकास एवं अवस्था निगरानी',
      featCropDesc: 'बुवाई से कटाई तक के दिन, वानस्पतिक और पुष्पन अवस्था पर नज़र रखें और सिंचाई लॉग दर्ज करें।',

      featPestTitle: 'सत्यापित कीट एवं रोग अलर्ट',
      featPestDesc: 'फॉल आर्मीवॉर्म और रतुआ रोग से पूर्व चेतावनी। कृषि विश्वविद्यालय द्वारा सत्यापित सूचनाएँ।',

      howItWorksTitle: 'एग्रीटेक कैसे काम करता है',
      step1Title: '१. अपना खेत जोड़ें',
      step1Desc: 'खेत का क्षेत्रफल, मिट्टी का प्रकार और सिंचाई साधन (ड्रिप/नहर/नलकूप) दर्ज करें।',
      step2Title: '२. फसल की जानकारी दर्ज करें',
      step2Desc: 'बुवाई की तारीख, किस्म और स्वास्थ्य की स्थिति पर नियमित नज़र रखें।',
      step3Title: '३. पैदावार बढ़ाएँ एवं विशेषज्ञ से जुड़ें',
      step3Desc: 'मिट्टी की रिपोर्ट देखें, कृषि वैज्ञानिकों से सवाल पूछें और प्रामाणिक खाद-बीज खरीदें।',

      sustainableTitle: 'टिकाऊ और प्राकृतिक खेती के प्रति प्रतिबद्धता',
      sustainableDesc: 'ड्रिप सिंचाई के माध्यम से जल संरक्षण और संतुलित उर्वरक प्रयोग से मिट्टी की जैविक ताकत को बनाए रखना।',

      footerTagline: 'सुलभ, वैज्ञानिक और व्यावहारिक तकनीक से भारतीय किसानों का सशक्तिकरण।',
      footerRights: 'सर्वाधिकार सुरक्षित। मेंटर और अकादमिक मूल्यांकन के लिए तैयार।',
      footerDemoNotice: 'डेमो मोड: ब्राउज़र स्टोरेज में सुरक्षित। /backend में सम्पूर्ण MongoDB कोड उपलब्ध है।',
    },

    // Dashboard
    dashboard: {
      title: 'किसान डैशबोर्ड',
      subtitle: 'स्वागत है',
      totalFarms: 'कुल खेत',
      activeCrops: 'सक्रिय फसलें',
      upcomingTasks: 'लंबित कार्य',
      activeAlerts: 'सक्रिय कीट अलर्ट',
      soilSummary: 'मिट्टी की स्थिति',
      quickActions: 'त्वरित कार्य',
      addFarm: 'नया खेत जोड़ें',
      registerCrop: 'फसल दर्ज करें',
      testSoil: 'मृदा परीक्षण जोड़ें',
      checkWeather: 'मौसम देखें',
      cropHealthOverview: 'फसल स्वास्थ्य अवलोकन',
      recentActivities: 'हालिया गतिविधियाँ',
      weeklyForecast: '7 दिवसीय वर्षा एवं तापमान पूर्वानुमान',
      viewAll: 'सभी देखें',
      noCropsYet: 'अभी तक कोई फसल दर्ज नहीं है। निगरानी शुरू करने के लिए नई फसल जोड़ें।',
    },

    // Common Buttons & Labels
    common: {
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      submit: 'जमा करें',
      search: 'खोजें...',
      filter: 'फ़िल्टर',
      status: 'स्थिति',
      actions: 'कार्रवाई',
      date: 'तारीख',
      all: 'सभी',
      loading: 'लोड हो रहा है...',
      confirmDelete: 'क्या आप वाकई इस रिकॉर्ड को हटाना चाहते हैं?',
      yes: 'हाँ, हटाएं',
      no: 'रद्द करें',
      success: 'कार्य सफलतापूर्वक पूरा हुआ।',
      error: 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
    }
  }
};
