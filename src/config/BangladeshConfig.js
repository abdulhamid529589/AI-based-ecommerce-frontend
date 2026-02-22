// components/LocalizationConfig.js
// Configuration for Bangladeshi market adaptation

export const BangladeshConfig = {
  // CURRENCY SETTINGS
  currency: {
    code: 'BDT',
    symbol: '৳',
    name: 'Bangladeshi Taka',
    format: '{symbol}{amount}', // ৳1,000
    locale: 'bn-BD',
  },

  // PAYMENT METHODS (IN ORDER OF PRIORITY)
  paymentMethods: [
    {
      id: 'bkash',
      name: 'bKash',
      label: 'bKash মোবাইল ব্যাংকিং',
      description: 'দ্রুততম এবং সবচেয়ে জনপ্রিয় পদ্ধতি',
      icon: 'bkash-logo',
      transactionLimit: { min: 100, max: 50000 },
      processingTime: 'তাৎক্ষণিক',
      fee: 0,
      active: true,
      priority: 1,
    },
    {
      id: 'nagad',
      name: 'Nagad',
      label: 'Nagad ডিজিটাল ওয়ালেট',
      description: '২৫+ মিলিয়ন ব্যবহারকারী',
      icon: 'nagad-logo',
      transactionLimit: { min: 100, max: 100000 },
      processingTime: 'তাৎক্ষণিক',
      fee: 0,
      active: true,
      priority: 2,
    },
    {
      id: 'rocket',
      name: 'Rocket',
      label: 'Rocket মোবাইল মানি',
      description: 'পুরো পরিবারের জন্য সেবা',
      icon: 'rocket-logo',
      transactionLimit: { min: 100, max: 100000 },
      processingTime: 'তাৎক্ষণিক',
      fee: 0,
      active: true,
      priority: 3,
    },
    {
      id: 'creditcard',
      name: 'ক্রেডিট/ডেবিট কার্ড',
      label: 'ক্রেডিট বা ডেবিট কার্ড',
      description: 'সকল দেশীয় ব্যাংক সমর্থিত',
      icon: 'card-icon',
      transactionLimit: { min: 500, max: 1000000 },
      processingTime: '১-২ মিনিট',
      fee: 0,
      active: true,
      emi: true, // EMI available
      priority: 4,
    },
    {
      id: 'cod',
      name: 'ক্যাশ অন ডেলিভারি',
      label: 'ক্যাশ অন ডেলিভারি (COD)',
      description: 'পণ্য দেখে, টাকা দিয়ে নিন',
      icon: 'cod-icon',
      transactionLimit: { min: 0, max: 50000 },
      processingTime: 'ডেলিভারির সময়',
      fee: 0,
      active: true,
      priority: 5,
      popular: true, // Still popular in BD
    },
    {
      id: 'banktransfer',
      name: 'ব্যাংক ট্রান্সফার',
      label: 'সরাসরি ব্যাংক ট্রান্সফার',
      description: 'বড় পরিমাণ অর্ডারের জন্য',
      icon: 'bank-icon',
      transactionLimit: { min: 20000, max: 5000000 },
      processingTime: '১-২ ঘন্টা',
      fee: 0,
      active: true,
      priority: 6,
    },
  ],

  // DELIVERY ZONES
  deliveryZones: [
    {
      id: 'dhaka-metro',
      name: 'ঢাকা শহর',
      cities: ['Dhaka'],
      deliveryDays: 1,
      standardShipping: { cost: 50, days: 1 },
      expressShipping: { cost: 150, days: 'একই দিন' },
      freeShippingThreshold: 1500,
      message: 'আগামীকাল ডেলিভারি',
    },
    {
      id: 'major-cities',
      name: 'প্রধান শহর',
      cities: ['Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal'],
      deliveryDays: 2,
      standardShipping: { cost: 200, days: '2-3 দিন' },
      expressShipping: { cost: 400, days: '1-2 দিন' },
      freeShippingThreshold: 2000,
      message: '২-৩ দিনের মধ্যে ডেলিভারি',
    },
    {
      id: 'secondary-towns',
      name: 'অন্যান্য এলাকা',
      deliveryDays: 3,
      standardShipping: { cost: 300, days: '3-5 দিন' },
      expressShipping: { cost: 600, days: '2-3 দিন' },
      freeShippingThreshold: 2500,
      message: '৩-৫ দিনের মধ্যে ডেলিভারি',
    },
  ],

  // SEASONAL CAMPAIGNS
  seasonalCampaigns: [
    {
      id: 'pohela-boishakh',
      name: 'পহেলা বৈশাখ',
      enName: 'Bengali New Year',
      date: { month: 4, day: 14 }, // April 14
      startDate: { month: 4, day: 1 },
      endDate: { month: 4, day: 30 },
      discount: 'পর্যন্ত ৪০% ছাড়',
      colors: ['#FF6B6B', '#FFFFFF'], // Red & White
      message: 'নতুন বছরের সাথে নতুন শপিং',
      topProducts: ['clothing', 'jewelry', 'home-decor'],
      featured: true,
    },
    {
      id: 'eid-fitr',
      name: 'ঈদ-উল-ফিত্র',
      enName: 'Eid-ul-Fitr',
      duration: 'রমজানের পর',
      discount: 'পর্যন্ত ৪০% ছাড়',
      message: 'ঈদের জন্য বিশেষ সংগ্রহ',
      topProducts: ['formal-wear', 'jewelry', 'gifts'],
      paymentPlans: ['3-month-emi', '6-month-emi'],
      highlighted: true,
      popular: true,
    },
    {
      id: 'eid-adha',
      name: 'ঈদ-উল-আজহা',
      enName: 'Eid-ul-Adha',
      duration: 'হজের দিন থেকে',
      discount: 'পর্যন্ত ৪০% ছাড়',
      message: 'পরিবারের সাথে উদযাপন করুন',
      topProducts: ['clothing', 'home-items', 'gifts'],
      paymentPlans: ['3-month-emi', '6-month-emi'],
      highlighted: true,
      popular: true,
    },
    {
      id: 'independence-day',
      name: 'স্বাধীনতা দিবস',
      enName: 'Independence Day',
      date: { month: 3, day: 26 }, // March 26
      discount: '২০-৩০% ছাড়',
      colors: ['#27AE60', '#FF6B6B'], // Green & Red
      message: 'স্বাধীন দিনে স্বাধীন শপিং',
      featured: true,
    },
    {
      id: 'summer-sale',
      name: 'গ্রীষ্মকালীন সংগ্রহ',
      enName: 'Summer Collection',
      startDate: { month: 4, day: 1 },
      endDate: { month: 9, day: 30 },
      discount: '২০-৩৫% ছাড়',
      message: 'গরমে রাহত - হালকা পোশাক এবং আরও অনেক কিছু',
      topProducts: ['summer-clothing', 'cooling-products'],
      featured: true,
    },
    {
      id: 'new-year-academic',
      name: 'নতুন শিক্ষা বর্ষ',
      enName: 'Academic Year Start',
      startDate: { month: 8, day: 1 },
      endDate: { month: 8, day: 31 },
      discount: '৩০-৫০% ছাড়',
      message: 'স্কুল ও কলেজ শপিং - সবকিছুতে বিশাল ছাড়',
      topProducts: ['uniforms', 'bags', 'shoes', 'books'],
      bundles: true,
      featured: true,
    },
  ],

  // COURIER PARTNERS
  couriers: [
    { id: 'sundarban', name: 'সুন্দরবন কুরিয়ার', coverage: 'All Bangladesh' },
    { id: 'steadfast', name: 'স্টেডফাস্ট কুরিয়ার', coverage: 'All Bangladesh' },
    { id: 'paperfly', name: 'পেপারফ্লাই', coverage: 'All Bangladesh' },
    { id: 'redx', name: 'রেডএক্স লজিস্টিক্স', coverage: 'All Bangladesh' },
    { id: 'etim', name: 'ই-টিআইএম', coverage: 'All Bangladesh' },
  ],

  // BENGALI MESSAGING
  messages: {
    welcome: 'স্বাগতম!',
    addToCart: 'কার্টে যোগ করুন',
    buyNow: 'এখনই কিনুন',
    checkout: 'চেকআউট করুন',
    continueShipping: 'শিপিং চালিয়ে যান',
    selectPayment: 'পেমেন্ট পদ্ধতি নির্বাচন করুন',
    confirmOrder: 'অর্ডার নিশ্চিত করুন',
    orderConfirmed: 'আপনার অর্ডার নিশ্চিত করা হয়েছে ✓',
    trackOrder: 'আপনার অর্ডার ট্র্যাক করুন',
    returnPolicy: '৩০ দিনের সহজ রিটার্ন নীতি',
    freeShipping: 'বিনামূল্যে শিপিং',
    moneyBackGuarantee: 'মানি-ব্যাক গ্যারান্টি',
    securepayment: 'সম্পূর্ণ নিরাপদ পেমেন্ট',
    customerSupport: '২৪/৭ গ্রাহক সহায়তা',
    language: 'বাংলা ভাষায় সেবা',
  },

  // PRICE RANGES (For filtering)
  priceRanges: [
    { id: '0-1000', label: '৳০-৳১,০০০', min: 0, max: 1000, tag: 'বাজেট সংবেদনশীল' },
    { id: '1000-5000', label: '৳১,০০০-৳৫,০০০', min: 1000, max: 5000, tag: 'মিড-রেঞ্জ' },
    { id: '5000-10000', label: '৳৫,০০০-৳১০,০০০', min: 5000, max: 10000, tag: 'প্রিমিয়াম' },
    { id: '10000-50000', label: '৳১০,০০০-৳৫০,০০০', min: 10000, max: 50000, tag: 'লাক্সারি' },
    { id: '50000+', label: '৳৫০,০০০+', min: 50000, max: Infinity, tag: 'আলট্রা-প্রিমিয়াম' },
  ],

  // SOCIAL PROOF MESSAGES
  socialProof: {
    totalCustomers: '৫ লাখ+ সন্তুষ্ট গ্রাহক',
    monthlyOrders: '৫০,০০০+ মাসিক অর্ডার',
    avgRating: '৪.৮ তারকা রেটিং',
    returnRate: '৯৯% ডেলিভারি সফলতা',
    coverageMessage: 'ঢাকা থেকে সিলেট - সর্বত্র ডেলিভারি',
  },

  // PRIORITY FEATURES FOR BANGLADESH
  features: [
    'মোবাইল-ফার্স্ট ডিজাইন',
    'স্থানীয় পেমেন্ট পদ্ধতি',
    'কমিউনিটি রিভিউ সিস্টেম',
    'সহজ রিটার্ন প্রক্রিয়া',
    'লাইভ চ্যাট সাপোর্ট',
    'পুশ নোটিফিকেশন সতর্কতা',
    'এসএমএস অর্ডার আপডেট',
  ],
}

export default BangladeshConfig
