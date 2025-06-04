// Step 1: Create a simpler translation solution that doesn't require provider setup

// Create a file at src/utils/translation.js
export const translations = {
  en: {
    // Navigation
    'home': 'Home',
    'siem-reap': 'Siem Reap',
    'about-us': 'About Us',
    'adventure': 'Adventure',
    'about-page-title': 'About Us',
    // Auth
    'signup': 'Register',
    'login': 'Login',
    'logout': 'Logout',
    'my-orders': 'My Orders',
    // Hero section
    'cambodia': 'CAMBODIA',
    'find-favorite-place': 'Find your Favorite place',
    'search-placeholder': 'Location, address or destination',

    // User profile dropdown
    'my-profile': 'My Profile',
    'my-favorites': 'My Favorites',
    'my-bookings': 'My Bookings',
    'settings': 'Settings',

    // Logout modal
    'confirm-logout': 'Confirm Logout',
    'logout-message': 'Are you sure you want to log out?',
    'cancel': 'Cancel',
    'logging-out': 'Logging out...',

    // Review form
    'write-review': 'Write a Review',
    'your-rating': 'Your Rating:',
    'share-experience': 'Share your experience...',
    'submit': 'Submit',
    'submitting': 'Submitting...',
    "personal-info": "Personal Information",
    "enter-first-name": "Enter your first name",
    "enter-last-name": "Enter your last name",
    "gender": "Gender",

    "enter-phone": "Enter your phone number",
    "enter-email": "Enter your email address",
    "email-cannot-be-changed": "Email address cannot be changed",
    "security": "Security",
    "change-password": "Change Password",
    "current-password": "Current Password",
    "new-password": "New Password",
    "confirm-new-password": "Confirm New Password",
    "enter-current-password": "Enter your current password",
    "enter-new-password": "Enter your new password",
    "update-profile": "Update Profile",
    "profile-updated-successfully": "Profile updated successfully!",
    "update-failed": "Failed to update profile. Please try again.",
    "error-fetching-profile": "Error fetching profile data",
    "invalid-image-format": "Please upload a valid image file",
    "last-name-required": "Last name is required",
    "phone-required": "Phone number is required",
    "current-password-required": "Current password is required",
    "new-password-required": "New password is required",
    "passwords-dont-match": "Passwords don't match",
    'recently-viewed': 'Recently viewed',
    'popular': 'POPULAR',
    'view': 'View',
    'views': 'Views',
    'no-locations-available': 'No locations available',

    // Category filters
    'all': 'All',
    'heritage': 'Heritage',
    'nature': 'Nature',
    'cultural': 'Cultural',
    'beach': 'Beach',
    'food-tours': 'Food Tours',
    'camping': 'Camping',
    'trekking': 'Trekking',
    'clothing': 'Clothing',
    'accessories': 'Accessories',

    // Heritage tourism section
    'heritage-tourism': 'Heritage Tourism',
    'ready-to-explore': 'Are You Ready To Explore?',
    'heritage-tourism-description': 'Discover Cambodia\'s rich cultural heritage and breathtaking natural landscapes with our curated tours and immersive experiences designed for adventurous travelers.',

    // Location cards
    'top-rated': 'TOP RATED',
    'new': 'NEW',
    'no-locations-found': 'No Locations Found',
    'adding-new-locations-soon': 'We\'re adding new exciting locations soon!',
    'more': 'More',
    'showing-filtered-results': 'The results of filtered',
    'locations-found': 'locations',
    'all-categories': 'All Categoris',
    // Features section
    "best-locations": "Smart Trip Planner",
    "best-locations-description": "Discover tailor-made travel and hiking experiences with our intelligent system that recommends destinations and budget plans based on your preferences.",
    "local-guides": "Expert Chat Support",
    "local-guides-description": "Get real-time assistance from our friendly chatbot and expert team for travel tips, gear advice, and personalized recommendations.",
    "best-prices": "Top Gear Deals",
    "best-prices-description": "Shop premium hiking and outdoor products at unbeatable prices, featuring seasonal offers and our lowest price guarantee.",
    "easy-booking": "Adventure Made Easy",
    "easy-booking-description": "Plan your next adventure effortlessly with our seamless booking system, flexible payment options, and gear bundles — all in one place.",

    // Shopping section
    'shopping': 'Shopping',
    'get-your-need': 'Get Your Need',
    'shopping-description': 'Find everything you need for your adventure in Cambodia from quality camping gear to travel essentials, all at unbeatable prices with fast delivery options.',
    'sale': 'SALE',
    'size': 'Size',
    'in-stock': 'In Stock',
    'featured': 'Featured',
    'regular': 'Regular',

    // Newsletter section
    'newsletter-title': 'Get Travel Updates & Exclusive Offers',
    'newsletter-description': 'Subscribe to our newsletter and be the first to know about new tours, seasonal promotions and travel tips for Cambodia.',
    'travel-updates': 'Travel updates',
    'exclusive-offers': 'Exclusive offers',
    'newsletter-privacy': 'By subscribing, you agree to our Privacy Policy. You can unsubscribe at any time.',

    // Chatbot section
    'ai-tour-guide': 'AI Tour Guide',
    'chatbot-description': 'Your personal assistant for planning the perfect Cambodia trip. Ask me anything about tours, attractions, or travel tips!',
    'ask-me-about': 'Ask me about',
    'chatbot-placeholder': 'Type your question here...',
    'start-chat': 'Start Chat',

    // Chatbot questions
    'chatbot-question-angkor-wat': 'Best time to visit Angkor Wat?',
    'chatbot-question-cuisine': 'Where to find authentic cuisine?',
    'chatbot-question-budget': 'How much budget for 7 days?',
    'chatbot-question-trekking': 'Top trekking routes in Cambodia?',
    'chatbot-question-itinerary': 'Best 5-day itinerary for Phnom Penh?',
    'chatbot-question-safety': 'Safety tips for solo travelers?',

    // Chatbot features
    'trip-planning': 'Trip Planning',
    'tour-discounts': 'Tour Discounts',
    'location-info': 'Location Info',
    'travel-tips': 'Travel Tips',
    'budget-advice': 'Budget Advice',

    // Call to action section
    'cta-title': 'Ready for Your Cambodian Adventure?',
    'cta-description': 'Book your dream tour today and discover the wonders of Cambodia with expert guides, exclusive experiences, and unforgettable memories.',
    'explore-tours': 'EXPLORE TOURS',

    'camtour-recommender': 'Camtour',
    'discover-cambodia': 'Discover the beauty of Cambodia',
    'contact-us': 'Contact Us',

    // Siem Reap locations
    'angkor-thom': 'Angkor Thom',
    'banteay-srei': 'Banteay Srei',
    'kralanh': 'Kralanh',
    'puok': 'Puok',
    'prasat-bakong': 'Prasat Bakong',
    'soutr-nikom': 'Soutr Nikom',
    'srei-snam': 'Srei Snam',
    'svay-leu': 'Svay Leu',
    'varin': 'Varin',

    // Adventure locations
    'banteay-meanchey': 'Banteay Meanchey',
    'battambang': 'Battambang',
    'kampong-cham': 'Kampong Cham',
    'kep': 'Kep',
    'koh-kong': 'Koh Kong',
    'kampong-chhnang': 'Kampong Chhnang',
    'kratie': 'Kratié',
    'mondulkiri': 'Mondulkiri',
    'ratanakiri': 'Ratanakiri',
    'siem-reap-adventure': 'Siem Reap',
    'takeo': 'Takéo',

    // Shopping categories
    'camping-equipment': 'Camping Equipment',
    'camping-tents': 'Camping Tents',
    'bottles': 'Bottles',
    'camping-pump': 'Camping Pump',
    'mattress': 'Mattress',
    'pillow-hammock': 'Pillow & Hammock',
    'chair-table': 'Chair and Table',
    'sleeping-bag': 'Sleeping Bag',
    'camping-shelters': 'Camping Shelters',
    'camping-accessories': 'Camping Accessories',
    'camping-trekking': 'Camping & Trekking',

    // Contact and social
    'footer-address': 'Phnom Penh, Cambodia',
    'facebook-page': 'Visit our Facebook page',
    'twitter-page': 'Follow us on Twitter',
    'instagram-page': 'Follow us on Instagram',
    'youtube-channel': 'Subscribe to our YouTube channel',

    // Footer bottom
    'copyright': '© {2025} Camtour Recommender. All rights reserved.',
    'privacy-policy': 'Privacy Policy',
    'terms-of-service': 'Terms of Service',
    'faq': 'FAQ',

    //login form
    'back-to-home': 'Back to Home',

    // Branding
    'camtour-brand': 'Camtour',
    'login-slogan': 'Discover the world with expert guides',

    // Login form header
    'welcome-back': 'Welcome Back!',
    'login-subtitle': 'Login to your account',

    // Form fields
    'email': 'Email',
    'email-placeholder': 'email@example.com',
    'password': 'Password',
    'password-placeholder': '••••••••',
    'remember-me': 'Remember me',
    'forgot-password': 'Forgot password?',

    // Buttons
    'login-button': 'Login',
    'show-password': 'Show password',
    'hide-password': 'Hide password',

    // Social login
    'or-continue-with': 'or continue with',
    'login-with-google': 'Login with Google',
    'login-with-apple': 'Login with Apple',
    'login-with-facebook': 'Login with Facebook',
    'google': 'Google',
    'apple': 'Apple',
    'facebook': 'Facebook',

    // Registration prompt
    'no-account': "Don't have an account?",
    'register-now': 'Register now',

    // Validation messages
    'email-required': 'Email is required',
    'email-invalid': 'Please enter a valid email address',
    'password-required': 'Password is required',
    'password-min-length': 'Password must be at least 6 characters',

    // Error messages
    'login-failed': 'Login failed. Please check your credentials.',
    'network-error': 'Network error. Please try again later.',
    'invalid-credentials': 'Invalid email or password',
    'account-locked': 'Account is temporarily locked. Please try again later.',
    'server-error': 'Server error. Please try again later.',


    //sign up
    'adventure-starts-here': 'Adventure Starts Here',
    'join-travel-community': 'Join our travel community today',

    // Social login
    'continue-with-google': 'Continue with Google',
    'or-sign-up-with-email': 'or sign up with email',

    // Form fields - Register specific
    'first-name': 'First Name',
    'first-name-placeholder': 'Enter your first name',
    'last-name': 'Last Name',
    'last-name-placeholder': 'Enter your last name',
    'date-of-birth': 'Date of Birth',
    'profile-image': 'Profile Image',
    'photo': 'Photo',
    'profile-preview': 'Profile Preview',
    'calendar': 'Calendar',
    'upload': 'Upload',

    'prefer-not-to-say': 'Prefer not to say',
    'male': 'Male',
    'female': 'Female',

    // Contact information - Register specific
    'phone-number': 'Phone Number',
    'phone-placeholder': 'Enter your phone number',

    // Password fields - Register specific
    'confirm-password': 'Confirm Password',
    'confirm-password-placeholder': 'Confirm your password',

    // Password strength
    'password-strength-weak': 'Weak',
    'password-strength-medium': 'Medium',
    'password-strength-strong': 'Strong',

    // Password requirements - Register specific
    'password-requirement-length': 'At least 8 characters',
    'password-requirement-uppercase': 'One uppercase letter',
    'password-requirement-lowercase': 'One lowercase letter',
    'password-requirement-special': 'One special character',

    // Terms and conditions - Register specific
    'agree-to-terms-start': 'I agree to the',
    'and': 'and',

    // Buttons - Register specific
    'creating-account': 'Creating account...',
    'start-your-journey': 'Start Your Journey',

    // Login link - Register specific
    'already-have-account': 'Already have an account?',
    'sign-in': 'Sign in',

    // Success modal - Register specific
    'welcome-aboard': 'Welcome Aboard!',
    'journey-begins-now': 'Your journey with us begins now. Get ready to explore amazing destinations!',
    'continue-to-login': 'Continue to Login',

    // Validation messages - Register specific
    'first-name-required': 'First name is required',
    'first-name-min-length': 'First name must be at least 2 characters',
    'last-name-min-length': 'Last name must be at least 2 characters',
    'dob-required': 'Date of birth is required',
    'dob-min-age': 'You must be at least 13 years old',
    'phone-invalid': 'Please enter a valid phone number',
    'password-too-weak': 'Please create a stronger password',
    'confirm-password-required': 'Please confirm your password',
    'passwords-do-not-match': 'Passwords do not match',
    'terms-must-be-accepted': 'You must accept the terms to continue',
    'image-invalid-type': 'Please upload a valid image file (JPG, PNG, or GIF)',
    'image-too-large': 'Image size should be less than 5MB',
    'home-page-title': 'Recommender',

    // Error messages - Register specific
    'registration-failed': 'Registration failed. Please try again.',
    'registration-error': 'An error occurred during registration. Please try again.',
    'adventure-page-title': 'Adventure',

    // Hero section
    'hero-title-line1': "IT'S TIME",
    'hero-title-line2': 'FOR HIKING',
    'hero-subtitle': "EXPLORE CAMBODIA'S NATURAL BEAUTY",
    'hero-description': 'Hiking in Cambodia offers an unforgettable adventure through lush rainforests, remote mountains, and ancient temple trails. From the misty peaks of Kulen Mountain to the serene waterfalls of Mondulkiri and the hidden paths around Cardamom Mountains, Cambodia is a paradise for nature lovers.',
    'hiking-adventure-alt': 'Hiking Adventure',

    // Header section
    'adventure-tourism-tag': 'ADVENTURE TOURISM',
    'ready-to-hiking-title': 'ARE YOU READY TO HIKING?',

    // Sidebar filters
    'filter-options': 'Filter Options',
    'your-favorite-place': 'Your Favorite Place',
    'popular-place-in': 'Popular Place in',
    'star-rating': 'Star Rating',
    'five-stars': '5 Stars',
    'four-stars': '4 Stars',
    'three-stars': '3 Stars',
    'two-stars': '2 Stars',
    'reset-filters': 'Reset Filters',

    // Content area
    'no-results-alt': 'No results found',
    'adventure-category-default': 'Adventure',
    'read-more': 'Read More',
    'view-details': 'View Details',

    // View counts
    'no-views': 'No Views',
    'one-view': '1 View',
    'multiple-views': ' Views',

    // Pagination
    'prev': 'Prev',
    'next': 'Next',
    'previous-page': 'Previous Page',
    'next-page': 'Next Page',
    'more-pages': 'More pages',
    'page-number': 'Page {number}',


    // Provinces
    'province-battambang': 'Battambang',
    'province-banteay-meanchey': 'Banteay Meanchey',
    'province-kampong-cham': 'Kampong Cham',
    'province-kampong-chhnang': 'Kampong Chhnang',
    'province-kampong-speu': 'Kampong Speu',
    'province-kampong-thom': 'Kampong Thom',
    'province-kampot': 'Kampot',
    'province-kandal': 'Kandal',
    'province-kep': 'Kep',
    'province-koh-kong': 'Koh Kong',
    'province-kratie': 'Kratie',
    'province-mondulkiri': 'Mondulkiri',
    'province-ratanakiri': 'Ratanakiri',
    'province-siem-reap': 'Siem Reap',
    'province-preah-sihanouk': 'Preah Sihanouk',
    'province-stung-treng': 'Stung Treng',
    'province-svay-rieng': 'Svay Rieng',
    'province-takeo': 'Takeo',
    'province-oddar-meanchey': 'Oddar Meanchey',
    'province-pursat': 'Pursat',
    'province-preah-vihear': 'Preah Vihear',
    'province-prey-veng': 'Prey Veng',
    'province-pailin': 'Pailin',
    'province-tboung-khmum': 'Tboung Khmum',

    // Districts
    'district-angkor-thom': 'Angkor Thom',
    'district-banteay-srei': 'Banteay Srei',
    'district-chi-kraeng': 'Chi Kraeng',
    'district-krakir': 'Krakir',
    'district-phouk': 'Phouk',
    'district-prasat-bokong': 'Prasat Bokong',
    'district-soutr-nikom': 'Soutr Nikom',
    'district-srei-snam': 'Srei Snam',
    'district-svey-leu': 'Svey Leu',
    'district-kampong-kdei': 'Kampong Kdei',
    'district-varin': 'Varin',
    'district-kulen': 'Kulen',

    // Categories
    'category-adventure': 'Adventure',
    'category-hiking': 'Hiking',
    'category-trekking': 'Trekking',
    'category-mountain-climbing': 'Mountain Climbing',
    'category-nature': 'Nature',
    'category-waterfall': 'Waterfall',
    'category-forest': 'Forest',
    'category-temple-trail': 'Temple Trail',

    //product
    'shop-page-title': 'Adventure Shop',

    // Search header - Shop specific
    'find-perfect-gear': 'Find Your Perfect Gear',
    'discover-premium-equipment': 'Discover premium outdoor equipment for every adventure',
    'search-placeholder-shop': 'Search for hiking gear, camping equipment, photography gear...',
    'popular-brands': 'Popular Brands',
    'searching-for': 'Searching for',
    'clear-search': 'Clear search',

    // Filters - Shop specific
    'filter-products': 'Filter Products',
    'price-range': 'Price Range',
    'brands': 'Brands',
    'sort-by': 'Sort By',
    'price-low-to-high': 'Price: Low to High',
    'price-high-to-low': 'Price: High to Low',
    'newest': 'Newest',
    'popularity': 'Popularity',

    // Status messages - Shop specific
    'loading-products': 'Loading products...',
    'try-again': 'Try Again',
    'no-products-found': 'No products found matching your criteria.',
    'error-loading-products': 'An error occurred while loading products. Please try again.',

    // Products - Shop specific
    'outdoor-gear': 'Outdoor Gear',
    'items-count': 'items',
    'grid-view': 'Grid View',
    'list-view': 'List View',
    'product-view': 'Product View',
    'rent-now': 'Order',
    'add-to-wishlist': 'Add to Wishlist',
    'remove-from-wishlist': 'Remove from Wishlist',

    // Product badges - Shop specific
    'premium': 'Premium',
    'discount-percentage': '{percent}% OFF',

    // Stock status - Shop specific
    'stock-status-in-stock': 'In Stock',
    'stock-status-available': 'Available',
    'stock-status-low-stock': 'Low Stock',
    'stock-status-limited': 'Limited Stock',
    'stock-status-out-of-stock': 'Out of Stock',
    'stock-status-unavailable': 'Unavailable',

    // Product categories - Shop specific
    'category-outdoor-gear': 'Outdoor Gear',
    'category-adventure-gear': 'Adventure Gear',
    'category-backpacking': 'Backpacking',
    'category-climbing': 'Climbing',
    'category-travel': 'Travel',
    'category-electronics': 'Electronics',
    'category-footwear': 'Footwear',
    'category-safety': 'Safety',
    'category-navigation': 'Navigation',
    'category-cooking': 'Cooking',
    'category-shelter': 'Shelter',
    'category-lighting': 'Lighting',
    'category-water': 'Water & Hydration',


    //about us
    'discover-hidden-trails': "Discover Cambodia's Hidden Trails",
    'hiking-trails': 'Hiking Trails',
    'provinces': 'Provinces',
    'happy-hikers': 'Happy Hikers',

    // Our Story section
    'our-story': 'Our Story',
    'story-paragraph-1': "Born from a passion for Cambodia's untamed wilderness, our platform connects adventurous souls with the Kingdom's most spectacular hiking destinations. From the mystical temples of Angkor to the pristine rainforests of the Cardamom Mountains, we're dedicated to showcasing Cambodia's natural wonders while promoting sustainable tourism.",
    'story-paragraph-2': "Our journey began in 2020 when a group of local hiking enthusiasts recognized the need for a comprehensive platform that would make Cambodia's incredible trails accessible to both locals and international visitors. Today, we're proud to be Cambodia's leading hiking community.",

    // Featured Destinations
    'explore-premier-destinations': "Explore Cambodia's Premier Hiking Destinations",
    'destinations-subtitle': "From ancient temple trails to pristine mountain peaks, discover the Kingdom's most breathtaking hiking experiences",

    // Difficulty levels
    'difficulty-expert': 'Expert',
    'difficulty-beginner': 'Beginner',
    'difficulty-intermediate': 'Intermediate',

    // Destination names and descriptions
    'cardamom-mountains': 'Cardamom Mountains',
    'koh-kong-province': 'Koh Kong Province',
    'cardamom-description': "Cambodia's largest and most biodiverse mountain range offers challenging multi-day treks through pristine rainforest, stunning waterfalls, and wildlife encounters including Asian elephants and sun bears.",

    'angkor-archaeological-park': 'Angkor Archaeological Park',
    'siem-reap-province': 'Siem Reap Province',
    'angkor-description': 'Explore hidden jungle paths connecting ancient Khmer temples, including secret trails to Beng Mealea and remote temple complexes rarely visited by tourists.',

    'preah-vihear-temple': 'Preah Vihear Temple',
    'preah-vihear-province': 'Preah Vihear Province',
    'preah-vihear-description': "Hike to Cambodia's most dramatically situated temple, perched on a 525-meter cliff in the Dangrek Mountains, offering panoramic views over the Cambodian plains.",

    'kep-national-park': 'Kep National Park',
    'kep-province': 'Kep Province',
    'kep-description': 'Coastal hiking trails through tropical forest with stunning ocean views, butterfly gardens, and opportunities to spot various bird species and macaques.',

    'mondulkiri-hills': 'Mondulkiri Hills',
    'mondulkiri-province': 'Mondulkiri Province',
    'mondulkiri-description': "Rolling hills, elephant sanctuaries, and indigenous Bunong villages. Experience Cambodia's cooler climate, coffee plantations, and spectacular waterfalls like Bou Sra.",

    'bokor-national-park': 'Bokor National Park',
    'kampot-province': 'Kampot Province',
    'bokor-description': 'Misty mountain trails leading to the abandoned French hill station, featuring the famous Bokor Palace Hotel ruins and breathtaking views of the Gulf of Thailand.',

    // Destination highlights
    'wildlife-viewing': 'Wildlife Viewing',
    'waterfalls': 'Waterfalls',
    'multi-day-treks': 'Multi-day Treks',
    'ancient-temples': 'Ancient Temples',
    'jungle-trails': 'Jungle Trails',
    'photography': 'Photography',
    'mountain-views': 'Mountain Views',
    'unesco-site': 'UNESCO Site',
    'sunrise-hikes': 'Sunrise Hikes',
    'ocean-views': 'Ocean Views',
    'butterflies': 'Butterflies',
    'wildlife': 'Wildlife',
    'elephant-sanctuary': 'Elephant Sanctuary',
    'coffee-trails': 'Coffee Trails',
    'hill-tribes': 'Hill Tribes',
    'ghost-town': 'Ghost Town',
    'cloud-forest': 'Cloud Forest',
    'coastal-views': 'Coastal Views',

    // Cambodia facts
    'why-hike-cambodia': 'Why Hike in Cambodia?',
    'biodiversity-hotspot': 'Biodiversity Hotspot',
    'biodiversity-description': 'Home to over 2,300 plant species, 800 bird species, and endangered wildlife including tigers, elephants, and the Irrawaddy dolphin.',

    'years-of-history': '1,000+ Years of History',
    'history-description': 'Trek through landscapes dotted with ancient Khmer temples, some dating back to the 9th century, including UNESCO World Heritage sites.',

    'tropical-climate': 'Tropical Climate',
    'climate-description': 'Year-round hiking opportunities with the best conditions from November to March. Dry season offers clear skies and comfortable temperatures.',

    'affordable-adventure': 'Affordable Adventure',
    'affordable-description': 'Experience world-class hiking at a fraction of the cost compared to other Southeast Asian destinations, with budget-friendly accommodations and local guides.',
    'try-adjusting-filters' : 'Try Adjusting Filters',
    
    // Mission & Values
    'mission-values': 'Our Mission & Values',
    'sustainable-tourism': 'Sustainable Tourism',
    'sustainable-description': "Promoting eco-friendly hiking practices that preserve Cambodia's pristine wilderness for future generations while supporting local communities.",

    'trail-accessibility': 'Trail Accessibility',
    'accessibility-description': 'Providing detailed trail maps, GPS coordinates, difficulty ratings, and comprehensive gear recommendations for safe and enjoyable adventures.',

    'community-support': 'Community Support',
    'community-description': 'Partnering with local guides, indigenous communities, and conservation organizations to create authentic and responsible hiking experiences.',

    'safety-first': 'Safety First',
    'safety-description': 'Prioritizing hiker safety through real-time weather updates, emergency protocols, and partnerships with local rescue services.',

    // Our Team
    'meet-adventure-team': 'Meet Our Adventure Team',
    'team-intro': "Passionate locals and hiking experts dedicated to sharing Cambodia's natural wonders",

    // Team member roles
    'founder-chief-guide': 'Founder & Chief Trail Guide',
    'ux-designer-cartographer': 'UX/UI Designer & Digital Cartographer',
    'content-creator-cultural': 'Content Creator & Cultural Expert',
    'backend-developer-architect': 'Backend Developer & Systems Architect',
    'technical-advisor-conservation': 'Technical Advisor & Conservation Expert',

    // Team member descriptions
    'sokmeng-description': 'With over 15 years exploring Cambodia\'s wilderness, Sokmeng has summited every major peak and discovered countless hidden trails. A certified wilderness first aid instructor and passionate conservationist.',
    'raksa-description': 'Creates intuitive trail maps and user experiences that help adventurers navigate Cambodia\'s diverse landscapes. Specializes in GPS mapping and mobile app design for outdoor enthusiasts.',
    'chhayya-description': 'Shares detailed trail guides, cultural insights, and photography tips. Fluent in Khmer, English, and French, she bridges the gap between local knowledge and international visitors.',
    'rachana-description': 'Powers our platform with robust systems, real-time weather integration, and interactive mapping technologies. Ensures seamless experiences for thousands of users daily.',
    'socheat-description': 'Former park ranger and environmental scientist who guides our conservation efforts and technical development. 20+ years experience in Cambodia\'s national parks and protected areas.',

    // Team stats
    'trails-explored': 'Trails Explored',
    'hikers-guided': 'Hikers Guided',
    'digital-maps-created': 'Digital Maps Created',
    'award-winning-design': 'Award-Winning Design',
    'trail-articles': 'Trail Articles',
    'cultural-ambassador': 'Cultural Ambassador',
    'uptime': 'Uptime',
    'tech-innovation-leader': 'Tech Innovation Leader',
    'conservation-champion': 'Conservation Champion',
    'years-experience': 'Years Experience',

    // Call to Action
    'ready-start-adventure': 'Ready to Start Your Cambodia Adventure?',
    'explore-trails': 'Explore Trails',
    'contact-guides': 'Contact Our Guides',


    //siemreap
    'siem-reap-page-title': 'Siem Reap - Gateway to Angkor',
    'gateway-to-angkor': 'Gateway to Angkor',
    'ancient-sites': 'Ancient Sites',
    'temples': 'Temples',
    'explore-siem-reap': 'Explore Siem Reap',

    // About Siem Reap Section
    'about-siem-reap': 'About Siem Reap',
    'population': 'Population',
    'area': 'Area',
    'province': 'Province',
    'main-language': 'Main Language',
    'currency': 'Currency',
    'best-time-to-visit': 'Best Time to Visit',
    'famous-for': 'Famous For',
    'climate': 'Climate',
    'cool-dry-season': 'Cool & Dry Season',
    'khmer-cambodian-english': 'Khmer (Cambodian), English widely spoken',
    'cambodian-riel-us-dollar': 'Cambodian Riel (KHR) & US Dollar (USD)',
    'november-to-march': 'November to March (Cool & Dry Season)',
    'angkor-wat-complex': 'Angkor Wat Temple Complex & Ancient Khmer Architecture',
    'tropical-monsoon-climate': 'Tropical monsoon climate with wet season (May-October) and dry season (November-April). Average temperature 25-35°C.',

    // Filter Section
    'filter-by-location': 'Filter by Location',
    'district': 'District',
    'commune': 'Commune',
    'village': 'Village',
    'all-districts': 'All Districts',
    'all-communes': 'All Communes',
    'all-villages': 'All Villages',
    'rating-filter': 'Rating Filter',
    'minimum-views': 'Minimum Views',

    // Star Ratings
    'stars-plus': '+ Stars',
    'all-ratings': 'All Ratings',

    // Cultural Heritage
    'cultural-heritage-siem-reap': 'Cultural Heritage of Siem Reap',
    'angkor-wat': 'Angkor Wat',
    'angkor-wat-description': 'The world\'s largest religious monument and UNESCO World Heritage Site, representing the pinnacle of Khmer architecture.',
    '12th-century': '12th Century',
    'hindu-temple-complex': 'Hindu Temple Complex',

    'bayon-temple': 'Bayon Temple',
    'bayon-description': 'Famous for its serene and massive stone faces, this temple sits at the center of Angkor Thom.',
    'late-12th-century': 'Late 12th Century',
    'buddhist-temple': 'Buddhist Temple',

    'ta-prohm': 'Ta Prohm',
    'ta-prohm-description': 'The \'Tomb Raider Temple\' where ancient stones and jungle roots create a mystical atmosphere.',
    'buddhist-monastery': 'Buddhist Monastery',
    'banteay-srei-description': 'Known as the \'Lady Temple\' for its intricate pink sandstone carvings and delicate artistry.',
    '10th-century': '10th Century',
    'hindu-temple': 'Hindu Temple',

    // Most Popular Destinations
    'most-popular-destinations': 'Most Popular Destinations',

    // Local Cuisine
    'siem-reap-local-cuisine': 'Siem Reap Local Cuisine',
    'fish-amok': 'Fish Amok',
    'fish-amok-description': 'Cambodia\'s national dish - a creamy coconut curry with fish steamed in banana leaves.',
    'main-course': 'Main Course',
    'price-range-3-8': '$3-8',

    'lok-lak': 'Lok Lak',
    'lok-lak-description': 'Cambodian beef stir-fry served with rice and a tangy lime-pepper dipping sauce.',
    'price-range-4-10': '$4-10',

    'nom-banh-chok': 'Nom Banh Chok',
    'nom-banh-chok-description': 'Traditional Khmer noodles with fish-based green curry sauce, often eaten for breakfast.',
    'breakfast-light-meal': 'Breakfast/Light Meal',
    'price-range-1-3': '$1-3',

    'prahok-ktiss': 'Prahok Ktiss',
    'prahok-ktiss-description': 'Traditional fermented fish dip served with fresh vegetables and rice.',
    'appetizer': 'Appetizer',
    'price-range-2-5': '$2-5',
    'select-province': 'Select Province',

    // All Tourist Destinations
    'all-tourist-destinations': 'All Tourist Destinations',
    'amazing-places-found': 'amazing places found',
    'loading-amazing-destinations': 'Loading amazing destinations...',
    'cta-description-about': "Join thousands of hikers who have discovered Cambodia's hidden gems. Your next great adventure awaits!",
    // Travel Tips
    'travel-tips-siem-reap': 'Travel Tips for Siem Reap',
    'getting-around': 'Getting Around',
    'getting-around-tips': [
      'Rent a bicycle for temple exploration',
      'Tuk-tuks are perfect for short distances',
      'Hire a car with driver for day trips',
      'Download offline maps before exploring'
    ],

    'temple-visits': 'Temple Visits',
    'temple-visits-tips': [
      'Buy 3-day pass for better temple exploration',
      'Start early (5:30 AM) for sunrise at Angkor Wat',
      'Dress modestly (cover shoulders and knees)',
      'Bring plenty of water and sunscreen'
    ],

    'local-etiquette': 'Local Etiquette',
    'local-etiquette-tips': [
      'Remove shoes when entering temples',
      'Greet with traditional \'sampeah\' (prayer-like gesture)',
      'Don\'t touch monks or Buddha statues',
      'Respect local customs and photography rules'
    ],

    'money-shopping': 'Money & Shopping',
    'money-shopping-tips': [
      'USD widely accepted alongside Riel',
      'Bargain at markets (start at 30% of asking price)',
      'Visit Old Market and Night Market for souvenirs',
      'Tip 10% at restaurants, $1-2 for tuk-tuk drivers'
    ],

    // Recommended Gear
    'recommended-gear-cambodia': 'Recommended Gear for Cambodia',
    'left': 'left',
    'select-category': 'Select Location Cagetory',

  },


  km: {
    // Navigation
    'home': 'ទំព័រដើម',
    'siem-reap': 'សៀមរាប',
    'shopping': 'ការទិញទំនិញ',
    'about-us': 'អំពីយើងខ្ញុំ',
    "male": "ប្រុស",
    "female": "ស្រី",
    // Auth
    'signup': 'ចុះឈ្មោះ',
    'login': 'ចូលគណនី',
    'logout': 'ចាកចេញ',
    'gender': 'ភេទ',
    "prefer-not-to-say": "មិនចង់បញ្ជាក់!",
    'select-province': 'សូមជ្រើសរើសរាជាធានី /ខេត្ត',
    'select-category': 'សូមជ្រើសរើសប្រភេទទីតាំង',
    'showing-filtered-results': 'លទ្ធផលនៃការស្វែងរកគឺចំនួន',
    'locations-found': 'នៃទីតាំង',

    // Hero section
    'cambodia': 'កម្ពុជា',
    'find-favorite-place': 'ស្វែងរកកន្លែងដែលអ្នកចូលចិត្ត',
    'search-placeholder': 'ទីតាំង អាសយដ្ឋាន ឬគោលដៅ',
    'my-favorites': 'ការចូលចិត្តរបស់ខ្ញុំ',
    'settings': 'ការកំណត់',
    'logout-message': 'តើអ្នកប្រាកដទេ សម្រាប់ការចាកចេញពីគណនី?',
    "my-profile": "ប្រវត្តិរូបរបស់ខ្ញុំ",
    "personal-info": "ព័ត៌មានផ្ទាល់ខ្លួន",
    "last-name": "នាមខ្លួន",
    "enter-first-name": "បញ្ចូលនាមត្រកូលរបស់អ្នក",
    "enter-last-name": "បញ្ចូលនាមខ្លួនរបស់អ្នក",
    'confirm-logout': 'ការសម្រេចចិត្ត ចាកចេញពីគណនី',
    "phone-number": "លេខទូរសព្ទ",
    "enter-phone": "បញ្ចូលលេខទូរសព្ទរបស់អ្នក",
    "email": "អាសយដ្ឋានអ៊ីមែល",
    "enter-email": "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក",
    "email-cannot-be-changed": "អាសយដ្ឋានអ៊ីមែលមិនអាចផ្លាស់ប្តូរបានទេ",
    "security": "សុវត្ថិភាព",
    "change-password": "ផ្លាស់ប្តូរពាក្យសម្ងាត់",
    "current-password": "ពាក្យសម្ងាត់បច្ចុប្បន្ន",
    "new-password": "ពាក្យសម្ងាត់ថ្មី",
    "confirm-new-password": "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
    "enter-current-password": "បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្នរបស់អ្នក",
    "enter-new-password": "បញ្ចូលពាក្យសម្ងាត់ថ្មីរបស់អ្នក",
    "update-profile": "ធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប",
    "cancel": "បោះបង់",
    "profile-updated-successfully": "ប្រវត្តិរូបត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!",
    "update-failed": "បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប។ សូមព្យាយាមម្តងទៀត។",
    "error-fetching-profile": "មានបញ្ហាក្នុងការទាញយកទិន្នន័យប្រវត្តិរូប",
    "invalid-image-format": "សូមបញ្ចូលឯកសាររូបភាពដែលត្រឹមត្រូវ",
    "current-password-required": "តម្រូវឱ្យមានពាក្យសម្ងាត់បច្ចុប្បន្ន",
    "new-password-required": "តម្រូវឱ្យមានពាក្យសម្ងាត់ថ្មី",
    "password-min-length": "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 8 តួអក្សរ",
    "passwords-dont-match": "ពាក្យសម្ងាត់មិនត្រូវគ្នា",
    "logging-out": "កំពុងចេញ...",

    'recently-viewed': 'បានមើលថ្មីៗ',
    'popular': 'ពេញនិយម',
    'view': 'អ្នកទស្សនា',
    'views': 'អ្នកទស្សនា',
    'no-locations-available': 'មិនមានទីតាំងអាច',

    // Category filters
    'all': 'ទាំងអស់',
    'heritage': 'បេតិកភណ្ឌ',
    'nature': 'ធម្មជាតិ',
    'cultural': 'វប្បធម៌',
    'beach': 'ឆ្នេរ',
    'food-tours': 'ដំណើរអាហារ',
    'camping': 'ការជំរុំ',
    'trekking': 'ដំណើរឈើ',
    'clothing': 'សម្លៀកបំពាក់',
    'accessories': 'គ្រឿងប្រដាប់',

    // Heritage tourism section
    'heritage-tourism': 'ទេសចរណ៍បេតិកភណ្ឌ',
    'ready-to-explore': 'តើអ្នកត្រៀមខ្លួនសម្រាប់ការរុករកហើយឬនៅ?',
    'heritage-tourism-description': 'ស្វែងរកបេតិកភណ្ឌវប្បធម៌សម្បូរបែបនិងទេសភាពធម្មជាតិដ៏អស្ចារ្យរបស់កម្ពុជាជាមួយនឹងដំណើរទេសចរណ៍ដែលបានជ្រើសរើសយ៉ាងល្អិតល្អន់និងបទពិសោធន៍ជ្រាលជ្រៅដែលរចនាសម្រាប់អ្នកដំណើរដែលស្រលាញ់ការផ្សងព្រេង។',

    // Location cards
    'top-rated': 'ដាក់ពិន្ទុខ្ពស់',
    'new': 'ថ្មី',
    'no-locations-found': 'រកមិនឃើញទីតាំង',
    'adding-new-locations-soon': 'យើងកំពុងបន្ថែមទីតាំងថ្មីៗដ៏រំភើបឆាប់ៗនេះ!',
    'more': 'ច្រើនទៀត',

    // Features section
    "best-locations": "កម្មវិធីរៀបចំព័ត៌មានទេសចរណ៍ឆ្លាតវៃ",
    "best-locations-description": "ស្វែងរកបទពិសោធន៍ធ្វើដំណើរ និងដើរឡើងភ្នំតាមបំណងរបស់អ្នក ជាមួយនឹងប្រព័ន្ធឆ្លាតវៃដែលផ្តល់អនុសាសន៍អំពីទីកន្លែង និងផែនការថវិកា។",

    "local-guides": "ជំនួយដោយជំនាញ",
    "local-guides-description": "ទទួលជំនួយភ្លាមៗពីឆាតបុត និងក្រុមការងារជំនាញរបស់យើង សម្រាប់ព័ត៌មានទេសចរណ៍ ការប្រើប្រាស់ឧបករណ៍ និងអនុសាសន៍ផ្ទាល់ខ្លួន។",

    "best-prices": "ការផ្តល់ជូនល្អបំផុតសម្រាប់ឧបករណ៍",
    "best-prices-description": "ទិញផលិតផលដើរឡើងភ្នំ និងអាកាសធាតុក្រៅគ្រឿងសម្បុក មានគុណភាពខ្ពស់ ក្នុងតម្លៃសមរម្យជាមួយការផ្តល់ជូនពិសេស។",

    "easy-booking": "ធ្វើដំណើរយ៉ាងងាយស្រួល",
    "easy-booking-description": "រៀបចំដំណើរផ្សងព្រេងបន្ទាប់របស់អ្នកយ៉ាងងាយស្រួល ជាមួយប្រព័ន្ធកក់សេវា មានជម្រើសបង់ប្រាក់ទាន់ចិត្ត និងកញ្ចប់ឧបករណ៍នៅទីតែមួយ។",
    'my-orders': 'ការកម្មង់ផលិតផលរបស់ខ្ញុំ',
    // Shopping section
    'get-your-need': 'ទទួលបានអ្វីដែលអ្នកត្រូវការ',
    'shopping-description': 'រកអ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវការសម្រាប់ការផ្សងព្រេងរបស់អ្នកនៅកម្ពុជាពីគ្រឿងបរិក្ខារជំរុំគុណភាពទៅរហូតដល់សម្ភារៈដំណើរចាំបាច់ទាំងអស់នៅតម្លៃមិនអាចឈ្នះបានជាមួយនឹងជម្រើសដឹកជញ្ជូនលឿន។',
    'sale': 'បញ្ចុះតម្លៃ',
    'size': 'ទំហំ',
    'in-stock': 'មានក្នុងស្តុក',
    'featured': 'លក្ខណៈពិសេស',
    'regular': 'ធម្មតា',

    // Newsletter section
    'newsletter-title': 'ទទួលបានការបង្ហាញពត៌មានដំណើរ និងការផ្តល់ជូនផ្តាច់មុខ',
    'newsletter-description': 'ជាវព្រឹត្តិប័ត្រព័ត៌មានរបស់យើងហើយកុំអោយខកខានដើម្បីដឹងអំពីដំណើរទេសចរណ៍ថ្មី ការផ្តល់ជូនតាមរដូវកាល និងគន្លឹះដំណើរសម្រាប់កម្ពុជា។',
    'travel-updates': 'ការបង្ហាញពត៌មានដំណើរ',
    'exclusive-offers': 'ការផ្តល់ជូនផ្តាច់មុខ',
    'newsletter-privacy': 'ដោយការជាវ អ្នកយល់ព្រមលើគោលការណ៍ភាពឯកជនរបស់យើង។ អ្នកអាចលុបចោលការជាវបាននៅពេលណាក៏បាន។',

    // Chatbot section
    'ai-tour-guide': 'AI Tour Guide',
    'chatbot-description': "ជំនួយការផ្ទាល់ខ្លួនរបស់អ្នកសម្រាប់ការរៀបចំដំណើរកម្ពុជាដ៏ល្អឥតខ្ចោះ។ សួរខ្ញុំអ្វីគ្រប់យ៉ាងអំពីដំណើរទេសចរណ៍ ទីតាំងទាក់ទាញ ឬគន្លឹះដំណើរ! -> សូមចុចលើ Roboot ខាងក្រោមដើម្បីដំណើរការស្វែងរក!",
    'ask-me-about': 'សួរខ្ញុំអំពី',
    'chatbot-placeholder': 'វាយសំណួររបស់អ្នកនៅទីនេះ...',
    'start-chat': 'ចាប់ផ្តើមសន្ទនា',

    // Chatbot questions
    'chatbot-question-angkor-wat': 'ពេលល្អបំផុតសម្រាប់ទៅទស្សនានគរវត្ត?',
    'chatbot-question-cuisine': 'ទីតាំងរកអាហារប្រពៃណី?',
    'chatbot-question-budget': 'ថវិកាប៉ុន្មានសម្រាប់ 7 ថ្ងៃ?',
    'chatbot-question-trekking': 'ផ្លូវដំណើរឈើកំពូលនៅកម្ពុជា?',
    'chatbot-question-itinerary': 'កម្មវិធីល្អបំផុត 5 ថ្ងៃសម្រាប់ភ្នំពេញ?',
    'chatbot-question-safety': 'គន្លឹះសុវត្ថិភាពសម្រាប់អ្នកដំណើរតែម្នាក់?',

    // Chatbot features
    'trip-planning': 'ការរៀបចំដំណើរ',
    'tour-discounts': 'បញ្ចុះតម្លៃដំណើរ',
    'location-info': 'ព័ត៌មានទីតាំង',
    'travel-tips': 'គន្លឹះដំណើរ',
    'budget-advice': 'ការណែនាំថវិកា',

    // Call to action section
    'cta-title': 'ត្រៀមខ្លួនសម្រាប់ការផ្សងព្រេងកម្ពុជារបស់អ្នកហើយឬនៅ?',
    'cta-description': 'កក់ដំណើរក្តីសុបិនរបស់អ្នកថ្ងៃនេះ ហើយស្វែងរកភាពអស្ចារ្យនៃកម្ពុជាជាមួយមគ្គុទ្ទេសក៍ជំនាញ បទពិសោធន៍ផ្តាច់មុខ និងការចងចាំមិនអាចបំភ្លេចបាន។',
    'explore-tours': 'ស្វែងរកដំណើរ',
    'contact-us': 'ទាក់ទងយើង',
    'camtour-recommender': 'Camtour',
    'discover-cambodia': 'ស្វែងរកភាពស្រស់ស្អាតនៃកម្ពុជា',
    'adventure': 'បេសកកម្ម',

    // Siem Reap locations
    'angkor-thom': 'អង្គរធំ',
    'banteay-srei': 'បន្ទាយស្រី',
    'kralanh': 'ក្រឡាញ់',
    'puok': 'ពួក',
    'prasat-bakong': 'ប្រាសាទបាគង',
    'soutr-nikom': 'សូត្រនិគម',
    'srei-snam': 'ស្រីស្នាម',
    'svay-leu': 'ស្វាយលើ',
    'varin': 'វារិន',

    // Adventure locations
    'banteay-meanchey': 'បន្ទាយមានជ័យ',
    'battambang': 'បាត់ដំបង',
    'kampong-cham': 'កំពង់ចាម',
    'kep': 'កែប',
    'koh-kong': 'កោះកុង',
    'kampong-chhnang': 'កំពង់ឆ្នាំង',
    'kratie': 'ក្រចេះ',
    'mondulkiri': 'មណ្ឌលគិរី',
    'ratanakiri': 'រតនគិរី',
    'siem-reap-adventure': 'សៀមរាប',
    'takeo': 'តាកែវ',

    // Shopping categories
    'camping-equipment': 'គ្រឿងបរិក្ខារជំរុំ',
    'camping-tents': 'តង់ជំរុំ',
    'bottles': 'ដបទឹក',
    'camping-pump': 'ម៉ាស៊ីនបូមជំរុំ',
    'mattress': 'ពូក',
    'pillow-hammock': 'ខ្នើយ និង អង្រឹង',
    'chair-table': 'កៅអី និង តុ',
    'sleeping-bag': 'កន្សែងគេង',
    'camping-shelters': 'ជំរមជំរុំ',
    'camping-accessories': 'គ្រឿងប្រដាប់ជំរុំ',
    'camping-trekking': 'ជំរុំ និង ដំណើរឈើ',

    // Contact and social
    'footer-address': 'ភ្នំពេញ កម្ពុជា',
    'facebook-page': 'មើលទំព័រ Facebook របស់យើង',
    'twitter-page': 'តាមដានយើងនៅ Twitter',
    'instagram-page': 'តាមដានយើងនៅ Instagram',
    'youtube-channel': 'ជាវឆានែល YouTube របស់យើង',

    // Footer bottom
    'copyright': '© {២០២៥} Camtour Recommender។ រក្សាសិទ្ធិទាំងអស់។',
    'privacy-policy': 'គោលការណ៍ភាពឯកជន',
    'terms-of-service': 'លក្ខខណ្ឌសេវាកម្ម',
    'faq': 'សំណួរញឹកញាប់',

    //login form
    'back-to-home': 'ត្រឡប់ទៅទំព័រដើម',

    // Branding
    'camtour-brand': 'Camtour',
    'login-slogan': 'រកឃើញពិភពលោកជាមួយមគ្គុទ្ទេសក៍ជំនាញ',

    // Login form header
    'welcome-back': 'សូមស្វាគមន៍មកវិញ!',
    'login-subtitle': 'ចូលគណនីរបស់អ្នក',

    // Form fields
    'email-placeholder': 'email@example.com',
    'password': 'ពាក្យសម្ងាត់',
    'password-placeholder': '••••••••',
    'remember-me': 'ចងចាំខ្ញុំ',
    'forgot-password': 'ភ្លេចពាក្យសម្ងាត់?',

    // Buttons
    'login-button': 'ចូលគណនី',
    'show-password': 'បង្ហាញពាក្យសម្ងាត់',
    'hide-password': 'លាក់ពាក្យសម្ងាត់',

    // Social login
    'or-continue-with': 'ឬបន្តជាមួយ',
    'login-with-google': 'ចូលជាមួយ Google',
    'login-with-apple': 'ចូលជាមួយ Apple',
    'login-with-facebook': 'ចូលជាមួយ Facebook',
    'google': 'Google',
    'apple': 'Apple',
    'facebook': 'Facebook',

    // Registration prompt
    'no-account': 'មិនមានគណនីទេឬ?',
    'register-now': 'ចុះឈ្មោះឥឡូវនេះ',

    // Validation messages
    'email-required': 'តម្រូវអោយមានអ៊ីមែល',
    'email-invalid': 'សូមបញ្ចូលអាស័យដ្ឋានអ៊ីមែលត្រឹមត្រូវ',
    'password-required': 'តម្រូវអោយមានពាក្យសម្ងាត់',

    // Error messages
    'login-failed': 'ការចូលបានបរាជ័យ។ សូមពិនិត្យព័ត៌មានរបស់អ្នកម្តងទៀត។',
    'network-error': 'បញ្ហាបណ្តាញ។ សូមព្យាយាមពេលក្រោយ។',
    'invalid-credentials': 'អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ',
    'account-locked': 'គណនីត្រូវបានចាក់សោជាបណ្តោះអាសន្ន។ សូមព្យាយាមម្តងទៀតពេលក្រោយ។',
    'server-error': 'បញ្ហាម៉ាស៊ីនមេ។ សូមព្យាយាមម្តងទៀតពេលក្រោយ។',

    //sign up
    'adventure-starts-here': 'ការផ្សងព្រេងចាប់ផ្តើមពីទីនេះ',
    'join-travel-community': 'ចូលរួមជាមួយសហគមន៍ទេសចរណ៍របស់យើងថ្ងៃនេះ',

    // Social login
    'continue-with-google': 'បន្តជាមួយ Google',
    'or-sign-up-with-email': 'ឬចុះឈ្មោះជាមួយអ៊ីមែល',

    // Form fields - Register specific
    // 'first-name': 'នាមខ្លួន',
    'first-name-placeholder': 'បញ្ចូលនាមខ្លួនរបស់អ្នក',
    // 'last-name': 'នាមត្រកូល',
    'last-name-placeholder': 'បញ្ចូលនាមត្រកូលរបស់អ្នក',
    'date-of-birth': 'ថ្ងៃខែឆ្នាំកំណើត',
    'profile-image': 'រូបភាពប្រវត្តិរូប',
    'photo': 'រូបភាព',
    'profile-preview': 'មើលរូបភាពប្រវត្តិរូប',
    'calendar': 'ប្រតិទិន',
    'upload': 'បញ្ចូល',

    'phone-placeholder': 'បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក',

    // Password fields - Register specific
    'confirm-password': 'បញ្ជាក់ពាក្យសម្ងាត់',
    'confirm-password-placeholder': 'បញ្ជាក់ពាក្យសម្ងាត់របស់អ្នក',

    // Password strength
    'password-strength-weak': 'ខ្សោយ',
    'password-strength-medium': 'មធ្យម',
    'password-strength-strong': 'ខ្លាំង',

    // Password requirements - Register specific
    'password-requirement-length': 'យ៉ាងហោចណាស់ ៨ តួអក្សរ',
    'password-requirement-uppercase': 'អក្សរធំមួយ',
    'password-requirement-lowercase': 'អក្សរតូចមួយ',
    'password-requirement-special': 'និមិត្តសញ្ញាពិសេសមួយ',

    // Terms and conditions - Register specific
    'agree-to-terms-start': 'ខ្ញុំយល់ព្រមលើ',
    'and': 'និង',

    // Buttons - Register specific
    'creating-account': 'កំពុងបង្កើតគណនី...',
    'start-your-journey': 'ចាប់ផ្តើមដំណើររបស់អ្នក',

    // Login link - Register specific
    'already-have-account': 'មានគណនីរួចហើយឬ?',
    'sign-in': 'ចូល',
    // 'stars': 'star',

    // Success modal - Register specific
    'welcome-aboard': 'សូមស្វាគមន៍មកកាន់!',
    'journey-begins-now': 'ដំណើររបស់អ្នកជាមួយយើងចាប់ផ្តើមឥឡូវនេះ។ ត្រៀមខ្លួនសម្រាប់ការរុករកទិសដៅអស្ចារ្យ!',
    'continue-to-login': 'បន្តទៅការចូល',

    // Validation messages - Register specific
    'first-name-required': 'តម្រូវអោយមាននាមខ្លួន',
    'first-name-min-length': 'នាមខ្លួនត្រូវតែមានយ៉ាងហោចណាស់ ២ តួអក្សរ',
    'last-name-required': 'តម្រូវអោយមាននាមត្រកូល',
    'last-name-min-length': 'នាមត្រកូលត្រូវតែមានយ៉ាងហោចណាស់ ២ តួអក្សរ',
    'dob-required': 'តម្រូវអោយមានថ្ងៃខែឆ្នាំកំណើត',
    'dob-min-age': 'អ្នកត្រូវតែមានអាយុយ៉ាងហោចណាស់ ១៣ ឆ្នាំ',
    'phone-invalid': 'សូមបញ្ចូលលេខទូរស័ព្ទត្រឹមត្រូវ',
    'password-too-weak': 'សូមបង្កើតពាក្យសម្ងាត់កាន់តែខ្លាំង',
    'confirm-password-required': 'សូមបញ្ជាក់ពាក្យសម្ងាត់របស់អ្នក',
    'passwords-do-not-match': 'ពាក្យសម្ងាត់មិនដូចគ្នា',
    'terms-must-be-accepted': 'អ្នកត្រូវតែយល់ព្រមលើលក្ខខណ្ឌដើម្បីបន្ត',
    'image-invalid-type': 'សូមបញ្ចូលឯកសាររូបភាពត្រឹមត្រូវ (JPG, PNG, ឬ GIF)',
    'image-too-large': 'ទំហំរូបភាពគួរតែតិចជាង ៥MB',

    // Error messages - Register specific
    'registration-failed': 'ការចុះឈ្មោះបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។',
    'registration-error': 'មានបញ្ហាកើតឡើងកំឡុងពេលចុះឈ្មោះ។ សូមព្យាយាមម្តងទៀត។',
    'all-categories': 'ប្រភេទនៃតំបន់ទាំងអស់',

    //Adventure Page
    'adventure-page-title': 'ការផ្សងព្រេង',

    // Hero section
    'hero-title-line1': 'ដល់ពេលហើយ',
    'hero-title-line2': 'សម្រាប់ការឡើងភ្នំ',
    'hero-subtitle': 'រុករកសម្រស់ធម្មជាតិរបស់កម្ពុជា',
    'hero-description': 'ការឡើងភ្នំនៅកម្ពុជាផ្តល់នូវការផ្សងព្រេងដែលមិនអាចបំភ្លេចបានតាមរយៈព្រៃឈើខៀវស្រងាត់ ភ្នំដាច់ស្រយាល និងផ្លូវប្រាសាទបុរាណ។ ពីកំពូលភ្នំគុលែនដែលមានអ័ព្ទ រហូតដល់ទឹកធ្លាក់ស្ងប់ស្ងាត់នៃមណ្ឌលគិរី និងផ្លូវលាក់កំបាំងជុំវិញភ្នំក្រវាញ កម្ពុជាគឺជាសួនសុខសម្រាប់អ្នកស្រលាញ់ធម្មជាតិ។',
    'hiking-adventure-alt': 'ការផ្សងព្រេងឡើងភ្នំ',

    // Header section
    'adventure-tourism-tag': 'ទេសចរណ៍ផ្សងព្រេង',
    'ready-to-hiking-title': 'តើអ្នកត្រៀមរួចហើយឬនៅសម្រាប់ការការផ្សងព្រេង?',

    // Sidebar filters
    'filter-options': 'ជម្រើសតម្រង',
    'your-favorite-place': 'កន្លែងសំណព្វរបស់អ្នក',
    'popular-place-in': 'កន្លែងពេញនិយមនៅ',
    'star-rating': 'ការវាយតម្លៃផ្កាយ',
    'five-stars': '៥ ផ្កាយ',
    'four-stars': '៤ ផ្កាយ',
    'three-stars': '៣ ផ្កាយ',
    'two-stars': '២ ផ្កាយ',
    'stars': 'ផ្កាយ',
    'reset-filters': 'កំណត់តម្រងឡើងវិញ',

    // Content area
    'no-results-alt': 'រកមិនឃើញលទ្ធផល',
    'adventure-category-default': 'ការផ្សងព្រេង',
    'read-more': 'អានបន្ថែម',
    'view-details': 'មើលព័ត៌មានលម្អិត',

    // View counts
    'no-views': 'គ្មានការមើល',
    'one-view': '១ ការមើល',
    'multiple-views': 'ការមើល',

    // Pagination
    'prev': 'មុន',
    'next': 'បន្ទាប់',
    'previous-page': 'ទំព័រមុន',
    'next-page': 'ទំព័របន្ទាប់',
    'more-pages': 'ទំព័របន្ថែម',
    'page-number': 'ទំព័រ {number}',


    // Provinces
    'province-battambang': 'បាត់ដំបង',
    'province-banteay-meanchey': 'បន្ទាយមានជ័យ',
    'province-kampong-cham': 'កំពង់ចាម',
    'province-kampong-chhnang': 'កំពង់ឆ្នាំង',
    'province-kampong-speu': 'កំពង់ស្ពឺ',
    'province-kampong-thom': 'កំពង់ធំ',
    'province-kampot': 'កំពត',
    'province-kandal': 'កណ្តាល',
    'province-kep': 'កែប',
    'province-koh-kong': 'កោះកុង',
    'province-kratie': 'ក្រចេះ',
    'province-mondulkiri': 'មណ្ឌលគិរី',
    'province-ratanakiri': 'រតនគិរី',
    'province-siem-reap': 'សៀមរាប',
    'province-preah-sihanouk': 'ព្រះសីហនុ',
    'province-stung-treng': 'ស្ទឹងត្រែង',
    'province-svay-rieng': 'ស្វាយរៀង',
    'province-takeo': 'តាកែវ',
    'province-oddar-meanchey': 'ឧត្តរមានជ័យ',
    'province-pursat': 'ពោធិ៍សាត់',
    'province-preah-vihear': 'ព្រះវិហារ',
    'province-prey-veng': 'ព្រៃវែង',
    'province-pailin': 'ប៉ៃលិន',
    'province-tboung-khmum': 'ត្បូងឃ្មុំ',

    // Districts
    'district-angkor-thom': 'អង្គរធំ',
    'district-banteay-srei': 'បន្ទាយស្រី',
    'district-chi-kraeng': 'ជីក្រែង',
    'district-krakir': 'ក្រករ',
    'district-phouk': 'ភូក',
    'district-prasat-bokong': 'ប្រាសាទបកុង',
    'district-soutr-nikom': 'សូត្រនិកម',
    'district-srei-snam': 'ស្រីស្នំ',
    'district-svey-leu': 'ស្វាយលើ',
    'district-kampong-kdei': 'កំពង់កដី',
    'district-varin': 'វារិន',
    'district-kulen': 'គូលែន',

    // Categories
    'category-adventure': 'ការផ្សងព្រេង',
    'category-hiking': 'ការឡើងភ្នំ',
    'category-trekking': 'ការដើរលេង',
    'category-mountain-climbing': 'ការឡើងភ្នំ',
    'category-nature': 'ធម្មជាតិ',
    'category-waterfall': 'ទឹកធ្លាក់',
    'category-forest': 'ព្រៃឈើ',
    'category-temple-trail': 'ផ្លូវប្រាសាទ',

    //product
    'shop-page-title': 'ហាងលក់គ្រឿងផ្សងព្រេង',

    // Search header - Shop specific
    'find-perfect-gear': 'រកឃើញគ្រឿងបរិក្ខារល្អឥតខ្ចោះ',
    'discover-premium-equipment': 'ស្វែងរកគ្រឿងបរិក្ខារខាងក្រៅដ៏ល្អបំផុតសម្រាប់ការផ្សងព្រេងគ្រប់យ៉ាង',
    'search-placeholder-shop': 'ស្វែងរកគ្រឿងឡើងភ្នំ គ្រឿងបរិក្ខារជំរុំ គ្រឿងថតរូប...',
    'popular-brands': 'ម៉ាកពេញនិយម',
    'searching-for': 'កំពុងស្វែងរក',
    'clear-search': 'សម្អាតការស្វែងរក',

    // Filters - Shop specific
    'filter-products': 'តម្រងផលិតផល',
    'price-range': 'ជួរតម្លៃ',
    'brands': 'ម៉ាក',
    'sort-by': 'តម្រៀបតាម',
    'price-low-to-high': 'តម្លៃ: ពីទាបទៅខ្ពស់',
    'price-high-to-low': 'តម្លៃ: ពីខ្ពស់ទៅទាប',
    'newest': 'ថ្មីបំផុត',
    'popularity': 'ពេញនិយម',

    // Status messages - Shop specific
    'loading-products': 'កំពុងផ្ទុកផលិតផល...',
    'try-again': 'ព្យាយាមម្តងទៀត',
    'no-products-found': 'រកមិនឃើញផលិតផលដែលត្រូវនឹងលក្ខណៈវិនិច្ឆ័យរបស់អ្នក។',
    'error-loading-products': 'មានបញ្ហាកើតឡើងពេលផ្ទុកផលិតផល។ សូមព្យាយាមម្តងទៀត។',

    // Products - Shop specific
    'outdoor-gear': 'គ្រឿងបរិក្ខារខាងក្រៅ',
    'items-count': 'ទំនិញ',
    'grid-view': 'ទិដ្ឋភាពក្រឡាចត្រង្គ',
    'list-view': 'ទិដ្ឋភាពបញ្ជី',
    'product-view': 'មើលផលិតផល',
    'rent-now': 'កម្មង់',
    'add-to-wishlist': 'បន្ថែមទៅបញ្ជីចង់បាន',
    'remove-from-wishlist': 'យកចេញពីបញ្ជីចង់បាន',

    // Product badges - Shop specific
    'premium': 'ព្រីមៀម',
    'discount-percentage': 'បញ្ចុះតម្លៃ {percent}%',

    // Stock status - Shop specific
    'stock-status-in-stock': 'មានក្នុងស្តុក',
    'stock-status-available': 'មាន',
    'stock-status-low-stock': 'ស្តុកតិច',
    'stock-status-limited': 'ស្តុកកំណត់',
    'stock-status-out-of-stock': 'អស់ស្តុក',
    'stock-status-unavailable': 'មិនមាន',

    // Product categories - Shop specific
    'category-outdoor-gear': 'គ្រឿងបរិក្ខារខាងក្រៅ',
    'category-adventure-gear': 'គ្រឿងបរិក្ខារផ្សងព្រេង',
    'category-backpacking': 'ការដើរកំសាន្ត',
    'category-climbing': 'ការឡើងភ្នំ',
    'category-travel': 'ការដំណើរ',
    'category-electronics': 'គ្រឿងអេឡិចត្រូនិក',
    'category-footwear': 'ស្បែកជើង',
    'category-safety': 'សុវត្ថិភាព',
    'category-navigation': 'ការណែនាំ',
    'category-cooking': 'ការធ្វើម្ហូប',
    'category-shelter': 'ជម្រក',
    'category-lighting': 'ភ្លើង',
    'category-water': 'ទឹក និង ការផ្គត់ផ្គង់ទឹក',

    //about us
    // Page title
    'about-page-title': 'អំពីយើងខ្ញុំ',

    // Hero section
    'discover-hidden-trails': 'ស្វែងរកផ្លូវលាក់កំបាំងរបស់កម្ពុជា',
    'hiking-trails': 'ផ្លូវឡើងភ្នំ',
    'provinces': 'ខេត្ត',
    'happy-hikers': 'អ្នកឡើងភ្នំរីករាយ',

    // Our Story section
    'our-story': 'រឿងរ៉ាវរបស់យើង',
    'story-paragraph-1': 'កើតចេញពីចំណង់ចំណូលចិត្តចំពោះព្រៃឈើដុំរបស់កម្ពុជា វេទិការបស់យើងភ្ជាប់ព្រលឹងដែលស្រលាញ់ការផ្សងព្រេងជាមួយនឹងគោលដៅការឡើងភ្នំដ៏អស្ចារ្យបំផុតរបស់ព្រះរាជាណាចក្រ។ ពីប្រាសាទអង្គរវត្តអាថ៌កំបាំងរហូតដល់ព្រៃឈើដើមនៃភ្នំក្រវាញ យើងប្តេជ្ញាចិត្តបង្ហាញបាតុភូតធម្មជាតិរបស់កម្ពុជាដោយផ្តល់ជូនទេសចរណ៍ប្រកបដោយនិរន្តរភាព។',
    'story-paragraph-2': 'ដំណើររបស់យើងបានចាប់ផ្តើមក្នុងឆ្នាំ ២០២០ នៅពេលដែលក្រុមអ្នកស្រលាញ់ការឡើងភ្នំក្នុងស្រុកបានទទួលស្គាល់ពីតម្រូវការសម្រាប់វេទិកាដ៏ទូលំទូលាយមួយដែលនឹងធ្វើឱ្យផ្លូវដ៏អស្ចារ្យរបស់កម្ពុជាអាចចូលដំណើរការបានទាំងអ្នកក្នុងស្រុកនិងភ្ញៀវអន្តរជាតិ។ សព្វថ្ងៃនេះ យើងមានមោទនភាពដែលជាសហគមន៍ឡើងភ្នំឈានមុខនាក្នុងកម្ពុជា។',

    // Featured Destinations
    'explore-premier-destinations': 'ស្វែងរកគោលដៅឡើងភ្នំកំពូលរបស់កម្ពុជា',
    'destinations-subtitle': 'ពីផ្លូវប្រាសាទបុរាណរហូតដល់កំពូលភ្នំសុភាព ស្វែងរកបទពិសោធន៍ឡើងភ្នំដ៏អស្ចារ្យបំផុតរបស់ព្រះរាជាណាចក្រ',

    // Difficulty levels
    'difficulty-expert': 'ជំនាញ',
    'difficulty-beginner': 'ចាប់ផ្តើម',
    'difficulty-intermediate': 'មធ្យម',

    // Destination names and descriptions
    'cardamom-mountains': 'ភ្នំក្រវាញ',
    'koh-kong-province': 'ខេត្តកោះកុង',
    'cardamom-description': 'ជួរភ្នំដ៏ធំបំផុតនិងមានជីវចម្រុះបំផុតរបស់កម្ពុជាផ្តល់នូវការដើរលេងពីរបីថ្ងៃតាមរយៈព្រៃឈើដើម ទឹកធ្លាក់ដ៏អស្ចារ្យ និងការជួបសត្វព្រៃរួមទាំងដំរីអាស៊ីនិងខ្លាឃ្មុំព្រះអាទិត្យ។',

    'angkor-archaeological-park': 'ឧទ្យានបុរាណវិទ្យាអង្គរ',
    'siem-reap-province': 'ខេត្តសៀមរាប',
    'angkor-description': 'ស្វែងរកផ្លូវព្រៃលាក់កំបាំងដែលភ្ជាប់ប្រាសាទខ្មែរបុរាណ រួមទាំងផ្លូវសម្ងាត់ទៅបឹងមាលានិងក្រុមប្រាសាទដាច់ស្រយាលដែលភ្ញៀវទេសចរមិនសូវមកទស្សនា។',

    'preah-vihear-temple': 'ប្រាសាទព្រះវិហារ',
    'preah-vihear-province': 'ខេត្តព្រះវិហារ',
    'preah-vihear-description': 'ឡើងទៅប្រាសាទដែលមានទីតាំងដ៏អស្ចារ្យបំផុតរបស់កម្ពុជា ដែលស្ថិតនៅលើចំណោតថ្មកំពស់ ៥២៥ ម៉ែត្រនៅក្នុងភ្នំដងរែក ផ្តល់នូវទិដ្ឋភាពទូលំទូលាយលើវាលទំនាបកម្ពុជា។',

    'kep-national-park': 'ឧទ្យានជាតិកែប',
    'kep-province': 'ខេត្តកែប',
    'kep-description': 'ផ្លូវឡើងភ្នំតាមបណ្តោយសមុទ្រតាមរយៈព្រៃត្រូពិចជាមួយនឹងទិដ្ឋភាពសមុទ្រដ៏អស្ចារ្យ សួនមេអំបៅ និងឱកាសឃើញប្រភេទបក្សីផ្សេងៗនិងសត្វស្វា។',

    'mondulkiri-hills': 'ភ្នំមណ្ឌលគិរី',
    'mondulkiri-province': 'ខេត្តមណ្ឌលគិរី',
    'mondulkiri-description': 'ភ្នំរំកិល ទីជម្រកដំរី និងភូមិជនជាតិបុនងដើម។ សម្រាកអាកាសធាតុត្រជាក់របស់កម្ពុជា ចម្ការកាហ្វេ និងទឹកធ្លាក់ដ៏អស្ចារ្យដូចជាបូស្រា។',

    'bokor-national-park': 'ឧទ្យានជាតិបូកគោ',
    'kampot-province': 'ខេត្តកំពត',
    'bokor-description': 'ផ្លូវភ្នំមានអ័ព្ទនាំទៅកាន់ស្ថានីយ៍ភ្នំបារាំងដែលបោះបង់ចោល ដែលមានប្រាសាទសណ្ឋាគារបូកគោដ៏ល្បីល្បាញនិងទិដ្ឋភាពដ៏អស្ចារ្យនៃឈូងសមុទ្រថៃ។',

    // Destination highlights
    'wildlife-viewing': 'មើលសត្វព្រៃ',
    'waterfalls': 'ទឹកធ្លាក់',
    'multi-day-treks': 'ដំណើរពីរបីថ្ងៃ',
    'ancient-temples': 'ប្រាសាទបុរាណ',
    'jungle-trails': 'ផ្លូវព្រៃ',
    'photography': 'ការថតរូប',
    'mountain-views': 'ទិដ្ឋភាពភ្នំ',
    'unesco-site': 'បេតិកភណ្ឌយូណេស្កូ',
    'sunrise-hikes': 'ឡើងភ្នំពេលព្រះអាទិត្យរះ',
    'ocean-views': 'ទិដ្ឋភាពសមុទ្រ',
    'butterflies': 'មេអំបៅ',
    'wildlife': 'សត្វព្រៃ',
    'elephant-sanctuary': 'ទីជម្រកដំរី',
    'coffee-trails': 'ផ្លូវកាហ្វេ',
    'hill-tribes': 'ជនជាតិភ្នំ',
    'ghost-town': 'ទីក្រុងខ្មោច',
    'cloud-forest': 'ព្រៃពពក',
    'coastal-views': 'ទិដ្ឋភាពបណ្តោយសមុទ្រ',

    // Cambodia facts
    'why-hike-cambodia': 'ហេតុអ្វីត្រូវឡើងភ្នំនៅកម្ពុជា?',
    'biodiversity-hotspot': 'ចំណុចសំខាន់ជីវចម្រុះ',
    'biodiversity-description': 'ជាលំនៅរបស់រុក្ខជាតិលើស ២,៣០០ ប្រភេទ បក្សី ៨០០ ប្រភេទ និងសត្វព្រៃកម្រដូចជាខ្លាធំ ដំរី និងផ្សោតអ៊ីរ៉ាវ៉ាឌី។',

    'years-of-history': 'ប្រវត្តិសាស្រ្តជាង ១០០០ ឆ្នាំ',
    'history-description': 'ដើរតាមទេសភាពដែលប្រកបដោយប្រាសាទខ្មែរបុរាណ ខ្លះមានអាយុចាប់ពីសតវត្សទី៩ រួមទាំងបេតិកភណ្ឌពិភពលោករបស់យូណេស្កូ។',

    'tropical-climate': 'អាកាសធាតុត្រូពិច',
    'climate-description': 'ឱកាសឡើងភ្នំពេញមួយឆ្នាំជាមួយនឹងស្ថានភាពល្អបំផុតពីខែវិច្ឆិកាដល់ខែមីនា។ រដូវស្ងួតផ្តល់នូវមេឃច្បាស់និងសីតុណ្ហភាពស្រួល។',

    'affordable-adventure': 'ការផ្សងព្រេងតម្លៃសមរម្យ',
    'affordable-description': 'បទពិសោធន៍ឡើងភ្នំកម្រិតពិភពលោកក្នុងតម្លៃតិចជាងបណ្តាគោលដៅអាស៊ីអាគ្នេយ៍ផ្សេងទៀត ជាមួយនឹងកន្លែងស្នាក់នៅតម្លៃសមរម្យនិងមគ្គុទេសក៍ក្នុងស្រុក។',

    // Mission & Values
    'mission-values': 'បេសកកម្ម និងតម្លៃរបស់យើង',
    'sustainable-tourism': 'ទេសចរណ៍ប្រកបដោយនិរន្តរភាព',
    'sustainable-description': 'លើកទឹកចិត្តការអនុវត្តឡើងភ្នំដែលមិនបំផ្លាញបរិស្ថានដើម្បីរក្សាព្រៃឈើដុំរបស់កម្ពុជាសម្រាប់មនុស្សជំនាន់ក្រោយដោយគាំទ្រសហគមន៍មូលដ្ឋាន។',

    'trail-accessibility': 'ភាពងាយស្រួលរបស់ផ្លូវ',
    'accessibility-description': 'ផ្តល់នូវផែនទីផ្លូវលម្អិត កូអរដោណេ GPS ការវាយតម្លៃភាពលំបាក និងការណែនាំឧបករណ៍ទូលំទូលាយសម្រាប់ការផ្សងព្រេងប្រកបដោយសុវត្ថិភាពនិងរីករាយ។',

    'community-support': 'ការគាំទ្រសហគមន៍',
    'community-description': 'ភាពជាដៃគូជាមួយមគ្គុទេសក៍ក្នុងស្រុក សហគមន៍ជនជាតិដើម និងអង្គការអភិរក្សដើម្បីបង្កើតបទពិសោធន៍ឡើងភ្នំពិតប្រាកដនិងទទួលខុសត្រូវ។',

    'safety-first': 'សុវត្ថិភាពជាមុនសិន',
    'safety-description': 'ផ្តល់អាទិភាពដល់សុវត្ថិភាពអ្នកឡើងភ្នំតាមរយៈការធ្វើបច្ចុប្បន្នភាពអាកាសធាតុក្នុងពេលវេលាជាក់ស្តែង ពិធីការសង្គ្រោះបន្ទាន់ និងភាពជាដៃគូជាមួយសេវាកម្មសង្គ្រោះក្នុងស្រុក។',

    // Our Team
    'meet-adventure-team': 'ស្គាល់ក្រុមការងារផ្សងព្រេងរបស់យើង',
    'team-intro': 'ជនជាតិក្នុងស្រុកដែលមានចំណង់ចំណូលចិត្តនិងជំនាញការឡើងភ្នំដែលប្តេជ្ញាចិត្តចែករំលែកបាតុភូតធម្មជាតិរបស់កម្ពុជា',

    // Team member roles
    'founder-chief-guide': 'អ្នកបង្កើតនិងមគ្គុទេសក៍ដើមបំផុត',
    'ux-designer-cartographer': 'អ្នករចនា UX/UI និងអ្នកធ្វើផែនទីឌីជីថល',
    'content-creator-cultural': 'អ្នកបង្កើតមាតិកានិងជំនាញវប្បធម៌',
    'backend-developer-architect': 'អ្នកអភិវឌ្ឍន៍ Backend និងស្ថាបត្យកម្មប្រព័ន្ធ',
    'technical-advisor-conservation': 'ទីប្រឹក្សាបច្ចេកទេសនិងជំនាញអភិរក្ស',

    // Call to Action
    'ready-start-adventure': 'ត្រៀមរួចសម្រាប់ចាប់ផ្តើមការផ្សងព្រេងកម្ពុជារបស់អ្នកហើយឬនៅ?',
    'contact-guides': 'ទាក់ទងមគ្គុទេសក៍របស់យើង',


    //siem reap
    // Siem Reap Page Specific
    'siem-reap-page-title': 'សៀមរាប',
    'home-page-title': 'ទំព័រដើម',

    'gateway-to-angkor': 'ទ្វារចូលទៅអង្គរ',
    'ancient-sites': 'បុរាណដ្ឋាន',
    'temples': 'ប្រាសាទ',
    'explore-siem-reap': 'ស្វែងរកសៀមរាប',

    // About Siem Reap Section
    'about-siem-reap': 'អំពីសៀមរាប',
    'population': 'ចំនួនប្រជាជន',
    'area': 'ផ្ទៃដី',
    'province': 'ខេត្ត',
    'main-language': 'ភាសាសំខាន់',
    'currency': 'រូបិយប័ណ្ណ',
    'best-time-to-visit': 'ពេលល្អបំផុតសម្រាប់ទស្សនា',
    'famous-for': 'ល្បីសម្រាប់',
    'climate': 'អាកាសធាតុ',
    'cool-dry-season': 'រដូវត្រជាក់ និងស្ងួត',
    'khmer-cambodian-english': 'ខ្មែរ (កម្ពុជា), អង់គ្លេសនិយាយបានទូលំទូលាយ',
    'cambodian-riel-us-dollar': 'រៀលកម្ពុជា (KHR) និងដុល្លារអាមេរិក (USD)',
    'november-to-march': 'វិច្ឆិកាដល់មីនា (រដូវត្រជាក់ និងស្ងួត)',
    'angkor-wat-complex': 'ប្រាសាទអង្គរវត្ត និងស្ថាបត្យកម្មខ្មែរបុរាណ',
    'tropical-monsoon-climate': 'អាកាសធាតុត្រូពិចម៉ានស៊ុនជាមួយរដូវវស្សា (ឧសភា-តុលា) និងរដូវស្ងួត (វិច្ឆិកា-មេសា)។ សីតុណ្ហភាពជាមធ្យម ២៥-៣៥ អង្សាសេ។',

    // Filter Section
    'filter-by-location': 'តម្រងតាមទីតាំង',
    'district': 'ស្រុក',
    'commune': 'ឃុំ',
    'village': 'ភូមិ',
    'all-districts': 'ស្រុកទាំងអស់',
    'all-communes': 'ឃុំទាំងអស់',
    'all-villages': 'ភូមិទាំងអស់',
    'rating-filter': 'តម្រងការវាយតម្លៃ',
    'minimum-views': 'ចំនួនអ្នកមើលអប្បបរមា',

    // Star Ratings
    'stars-plus': '+ ផ្កាយ',
    'all-ratings': 'ការវាយតម្លៃទាំងអស់',

    // Cultural Heritage
    'cultural-heritage-siem-reap': 'បេតិកភណ្ឌវប្បធម៌សៀមរាប',
    'angkor-wat': 'អង្គរវត្ត',
    'angkor-wat-description': 'វិហារសាសនាធំបំផុតនៅលើពិភពលោក និងជាបេតិកភណ្ឌពិភពលោករបស់យូណេស្កូ ដែលតំណាងឱ្យកំពូលនៃស្ថាបត្យកម្មខ្មែរ។',
    '12th-century': 'សតវត្សទី១២',
    'hindu-temple-complex': 'ប្រាសាទហិណ្ឌូ',

    'bayon-temple': 'ប្រាសាទបាយ័ន',
    'bayon-description': 'ល្បីសម្រាប់មុខថ្មធំៗដ៏ស្ងប់ស្ងាត់ ប្រាសាទនេះស្ថិតនៅកណ្តាលអង្គរធំ។',
    'late-12th-century': 'ចុងសតវត្សទី១២',
    'buddhist-temple': 'ប្រាសាទព្រះពុទ្ធសាសនា',

    'ta-prohm': 'តាព្រហ្ម',
    'ta-prohm-description': '\'ប្រាសាទ Tomb Raider\' ដែលថ្មបុរាណ និងឫសគើធ្វើឱ្យមានបរិយាកាសអាថ៌កំបាំង។',
    'buddhist-monastery': 'វត្តព្រះពុទ្ធសាសនា',

    'banteay-srei-description': 'ត្រូវបានគេស្គាល់ថាជា \'ប្រាសាទស្ត្រី\' សម្រាប់ការចារិកថ្មភក់ស្រទាប់ៗ និងសិល្បៈយ៉ាងល្អិត។',
    '10th-century': 'សតវត្សទី១០',
    'hindu-temple': 'ប្រាសាទហិណ្ឌូ',

    // Most Popular Destinations
    'most-popular-destinations': 'គោលដៅពេញនិយមបំផុត',

    // Local Cuisine
    'siem-reap-local-cuisine': 'មុខម្ហូបក្នុងស្រុកសៀមរាប',
    'fish-amok': 'អាមុកត្រី',
    'fish-amok-description': 'មុខម្ហូបជាតិរបស់កម្ពុជា - ការ៉ីដូងគ្រឿងក្រមក្រឡុកជាមួយត្រីចំហុយក្នុងស្លឹកចេក។',
    'main-course': 'មុខម្ហូបសំខាន់',
    'price-range-3-8': '៛ ១២០០០​​ - ៣២០០០',

    'lok-lak': 'លុកឡាក់',
    'lok-lak-description': 'សាច់គោឆាកម្ពុជាបរិភោគជាមួយបាយ និងទឹកជ្រលក់ម្រេចកន្ត្រោបជូរ។',
    'price-range-4-10': '៛ ១៦០០០ - ៤០០០០',

    'nom-banh-chok': 'នំបញ្ចុក',
    'nom-banh-chok-description': 'មីខ្មែរប្រពៃណីជាមួយទឹកស៊ុបពណ៌បៃតងដែលមានមូលដ្ឋានលើត្រី តែងតែបរិភោគសម្រាប់អាហារពេលព្រឹក។',
    'breakfast-light-meal': 'អាហារពេលព្រឹក/អាហារស្រាល',
    'price-range-1-3': '៛ ៤០០០ - ១២០០០',
    'cta-description-about': "ចូលរួមជាមួយអ្នកដើរលេងរាប់ពាន់នាក់ដែលបានរកឃើញត្បូងលាក់កំបាំងរបស់កម្ពុជា។ ការផ្សងព្រេងដ៏អស្ចារ្យបន្ទាប់របស់អ្នកកំពុងរង់ចាំ!",
    'prahok-ktiss': 'ប្រហុកក្ដីស',
    'prahok-ktiss-description': 'ទឹកជ្រលក់ត្រីចំរុះប្រពៃណីបរិភោគជាមួយបន្លែស្រស់ និងបាយ។',
    'appetizer': 'ម្ហូបសម្រន់',
    'price-range-2-5': '៛ ៨០០០ - ២០០០០',

    // All Tourist Destinations
    'all-tourist-destinations': 'គោលដៅទេសចរណ៍ទាំងអស់',
    'amazing-places-found': 'កន្លែងអស្ចារ្យដែលរកឃើញ',
    'loading-amazing-destinations': 'កំពុងផ្ទុកគោលដៅអស្ចារ្យ...',

    // Travel Tips
    'travel-tips-siem-reap': 'គន្លឹះទេសចរណ៍សម្រាប់សៀមរាប',
    'getting-around': 'ការធ្វើដំណើរ',
    'getting-around-tips': [
      'ជួលកង់សម្រាប់ការរុករកប្រាសាទ',
      'តុកតុកល្អឥតខ្ចោះសម្រាប់ចម្ងាយខ្លី',
      'ជួលឡានជាមួយអ្នកបើកបរសម្រាប់ដំណើរមួយថ្ងៃ',
      'ទាញយកផែនទីបិទអ៊ីនធឺណិតមុនពេលរុករក'
    ],

    'temple-visits': 'ការទស្សនាប្រាសាទ',
    'temple-visits-tips': [
      'ទិញសំបុត្រ៣ថ្ងៃសម្រាប់ការរុករកប្រាសាទបានល្អប្រសើរ',
      'ចាប់ផ្តើមម៉ោង៥៖៣០ព្រឹកសម្រាប់ព្រះអាទិត្យរះនៅអង្គរវត្ត',
      'ស្លៀកពាក់សមរម្យ (គ្របស្មា និងជង្គង់)',
      'យកទឹក និងក្រែមការពារពន្លឺថ្ងៃច្រើន'
    ],

    'local-etiquette': 'សុជីវធម៌ក្នុងស្រុក',
    'local-etiquette-tips': [
      'ដោះស្បែកជើងពេលចូលប្រាសាទ',
      'សួរសុខទុក្ខដោយ\'សំពះ\' ប្រពៃណី (កាយវិការដូចការអធិស្ឋាន)',
      'កុំប៉ះព្រះសង្ឃ ឬរូបព្រះពុទ្ធ',
      'គោរពផ្នត់គំនិតក្នុងស្រុក និងច្បាប់ថតរូប'
    ],

    'money-shopping': 'លុយកាក់ និងការទិញទំនិញ',
    'money-shopping-tips': [
      'ដុល្លារអាមេរិកត្រូវបានទទួលយ៉ាងទូលំទូលាយជាមួយរៀល',
      'ចរចារនៅផ្សារ (ចាប់ផ្តើម៣០% នៃតម្លៃស្នើ)',
      'ទស្សនាផ្សារចាស់ និងផ្សារយប់សម្រាប់អនុស្សាវរីយ៍',
      'ផ្តល់ព្យាបាល១០% នៅភោជនីយដ្ឋាន $១-២ សម្រាប់អ្នកបើកតុកតុក'
    ],

    // Recommended Gear
    'recommended-gear-cambodia': 'គ្រឿងបរិក្ខារណែនាំសម្រាប់កម្ពុជា',
    'left': 'នៅសល់',
    'try-adjusting-filters' : 'សូមធ្វើការស្វែងរកឡើងវិញ',
  }
};

const languageService = {
  currentLanguage: localStorage.getItem('language') || 'en',
  translate(key) {
    const lang = this.currentLanguage;
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    return translations.en[key] || key;
  },
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      document.documentElement.setAttribute('lang', lang);
      window.dispatchEvent(new CustomEvent('language-changed', {
        detail: { language: lang }
      }));
    }
  }
};

export default languageService;