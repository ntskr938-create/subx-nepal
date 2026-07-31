import { Product, PaymentDetails, FAQItem, LiveOrderFeed, Order, PromoPoster } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'gemini-ai',
    title: 'Google Gemini AI',
    brand: 'Google',
    category: 'AI Tools',
    description: 'Experience Google’s most capable AI model for writing, coding, brainstorming, and productivity.',
    iconBg: 'from-blue-600 via-indigo-600 to-purple-600',
    brandColor: '#4285F4',
    logoIcon: 'Sparkles',
    plans: [
      { id: 'gemini-1y', name: '1 Year Full Plan', duration: '1 Year', priceNpr: 1299, originalPriceNpr: 3999, popular: true },
      { id: 'gemini-6m', name: '6 Months Plan', duration: '6 Months', priceNpr: 799, originalPriceNpr: 2100 },
      { id: 'gemini-1m', name: '1 Month Starter', duration: '1 Month', priceNpr: 299, originalPriceNpr: 699 },
    ],
    selectedPlanId: 'gemini-1y',
    features: [
      'AI assistant with Gemini 1.5 Pro access',
      'Premium AI tools & multimodal analysis',
      'Cloud benefits & Google One 2TB integration',
      'Advanced coding assistance & file upload',
      '100% Genuine Private Account activation'
    ],
    stockStatus: 'Instant Auto-Deliver',
    badge: '🔥 BEST VALUE',
    deliveryTime: '5-15 mins',
    rating: 4.9,
    reviewsCount: 342,
    featured: true
  },
  {
    id: 'youtube-premium',
    title: 'YouTube Premium',
    brand: 'YouTube',
    category: 'Streaming',
    description: 'Watch your favorite creators without ads, download for offline viewing, and enjoy YouTube Music.',
    iconBg: 'from-red-600 to-rose-700',
    brandColor: '#FF0000',
    logoIcon: 'Youtube',
    plans: [
      { id: 'yt-1m', name: '1 Month', duration: '1 Month', priceNpr: 499, originalPriceNpr: 899, popular: true },
      { id: 'yt-6m', name: '6 Months Pass', duration: '6 Months', priceNpr: 2499, originalPriceNpr: 3500 },
      { id: 'yt-1y', name: '1 Year Annual Pass', duration: '1 Year', priceNpr: 4499, originalPriceNpr: 6000 },
    ],
    selectedPlanId: 'yt-1m',
    features: [
      'Ad-free video streaming across all devices',
      'Background play while using other apps',
      'Full access to YouTube Music Premium',
      'Offline video & music downloads in full HD',
      'Works on your own personal Google email'
    ],
    stockStatus: 'In Stock',
    badge: '⭐ TOP SELLER',
    deliveryTime: '5-15 mins',
    rating: 5.0,
    reviewsCount: 890,
    featured: true
  },
  {
    id: 'capcut-pro',
    title: 'CapCut Premium',
    brand: 'CapCut',
    category: 'Design & Video',
    description: 'Unlock professional video editing, AI effects, auto-captions, and 4K export templates.',
    iconBg: 'from-cyan-500 to-blue-600',
    brandColor: '#00D8F6',
    logoIcon: 'Video',
    plans: [
      { id: 'capcut-1m', name: '1 Month Pro Pass', duration: '1 Month', priceNpr: 499, originalPriceNpr: 999, popular: true },
      { id: 'capcut-6m', name: '6 Months Editor', duration: '6 Months', priceNpr: 2299, originalPriceNpr: 3999 },
      { id: 'capcut-1y', name: '1 Year Creator Unlimited', duration: '1 Year', priceNpr: 3899, originalPriceNpr: 6999 },
    ],
    selectedPlanId: 'capcut-1m',
    features: [
      'Premium editing tools & AI text-to-speech',
      'Pro effects, filters, transitions & keyframe',
      '100GB+ Cloud storage & auto captions',
      '4K 60fps export without watermark',
      'Multi-device support (Mobile + PC)'
    ],
    stockStatus: 'In Stock',
    badge: '🎬 CREATOR CHOICE',
    deliveryTime: '5-15 mins',
    rating: 4.8,
    reviewsCount: 215,
    featured: true
  },
  {
    id: 'netflix-premium',
    title: 'Netflix Premium',
    brand: 'Netflix',
    category: 'Streaming',
    description: 'Stream unlimited movies, TV shows, and anime in Ultra HD 4K on any screen.',
    iconBg: 'from-red-700 via-zinc-900 to-black',
    brandColor: '#E50914',
    logoIcon: 'Tv',
    plans: [
      { id: 'netflix-1m', name: '1 Month UHD Screen', duration: '1 Month', priceNpr: 499, originalPriceNpr: 999, popular: true },
      { id: 'netflix-3m', name: '3 Months Pass', duration: '3 Months', priceNpr: 1399, originalPriceNpr: 2500 },
      { id: 'netflix-6m', name: '6 Months VIP', duration: '6 Months', priceNpr: 2699, originalPriceNpr: 4800 },
    ],
    selectedPlanId: 'netflix-1m',
    features: [
      'Ultra HD 4K + HDR crisp streaming quality',
      'Private screen with custom profile & PIN lock',
      'Download shows on Mobile, Tablet & Laptop',
      'Zero ads & uninterrupted binge watching',
      'Instant login credentials provided'
    ],
    stockStatus: 'Limited Stock',
    badge: '📺 POPULAR',
    deliveryTime: '5-10 mins',
    rating: 4.9,
    reviewsCount: 1120,
    featured: true
  },
  {
    id: 'chatgpt-plus',
    title: 'ChatGPT Plus',
    brand: 'OpenAI',
    category: 'AI Tools',
    description: 'Get priority access to GPT-4o, OpenAI o1, DALL-E 3 image generation, and custom GPTs.',
    iconBg: 'from-emerald-600 to-teal-800',
    brandColor: '#10A37F',
    logoIcon: 'Bot',
    plans: [
      { id: 'cgpt-1m', name: '1 Month Plus', duration: '1 Month', priceNpr: 1499, originalPriceNpr: 2800, popular: true },
      { id: 'cgpt-3m', name: '3 Months Pro', duration: '3 Months', priceNpr: 4199, originalPriceNpr: 7500 },
    ],
    selectedPlanId: 'cgpt-1m',
    features: [
      'Access to GPT-4o, GPT-4, and OpenAI o1 reasoning',
      'DALL-E 3 AI image creator & file analysis',
      'Faster response speeds & priority peak access',
      'Custom GPT builder & web browsing mode'
    ],
    stockStatus: 'In Stock',
    badge: '🧠 AI POWER',
    deliveryTime: '5-15 mins',
    rating: 4.9,
    reviewsCount: 560,
    featured: false
  },
  {
    id: 'canva-pro',
    title: 'Canva Pro',
    brand: 'Canva',
    category: 'Design & Video',
    description: 'Design anything like a pro with 100M+ stock photos, background remover, and brand kit.',
    iconBg: 'from-purple-600 to-indigo-700',
    brandColor: '#00C4CC',
    logoIcon: 'Palette',
    plans: [
      { id: 'canva-1y', name: '1 Year Pro (Personal/Edu)', duration: '1 Year', priceNpr: 1299, originalPriceNpr: 3500, popular: true },
      { id: 'canva-1m', name: '1 Month Quick', duration: '1 Month', priceNpr: 399, originalPriceNpr: 799 },
    ],
    selectedPlanId: 'canva-1y',
    features: [
      'One-click Magic Background Remover',
      '100M+ Premium photos, videos & audio tracks',
      'Brand Kit with custom fonts & palettes',
      '1TB Cloud storage & Magic Resize'
    ],
    stockStatus: 'Instant Auto-Deliver',
    badge: '🎨 DESIGNER BEST',
    deliveryTime: 'Instant',
    rating: 5.0,
    reviewsCount: 740,
    featured: false
  },
  {
    id: 'spotify-premium',
    title: 'Spotify Premium',
    brand: 'Spotify',
    category: 'Streaming',
    description: 'Listen to millions of tracks offline, in ultra high quality, with unlimited skips and zero ads.',
    iconBg: 'from-green-600 to-emerald-900',
    brandColor: '#1DB954',
    logoIcon: 'Music',
    plans: [
      { id: 'spot-1m', name: '1 Month Individual', duration: '1 Month', priceNpr: 399, originalPriceNpr: 699, popular: true },
      { id: 'spot-6m', name: '6 Months', duration: '6 Months', priceNpr: 1999, originalPriceNpr: 3200 },
      { id: 'spot-1y', name: '1 Year VIP', duration: '1 Year', priceNpr: 3499, originalPriceNpr: 5800 },
    ],
    selectedPlanId: 'spot-1m',
    features: [
      'Ad-free music listening everywhere',
      'Download songs for offline playback',
      'Very High audio quality (320 kbps)',
      'Works on your own personal Spotify account'
    ],
    stockStatus: 'In Stock',
    badge: '🎵 MUSIC LOVER',
    deliveryTime: '5-15 mins',
    rating: 4.9,
    reviewsCount: 430,
    featured: false
  },
  {
    id: 'claude-pro',
    title: 'Claude Pro',
    brand: 'Anthropic',
    category: 'AI Tools',
    description: 'Supercharge your technical writing and complex coding with Claude 3.5 Sonnet and high usage limits.',
    iconBg: 'from-amber-600 to-orange-800',
    brandColor: '#D97706',
    logoIcon: 'Cpu',
    plans: [
      { id: 'claude-1m', name: '1 Month Pro', duration: '1 Month', priceNpr: 1499, originalPriceNpr: 2800, popular: true },
    ],
    selectedPlanId: 'claude-1m',
    features: [
      '5x more usage of Claude 3.5 Sonnet',
      'Interactive Code Artifacts & UI live preview',
      '200K token context window for massive documents',
      'Priority access during high traffic hours'
    ],
    stockStatus: 'In Stock',
    badge: '⚡ CODER CHOICE',
    deliveryTime: '10-20 mins',
    rating: 4.9,
    reviewsCount: 180,
    featured: false
  }
];

export const PAYMENT_METHODS: PaymentDetails[] = [
  {
    id: 'esewa',
    name: 'eSewa Wallet',
    logoText: 'eSewa',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    textColor: 'text-emerald-400',
    accountNumber: '9765617156',
    accountName: 'SubX Nepal / Suman Subedi',
    instructions: 'Open your eSewa app -> Send Money -> Enter 9765617156 -> Enter exact amount -> Put Order ID or your name in remarks.'
  },
  {
    id: 'khalti',
    name: 'Khalti Wallet',
    logoText: 'Khalti',
    badgeBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    textColor: 'text-purple-400',
    accountNumber: '9765617156',
    accountName: 'SubX Nepal / Suman Subedi',
    instructions: 'Open Khalti app -> Send Money -> Enter 9765617156 -> Enter exact amount -> Add Remarks with your phone or product.'
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer (Mobile Banking)',
    logoText: 'Mobile Banking',
    badgeBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    textColor: 'text-blue-400',
    accountNumber: '08401017500129 (NIC ASIA) / 02100100234 (NABIL)',
    accountName: 'SubX Digital Services',
    instructions: 'Transfer via any Bank App (NIC Asia, Nabil, Global IME, eSewa Direct Bank Transfer) and save the transaction Reference ID.'
  },
  {
    id: 'card_fonepay',
    name: 'Fonepay / Direct QR Scan',
    logoText: 'FonePay QR',
    badgeBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    textColor: 'text-amber-400',
    accountNumber: '9765617156 (Fonepay Merchant)',
    accountName: 'SubX Nepal Official',
    instructions: 'Scan our universal Fonepay QR using any mobile banking or payment app in Nepal.'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'SUBX-90124',
    createdAt: '2026-07-27 01:10',
    customerName: 'Aarav Sharma',
    customerEmail: 'aarav.sharma@gmail.com',
    customerPhone: '9841234567',
    productId: 'gemini-ai',
    productTitle: 'Google Gemini AI',
    planDuration: '1 Year',
    amountNpr: 1299,
    discountNpr: 0,
    paymentMethod: 'esewa',
    paymentRefId: 'ESW-98127391',
    status: 'Completed',
    accountCredentials: 'Activated on aarav.sharma@gmail.com',
    deliveryNotes: '1 Year Google Gemini AI & 2TB Google One storage activated successfully.'
  },
  {
    id: 'SUBX-90123',
    createdAt: '2026-07-27 00:45',
    customerName: 'Pratima Rai',
    customerEmail: 'pratima.rai@hotmail.com',
    customerPhone: '9808112233',
    productId: 'youtube-premium',
    productTitle: 'YouTube Premium',
    planDuration: '1 Month',
    amountNpr: 499,
    discountNpr: 0,
    paymentMethod: 'khalti',
    paymentRefId: 'KHL-442109',
    status: 'Completed',
    accountCredentials: 'Family invitation sent to email',
    deliveryNotes: 'YouTube Premium invitation accepted.'
  },
  {
    id: 'SUBX-90122',
    createdAt: '2026-07-26 23:20',
    customerName: 'Bikash Gurung',
    customerEmail: 'bikash.gurung@gmail.com',
    customerPhone: '9860998877',
    productId: 'netflix-premium',
    productTitle: 'Netflix Premium',
    planDuration: '1 Month',
    amountNpr: 499,
    discountNpr: 0,
    paymentMethod: 'esewa',
    paymentRefId: 'ESW-1092837',
    status: 'Payment Verified',
    deliveryNotes: 'Credentials being issued via WhatsApp.'
  },
  {
    id: 'SUBX-90121',
    createdAt: '2026-07-26 22:05',
    customerName: 'Sujan Thapa',
    customerEmail: 'sujan.thapa@gmail.com',
    customerPhone: '9812349000',
    productId: 'capcut-pro',
    productTitle: 'CapCut Premium',
    planDuration: '1 Month',
    amountNpr: 499,
    discountNpr: 0,
    paymentMethod: 'bank_transfer',
    paymentRefId: 'NIC-908123',
    status: 'Pending',
    deliveryNotes: 'Awaiting admin manual check.'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Delivery',
    question: 'How fast will I receive my subscription after payment?',
    answer: 'Most orders are processed within 5 to 15 minutes! Once you submit your payment transaction code or screenshot, our automated team sends activation instructions or credentials directly to your WhatsApp (+977 number) and Email.'
  },
  {
    id: 'faq-2',
    category: 'Authenticity',
    question: 'Are SubX Nepal digital subscriptions 100% legal and genuine?',
    answer: 'Yes! All subscriptions provided by SubX Nepal are 100% official, legitimate, and paid through valid merchant channels. We guarantee zero risk of account ban or interruption for the entire duration purchased.'
  },
  {
    id: 'faq-3',
    category: 'Payment',
    question: 'Which payment methods are accepted in Nepal?',
    answer: 'We accept eSewa, Khalti, Mobile Banking Bank Transfer (NIC Asia, Nabil, Global IME, Sanima, etc.), and Fonepay QR scans. Payment details are shown at checkout.'
  },
  {
    id: 'faq-4',
    category: 'Account Type',
    question: 'Do I get access on my own email address or a new account?',
    answer: 'For services like Google Gemini AI, YouTube Premium, and Canva Pro, we activate the subscription directly on your personal email address! For services like Netflix 4K, we provide a private profile login.'
  },
  {
    id: 'faq-5',
    category: 'Support & Replacement',
    question: 'What happens if my subscription encounters any issue during the period?',
    answer: 'SubX Nepal provides full-duration replacement warranty. If you face any issues anytime during your subscription period, simply contact us on WhatsApp (+977 9765617156) for instant resolution or replacement!'
  }
];

export const LIVE_ORDERS_FEED: LiveOrderFeed[] = [
  { id: '1', customerName: 'Suman K.', city: 'Kathmandu', productTitle: 'Google Gemini AI 1 Year', plan: 'NPR 1299', timeAgo: '2 mins ago' },
  { id: '2', customerName: 'Rohan G.', city: 'Pokhara', productTitle: 'YouTube Premium', plan: 'NPR 499', timeAgo: '6 mins ago' },
  { id: '3', customerName: 'Anjali S.', city: 'Lalitpur', productTitle: 'CapCut Premium Pro', plan: 'NPR 499', timeAgo: '12 mins ago' },
  { id: '4', customerName: 'Kiran N.', city: 'Biratnagar', productTitle: 'Netflix 4K Ultra HD', plan: 'NPR 499', timeAgo: '18 mins ago' },
  { id: '5', customerName: 'Pooja T.', city: 'Chitwan', productTitle: 'Canva Pro 1 Year', plan: 'NPR 1299', timeAgo: '25 mins ago' },
  { id: '6', customerName: 'Nabin R.', city: 'Butwal', productTitle: 'ChatGPT Plus GPT-4o', plan: 'NPR 1499', timeAgo: '32 mins ago' }
];

export const INITIAL_PROMO_POSTERS: PromoPoster[] = [
  {
    id: 'poster-gemini',
    imageUrl: '',
    title: 'Google Gemini AI Pro',
    subtitle: 'Multimodal AI & 2TB Cloud Storage • Special Offer',
    buttonText: 'Get Gemini AI',
    productId: 'gemini-ai',
    isActive: true,
    displayOrder: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'poster-capcut',
    imageUrl: '',
    title: 'CapCut Pro — Best Price',
    subtitle: 'Unlock 4K Export, Auto-Captions & Pro Templates',
    buttonText: 'Buy CapCut Pro',
    productId: 'capcut-pro',
    isActive: true,
    displayOrder: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'poster-netflix',
    imageUrl: '',
    title: 'Netflix 4K Ultra HD',
    subtitle: 'Private Profile • Ultra HD Streaming Guaranteed',
    buttonText: 'Get Netflix 4K',
    productId: 'netflix-premium',
    isActive: true,
    displayOrder: 3,
    createdAt: new Date().toISOString()
  },
  {
    id: 'poster-yt',
    imageUrl: '',
    title: 'YouTube Premium',
    subtitle: 'Ad-Free Video & YouTube Music Included',
    buttonText: 'Get YouTube Pass',
    productId: 'youtube-premium',
    isActive: true,
    displayOrder: 4,
    createdAt: new Date().toISOString()
  }
];
