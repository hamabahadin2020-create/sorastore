const STORAGE_KEYS = {
  products: "sora_products",
  accounts: "sora_accounts",
  cart: "sora_cart",
  orders: "sora_orders",
  signedInUser: "sora_signed_in_user",
  blockedPhones: "sora_blocked_phones",
  heroImage: "sora_hero_image",
  heroContent: "sora_hero_content",
  chatThreads: "sora_chat_threads",
  catalogs: "sora_catalogs",
  linkRequestCart: "sora_link_request_cart",
  linkRequests: "sora_link_requests",
  wishlist: "sora_wishlist",
  notifications: "sora_notifications"
};

const ORDER_STEPS = ["Confirming", "Preparing", "Delivering", "Completed"];
const ADMIN_EMAIL = "admin@sora.com";
const ADMIN_PASSWORD = "admin123";
const PHONE_REGEX = /^\d{3}\s\d{3}\s\d{4}$/;

const defaultProducts = [
  {
    id: 1,
    productId: "PRD-0001",
    name: "Sora Classic Hoodie",
    brand: "Sora",
    type: "Clothes",
    category: "Hoodie",
    audience: "Women",
    country: "China",
    colors: ["Purple", "Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    material: "Cotton",
    price: 49,
    discountPrice: 39,
    stock: 15,
    description: "Clean premium hoodie for everyday wear.",
    accent: "linear-gradient(135deg, #7c3aed, #c4b5fd)",
    shippingOptions: {
      air: { enabled: true, price: 52, note: "Air shipping is faster and usually arrives first." },
      sea: { enabled: true, price: 41, note: "Sea shipping is lower cost and usually takes longer." }
    },
    images: []
  },
  {
    id: 2,
    productId: "PRD-0002",
    name: "Sora Urban Watch",
    brand: "Sora",
    type: "Watch",
    category: "Accessories",
    audience: "",
    country: "Turkey",
    colors: ["Black", "Silver", "Gold"],
    sizes: ["40mm", "42mm", "44mm"],
    material: "Steel",
    price: 79,
    discountPrice: 0,
    stock: 9,
    description: "Simple modern watch with a premium feel.",
    accent: "linear-gradient(135deg, #06b6d4, #a5f3fc)",
    shippingOptions: {
      air: { enabled: true, price: 88, note: "Air shipping is faster and better for urgent orders." },
      sea: { enabled: true, price: 74, note: "Sea shipping costs less but delivery takes longer." }
    },
    images: []
  }
];

const defaultAccounts = [
  {
    id: 1,
    userId: "USR-0001",
    name: "Owner",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    phone: "770 000 0000",
    role: "owner",
    blocked: false,
    createdAt: new Date().toISOString()
  }
];

const defaultHeroContent = {
  tag: "Premium shopping in Iraq",
  title: "Beautiful catalogs, trusted products, and smooth ordering for every customer.",
  description:
    "Browse curated collections, save your delivery address, and manage purchases through a refined storefront and dashboard experience.",
  card1Label: "Collections",
  card1Title: "Smart Catalogs",
  card2Label: "Orders",
  card2Title: "Fast Processing",
  card3Label: "Delivery",
  card3Title: "Iraq Only"
};

const defaultCatalogs = [
  { id: "catalog-1", name: "Featured" },
  { id: "catalog-2", name: "New Arrivals" },
  { id: "catalog-3", name: "Best Sellers" }
];

const state = {
  search: "",
  authMode: "signin",
  dashboardTab: "overview",
  dashboardUserSearch: "",
  dashboardOrderSearch: "",
  dashboardOrderStatus: "all",
  dashboardRequestSearch: "",
  dashboardRequestStatus: "all",
  products: [],
  cart: [],
  accounts: [],
  orders: [],
  blockedPhones: [],
  signedInUser: null,
  nextProductId: 1,
  nextAccountId: 1,
  heroImage: "",
  heroContent: { ...defaultHeroContent },
  chatThreads: [],
  activeChatThreadId: null,
  catalogs: [],
  selectedCatalog: "all",
  linkRequestCart: [],
  linkRequests: [],
  wishlist: [],
  notifications: [],
  activeProductDetailsId: null,
  language: "en"
};

const $ = (id) => document.getElementById(id);

// Main
const productGrid = $("productGrid");
const resultsText = $("resultsText");
const resultsCount = $("resultsCount");
const heroProductCount = $("heroProductCount");
const heroAccountCount = $("heroAccountCount");
const heroAdminCount = $("heroAdminCount");
const searchInput = $("searchInput");
const clearFiltersBtn = $("clearFiltersBtn");
const template = $("productCardTemplate");
const mobileMenuBtn = $("mobileMenuBtn");
const mobileMenuPanel = $("mobileMenuPanel");
const closeMobileMenuBtn = $("closeMobileMenuBtn");
const mobileMenuCartBtn = $("mobileMenuCartBtn");
const mobileMenuOrdersBtn = $("mobileMenuOrdersBtn");
const mobileMenuAccountBtn = $("mobileMenuAccountBtn");
const mobileMenuMessagesBtn = $("mobileMenuMessagesBtn");
const currencyPill = $("currencyPill");

// Top / sidebar buttons
const cartBtn = $("cartBtn");
const openCartPanelBtn = $("openCartPanelBtn");
const openOrdersPanelBtn = $("openOrdersPanelBtn");
const notificationBellBtn = $("notificationBellBtn");
const notificationBellCount = $("notificationBellCount");
const openChatPanelBtn = $("openChatPanelBtn");
const sidebarOpenChatBtn = $("sidebarOpenChatBtn");
const openAccountPanelBtn = $("openAccountPanelBtn");
const openDashboardPanelBtn = $("openDashboardPanelBtn");
const sidebarOpenCartBtn = $("sidebarOpenCartBtn");
const sidebarCartCount = $("sidebarCartCount");
const sidebarCartSubtotal = $("sidebarCartSubtotal");

// Cart
const cartCount = $("cartCount");
const cartItems = $("cartItems");
const cartSubtotal = $("cartSubtotal");
const checkoutBtn = $("checkoutBtn");

// Panels
const cartPanel = $("cartPanel");
const ordersPanel = $("ordersPanel");
const chatPanel = $("chatPanel");
const productDetailsModal = $("productDetailsModal");
const accountPanel = $("accountPanel");
const dashboardPanel = $("dashboardPanel");
const overlay = $("overlay");

// Auth
const signInBtn = $("signInBtn");
const authModal = $("authModal");
const closeAuthBtn = $("closeAuthBtn");
const closeProductDetailsBtn = $("closeProductDetailsBtn");
const detailsModalTitle = $("detailsModalTitle");
const detailsModalMeta = $("detailsModalMeta");
const detailsMainVisual = $("detailsMainVisual");
const detailsThumbs = $("detailsThumbs");
const detailsPriceText = $("detailsPriceText");
const detailsOldPriceText = $("detailsOldPriceText");
const detailsDescriptionText = $("detailsDescriptionText");
const detailsSpecs = $("detailsSpecs");
const detailsColorLabel = $("detailsColorLabel");
const detailsSizeLabel = $("detailsSizeLabel");
const detailsColorOptions = $("detailsColorOptions");
const detailsSizeOptions = $("detailsSizeOptions");
const detailsSelectionInfo = $("detailsSelectionInfo");
const detailsShippingLabel = $("detailsShippingLabel");
const detailsShippingOptions = $("detailsShippingOptions");
const detailsShippingNote = $("detailsShippingNote");
const detailsWishlistBtn = $("detailsWishlistBtn");
const detailsAddToCartBtn = $("detailsAddToCartBtn");
const detailsBuyNowBtn = $("detailsBuyNowBtn");
const relatedProductsList = $("relatedProductsList");
const imageZoomModal = $("imageZoomModal");
const imageZoomPreview = $("imageZoomPreview");
const closeImageZoomBtn = $("closeImageZoomBtn");
const signInForm = $("signInForm");
const emailInput = $("emailInput");
const passwordInput = $("passwordInput");
const nameInput = $("nameInput");
const phoneInput = $("phoneInput");
const nameField = $("nameField");
const phoneField = $("phoneField");
const authTitle = $("authTitle");
const authHelper = $("authHelper");
const authSubmitBtn = $("authSubmitBtn");
const signInTab = $("signInTab");
const createAccountTab = $("createAccountTab");

// Account / Orders
const ordersList = $("ordersList");
const chatThreadList = $("chatThreadList");
const chatEmptyState = $("chatEmptyState");
const chatConversationBox = $("chatConversationBox");
const chatThreadInfo = $("chatThreadInfo");
const chatMessages = $("chatMessages");
const chatMessageForm = $("chatMessageForm");
const chatMessageInput = $("chatMessageInput");
const accountInfoText = $("accountInfoText");
const historyList = $("historyList");
const accountNotificationsList = $("accountNotificationsList");
const linkRequestsHistoryList = $("linkRequestsHistoryList");
const accountActionButtons = $("accountActionButtons");
const accountWishlistList = $("accountWishlistList");
const changePasswordCard = $("changePasswordCard");
const changePasswordForm = $("changePasswordForm");
const currentPasswordInput = $("currentPasswordInput");
const newPasswordInput = $("newPasswordInput");
const shippingCard = $("shippingCard");
const shippingAddressForm = $("shippingAddressForm");
const apartmentAddressBtn = $("apartmentAddressBtn");
const houseAddressBtn = $("houseAddressBtn");
const shippingCountrySelect = $("shippingCountrySelect");
const houseAddressFields = $("houseAddressFields");
const apartmentAddressFields = $("apartmentAddressFields");
const houseNumberInput = $("houseNumberInput");
const houseFloorInput = $("houseFloorInput");
const houseStreetInput = $("houseStreetInput");
const housePhoneInput = $("housePhoneInput");
const houseAdditionalInput = $("houseAdditionalInput");
const houseLabelInput = $("houseLabelInput");
const apartmentBuildingNameInput = $("apartmentBuildingNameInput");
const apartmentNumberInput = $("apartmentNumberInput");
const apartmentFloorInput = $("apartmentFloorInput");
const apartmentStreetInput = $("apartmentStreetInput");
const apartmentAdditionalInput = $("apartmentAdditionalInput");
const apartmentLabelInput = $("apartmentLabelInput");
const shippingSummaryText = $("shippingSummaryText");

// Hero
const heroManagedImage = $("heroManagedImage");
const heroVisualFallback = $("heroVisualFallback");
const heroTagText = $("heroTagText");
const heroTitleText = $("heroTitleText");
const heroDescriptionText = $("heroDescriptionText");
const heroCard1Label = $("heroCard1Label");
const heroCard1Title = $("heroCard1Title");
const heroCard2Label = $("heroCard2Label");
const heroCard2Title = $("heroCard2Title");
const heroCard3Label = $("heroCard3Label");
const heroCard3Title = $("heroCard3Title");

// Dashboard
const dashboardTabs = $("dashboardTabs");
const dashboardUserSearchInput = $("dashboardUserSearchInput");
const dashboardTotalUsers = $("dashboardTotalUsers");
const dashboardTotalAdmins = $("dashboardTotalAdmins");
const dashboardMonthlyAccounts = $("dashboardMonthlyAccounts");
const dashboardTotalProducts = $("dashboardTotalProducts");
const dashboardTotalOrders = $("dashboardTotalOrders");
const dashboardBlockedUsers = $("dashboardBlockedUsers");
const dashboardMonthlyChart = $("dashboardMonthlyChart");
const dashboardUsersList = $("dashboardUsersList");
const dashboardRoleEmailInput = $("dashboardRoleEmailInput");
const dashboardPromoteAdminBtn = $("dashboardPromoteAdminBtn");
const dashboardProductsList = $("dashboardProductsList");
const dashboardOrdersList = $("dashboardOrdersList");
const dashboardLinkRequestsList = $("dashboardLinkRequestsList");
const dashboardCustomerHistory = $("dashboardCustomerHistory");
const dashboardReportsList = $("dashboardReportsList");
const dashboardNotificationForm = $("dashboardNotificationForm");
const dashboardNotificationTitle = $("dashboardNotificationTitle");
const dashboardNotificationMessage = $("dashboardNotificationMessage");
const dashboardNotificationsLog = $("dashboardNotificationsLog");
const dashboardOrderSearchInput = $("dashboardOrderSearchInput");
const dashboardOrderStatusFilter = $("dashboardOrderStatusFilter");
const dashboardRequestSearchInput = $("dashboardRequestSearchInput");
const dashboardRequestStatusFilter = $("dashboardRequestStatusFilter");
const dashboardChatsList = $("dashboardChatsList");
const catalogFilters = $("catalogFilters");
const linkRequestForm = $("linkRequestForm");
const linkPlatformSelect = $("linkPlatformSelect");
const linkProductUrlInput = $("linkProductUrlInput");
const linkProductTitleInput = $("linkProductTitleInput");
const linkProductQuantityInput = $("linkProductQuantityInput");
const linkProductNoteInput = $("linkProductNoteInput");
const linkRequestCartList = $("linkRequestCartList");
const linkRequestCartCount = $("linkRequestCartCount");
const submitLinkRequestBtn = $("submitLinkRequestBtn");
const dashboardCatalogForm = $("dashboardCatalogForm");
const dashboardCatalogName = $("dashboardCatalogName");
const dashboardCatalogList = $("dashboardCatalogList");
const dashboardCatalogParent = $("dashboardCatalogParent");

// Dashboard product form
const dashboardProductForm = $("dashboardProductForm");
const dashboardEditingProductId = $("dashboardEditingProductId");
const dashboardProductFormTitle = $("dashboardProductFormTitle");
const dashboardCancelEditBtn = $("dashboardCancelEditBtn");
const dashboardProductName = $("dashboardProductName");
const dashboardProductBrand = $("dashboardProductBrand");
const dashboardProductType = $("dashboardProductType");
const dashboardProductCategory = $("dashboardProductCategory");
const dashboardProductCatalog = $("dashboardProductCatalog");
const dashboardProductParentCatalog = $("dashboardProductParentCatalog");
const dashboardProductSubcatalog = $("dashboardProductSubcatalog");
const dashboardProductCatalogPath = $("dashboardProductCatalogPath");
const dashboardProductPrice = $("dashboardProductPrice");
const dashboardProductCostPrice = $("dashboardProductCostPrice");
const dashboardProductDiscountPrice = $("dashboardProductDiscountPrice");
const dashboardProductStock = $("dashboardProductStock");
const dashboardProductDescription = $("dashboardProductDescription");
const dashboardProductCountry = $("dashboardProductCountry");
const dashboardProductAudience = $("dashboardProductAudience");
const dashboardProductColors = $("dashboardProductColors");
const dashboardProductSizes = $("dashboardProductSizes");
const dashboardProductMaterial = $("dashboardProductMaterial");
const dashboardEnableAir = $("dashboardEnableAir");
const dashboardAirPrice = $("dashboardAirPrice");
const dashboardAirNote = $("dashboardAirNote");
const dashboardEnableSea = $("dashboardEnableSea");
const dashboardSeaPrice = $("dashboardSeaPrice");
const dashboardSeaNote = $("dashboardSeaNote");
const dashboardProductAccent = $("dashboardProductAccent");
const dashboardProductImageFiles = $("dashboardProductImageFiles");

// Dashboard hero form
const dashboardHeroContentForm = $("dashboardHeroContentForm");
const dashboardHeroTag = $("dashboardHeroTag");
const dashboardHeroTitle = $("dashboardHeroTitle");
const dashboardHeroDescription = $("dashboardHeroDescription");
const dashboardHeroCard1Label = $("dashboardHeroCard1Label");
const dashboardHeroCard1Title = $("dashboardHeroCard1Title");
const dashboardHeroCard2Label = $("dashboardHeroCard2Label");
const dashboardHeroCard2Title = $("dashboardHeroCard2Title");
const dashboardHeroCard3Label = $("dashboardHeroCard3Label");
const dashboardHeroCard3Title = $("dashboardHeroCard3Title");
const dashboardHeroImageInput = $("dashboardHeroImageInput");
const dashboardRemoveHeroImageBtn = $("dashboardRemoveHeroImageBtn");

function saveState() {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(state.products));
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(state.accounts));
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders));
  localStorage.setItem(STORAGE_KEYS.blockedPhones, JSON.stringify(state.blockedPhones));
  localStorage.setItem(STORAGE_KEYS.signedInUser, JSON.stringify(state.signedInUser));
  localStorage.setItem(STORAGE_KEYS.heroImage, JSON.stringify(state.heroImage));
  localStorage.setItem(STORAGE_KEYS.heroContent, JSON.stringify(state.heroContent));
  localStorage.setItem(STORAGE_KEYS.chatThreads, JSON.stringify(state.chatThreads));
  localStorage.setItem(STORAGE_KEYS.catalogs, JSON.stringify(state.catalogs));
  localStorage.setItem(STORAGE_KEYS.linkRequestCart, JSON.stringify(state.linkRequestCart));
  localStorage.setItem(STORAGE_KEYS.linkRequests, JSON.stringify(state.linkRequests));
  localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(state.wishlist));
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(state.notifications));
}

function makeUserId(id) {
  return `USR-${String(id).padStart(4, "0")}`;
}

function makeProductId(id) {
  return `PRD-${String(id).padStart(4, "0")}`;
}

function normalizeShippingOptions(product = {}) {
  const basePrice = Number(product.discountPrice || product.price || 0);
  const options = product.shippingOptions || {};
  return {
    air: {
      enabled: options.air?.enabled !== false,
      price: Number(options.air?.price || basePrice || 0),
      note: String(options.air?.note || "")
    },
    sea: {
      enabled: options.sea?.enabled !== false,
      price: Number(options.sea?.price || basePrice || 0),
      note: String(options.sea?.note || "")
    }
  };
}

function getAvailableShippingMethods(product) {
  const options = normalizeShippingOptions(product);
  return ["air", "sea"].filter((key) => options[key]?.enabled);
}

function getShippingLabel(method) {
  return method === "sea" ? "Sea" : "Air";
}


function getShippingMetaText(method) {
  return method === "sea" ? "Lower cost · Longer delivery" : "Faster delivery · Higher priority";
}

function renderShippingNoteHtml(product, method) {
  const note = escapeHtml(getShippingNote(product, method) || "Admin has not added a note yet.");
  return `<span class="shipping-note-label">${escapeHtml(getShippingLabel(method))} note:</span>${note}`;
}

function renderShippingChipHtml(product, method, isActive = false) {
  return `
    <span class="shipping-chip-title">
      <span>${escapeHtml(getShippingLabel(method))}</span>
      <span class="shipping-chip-price">${formatPrice(getShippingPrice(product, method))}</span>
    </span>
    <span class="shipping-chip-meta">${escapeHtml(getShippingMetaText(method))}</span>
  `;
}

function getShippingPrice(product, method) {
  const options = normalizeShippingOptions(product);
  const finalMethod = options[method]?.enabled ? method : getAvailableShippingMethods(product)[0] || "air";
  return Number(options[finalMethod]?.price || product.discountPrice || product.price || 0);
}

function getShippingNote(product, method) {
  const options = normalizeShippingOptions(product);
  const finalMethod = options[method]?.enabled ? method : getAvailableShippingMethods(product)[0] || "air";
  return String(options[finalMethod]?.note || "");
}

function normalizeProducts(products) {
  return products.map((product, index) => ({
    ...product,
    id: Number(product.id) || index + 1,
    productId: product.productId || makeProductId(Number(product.id) || index + 1),
    colors: Array.isArray(product.colors) ? product.colors : ["Black"],
    sizes: Array.isArray(product.sizes) ? product.sizes : ["Standard"],
    shippingOptions: normalizeShippingOptions(product),
    images: Array.isArray(product.images) ? product.images : product.image ? [product.image] : []
  }));
}

function normalizeAccounts(accounts) {
  return accounts.map((account, index) => ({
    ...account,
    id: Number(account.id) || index + 1,
    userId: account.userId || makeUserId(Number(account.id) || index + 1),
    blocked: Boolean(account.blocked),
    role: account.role || "customer",
    shippingAddressType: account.shippingAddressType || "",
    shippingCountry: account.shippingCountry || "",
    shippingCity: account.shippingCity || "",
    apartmentAddress: account.apartmentAddress || "",
    houseAddress: account.houseAddress || "",
    houseNumber: account.houseNumber || "",
    houseFloor: account.houseFloor || "",
    houseStreet: account.houseStreet || account.houseAddress || "",
    housePhone: account.housePhone || account.phone || "",
    houseAdditional: account.houseAdditional || "",
    houseLabel: account.houseLabel || "",
    apartmentBuildingName: account.apartmentBuildingName || "",
    apartmentNumber: account.apartmentNumber || "",
    apartmentFloor: account.apartmentFloor || "",
    apartmentStreet: account.apartmentStreet || account.apartmentAddress || "",
    apartmentAdditional: account.apartmentAdditional || "",
    apartmentLabel: account.apartmentLabel || "",
    createdAt: account.createdAt || new Date().toISOString()
  }));
}

function normalizeChatThreads(chatThreads) {
  return chatThreads.map((thread, index) => ({
    id: thread.id || `CHAT-${index + 1}`,
    productId: Number(thread.productId) || 0,
    productName: thread.productName || "Product",
    productImage: thread.productImage || "",
    memberEmail: thread.memberEmail || "",
    memberName: thread.memberName || "Member",
    adminEmail: thread.adminEmail || ADMIN_EMAIL,
    createdAt: thread.createdAt || new Date().toISOString(),
    updatedAt: thread.updatedAt || thread.createdAt || new Date().toISOString(),
    messages: Array.isArray(thread.messages)
      ? thread.messages.map((message, messageIndex) => ({
          id: message.id || `MSG-${index + 1}-${messageIndex + 1}`,
          senderEmail: message.senderEmail || "",
          senderName: message.senderName || "User",
          senderRole: message.senderRole || "customer",
          text: message.text || "",
          createdAt: message.createdAt || new Date().toISOString()
        }))
      : []
  }));
}

function normalizeCatalogName(name) {
  return String(name || "").trim();
}

function normalizeCatalogSlug(name) {
  return normalizeCatalogName(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `catalog-${Date.now()}`;
}

function loadState() {
  const savedProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || "null");
  const savedAccounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts) || "null");
  const savedCart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || "null");
  const savedOrders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "null");
  const savedBlockedPhones = JSON.parse(localStorage.getItem(STORAGE_KEYS.blockedPhones) || "null");
  const savedSignedInUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.signedInUser) || "null");
  const savedHeroImage = JSON.parse(localStorage.getItem(STORAGE_KEYS.heroImage) || '""');
  const savedHeroContent = JSON.parse(localStorage.getItem(STORAGE_KEYS.heroContent) || "null");
  const savedChatThreads = JSON.parse(localStorage.getItem(STORAGE_KEYS.chatThreads) || "null");
  const savedCatalogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.catalogs) || "null");
  const savedLinkRequestCart = JSON.parse(localStorage.getItem(STORAGE_KEYS.linkRequestCart) || "null");
  const savedLinkRequests = JSON.parse(localStorage.getItem(STORAGE_KEYS.linkRequests) || "null");
  const savedWishlist = JSON.parse(localStorage.getItem(STORAGE_KEYS.wishlist) || "null");
  const savedNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.notifications) || "null");

  state.products =
    Array.isArray(savedProducts) && savedProducts.length
      ? normalizeProducts(savedProducts)
      : normalizeProducts(defaultProducts);

  state.accounts =
    Array.isArray(savedAccounts) && savedAccounts.length
      ? normalizeAccounts(savedAccounts)
      : normalizeAccounts(defaultAccounts);

  state.cart = Array.isArray(savedCart) ? savedCart : [];
  state.orders = Array.isArray(savedOrders) ? savedOrders : [];
  state.blockedPhones = Array.isArray(savedBlockedPhones) ? savedBlockedPhones : [];
  state.signedInUser = savedSignedInUser || null;
  state.heroImage = savedHeroImage || "";
  state.heroContent = savedHeroContent ? { ...defaultHeroContent, ...savedHeroContent } : { ...defaultHeroContent };
  state.chatThreads = Array.isArray(savedChatThreads) ? normalizeChatThreads(savedChatThreads) : [];
  state.catalogs = (Array.isArray(savedCatalogs) && savedCatalogs.length ? savedCatalogs : [...defaultCatalogs]).map((catalog) => ({
    ...catalog,
    parentId: catalog.parentId || ""
  }));

  state.linkRequestCart = Array.isArray(savedLinkRequestCart) ? savedLinkRequestCart : [];
  state.linkRequests = Array.isArray(savedLinkRequests) ? savedLinkRequests : [];
  state.wishlist = Array.isArray(savedWishlist) ? savedWishlist.map((id) => Number(id)).filter(Boolean) : [];

  state.accounts = normalizeAccounts(state.accounts);
  const owner = state.accounts.find((entry) => entry.email === ADMIN_EMAIL);
  if (owner) owner.role = "owner";

  state.products = state.products.map((product, index) => ({
    ...product,
    catalogId: product.catalogId || state.catalogs[index % Math.max(state.catalogs.length, 1)]?.id || ""
  }));

  state.nextProductId =
    state.products.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;

  state.nextAccountId =
    state.accounts.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

const STORE_IQD_RATE = 1300;

const translations = {
  en: {
    htmlLang: "en",
    dir: "ltr",
    title: "Sora Store | China to Iraq & Kurdistan",
    searchPlaceholder: "Search products, brand, type, country...",
    home: "Home",
    trustNav: "Why us",
    sourcingRequests: "Sourcing Requests",
    products: "Products",
    cart: "Cart",
    orders: "Orders",
    messages: "Messages",
    account: "Account",
    dashboard: "Dashboard",
    signIn: "Sign in",
    heroTag: "Trusted imports to Iraq",
    heroTitle: "Order products from China with delivery to Iraq and Kurdistan.",
    heroDescription: "Browse products, request custom items, and follow your order updates from one clean storefront.",
    heroNote: "IQD pricing, direct support, and clean ordering for customers across Iraq.",
    trustLabel: "Why customers choose us",
    trustTitle: "A simple and trusted way to order from China to Iraq and Kurdistan.",
    trustDescription: "Clear steps, direct support, and transparent delivery updates for every order.",
    trustHowTitle: "How ordering works",
    trustHowText: "Browse products or send a sourcing link, confirm your order, and we handle shipping to Iraq and Kurdistan.",
    trustDeliveryTitle: "Delivery time",
    trustDeliveryText: "Air orders usually arrive faster, while sea shipping is better for lower-cost delivery and larger orders.",
    trustWhyTitle: "Why trust us",
    trustWhyText: "We review each request, confirm product details, and keep customers updated through order status and direct messages.",
    trustPaymentTitle: "Payment methods",
    trustPaymentText: "Payment is handled in IQD. You can confirm payment details with the store before final processing.",
    trustRefundTitle: "Return and refund policy",
    trustRefundText: "If there is a confirmed issue with your order, our team can review cancellation, return, or refund requests from your account panel.",
    sourcingLabel: "Sourcing requests",
    requestItemTitle: "Request an item",
    requestItemText: "Paste the product link and add any relevant details. Our team will review the request and return the final price.",
    requestUrlPlaceholder: "Paste product link",
    requestNotePlaceholder: "Add any important details such as size, color, or specifications",
    addItem: "Add Item",
    submit: "Submit",
    requestOverviewTitle: "Request Overview",
    requestOverviewText: "Combine multiple product links into a single request before submission.",
    requestHelper: "You can add several links first, then submit them together as one sourcing request.",
    collections: "Collections",
    shopByCatalog: "Shop by catalog",
    shopByCatalogText: "Choose a catalog to quickly browse the products you want.",
    clearFilters: "Clear filters",
    catalogLabel: "Catalog",
    showingAllProducts: "Showing all products.",
    footerText: "Frontend storefront for importing products from China to Iraq and Kurdistan.",
    mobileMenuSubtitle: "China to Iraq & Kurdistan",
    close: "Close",
    addToCart: "Add to cart",
    details: "Details",
    productInquiry: "Product Inquiry",
    buyNow: "Buy now",
    colors: "Colors",
    sizes: "Sizes",
    shipping: "Shipping",
    shoppingCart: "Shopping cart",
    yourCart: "Your cart",
    subtotal: "Subtotal",
    checkout: "Checkout",
    allProducts: "All Products",
    noProductsFound: "No products found.",
    noProductsHint: "Try another search word or clear the selected catalog filter."
  },
  ar: {
    htmlLang: "ar",
    dir: "rtl",
    title: "سۆرا | منتجات من الصين إلى العراق وكوردستان",
    searchPlaceholder: "ابحث عن المنتجات أو الماركة أو النوع أو البلد...",
    home: "الرئيسية",
    trustNav: "لماذا نحن",
    sourcingRequests: "طلبات التوريد",
    products: "المنتجات",
    cart: "السلة",
    orders: "الطلبات",
    messages: "الرسائل",
    account: "الحساب",
    dashboard: "لوحة التحكم",
    signIn: "تسجيل الدخول",
    heroTag: "استيراد موثوق إلى العراق",
    heroTitle: "اطلب منتجات من الصين مع التوصيل إلى العراق وكوردستان.",
    heroDescription: "تصفح المنتجات، اطلب منتجات مخصصة، وتابع تحديثات طلبك من واجهة واحدة مرتبة.",
    heroNote: "الأسعار بالدينار العراقي مع دعم مباشر وتجربة طلب واضحة داخل العراق.",
    trustLabel: "لماذا يختارنا العملاء",
    trustTitle: "طريقة بسيطة وموثوقة للطلب من الصين إلى العراق وكوردستان.",
    trustDescription: "خطوات واضحة، دعم مباشر، وتحديثات شفافة لكل طلب.",
    trustHowTitle: "كيف يتم الطلب",
    trustHowText: "تصفح المنتجات أو أرسل رابط المنتج، أكّد طلبك، ونحن نهتم بالشحن إلى العراق وكوردستان.",
    trustDeliveryTitle: "مدة التوصيل",
    trustDeliveryText: "الشحن الجوي أسرع عادةً، بينما الشحن البحري مناسب أكثر للتكلفة الأقل والطلبات الكبيرة.",
    trustWhyTitle: "لماذا تثق بنا",
    trustWhyText: "نراجع كل طلب، نؤكد تفاصيل المنتج، ونبقي العميل على اطلاع من خلال حالة الطلب والرسائل المباشرة.",
    trustPaymentTitle: "طرق الدفع",
    trustPaymentText: "الدفع يتم بالدينار العراقي فقط، ويمكن تأكيد طريقة الدفع مع المتجر قبل إكمال الطلب.",
    trustRefundTitle: "سياسة الإرجاع والاسترجاع",
    trustRefundText: "إذا وُجدت مشكلة مؤكدة في الطلب، يمكن لفريقنا مراجعة طلبات الإلغاء أو الإرجاع أو الاسترجاع من لوحة الحساب.",
    sourcingLabel: "طلبات التوريد",
    requestItemTitle: "اطلب منتجاً",
    requestItemText: "الصق رابط المنتج وأضف أي تفاصيل مهمة، وسيقوم فريقنا بمراجعة الطلب وإرسال السعر النهائي.",
    requestUrlPlaceholder: "الصق رابط المنتج",
    requestNotePlaceholder: "أضف أي تفاصيل مهمة مثل المقاس أو اللون أو المواصفات",
    addItem: "إضافة عنصر",
    submit: "إرسال",
    requestOverviewTitle: "ملخص الطلب",
    requestOverviewText: "يمكنك جمع عدة روابط ضمن طلب توريد واحد قبل الإرسال.",
    requestHelper: "يمكنك إضافة عدة روابط أولاً ثم إرسالها كطلب واحد.",
    collections: "الأقسام",
    shopByCatalog: "تسوق حسب التصنيف",
    shopByCatalogText: "اختر تصنيفاً لتصفح المنتجات بسرعة.",
    clearFilters: "مسح الفلاتر",
    catalogLabel: "الكتالوج",
    showingAllProducts: "عرض جميع المنتجات.",
    footerText: "واجهة متجر لاستيراد المنتجات من الصين إلى العراق وكوردستان.",
    mobileMenuSubtitle: "من الصين إلى العراق وكوردستان",
    close: "إغلاق",
    addToCart: "أضف إلى السلة",
    details: "التفاصيل",
    productInquiry: "استفسار عن المنتج",
    buyNow: "اشتر الآن",
    colors: "الألوان",
    sizes: "المقاسات",
    shipping: "الشحن",
    shoppingCart: "سلة التسوق",
    yourCart: "سلتك",
    subtotal: "المجموع",
    checkout: "إتمام الطلب",
    allProducts: "كل المنتجات",
    noProductsFound: "لم يتم العثور على منتجات.",
    noProductsHint: "جرّب كلمة بحث أخرى أو امسح فلتر التصنيف."
  },
  ku: {
    htmlLang: "ku",
    dir: "rtl",
    title: "سۆرا | بەرهەم لە چین بۆ عێراق و کوردستان",
    searchPlaceholder: "گەڕان بۆ بەرهەم، براند، جۆر یان وڵات...",
    home: "سەرەکی",
    trustNav: "بۆچی ئێمە",
    sourcingRequests: "داواکاری دابینکردن",
    products: "بەرهەمەکان",
    cart: "سەبەتە",
    orders: "داواکاریەکان",
    messages: "پەیامەکان",
    account: "هەژمار",
    dashboard: "بەڕێوەبردن",
    signIn: "چوونەژوورەوە",
    heroTag: "هاوردەی متمانەپێکراو بۆ عێراق",
    heroTitle: "بەرهەم لە چین داوا بکە بە گەیاندن بۆ عێراق و کوردستان.",
    heroDescription: "بەرهەم ببینە، داوای بەرهەمی تایبەت بکە، و دواداچوونی نوێکارییەکانی داواکاریەکەت بکە لە یەک شوێنی ڕێکخراو.",
    heroNote: "نرخی دیناری عێراقی، پشتگیری ڕاستەوخۆ، و سیستەمی داواکردنی ئاسایی بۆ کڕیارانی عێراق.",
    trustLabel: "بۆچی کڕیاران ئێمە هەڵدەبژێرن",
    trustTitle: "ڕێگایەکی سادە و متمانەپێکراو بۆ داواکردن لە چین بۆ عێراق و کوردستان.",
    trustDescription: "هەنگاوە ڕوونەکان، پشتگیری ڕاستەوخۆ، و نوێکارییە ڕوونەکان بۆ هەر داواکارییەک.",
    trustHowTitle: "چۆنیەتی داواکردن",
    trustHowText: "بەرهەمەکان ببینە یان لینکێک بنێرە، داواکاریەکەت پشتڕاست بکەوە، ئێمەش گەیاندن بۆ عێراق و کوردستان بەڕێوەدەبەین.",
    trustDeliveryTitle: "ماوەی گەیاندن",
    trustDeliveryText: "ناردنی ئاسمانی زووتر دەگات، بەڵام ناردنی دەریایی بۆ تێچووی کەمتر و داواکاریی گەورە باشترە.",
    trustWhyTitle: "بۆچی متمانەمان پێبکەیت",
    trustWhyText: "هەر داواکارییەک پشکنین دەکەین، وردەکاریی بەرهەم پشتڕاست دەکەینەوە، و بە دواداچوونی داواکاری و پەیامی ڕاستەوخۆ ئاگادارتان دەکەین.",
    trustPaymentTitle: "شێوازەکانی پارەدان",
    trustPaymentText: "پارەدان تەنها بە دیناری عێراقیە، و دەتوانیت پێش تەواوکردنی داواکاری شێوازی پارەدان لەگەڵ فرۆشگا پشتڕاست بکەیتەوە.",
    trustRefundTitle: "سیاسەتی گەڕاندنەوە و پارەگەڕاندنەوە",
    trustRefundText: "ئەگەر کێشەیەکی دڵنیابوو هەبێت، تیمەکەمان دەتوانێت داواکاری هەڵوەشاندنەوە، گەڕاندنەوە، یان پارەگەڕاندنەوە لە پانێڵی هەژمارەکەت پشکنێت.",
    sourcingLabel: "داواکاری دابینکردن",
    requestItemTitle: "داوای بەرهەم بکە",
    requestItemText: "لینکی بەرهەمەکە بنوسە و هەر وردەکارییەکی گرنگ زیاد بکە، تیمەکەمانیش داواکارییەکە دەبینێت و نرخی کۆتایی دەنێرێت.",
    requestUrlPlaceholder: "لینکی بەرهەمەکە بنوسە",
    requestNotePlaceholder: "وردەکاری گرنگ وەک قەبارە، ڕەنگ یان تایبەتمەندی بنوسە",
    addItem: "زیادکردنی بەرهەم",
    submit: "ناردن",
    requestOverviewTitle: "پوختەی داواکاری",
    requestOverviewText: "دەتوانیت چەند لینکێک یەکخەیت پێش ناردنی یەک داواکاری.",
    requestHelper: "دەتوانیت سەرەتا چەند لینکێک زیاد بکەیت و پاشان وەک یەک داواکاری بینێریت.",
    collections: "کۆمەڵەکان",
    shopByCatalog: "بازاڕکردن بە پێی کاتەلۆگ",
    shopByCatalogText: "کاتەلۆگێک هەڵبژێرە بۆ ئەوەی بەرهەمەکان خێرا ببینیت.",
    clearFilters: "سڕینەوەی فلتەرەکان",
    catalogLabel: "کاتەلۆگ",
    showingAllProducts: "هەموو بەرهەمەکان پیشان دەدرێن.",
    footerText: "پێشەکەشی فرۆشگا بۆ هاوردەی بەرهەم لە چین بۆ عێراق و کوردستان.",
    mobileMenuSubtitle: "لە چین بۆ عێراق و کوردستان",
    close: "داخستن",
    addToCart: "زیادکردن بۆ سەبەتە",
    details: "وردەکاری",
    productInquiry: "پرسیار دەربارەی بەرهەم",
    buyNow: "ئێستا بکڕە",
    colors: "ڕەنگەکان",
    sizes: "قەبارەکان",
    shipping: "گەیاندن",
    shoppingCart: "سەبەتەی کڕین",
    yourCart: "سەبەتەکەت",
    subtotal: "کۆی گشتی",
    checkout: "تەواوکردنی داواکاری",
    allProducts: "هەموو بەرهەمەکان",
    noProductsFound: "هیچ بەرهەمێک نەدۆزرایەوە.",
    noProductsHint: "وشەیەکی تر تاقی بکەرەوە یان فلتەری کاتەلۆگ بسڕەوە."
  }
};

function t(key) {
  return translations[state.language]?.[key] || translations.en[key] || key;
}

function convertUsdToIqd(value) {
  return Math.round(Number(value || 0) * STORE_IQD_RATE);
}

function applyTranslations() {
  const lang = translations[state.language] || translations.en;
  document.documentElement.lang = lang.htmlLang;
  document.documentElement.dir = lang.dir;
  document.title = lang.title;

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === state.language);
  });

  const setText = (id, value) => { const node = $(id); if (node) node.textContent = value; };
  const setPlaceholder = (id, value) => { const node = $(id); if (node) node.placeholder = value; };

  setPlaceholder('searchInput', lang.searchPlaceholder);
  setText('heroTagText', lang.heroTag);
  setText('heroTitleText', lang.heroTitle);
  setText('heroDescriptionText', lang.heroDescription);
  const heroNote = document.querySelector('.hero-home-note span'); if (heroNote) heroNote.textContent = lang.heroNote;
  setText('trustLabelText', lang.trustLabel);
  setText('trustTitleText', lang.trustTitle);
  setText('trustDescriptionText', lang.trustDescription);
  setText('trustHowTitle', lang.trustHowTitle);
  setText('trustHowText', lang.trustHowText);
  setText('trustDeliveryTitle', lang.trustDeliveryTitle);
  setText('trustDeliveryText', lang.trustDeliveryText);
  setText('trustWhyTitle', lang.trustWhyTitle);
  setText('trustWhyText', lang.trustWhyText);
  setText('trustPaymentTitle', lang.trustPaymentTitle);
  setText('trustPaymentText', lang.trustPaymentText);
  setText('trustRefundTitle', lang.trustRefundTitle);
  setText('trustRefundText', lang.trustRefundText);
  setText('mobileMenuSubtitle', lang.mobileMenuSubtitle);
  setText('currencyPill', 'IQD');
  setText('linkRequestCartCount', `${state.linkRequestCart.length} ${state.linkRequestCart.length === 1 ? 'item' : 'items'}`);
  setPlaceholder('linkProductUrlInput', lang.requestUrlPlaceholder);
  setPlaceholder('linkProductNoteInput', lang.requestNotePlaceholder);

  const footerText = document.querySelector('.site-footer p'); if (footerText) footerText.textContent = lang.footerText;
  const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');
  if (sidebarLinks[0]) sidebarLinks[0].textContent = lang.home;
  if (sidebarLinks[1]) sidebarLinks[1].textContent = lang.sourcingRequests;
  if (sidebarLinks[2]) sidebarLinks[2].textContent = lang.products;
  if (sidebarOpenCartBtn) sidebarOpenCartBtn.textContent = lang.cart;
  if (openOrdersPanelBtn) openOrdersPanelBtn.textContent = lang.orders;
  if (sidebarOpenChatBtn) sidebarOpenChatBtn.textContent = lang.messages;
  if (openAccountPanelBtn) openAccountPanelBtn.textContent = lang.account;
  if (openDashboardPanelBtn && !openDashboardPanelBtn.classList.contains('hidden-box')) openDashboardPanelBtn.textContent = lang.dashboard;
  if (openChatPanelBtn) openChatPanelBtn.textContent = lang.messages;
  if (signInBtn && !state.signedInUser) signInBtn.textContent = lang.signIn;
  if (cartBtn && cartBtn.childNodes[0]) cartBtn.childNodes[0].textContent = `${lang.cart} `;
  document.querySelectorAll('.mobile-menu-link').forEach((link, index) => {
    const vals = [lang.home, lang.trustNav, lang.sourcingRequests, lang.products];
    if (vals[index]) link.textContent = vals[index];
  });
  if (mobileMenuCartBtn) mobileMenuCartBtn.textContent = lang.cart;
  if (mobileMenuOrdersBtn) mobileMenuOrdersBtn.textContent = lang.orders;
  if (mobileMenuAccountBtn) mobileMenuAccountBtn.textContent = lang.account;
  if (mobileMenuMessagesBtn) mobileMenuMessagesBtn.textContent = lang.messages;
  if (closeMobileMenuBtn) closeMobileMenuBtn.textContent = lang.close;

  const sectionLabels = document.querySelectorAll('.products-header .section-label');
  if (document.querySelector('#linkRequestsSection .section-label')) document.querySelector('#linkRequestsSection .section-label').textContent = lang.sourcingLabel;
  if (document.querySelector('#linkRequestsSection h3')) document.querySelector('#linkRequestsSection h3').textContent = lang.requestItemTitle;
  if (document.querySelector('#linkRequestsSection .results-text')) document.querySelector('#linkRequestsSection .results-text').textContent = lang.requestItemText;
  if (document.querySelector('#addLinkRequestItemBtn')) document.querySelector('#addLinkRequestItemBtn').textContent = lang.addItem;
  if (document.querySelector('#submitLinkRequestBtn')) document.querySelector('#submitLinkRequestBtn').textContent = lang.submit;
  const helper = document.querySelector('.link-request-cart-box .helper-note'); if (helper) helper.textContent = lang.requestHelper;
  const requestOverviewTitle = document.querySelector('.link-request-cart-box h4'); if (requestOverviewTitle) requestOverviewTitle.textContent = lang.requestOverviewTitle;
  const requestOverviewText = document.querySelector('.link-request-cart-box .order-meta'); if (requestOverviewText) requestOverviewText.textContent = lang.requestOverviewText;
  if (document.querySelector('#products .section-label')) document.querySelector('#products .section-label').textContent = lang.collections;
  if (document.querySelector('#products h3')) document.querySelector('#products h3').textContent = lang.shopByCatalog;
  if (document.querySelector('#products .results-text')) document.querySelector('#products .results-text').textContent = lang.shopByCatalogText;
  if (clearFiltersBtn) clearFiltersBtn.textContent = lang.clearFilters;
  if (sectionLabels[1]) sectionLabels[1].textContent = lang.catalogLabel;
  const productsHeaderH3 = document.querySelectorAll('.products-header h3'); if (productsHeaderH3[1]) productsHeaderH3[1].textContent = lang.products;
  if (!state.search.trim() && resultsText) resultsText.textContent = lang.showingAllProducts;
  const cartPanelLabel = cartPanel?.querySelector('.section-label'); if (cartPanelLabel) cartPanelLabel.textContent = lang.shoppingCart;
  const cartPanelTitle = cartPanel?.querySelector('h3'); if (cartPanelTitle) cartPanelTitle.textContent = lang.yourCart;
  const subtotalRowSpan = cartPanel?.querySelector('.subtotal-row span'); if (subtotalRowSpan) subtotalRowSpan.textContent = lang.subtotal;
  if (checkoutBtn) checkoutBtn.textContent = lang.checkout;
}

function setLanguage(language) {
  state.language = translations[language] ? language : 'en';
  applyTranslations();
  renderProducts();
  renderCart();
  renderOrders();
  renderAccountSection();
}

function closeMobileMenu() {
  mobileMenuPanel?.classList.remove('open');
}

function openMobileMenu() {
  closeAllPanels();
  mobileMenuPanel?.classList.add('open');
  overlay?.classList.add('show');
}

function parsePrice(value) {
  return Number(String(value).replace("$", "").trim()) || 0;
}

function ensureProductMetrics(product) {
  if (!product) return product;
  product.views = Number(product.views || 0);
  product.addedToCartCount = Number(product.addedToCartCount || 0);
  product.wishlistCount = Number(product.wishlistCount || 0);
  product.soldCount = Number(product.soldCount || 0);
  product.costPrice = Number(product.costPrice || 0);
  return product;
}

function createNotification(targetEmail, title, message, type = "general") {
  return {
    id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    targetEmail,
    title,
    message,
    type,
    read: false,
    createdAt: new Date().toISOString()
  };
}

function pushNotification(targetEmail, title, message, type = "general") {
  state.notifications.unshift(createNotification(targetEmail, title, message, type));
}

function notifyAllCustomers(title, message) {
  state.accounts.filter((account) => account.role === "customer").forEach((account) => {
    pushNotification(account.email, title, message, "broadcast");
  });
}

function getNotificationsForUser(email) {
  return state.notifications.filter((item) => item.targetEmail === email);
}

function getUnreadNotificationCount(email) {
  return getNotificationsForUser(email).filter((item) => !item.read).length;
}

function renderNotificationBell() {
  if (!notificationBellBtn || !notificationBellCount) return;

  const account = getCurrentAccount();
  const unreadCount = account ? getUnreadNotificationCount(account.email) : 0;

  notificationBellBtn.classList.toggle("has-unread", unreadCount > 0);
  notificationBellCount.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
  notificationBellCount.classList.toggle("hidden-box", unreadCount === 0);
}

function markNotificationsRead(email) {
  state.notifications.forEach((item) => {
    if (item.targetEmail === email) item.read = true;
  });
}

function getOrderProfit(order) {
  return (order.items || []).reduce((sum, item) => {
    const product = state.products.find((entry) => entry.id === Number(item.productId || item.id));
    const cost = Number(product?.costPrice || 0);
    return sum + ((Number(item.price || 0) - cost) * Number(item.quantity || 0));
  }, 0);
}

function getCompletedRevenue() {
  return state.orders.filter((order) => !["Cancelled", "Refunded"].includes(order.status)).reduce((sum, order) => sum + Number(order.total || 0), 0);
}

function getCompletedProfit() {
  return state.orders.filter((order) => !["Cancelled", "Refunded"].includes(order.status)).reduce((sum, order) => sum + getOrderProfit(order), 0);
}

function getLowStockProducts() {
  return state.products.filter((product) => Number(product.stock || 0) <= 5);
}

function getPendingActionOrders() {
  return state.orders.filter((order) => order.cancelRequested || order.returnRequested);
}

function sendOrderNotification(order, message, title = "Order update") {
  if (!order?.userEmail) return;
  pushNotification(order.userEmail, title, `${order.id} · ${message}`, "order");
}


function formatPrice(value) {
  return `${convertUsdToIqd(value).toLocaleString("en-US")} IQD`;
}

function getLinkRequestStatusLabel(status) {
  const labels = {
    pending: "Pending review",
    quoted: "Price sent",
    accepted: "Accepted by customer",
    declined: "Declined by customer"
  };

  labels.ordered = "Ordered";
  labels.shipped = "Shipped";
  labels.completed = "Completed";
  return labels[status] || "Pending review";
}

function getLinkRequestStatusClass(status) {
  if (status === "accepted") return "accepted";
  if (status === "declined") return "declined";
  if (status === "ordered") return "ordered";
  if (status === "shipped") return "shipped";
  if (status === "completed") return "completed";
  return "";
}

function makeLinkRequestId() {
  return `LNK-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function makeLinkRequestItemId() {
  return `ITEM-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function resetLinkRequestForm() {
  linkRequestForm?.reset();
}

function addExternalLinkItem() {
  const url = String(linkProductUrlInput?.value || "").trim();
  const note = String(linkProductNoteInput?.value || "").trim();

  if (!url) return alert("Please paste a product link.");

  state.linkRequestCart.push({
    id: makeLinkRequestItemId(),
    url,
    note
  });

  refreshAll();

  resetLinkRequestForm();
  alert("Item added successfully.");
}

function removeExternalLinkItem(itemId) {
  state.linkRequestCart = state.linkRequestCart.filter((item) => item.id !== itemId);
  refreshAll();
}

function submitExternalLinkRequest() {
  const account = getCurrentAccount();

  if (!account) {
    alert("Please sign in first.");
    openAuth();
    return;
  }

  if (!state.linkRequestCart.length) {
    return alert("Your request summary is empty.");
  }

  state.linkRequests.unshift({
    id: makeLinkRequestId(),
    userEmail: account.email,
    customerName: account.name,
    customerPhone: account.phone || "",
    status: "pending",
    quotedPrice: 0,
    adminNote: "",
    items: state.linkRequestCart.map((item) => ({ ...item })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  state.linkRequestCart = [];
  refreshAll();
  alert("Your request has been submitted successfully.");
}

function renderLinkRequestCart() {
  if (!linkRequestCartList) return;

  const count = state.linkRequestCart.length;
  if (linkRequestCartCount) {
    linkRequestCartCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
  }

  if (!count) {
    linkRequestCartList.innerHTML = `<div class="order-card"><p class="order-meta">No items added yet.</p></div>`;
    return;
  }

  linkRequestCartList.innerHTML = state.linkRequestCart
    .map((item) => `
      <div class="link-request-item-card">
        <div class="order-head">
          <div>
            <h4>${escapeHtml(item.title || "Product link")}</h4>
          </div>
          <div class="inline-actions">
            <button class="secondary-btn" data-link-cart-action="remove" data-id="${item.id}" type="button">Remove</button>
          </div>
        </div>
        <p class="order-meta">${escapeHtml(item.platform || "Other")} · Quantity: ${Number(item.quantity || 1)}</p>
        <p class="order-meta"><a class="link-request-url" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.url)}</a></p>
        <p class="order-meta">${escapeHtml(item.note || "No note added.")}</p>
      </div>
    `)
    .join("");
}

function updateLinkRequestQuote(requestId, quotedPrice, adminNote) {
  if (!isAdmin()) return alert("Only authorized team members can update sourcing requests.");

  const request = state.linkRequests.find((entry) => entry.id === requestId);
  if (!request) return;

  const finalPrice = Number(quotedPrice || 0);
  if (finalPrice <= 0) return alert("Enter a valid price.");

  request.quotedPrice = finalPrice;
  request.adminNote = String(adminNote || "").trim();
  request.status = "quoted";
  request.updatedAt = new Date().toISOString();
  refreshAll();
  alert("Price sent to customer.");
}

function respondToLinkRequest(requestId, action) {
  const account = getCurrentAccount();
  const request = state.linkRequests.find((entry) => entry.id === requestId);
  if (!account || !request || request.userEmail !== account.email) return;
  if (request.status !== "quoted") return;

  request.status = action === "accept" ? "accepted" : "declined";
  request.updatedAt = new Date().toISOString();
  refreshAll();
  alert(action === "accept" ? "You accepted the price." : "You declined the price.");
}

function renderDashboardLinkRequests() {
  if (!dashboardLinkRequestsList) return;

  dashboardLinkRequestsList.innerHTML = "";

  const visible = state.linkRequests.filter((request) => {
    const matchesStatus = state.dashboardRequestStatus === "all" || request.status === state.dashboardRequestStatus;
    const haystack = `${request.id} ${request.customerName || ""} ${request.userEmail || ""} ${(request.items || []).map((item) => `${item.title || ""} ${item.url || ""}`).join(" ")}`.toLowerCase();
    const matchesSearch = !state.dashboardRequestSearch || haystack.includes(state.dashboardRequestSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!visible.length) {
    dashboardLinkRequestsList.innerHTML = `<div class="order-card"><p class="order-meta">No sourcing requests found.</p></div>`;
    return;
  }

  dashboardLinkRequestsList.innerHTML = visible.map((request) => `
    <div class="order-card">
      <div class="order-head">
        <div>
          <strong>${request.id}</strong>
          <p class="order-meta">${escapeHtml(request.userEmail || "No email")} · ${getLinkRequestStatusLabel(request.status)}</p>
        </div>
        <span class="status-badge">${getLinkRequestStatusLabel(request.status)}</span>
      </div>
      <div class="link-request-items">
        ${(request.items || []).map((item) => `<div class="order-meta"><strong>${escapeHtml(item.title || "Product link")}</strong> · <a class="link-request-url" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.url)}</a></div>`).join("")}
      </div>
      <div class="request-quote-grid">
        <input type="number" placeholder="Quoted price" data-request-price="${request.id}" value="${request.quotedPrice || ""}" />
        <input type="text" placeholder="Admin note" data-request-note="${request.id}" value="${escapeHtml(request.adminNote || "")}" />
        <button class="primary-btn" data-link-request-action="quote" data-id="${request.id}" type="button">Save Quote</button>
      </div>
      <div class="inline-actions">
        <button class="secondary-btn" data-link-request-status="ordered" data-id="${request.id}" type="button">Mark Ordered</button>
        <button class="secondary-btn" data-link-request-status="shipped" data-id="${request.id}" type="button">Mark Shipped</button>
        <button class="secondary-btn" data-link-request-status="completed" data-id="${request.id}" type="button">Mark Completed</button>
      </div>
    </div>
  `).join("");
}

function getAccentByName(name) {
  const map = {
    purple: "linear-gradient(135deg, #7c3aed, #c4b5fd)",
    blue: "linear-gradient(135deg, #06b6d4, #a5f3fc)",
    gold: "linear-gradient(135deg, #f59e0b, #fde68a)",
    green: "linear-gradient(135deg, #22c55e, #bbf7d0)",
    pink: "linear-gradient(135deg, #ec4899, #fbcfe8)"
  };

  return map[name] || map.purple;
}

function splitValues(text, fallback) {
  const values = String(text)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return values.length ? values : fallback;
}

function getCurrentAccount() {
  return state.accounts.find((account) => account.email === state.signedInUser) || null;
}

function isOwner() {
  const account = getCurrentAccount();
  return Boolean(account && account.role === "owner");
}

function isAdmin() {
  const account = getCurrentAccount();
  return Boolean(account && (account.role === "owner" || account.role === "admin"));
}

function isOwnerOverviewVisible() {
  return isOwner();
}

function getRoleLabel(role) {
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  return "Customer";
}

function getUserOrderCount(email) {
  return state.orders.filter((order) => order.userEmail === email).length;
}

function getUserTotalSpent(email) {
  return state.orders
    .filter((order) => order.userEmail === email)
    .reduce((sum, order) => sum + Number(order.total || 0), 0);
}

function getHouseShippingAddress(account) {
  if (!account) return "";

  const parts = [];
  if (account.houseNumber) parts.push(`House no. ${account.houseNumber}`);
  if (account.houseFloor) parts.push(`Floor ${account.houseFloor}`);
  if (account.houseStreet) parts.push(`Street ${account.houseStreet}`);
  if (account.housePhone) parts.push(`Phone ${account.housePhone}`);
  if (account.houseAdditional) parts.push(account.houseAdditional);
  if (account.houseLabel) parts.push(`Label: ${account.houseLabel}`);

  return parts.length ? parts.join(" · ") : String(account.houseAddress || "").trim();
}

function getApartmentShippingAddress(account) {
  if (!account) return "";

  const parts = [];
  if (account.apartmentBuildingName) parts.push(`Building ${account.apartmentBuildingName}`);
  if (account.apartmentNumber) parts.push(`Apt. ${account.apartmentNumber}`);
  if (account.apartmentFloor) parts.push(`Floor ${account.apartmentFloor}`);
  if (account.apartmentStreet) parts.push(`Street ${account.apartmentStreet}`);
  if (account.apartmentAdditional) parts.push(account.apartmentAdditional);
  if (account.apartmentLabel) parts.push(`Label: ${account.apartmentLabel}`);

  return parts.length ? parts.join(" · ") : String(account.apartmentAddress || "").trim();
}

function getSelectedShippingAddress(account) {
  if (!account) return "";
  return account.shippingAddressType === "apartment"
    ? getApartmentShippingAddress(account)
    : account.shippingAddressType === "house"
    ? getHouseShippingAddress(account)
    : "";
}

function hasSavedShippingAddress(account) {
  if (!account || account.shippingCountry !== "Iraq" || !account.shippingAddressType) return false;

  if (account.shippingAddressType === "house") {
    return Boolean(
      String(account.houseNumber || "").trim() &&
      String(account.houseStreet || "").trim() &&
      String(account.housePhone || account.phone || "").trim()
    );
  }

  if (account.shippingAddressType === "apartment") {
    return Boolean(
      String(account.apartmentBuildingName || "").trim() &&
      String(account.apartmentNumber || "").trim() &&
      String(account.apartmentFloor || "").trim() &&
      String(account.apartmentStreet || "").trim()
    );
  }

  return Boolean(getSelectedShippingAddress(account));
}

function getShippingSummary(account) {
  if (!account) return "No shipping address saved yet.";

  const address = getSelectedShippingAddress(account);
  if (!account.shippingCountry || !account.shippingAddressType || !address) {
    return "No shipping address saved yet.";
  }

  const typeLabel = account.shippingAddressType === "apartment" ? "Apartment" : "House";
  return `${typeLabel} · ${account.shippingCountry} · ${address}`;
}

function setShippingAddressType(type) {
  const isApartment = type === "apartment";
  const isHouse = type === "house";

  apartmentAddressBtn?.classList.toggle("active", isApartment);
  houseAddressBtn?.classList.toggle("active", isHouse);
  apartmentAddressFields?.classList.toggle("hidden-field", !isApartment);
  houseAddressFields?.classList.toggle("hidden-field", !isHouse);

  if (shippingAddressForm) {
    shippingAddressForm.dataset.addressType = isApartment || isHouse ? type : "";
  }
}

function populateShippingForm(account) {
  if (!shippingAddressForm) return;

  shippingCountrySelect.value = "Iraq";
  houseNumberInput.value = account?.houseNumber || "";
  houseFloorInput.value = account?.houseFloor || "";
  houseStreetInput.value = account?.houseStreet || "";
  housePhoneInput.value = account?.housePhone || account?.phone || "";
  houseAdditionalInput.value = account?.houseAdditional || "";
  houseLabelInput.value = account?.houseLabel || "";
  apartmentBuildingNameInput.value = account?.apartmentBuildingName || "";
  apartmentNumberInput.value = account?.apartmentNumber || "";
  apartmentFloorInput.value = account?.apartmentFloor || "";
  apartmentStreetInput.value = account?.apartmentStreet || "";
  apartmentAdditionalInput.value = account?.apartmentAdditional || "";
  apartmentLabelInput.value = account?.apartmentLabel || "";
  setShippingAddressType(account?.shippingAddressType || "");

  if (shippingSummaryText) {
    shippingSummaryText.textContent = getShippingSummary(account);
  }
}

function getFilteredProducts() {
  const query = state.search.trim().toLowerCase();
  const selectedCatalogIds = state.selectedCatalog === "all" ? null : getCatalogDescendantIds(state.selectedCatalog);

  return state.products.filter((product) => {
    const productCatalogId = String(product.catalogId || "").trim();
    const matchesCatalog = !selectedCatalogIds || selectedCatalogIds.has(productCatalogId);
    if (!matchesCatalog) return false;
    const haystack = [
      product.name,
      product.brand,
      product.type,
      product.category,
      product.country,
      product.material,
      product.audience,
      ...(product.colors || []),
      ...(product.sizes || [])
    ]
      .join(" ")
      .toLowerCase();

    return !query || haystack.includes(query);
  });
}

function getCatalogById(catalogId) {
  return state.catalogs.find((entry) => entry.id === catalogId);
}

function getCatalogDepth(catalogId) {
  let depth = 0;
  let current = getCatalogById(catalogId);
  const seen = new Set();

  while (current?.parentId && !seen.has(current.parentId)) {
    seen.add(current.parentId);
    current = getCatalogById(current.parentId);
    if (current) depth += 1;
  }

  return depth;
}

function getCatalogName(catalogId) {
  const catalog = getCatalogById(catalogId);
  if (!catalog) return "Uncategorized";

  const parts = [catalog.name];
  let current = catalog;
  const seen = new Set([catalog.id]);

  while (current?.parentId && !seen.has(current.parentId)) {
    const parent = getCatalogById(current.parentId);
    if (!parent) break;
    parts.unshift(parent.name);
    seen.add(parent.id);
    current = parent;
  }

  return parts.join(" / ");
}

function getCatalogChildren(parentId = "") {
  return state.catalogs.filter((entry) => String(entry.parentId || "") === String(parentId || ""));
}

function getCatalogDescendantIds(catalogId) {
  const ids = new Set([String(catalogId)]);
  const queue = [String(catalogId)];

  while (queue.length) {
    const currentId = queue.shift();
    state.catalogs.forEach((entry) => {
      if (String(entry.parentId || "") === currentId && !ids.has(String(entry.id))) {
        ids.add(String(entry.id));
        queue.push(String(entry.id));
      }
    });
  }

  return ids;
}

function isCatalogSelectedOrAncestor(catalogId) {
  if (state.selectedCatalog === "all") return false;
  if (String(catalogId) === String(state.selectedCatalog)) return true;

  let current = getCatalogById(state.selectedCatalog);
  const seen = new Set();
  while (current?.parentId && !seen.has(current.parentId)) {
    if (String(current.parentId) === String(catalogId)) return true;
    seen.add(current.parentId);
    current = getCatalogById(current.parentId);
  }

  return false;
}

function renderCatalogFilters() {
  if (!catalogFilters) return;

  const topLevelCatalogs = getCatalogChildren("");
  const allProductsCount = state.products.length;

  const topLevelHtml = topLevelCatalogs
    .map((catalog) => {
      const catalogCount = state.products.filter((product) => getCatalogDescendantIds(catalog.id).has(String(product.catalogId || ""))).length;
      const subcatalogs = getCatalogChildren(catalog.id);
      const isOpen = isCatalogSelectedOrAncestor(catalog.id);
      const subcatalogHtml = subcatalogs.length
        ? `
          <div class="subcatalog-row ${isOpen ? "open" : ""}">
            ${subcatalogs
              .map((child) => {
                const childCount = state.products.filter((product) => getCatalogDescendantIds(child.id).has(String(product.catalogId || ""))).length;
                return `
                  <button class="subcatalog-chip ${state.selectedCatalog === child.id ? "active" : ""}" data-catalog-filter="${child.id}" type="button">
                    <span>${child.name}</span>
                    <strong>${childCount}</strong>
                  </button>
                `;
              })
              .join("")}
          </div>
        `
        : "";

      return `
        <div class="catalog-tree-block">
          <button class="catalog-chip ${state.selectedCatalog === catalog.id ? "active" : ""}" data-catalog-filter="${catalog.id}" type="button">
            <span>${catalog.name}</span>
            <strong>${catalogCount}</strong>
          </button>
          ${subcatalogHtml}
        </div>
      `;
    })
    .join("");

  catalogFilters.innerHTML = `
    <div class="catalog-tree-block">
      <button class="catalog-chip ${state.selectedCatalog === "all" ? "active" : ""}" data-catalog-filter="all" type="button">
        <span>${escapeHtml(t("allProducts"))}</span>
        <strong>${allProductsCount}</strong>
      </button>
    </div>
    ${topLevelHtml}
  `;
}

function populateProductSubcatalogSelect(parentId = "", preferredCatalogId = "") {
  if (!dashboardProductSubcatalog) return;

  const childCatalogs = getCatalogChildren(parentId);
  const options = ['<option value="">No subcatalog - save in main catalog</option>']
    .concat(childCatalogs.map((catalog) => `<option value="${catalog.id}">${catalog.name}</option>`))
    .join("");

  dashboardProductSubcatalog.innerHTML = options;

  const preferredIsChild = preferredCatalogId && childCatalogs.some((catalog) => String(catalog.id) === String(preferredCatalogId));
  dashboardProductSubcatalog.value = preferredIsChild ? String(preferredCatalogId) : "";
}

function syncProductCatalogSelection(preferredCatalogId = "") {
  if (!dashboardProductCatalog || !dashboardProductParentCatalog) return;

  const parentCatalogId = String(dashboardProductParentCatalog.value || "");
  populateProductSubcatalogSelect(parentCatalogId, preferredCatalogId);

  const selectedCatalogId = String(dashboardProductSubcatalog?.value || parentCatalogId || preferredCatalogId || "");
  dashboardProductCatalog.value = selectedCatalogId;

  if (dashboardProductCatalogPath) {
    dashboardProductCatalogPath.textContent = selectedCatalogId
      ? `This product will be saved in: ${getCatalogName(selectedCatalogId)}`
      : "This product will be saved in: No catalog";
  }
}

function setProductCatalogPicker(catalogId = "") {
  if (!dashboardProductParentCatalog || !dashboardProductCatalog) return;

  const selectedCatalog = getCatalogById(catalogId);
  const parentCatalogId = selectedCatalog?.parentId ? String(selectedCatalog.parentId) : String(catalogId || "");

  dashboardProductParentCatalog.value = parentCatalogId;
  syncProductCatalogSelection(catalogId);
}

function populateCatalogSelect() {
  if (dashboardProductCatalog) {
    const options = state.catalogs
      .map((catalog) => `<option value="${catalog.id}">${getCatalogName(catalog.id)}</option>`)
      .join("");
    dashboardProductCatalog.innerHTML = options || '<option value="">No catalog</option>';
  }

  if (dashboardProductParentCatalog) {
    const parentOptions = ['<option value="">Choose main catalog</option>']
      .concat(getCatalogChildren("").map((catalog) => `<option value="${catalog.id}">${catalog.name}</option>`))
      .join("");
    dashboardProductParentCatalog.innerHTML = parentOptions;
  }

  populateProductSubcatalogSelect("");
  syncProductCatalogSelection(dashboardProductCatalog?.value || "");

  if (dashboardCatalogParent) {
    const parentOptions = ['<option value="">Top level catalog</option>']
      .concat(state.catalogs.map((catalog) => {
        const indent = "&nbsp;".repeat(getCatalogDepth(catalog.id) * 4);
        return `<option value="${catalog.id}">${indent}${getCatalogName(catalog.id)}</option>`;
      }))
      .join("");
    dashboardCatalogParent.innerHTML = parentOptions;
  }
}

function renderDashboardCatalogs() {
  if (!dashboardCatalogList) return;
  dashboardCatalogList.innerHTML = "";

  if (!state.catalogs.length) {
    dashboardCatalogList.innerHTML = `<div class="order-card"><p class="order-meta">No catalogs yet.</p></div>`;
    return;
  }

  state.catalogs.forEach((catalog) => {
    const count = state.products.filter((product) => product.catalogId === catalog.id).length;
    const childCount = state.catalogs.filter((entry) => entry.parentId === catalog.id).length;
    const row = document.createElement("div");
    row.className = "order-card";
    row.innerHTML = `
      <div class="product-row">
        <div>
          <strong>${getCatalogName(catalog.id)}</strong>
          <p class="order-meta">${count} product${count === 1 ? "" : "s"} · ${childCount} subcatalog${childCount === 1 ? "" : "s"}</p>
        </div>
        <div class="inline-actions">
          <button class="secondary-btn" data-catalog-action="delete" data-id="${catalog.id}" type="button">Delete</button>
        </div>
      </div>
    `;
    dashboardCatalogList.appendChild(row);
  });
}

function createCatalog(name, parentId = "") {
  if (!isAdmin()) return alert("Only authorized team members can create catalogs.");
  const finalName = normalizeCatalogName(name);
  if (!finalName) return alert("Enter a catalog name.");

  const normalizedParentId = String(parentId || "").trim();
  if (normalizedParentId && !getCatalogById(normalizedParentId)) {
    return alert("Choose a valid parent catalog.");
  }

  const duplicate = state.catalogs.some((entry) => {
    const sameParent = String(entry.parentId || "") === normalizedParentId;
    return sameParent && entry.name.toLowerCase() === finalName.toLowerCase();
  });
  if (duplicate) return alert("This catalog already exists inside the same parent catalog.");

  const slugBase = normalizedParentId ? `${normalizedParentId}-${finalName}` : finalName;
  const newCatalog = { id: normalizeCatalogSlug(slugBase), name: finalName, parentId: normalizedParentId || "" };
  state.catalogs.unshift(newCatalog);
  refreshAll();
  setProductCatalogPicker(newCatalog.id);
  alert(`Catalog created: ${getCatalogName(newCatalog.id)}`);
}

function deleteCatalog(catalogId) {
  const hasChildren = state.catalogs.some((entry) => entry.parentId === catalogId);
  if (hasChildren) return alert("Delete or move the subcatalogs first.");
  const used = state.products.some((product) => product.catalogId === catalogId);
  if (used) return alert("Move products to another catalog before deleting this one.");
  state.catalogs = state.catalogs.filter((entry) => entry.id !== catalogId);
  if (state.selectedCatalog === catalogId) state.selectedCatalog = "all";
  refreshAll();
}

function openPanel(panel) {
  closeAllPanels();
  panel?.classList.add("open");
  overlay?.classList.add("show");
  document.body.classList.add("panel-lock");
}

function closeAllPanels() {
  [cartPanel, ordersPanel, chatPanel, accountPanel, dashboardPanel, mobileMenuPanel].forEach((panel) => {
    panel?.classList.remove("open");
  });
  overlay?.classList.remove("show");
  document.body.classList.remove("panel-lock");
}

function openAuth() {
  authModal?.classList.remove("hidden-box");
  overlay?.classList.add("show");
}

function closeAuth() {
  authModal?.classList.add("hidden-box");

  const anyPanelOpen = [cartPanel, ordersPanel, chatPanel, accountPanel, dashboardPanel].some((panel) =>
    panel?.classList.contains("open")
  );

  if (!anyPanelOpen) overlay?.classList.remove("show");
}

function setAuthMode(mode) {
  state.authMode = mode;

  const isCreate = mode === "create";
  authTitle.textContent = isCreate ? "Create account" : "Sign in";
  authHelper.textContent = isCreate
    ? "Create your customer account to place orders."
    : "Access your account to continue shopping.";
  authSubmitBtn.textContent = isCreate ? "Create account" : "Sign in";

  nameField?.classList.toggle("hidden-field", !isCreate);
  phoneField?.classList.toggle("hidden-field", !isCreate);

  signInTab?.classList.toggle("active", !isCreate);
  createAccountTab?.classList.toggle("active", isCreate);
}

function setDashboardTab(tab) {
  state.dashboardTab = tab;

  document.querySelectorAll(".dashboard-tab-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.dashboardTab === tab);
  });

  document.querySelectorAll("[data-dashboard-content]").forEach((section) => {
    section.classList.toggle("active", section.dataset.dashboardContent === tab);
  });
}

function renderDashboardVisibility() {
  const overviewTabButton = document.querySelector('[data-dashboard-tab="overview"]');
  const dashboardOverviewContent = document.querySelector('[data-dashboard-content="overview"]');
  const showOverview = isOwnerOverviewVisible();
  overviewTabButton?.classList.toggle('hidden-box', !showOverview);
  dashboardOverviewContent?.classList.toggle('hidden-box', !showOverview);

  if (!showOverview && state.dashboardTab === 'overview') {
    state.dashboardTab = 'orders';
  }
}

function updateHeroCounts() {
  if (heroProductCount) heroProductCount.textContent = `${state.products.length}+`;
  if (heroAccountCount) heroAccountCount.textContent = `${state.accounts.filter((account) => account.role === "customer").length}+`;
  if (heroAdminCount) heroAdminCount.textContent = String(state.accounts.filter((account) => account.role !== "customer").length);
}

function renderHeroImage() {
  if (!heroManagedImage || !heroVisualFallback) return;

  if (state.heroImage) {
    heroManagedImage.src = state.heroImage;
    heroManagedImage.classList.remove("hidden-image");
    heroVisualFallback.classList.add("hidden-box");
  } else {
    heroManagedImage.src = "";
    heroManagedImage.classList.add("hidden-image");
    heroVisualFallback.classList.remove("hidden-box");
  }
}

function renderHeroContent() {
  if (heroTagText) heroTagText.textContent = state.heroContent.tag || "";
  if (heroTitleText) heroTitleText.textContent = state.heroContent.title || "";
  if (heroDescriptionText) heroDescriptionText.textContent = state.heroContent.description || "";

  if (heroCard1Label) heroCard1Label.textContent = state.heroContent.card1Label || "";
  if (heroCard1Title) heroCard1Title.textContent = state.heroContent.card1Title || "";
  if (heroCard2Label) heroCard2Label.textContent = state.heroContent.card2Label || "";
  if (heroCard2Title) heroCard2Title.textContent = state.heroContent.card2Title || "";
  if (heroCard3Label) heroCard3Label.textContent = state.heroContent.card3Label || "";
  if (heroCard3Title) heroCard3Title.textContent = state.heroContent.card3Title || "";

  if (dashboardHeroTag) dashboardHeroTag.value = state.heroContent.tag || "";
  if (dashboardHeroTitle) dashboardHeroTitle.value = state.heroContent.title || "";
  if (dashboardHeroDescription) dashboardHeroDescription.value = state.heroContent.description || "";

  if (dashboardHeroCard1Label) dashboardHeroCard1Label.value = state.heroContent.card1Label || "";
  if (dashboardHeroCard1Title) dashboardHeroCard1Title.value = state.heroContent.card1Title || "";
  if (dashboardHeroCard2Label) dashboardHeroCard2Label.value = state.heroContent.card2Label || "";
  if (dashboardHeroCard2Title) dashboardHeroCard2Title.value = state.heroContent.card2Title || "";
  if (dashboardHeroCard3Label) dashboardHeroCard3Label.value = state.heroContent.card3Label || "";
  if (dashboardHeroCard3Title) dashboardHeroCard3Title.value = state.heroContent.card3Title || "";
}


function makeChatThreadId() {
  return `CHAT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeChatMessageId() {
  return `MSG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatChatTime(value) {
  return new Date(value).toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getVisibleChatThreads() {
  const account = getCurrentAccount();
  if (!account) return [];

  const visibleThreads = isAdmin()
    ? state.chatThreads
    : state.chatThreads.filter((thread) => thread.memberEmail === account.email);

  return [...visibleThreads].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

function ensureActiveChatThread() {
  const visibleThreads = getVisibleChatThreads();

  if (!visibleThreads.length) {
    state.activeChatThreadId = null;
    return null;
  }

  const active = visibleThreads.find((thread) => thread.id === state.activeChatThreadId);
  if (active) return active;

  state.activeChatThreadId = visibleThreads[0].id;
  return visibleThreads[0];
}

function createOrGetProductChat(product) {
  const account = getCurrentAccount();
  if (!account) return null;

  let thread = state.chatThreads.find(
    (entry) => entry.productId === product.id && entry.memberEmail === account.email
  );

  if (!thread) {
    const timestamp = new Date().toISOString();

    thread = {
      id: makeChatThreadId(),
      productId: product.id,
      productName: product.name,
      productImage: (product.images || [])[0] || "",
      memberEmail: account.email,
      memberName: account.name,
      adminEmail: ADMIN_EMAIL,
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [
        {
          id: makeChatMessageId(),
          senderEmail: "system@sora.local",
          senderName: "System",
          senderRole: "system",
          text: `${account.name} submitted an inquiry about ${product.name}.`,
          createdAt: timestamp
        }
      ]
    };

    state.chatThreads.unshift(thread);
    pushNotification(ADMIN_EMAIL, "New chat inquiry", `${account.name} started a chat about ${product.name}.`, "chat");
  }

  state.activeChatThreadId = thread.id;
  return thread;
}

function openProductChat(product) {
  const account = getCurrentAccount();

  if (!account) {
    alert("Please sign in first to continue.");
    openAuth();
    return;
  }

  createOrGetProductChat(product);
  refreshAll();
  openPanel(chatPanel);
}

function openChatPanelForCurrentUser() {
  const account = getCurrentAccount();

  if (!account) {
    alert("Please sign in first to view messages.");
    openAuth();
    return;
  }

  ensureActiveChatThread();
  renderChatPanel();
  openPanel(chatPanel);
}

function renderChatPanel() {
  if (!chatThreadList || !chatEmptyState || !chatConversationBox || !chatThreadInfo || !chatMessages) {
    return;
  }

  const account = getCurrentAccount();

  if (!account) {
    chatThreadList.innerHTML = `
      <div class="order-card"><p class="order-meta">Sign in to view your messages and inquiries.</p></div>
    `;
    chatEmptyState.classList.remove("hidden-box");
    chatConversationBox.classList.add("hidden-box");
    chatEmptyState.innerHTML = `<p class="order-meta">Please sign in first to access customer messages.</p>`;
    return;
  }

  const visibleThreads = getVisibleChatThreads();

  if (!visibleThreads.length) {
    chatThreadList.innerHTML = `
      <div class="order-card"><p class="order-meta">${
        isAdmin()
          ? "No customer inquiries yet."
          : "No inquiries yet. Open a product and select Product Inquiry."
      }</p></div>
    `;
    chatEmptyState.classList.remove("hidden-box");
    chatConversationBox.classList.add("hidden-box");
    chatEmptyState.innerHTML = `<p class="order-meta">${
      isAdmin()
        ? "Customer inquiries will appear here once they are submitted."
        : "Choose a product and select Product Inquiry to send a message about that item."
    }</p>`;
    return;
  }

  const activeThread = ensureActiveChatThread();

  chatThreadList.innerHTML = visibleThreads
    .map((thread) => {
      const lastMessage = thread.messages[thread.messages.length - 1];
      const preview = lastMessage?.text || "No messages yet.";
      const metaText = isAdmin()
        ? `${escapeHtml(thread.memberName)} · ${escapeHtml(thread.productName)}`
        : `Admin · ${escapeHtml(thread.productName)}`;

      return `
        <button class="chat-thread-btn${thread.id === activeThread?.id ? " active" : ""}" data-chat-thread-id="${thread.id}" type="button">
          <strong>${escapeHtml(thread.productName)}</strong>
          <span>${escapeHtml(metaText)}</span>
          <span>${escapeHtml(preview)}</span>
          <span>${formatChatTime(thread.updatedAt)}</span>
        </button>
      `;
    })
    .join("");

  if (!activeThread) {
    chatEmptyState.classList.remove("hidden-box");
    chatConversationBox.classList.add("hidden-box");
    return;
  }

  chatEmptyState.classList.add("hidden-box");
  chatConversationBox.classList.remove("hidden-box");

  const threadProduct = state.products.find((product) => product.id === activeThread.productId);
  const productImage = activeThread.productImage || (threadProduct?.images || [])[0] || "";
  const imageMarkup = productImage
    ? `<img class="chat-thread-product-image" src="${productImage}" alt="${escapeHtml(activeThread.productName)}" />`
    : `<div class="chat-thread-product-image"></div>`;

  chatThreadInfo.innerHTML = `
    ${imageMarkup}
    <div class="chat-thread-copy">
      <h4>${escapeHtml(activeThread.productName)}</h4>
      <p>Member: ${escapeHtml(activeThread.memberName)} · ${escapeHtml(activeThread.memberEmail)}</p>
      <p>Support contact: ${escapeHtml(activeThread.adminEmail)}</p>
    </div>
  `;

  chatMessages.innerHTML = activeThread.messages
    .map((message) => {
      const bubbleClass =
        message.senderRole === "system"
          ? "system"
          : message.senderEmail === account.email
          ? "self"
          : "other";

      return `
        <div class="chat-bubble-wrap ${bubbleClass}">
          <div class="chat-bubble">
            <strong>${escapeHtml(message.senderName)}</strong>
            <p>${escapeHtml(message.text)}</p>
            <span>${formatChatTime(message.createdAt)}</span>
          </div>
        </div>
      `;
    })
    .join("");

  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (chatMessageInput) {
    chatMessageInput.placeholder = isAdmin()
      ? `Reply to ${escapeHtml(activeThread.memberName)} about ${escapeHtml(activeThread.productName)}`
      : `Write a message about ${escapeHtml(activeThread.productName)}`;
  }
}

function sendChatMessage() {
  const account = getCurrentAccount();
  if (!account) return alert("Please sign in first.");

  const thread = state.chatThreads.find((entry) => entry.id === state.activeChatThreadId);
  if (!thread) return alert("Please select a conversation first.");

  const text = chatMessageInput?.value.trim();
  if (!text) return;

  const timestamp = new Date().toISOString();

  thread.messages.push({
    id: makeChatMessageId(),
    senderEmail: account.email,
    senderName: account.name,
    senderRole: account.role,
    text,
    createdAt: timestamp
  });

  thread.updatedAt = timestamp;

  const targetEmail = isAdmin() ? thread.memberEmail : thread.adminEmail;
  if (targetEmail && targetEmail !== account.email) {
    pushNotification(
      targetEmail,
      isAdmin() ? "New admin reply" : "New customer message",
      `${thread.productName} · ${account.name}: ${text.slice(0, 90)}`,
      "chat"
    );
  }

  if (chatMessageForm) chatMessageForm.reset();
  refreshAll();
  openPanel(chatPanel);
}

function renderDashboardChats() {
  if (!dashboardChatsList) return;

  if (!isAdmin()) {
    dashboardChatsList.innerHTML = `
      <div class="order-card"><p class="order-meta">Only authorized team members can open all customer inquiries.</p></div>
    `;
    return;
  }

  const visibleThreads = getVisibleChatThreads();

  if (!visibleThreads.length) {
    dashboardChatsList.innerHTML = `
      <div class="order-card"><p class="order-meta">No customer inquiries yet.</p></div>
    `;
    return;
  }

  dashboardChatsList.innerHTML = visibleThreads
    .map((thread) => {
      const lastMessage = thread.messages[thread.messages.length - 1];
      return `
        <div class="order-card">
          <div class="user-row">
            <div>
              <strong>${escapeHtml(thread.productName)}</strong>
              <p class="order-meta">Member: ${escapeHtml(thread.memberName)} · ${escapeHtml(thread.memberEmail)}</p>
              <p class="order-meta">Last message: ${escapeHtml(lastMessage?.text || "No messages yet.")}</p>
              <p class="order-meta">Updated: ${formatChatTime(thread.updatedAt)}</p>
            </div>
            <div class="inline-actions">
              <button class="primary-btn" data-dashboard-chat-id="${thread.id}" type="button">Open Conversation</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function createSliderDots(container, count, activeIndex, onClick) {
  container.innerHTML = "";
  if (count <= 1) return;

  Array.from({ length: count }).forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = index === activeIndex ? "active" : "";
    dot.addEventListener("click", () => onClick(index));
    container.appendChild(dot);
  });
}

function renderProducts() {
  if (!productGrid || !template) return;

  const products = getFilteredProducts();
  productGrid.innerHTML = "";

  if (resultsCount) {
    resultsCount.textContent = `${products.length} item${products.length === 1 ? "" : "s"}`;
  }

  if (resultsText) {
    const catalogName = state.selectedCatalog === "all" ? "all catalogs" : getCatalogName(state.selectedCatalog);
    resultsText.textContent = state.search.trim()
      ? `Showing ${catalogName} results for "${state.search}".`
      : `Showing products from ${catalogName}.`;
  }

  updateHeroCounts();

  if (!products.length) {
    productGrid.innerHTML = `<div class="empty-products"><strong>${escapeHtml(t("noProductsFound"))}</strong><p>${escapeHtml(t("noProductsHint"))}</p></div>`;
    return;
  }

  products.forEach((product) => {
    const fragment = template.content.cloneNode(true);

    const card = fragment.querySelector(".product-card");
    const imageWrap = fragment.querySelector(".product-image-wrap");
    const fallbackImage = fragment.querySelector(".fallback-image");
    const realImage = fragment.querySelector(".product-real-image");
    const prevBtn = fragment.querySelector(".slider-prev");
    const nextBtn = fragment.querySelector(".slider-next");
    const dotsWrap = fragment.querySelector(".slider-dots");
    const countryBadge = fragment.querySelector(".country-badge");
    const genderBadge = fragment.querySelector(".gender-badge");
    const categoryText = fragment.querySelector(".category-text");
    const title = fragment.querySelector(".product-title");
    const description = fragment.querySelector(".product-description");
    const brand = fragment.querySelector(".product-brand");
    const type = fragment.querySelector(".product-type");
    const material = fragment.querySelector(".product-material");
    const stock = fragment.querySelector(".product-stock");
    const colorLabel = fragment.querySelector(".product-color-label");
    const sizeLabel = fragment.querySelector(".product-size-label");
    const colorOptions = fragment.querySelector(".product-color-options");
    const sizeOptions = fragment.querySelector(".product-size-options");
    const price = fragment.querySelector(".product-price");
    const oldPrice = fragment.querySelector(".product-old-price");
    const shippingLabel = fragment.querySelector(".product-shipping-label");
    const shippingOptions = fragment.querySelector(".product-shipping-options");
    const shippingNote = fragment.querySelector(".shipping-method-note");
    const addToCartBtn = fragment.querySelector(".add-to-cart-btn");
    const detailsBtn = fragment.querySelector(".details-btn");
    const wishlistBtn = fragment.querySelector(".wishlist-icon-btn");
    const wishlistHeart = fragment.querySelector(".wishlist-heart");
    const chatProductBtn = fragment.querySelector(".chat-product-btn");
    const buyNowBtn = fragment.querySelector(".buy-now-btn");

    let currentImageIndex = 0;
    let selectedColor = (product.colors || [])[0] || "";
    addToCartBtn.textContent = t("addToCart");
    detailsBtn.textContent = t("details");
    chatProductBtn.textContent = t("productInquiry");
    buyNowBtn.textContent = t("buyNow");
    const choiceHeads = fragment.querySelectorAll('.choice-head strong');
    if (choiceHeads[0]) choiceHeads[0].textContent = t("colors");
    if (choiceHeads[1]) choiceHeads[1].textContent = t("sizes");
    if (choiceHeads[2]) choiceHeads[2].textContent = t("shipping");
    let selectedSize = (product.sizes || [])[0] || "";
    let selectedShipping = getAvailableShippingMethods(product)[0] || "air";

    categoryText.textContent = `${getCatalogName(product.catalogId)} · ${product.category || "Product"}`;
    title.textContent = product.name;
    description.textContent = product.description;
    brand.textContent = product.brand;
    type.textContent = product.type;
    material.textContent = product.material;
    stock.textContent = `${product.stock} in stock`;
    countryBadge.textContent = product.country || "Global";
    genderBadge.textContent = product.audience || "All";
    price.textContent = formatPrice(getShippingPrice(product, selectedShipping));
    oldPrice.textContent = "";

    const accent = product.accent || getAccentByName("purple");
    imageWrap.style.background = accent;
    fallbackImage.style.background = accent;
    wishlistBtn?.classList.toggle("active", isWishlisted(product.id));
    if (wishlistHeart) wishlistHeart.innerHTML = isWishlisted(product.id) ? "&#9829;" : "&#9825;";

    function updateImage() {
      const images = product.images || [];
      const hasImages = images.length > 0;

      realImage.classList.toggle("hidden-image", !hasImages);
      fallbackImage.classList.toggle("hidden-box", hasImages);

      if (hasImages) realImage.src = images[currentImageIndex];

      prevBtn.style.display = images.length > 1 ? "grid" : "none";
      nextBtn.style.display = images.length > 1 ? "grid" : "none";

      createSliderDots(dotsWrap, images.length, currentImageIndex, (index) => {
        currentImageIndex = index;
        updateImage();
      });
    }

    function renderColorOptions() {
      colorOptions.innerHTML = "";
      (product.colors || []).forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `color-chip${item === selectedColor ? " active" : ""}`;
        button.textContent = item;

        button.addEventListener("click", () => {
          selectedColor = item;
          renderColorOptions();
          updateSelections();
        });

        colorOptions.appendChild(button);
      });
    }

    function renderSizeOptions() {
      sizeOptions.innerHTML = "";
      (product.sizes || []).forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `size-chip${item === selectedSize ? " active" : ""}`;
        button.textContent = item;

        button.addEventListener("click", () => {
          selectedSize = item;
          renderSizeOptions();
          updateSelections();
        });

        sizeOptions.appendChild(button);
      });
    }

    function renderShippingOptions() {
      shippingOptions.innerHTML = "";
      getAvailableShippingMethods(product).forEach((method) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `shipping-chip${method === selectedShipping ? " active" : ""}`;
        button.innerHTML = renderShippingChipHtml(product, method, method === selectedShipping);
        button.addEventListener("click", () => {
          selectedShipping = method;
          renderShippingOptions();
          updateSelections();
        });
        shippingOptions.appendChild(button);
      });
    }

    function updateSelections() {
      colorLabel.textContent = selectedColor || "Select color";
      sizeLabel.textContent = selectedSize || "Select size";
      shippingLabel.textContent = `${getShippingLabel(selectedShipping)} · ${formatPrice(getShippingPrice(product, selectedShipping))}`;
      shippingNote.innerHTML = renderShippingNoteHtml(product, selectedShipping);
      price.textContent = formatPrice(getShippingPrice(product, selectedShipping));
    }

    prevBtn.addEventListener("click", () => {
      const images = product.images || [];
      if (!images.length) return;
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      updateImage();
    });

    nextBtn.addEventListener("click", () => {
      const images = product.images || [];
      if (!images.length) return;
      currentImageIndex = (currentImageIndex + 1) % images.length;
      updateImage();
    });

    addToCartBtn.addEventListener("click", () => {
      addToCart(product, selectedColor, selectedSize, selectedShipping);
    });

    detailsBtn?.addEventListener("click", () => {
      openProductDetails(product);
    });

    wishlistBtn?.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleWishlist(product.id);
    });

    chatProductBtn?.addEventListener("click", () => {
      openProductChat(product);
    });

    buyNowBtn.addEventListener("click", () => {
      addToCart(product, selectedColor, selectedSize, selectedShipping);
      openPanel(cartPanel);
    });

    updateSelections();
    updateImage();
    renderColorOptions();
    renderSizeOptions();
    renderShippingOptions();

    card.dataset.productId = product.id;
    productGrid.appendChild(fragment);
  });
}


function isWishlisted(productId) {
  return state.wishlist.includes(Number(productId));
}

function toggleWishlist(productId) {
  const numericId = Number(productId);
  if (isWishlisted(numericId)) {
    state.wishlist = state.wishlist.filter((id) => id !== numericId);
  } else {
    state.wishlist.unshift(numericId);
  }
  refreshAll();
  if (state.activeProductDetailsId === numericId) {
    openProductDetails(numericId, { preserveScroll: true });
  }
}

function getRelatedProducts(product, limit = 4) {
  return state.products
    .filter((entry) => entry.id !== product.id)
    .sort((a, b) => {
      const aScore = (a.category === product.category ? 2 : 0) + (a.catalogId === product.catalogId ? 1 : 0);
      const bScore = (b.category === product.category ? 2 : 0) + (b.catalogId === product.catalogId ? 1 : 0);
      return bScore - aScore;
    })
    .slice(0, limit);
}

function renderOrderTimeline(status) {
  const currentIndex = ORDER_STEPS.indexOf(status);
  return `
    <div class="order-timeline" aria-label="Order timeline">
      <div class="order-timeline-track">
        ${ORDER_STEPS.map((step, index) => {
          const stateClass = currentIndex > index ? "done" : currentIndex === index ? "current" : "upcoming";
          const stepIcon = currentIndex > index ? "✓" : index + 1;
          return `
            <div class="order-step ${stateClass}">
              <div class="order-step-dot">${stepIcon}</div>
              <div class="order-step-label">${escapeHtml(step)}</div>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function openImageZoom(src, altText) {
  if (!imageZoomModal || !imageZoomPreview || !src) return;
  imageZoomPreview.src = src;
  imageZoomPreview.alt = altText || "Zoomed product image";
  imageZoomModal.classList.remove("hidden-box");
  document.body.style.overflow = "hidden";
}

function closeImageZoom() {
  if (!imageZoomModal) return;
  imageZoomModal.classList.add("hidden-box");
  if (imageZoomPreview) imageZoomPreview.src = "";
  document.body.style.overflow = "";
}

function openProductDetails(productOrId, options = {}) {
  const product = typeof productOrId === "object" ? productOrId : state.products.find((entry) => entry.id === Number(productOrId));
  if (!product || !productDetailsModal) return;

  state.activeProductDetailsId = product.id;
  let activeImageIndex = 0;
  let selectedColor = (product.colors || [])[0] || "Default";
  let selectedSize = (product.sizes || [])[0] || "Default";
  let selectedShipping = getAvailableShippingMethods(product)[0] || "air";

  detailsModalTitle.textContent = product.name;
  detailsModalMeta.textContent = `${getCatalogName(product.catalogId)} · ${product.brand} · ${product.type}`;
  detailsPriceText.textContent = formatPrice(getShippingPrice(product, selectedShipping));
  detailsOldPriceText.textContent = "";
  detailsDescriptionText.textContent = product.description || "No description available yet.";

  const specEntries = [
    ["Brand", product.brand || "Sora"],
    ["Type", product.type || "Product"],
    ["Category", product.category || "General"],
    ["Material", product.material || "Standard"],
    ["Country", product.country || "Global"],
    ["Stock", `${product.stock} available`],
    ["Colors", (product.colors || []).join(", ") || "Default"],
    ["Sizes", (product.sizes || []).join(", ") || "Default"]
  ];
  detailsSpecs.innerHTML = specEntries.map(([label, value]) => `
    <div class="detail-spec-item">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(String(value))}</strong>
    </div>
  `).join("");

  function renderDetailImage() {
    const images = product.images || [];
    const image = images[activeImageIndex] || "";
    detailsMainVisual.innerHTML = image
      ? `<button class="details-main-image-wrap" id="detailsZoomTrigger" type="button" aria-label="Zoom ${escapeHtml(product.name)} image"><img src="${image}" alt="${escapeHtml(product.name)}" class="details-main-image" /></button>`
      : `<div class="details-main-fallback" style="background:${product.accent || getAccentByName("purple")}"><span>${escapeHtml(product.name)}</span></div>`;
    detailsThumbs.innerHTML = images.map((src, index) => `
      <button class="details-thumb${index === activeImageIndex ? " active" : ""}" data-details-thumb="${index}" type="button">
        <img src="${src}" alt="Thumbnail ${index + 1}" />
      </button>
    `).join("");
    detailsThumbs.querySelectorAll('[data-details-thumb]').forEach((button) => {
      button.addEventListener('click', () => {
        activeImageIndex = Number(button.dataset.detailsThumb) || 0;
        renderDetailImage();
      });
    });

    const zoomTrigger = $("detailsZoomTrigger");
    const zoomImage = detailsMainVisual.querySelector('.details-main-image');
    zoomTrigger?.addEventListener('click', () => openImageZoom(image, product.name));
    zoomTrigger?.addEventListener('mousemove', (event) => {
      if (!zoomImage) return;
      const rect = zoomTrigger.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      zoomImage.style.setProperty('--zoom-x', `${x}%`);
      zoomImage.style.setProperty('--zoom-y', `${y}%`);
    });
  }

  function renderDetailChoices() {
    detailsColorLabel.textContent = selectedColor;
    detailsSizeLabel.textContent = selectedSize;
    detailsShippingLabel.textContent = `${getShippingLabel(selectedShipping)} · ${formatPrice(getShippingPrice(product, selectedShipping))}`;
    detailsShippingNote.innerHTML = renderShippingNoteHtml(product, selectedShipping);
    detailsColorOptions.innerHTML = (product.colors || ["Default"]).map((item) => `
      <button class="color-chip${item === selectedColor ? " active" : ""}" data-detail-color="${escapeHtml(item)}" type="button">${escapeHtml(item)}</button>
    `).join("");
    detailsSizeOptions.innerHTML = (product.sizes || ["Default"]).map((item) => `
      <button class="size-chip${item === selectedSize ? " active" : ""}" data-detail-size="${escapeHtml(item)}" type="button">${escapeHtml(item)}</button>
    `).join("");
    detailsShippingOptions.innerHTML = getAvailableShippingMethods(product).map((method) => `
      <button class="shipping-chip${method === selectedShipping ? " active" : ""}" data-detail-shipping="${method}" type="button">${renderShippingChipHtml(product, method, method === selectedShipping)}</button>
    `).join("");
    detailsColorOptions.querySelectorAll('[data-detail-color]').forEach((button) => {
      button.addEventListener('click', () => {
        selectedColor = button.textContent;
        renderDetailChoices();
        updateSelectionInfo();
      });
    });
    detailsSizeOptions.querySelectorAll('[data-detail-size]').forEach((button) => {
      button.addEventListener('click', () => {
        selectedSize = button.textContent;
        renderDetailChoices();
        updateSelectionInfo();
      });
    });
    detailsShippingOptions.querySelectorAll('[data-detail-shipping]').forEach((button) => {
      button.addEventListener('click', () => {
        selectedShipping = button.dataset.detailShipping || 'air';
        renderDetailChoices();
        updateSelectionInfo();
      });
    });
  }

  function updateSelectionInfo() {
    detailsSelectionInfo.innerHTML = `<div class="shipping-helper-row"><span class="shipping-helper-pill"><strong>Color:</strong> ${escapeHtml(selectedColor)}</span><span class="shipping-helper-pill"><strong>Size:</strong> ${escapeHtml(selectedSize)}</span><span class="shipping-helper-pill"><strong>Shipping:</strong> ${escapeHtml(getShippingLabel(selectedShipping))}</span><span class="shipping-helper-pill"><strong>Total:</strong> ${formatPrice(getShippingPrice(product, selectedShipping))}</span></div><p class="order-meta">${renderShippingNoteHtml(product, selectedShipping)}</p>`;
    detailsPriceText.textContent = formatPrice(getShippingPrice(product, selectedShipping));
    detailsWishlistBtn.textContent = isWishlisted(product.id) ? "Remove from wishlist" : "Add to wishlist";
  }

  detailsWishlistBtn.onclick = () => toggleWishlist(product.id);
  detailsAddToCartBtn.onclick = () => addToCart(product, selectedColor, selectedSize, selectedShipping);
  detailsBuyNowBtn.onclick = () => {
    addToCart(product, selectedColor, selectedSize, selectedShipping);
    closeProductDetails();
    openPanel(cartPanel);
  };

  const related = getRelatedProducts(product);
  relatedProductsList.innerHTML = related.map((entry) => `
    <button class="related-product-chip" data-related-product="${entry.id}" type="button">
      <span>${escapeHtml(entry.name)}</span>
      <strong>${formatPrice(entry.discountPrice || entry.price)}</strong>
    </button>
  `).join("") || `<div class="order-card"><p class="order-meta">No related products yet.</p></div>`;
  relatedProductsList.querySelectorAll('[data-related-product]').forEach((button) => {
    button.addEventListener('click', () => openProductDetails(Number(button.dataset.relatedProduct), { preserveScroll: false }));
  });

  renderDetailImage();
  renderDetailChoices();
  updateSelectionInfo();
  productDetailsModal.classList.remove('hidden-box');
  if (!options.preserveScroll) {
    productDetailsModal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.location.hash !== `#product-${product.id}`) {
      history.replaceState(null, '', `#product-${product.id}`);
    }
  }
}

function closeProductDetails() {
  productDetailsModal?.classList.add('hidden-box');
  state.activeProductDetailsId = null;
  if (String(window.location.hash || '').startsWith('#product-')) {
    history.replaceState(null, '', '#products');
  }
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getCartItemId(productId, color, size, shippingMethod) {
  return `${productId}-${color}-${size}-${shippingMethod}`;
}

function addToCart(product, color, size, shippingMethod = "air") {
  const finalShippingMethod = getAvailableShippingMethods(product).includes(shippingMethod) ? shippingMethod : (getAvailableShippingMethods(product)[0] || "air");
  const cartId = getCartItemId(product.id, color || "Default", size || "Default", finalShippingMethod);
  const existing = state.cart.find((item) => item.cartId === cartId);

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      cartId,
      productId: product.id,
      name: product.name,
      price: getShippingPrice(product, finalShippingMethod),
      image: (product.images || [])[0] || "",
      color: color || "Default",
      size: size || "Default",
      shippingMethod: finalShippingMethod,
      shippingNote: getShippingNote(product, finalShippingMethod),
      quantity: 1
    });
  }

  refreshAll();
}

function changeQuantity(cartId, amount) {
  const item = state.cart.find((entry) => entry.cartId === cartId);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.cartId !== cartId);
  }

  refreshAll();
}

function removeFromCart(cartId) {
  state.cart = state.cart.filter((entry) => entry.cartId !== cartId);
  refreshAll();
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  const totalQty = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartCount) cartCount.textContent = totalQty;
  if (sidebarCartCount) sidebarCartCount.textContent = totalQty;
  if (cartSubtotal) cartSubtotal.textContent = formatPrice(subtotal);
  if (sidebarCartSubtotal) sidebarCartSubtotal.textContent = formatPrice(subtotal);

  if (!state.cart.length) {
    cartItems.innerHTML = `<div class="cart-card"><p class="order-meta">Your cart is empty.</p></div>`;
    return;
  }

  state.cart.forEach((item) => {
    const card = document.createElement("div");
    card.className = "cart-card";

    card.innerHTML = `
      <div class="order-head">
        <strong>${item.name}</strong>
        <strong>${formatPrice(item.price * item.quantity)}</strong>
      </div>
      <p class="order-meta">Color: ${item.color} · Size: ${item.size} · ${getShippingLabel(item.shippingMethod || "air")} shipping</p>
      ${item.shippingNote ? `<p class="order-meta">${item.shippingNote}</p>` : ""}
      <div class="qty-wrap">
        <button class="qty-btn secondary-btn" data-action="decrease" data-id="${item.cartId}" type="button">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn secondary-btn" data-action="increase" data-id="${item.cartId}" type="button">+</button>
        <button class="secondary-btn" data-action="remove" data-id="${item.cartId}" type="button">Remove</button>
      </div>
    `;

    cartItems.appendChild(card);
  });
}

function createOrderFromCart() {
  const account = getCurrentAccount();

  if (!account) {
    alert("Please sign in first.");
    openAuth();
    return;
  }

  if (!state.cart.length) {
    alert("Your cart is empty.");
    return;
  }

  if (!hasSavedShippingAddress(account)) {
    renderAccountSection();
    openPanel(accountPanel);
    alert("Please save your shipping address first.");
    return;
  }

  const newOrder = {
    id: `ORD-${Date.now()}`,
    userEmail: account.email,
    customerName: account.name,
    items: [...state.cart],
    status: ORDER_STEPS[0],
    total: state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    shippingAddressType: account.shippingAddressType,
    shippingCountry: account.shippingCountry,
    shippingCity: account.shippingCity || "",
    shippingAddress: getSelectedShippingAddress(account),
    createdAt: new Date().toISOString()
  };

  state.orders.unshift(newOrder);
  newOrder.items.forEach((item) => {
    const product = state.products.find((entry) => entry.id === Number(item.productId || item.id));
    if (product) product.soldCount = Number(product.soldCount || 0) + Number(item.quantity || 0);
  });
  sendOrderNotification(newOrder, "Your order was placed and is now confirming.", "Order placed");
  state.cart = [];
  refreshAll();
  openPanel(ordersPanel);
  alert("Order placed successfully.");
}

function advanceOrderStatus(orderId) {
  if (!isAdmin()) return;

  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) return;

  const currentIndex = ORDER_STEPS.indexOf(order.status);
  if (currentIndex < ORDER_STEPS.length - 1) {
    order.status = ORDER_STEPS[currentIndex + 1];
    sendOrderNotification(order, `Status changed to ${order.status}.`);
    refreshAll();
  }
}

function renderOrders() {
  if (!ordersList) return;

  ordersList.innerHTML = "";

  const visibleOrders = isAdmin()
    ? state.orders
    : state.orders.filter((order) => order.userEmail === state.signedInUser);

  const visibleLinkRequests = isAdmin()
    ? state.linkRequests
    : state.linkRequests.filter((request) => request.userEmail === state.signedInUser);

  if (!visibleOrders.length && !visibleLinkRequests.length) {
    ordersList.innerHTML = `<div class="order-card"><p class="order-meta">No orders yet.</p></div>`;
    return;
  }

  visibleOrders.forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-card";

    const actionButton =
      isAdmin() && order.status !== ORDER_STEPS[ORDER_STEPS.length - 1]
        ? `<button class="primary-btn" data-order-id="${order.id}" type="button">Next Status</button>`
        : "";

    card.innerHTML = `
      <div class="order-head">
        <strong>${order.id}</strong>
        <strong>${formatPrice(order.total)}</strong>
      </div>
      <p class="order-meta">Customer: ${order.customerName} · Status: ${order.status}</p>
      ${renderOrderTimeline(order.status)}
      <p class="order-meta">Shipping address: ${order.shippingAddressType ? order.shippingAddressType.charAt(0).toUpperCase() + order.shippingAddressType.slice(1) : "Address not saved"} · ${order.shippingCountry || "No country"}</p>
      <p class="order-meta">Item delivery: ${(order.items || []).map((item) => `${item.name} (${getShippingLabel(item.shippingMethod || "air")})`).join(" · ")}</p>
      <p class="order-meta">${order.shippingAddress || "No full address saved"}</p>
      <p class="order-meta">${new Date(order.createdAt).toLocaleString()}</p>
      ${actionButton}
    `;

    ordersList.appendChild(card);
  });

  visibleLinkRequests.forEach((request) => {
    const card = document.createElement("div");
    card.className = "order-card";
    const canReply = !isAdmin() && request.status === "quoted";

    card.innerHTML = `
      <div class="order-head">
        <strong>${request.id}</strong>
        <strong>${request.quotedPrice ? formatPrice(request.quotedPrice) : "Waiting"}</strong>
      </div>
      <p class="order-meta">Type: Custom link order · Status: ${getLinkRequestStatusLabel(request.status)}</p>
      <div class="link-request-items">
        ${request.items.map((item) => `<div class="order-meta"><a class="link-request-url" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.url)}</a></div><div class="order-meta">${escapeHtml(item.note || "No note added.")}</div>`).join("")}
      </div>
      ${request.quotedPrice ? `<div class="link-request-quote-box"><strong>Admin price: ${formatPrice(request.quotedPrice)}</strong><p class="order-meta">${escapeHtml(request.adminNote || "Quote prepared by the team.")}</p></div>` : `<p class="order-meta">Awaiting review and quotation from the team.</p>`}
      <p class="order-meta">${new Date(request.createdAt).toLocaleString()}</p>
      ${canReply ? `<div class="inline-actions"><button class="primary-btn" data-link-request-customer-action="accept" data-id="${request.id}" type="button">Accept Price</button><button class="secondary-btn" data-link-request-customer-action="decline" data-id="${request.id}" type="button">Decline</button></div>` : ""}
    `;

    ordersList.appendChild(card);
  });
}

function renderAccountSection() {
  if (!accountInfoText || !historyList || !accountActionButtons || !changePasswordCard || !accountWishlistList) return;

  const account = getCurrentAccount();

  if (!account) {
    accountInfoText.textContent = "Not signed in.";
    historyList.innerHTML = `<div class="order-card"><p class="order-meta">Sign in to see account details.</p></div>`;
    accountWishlistList.innerHTML = `<div class="order-card"><p class="order-meta">Sign in to save products to your wishlist.</p></div>`;
    accountActionButtons.innerHTML = `<button class="primary-btn" type="button" id="accountSignInBtn">Sign in</button>`;
    changePasswordCard.classList.add("hidden-box");
    shippingCard?.classList.add("hidden-box");
    populateShippingForm(null);

    const accountSignInBtn = $("accountSignInBtn");
    accountSignInBtn?.addEventListener("click", openAuth);
    return;
  }

  accountInfoText.textContent = `${account.name} · ${account.email} · ${account.phone || "No phone"} · ${getRoleLabel(account.role)} · ${getShippingSummary(account)}`;

  accountActionButtons.innerHTML = `
    <button class="secondary-btn" type="button" id="logoutBtn">Logout</button>
    <button class="primary-btn" type="button" id="togglePasswordBtn">Change Password</button>
  `;

  const userOrders = state.orders.filter((order) => order.userEmail === account.email);
  const userLinkRequests = state.linkRequests.filter((request) => request.userEmail === account.email);
  const userNotifications = getNotificationsForUser(account.email);
  const wishlistProducts = state.wishlist
    .map((productId) => state.products.find((product) => product.id === Number(productId)))
    .filter(Boolean);

  const orderCards = userOrders.map(
    (order) => `
      <div class="order-card">
        <div class="order-head">
          <strong>${order.id}</strong>
          <strong>${formatPrice(order.total)}</strong>
        </div>
        <p class="order-meta">Status: ${order.status}</p>
        ${renderOrderTimeline(order.status)}
        ${order.cancelRequested ? `<p class="order-meta warning-text">Cancellation request pending approval.</p>` : ""}
        ${order.returnRequested ? `<p class="order-meta warning-text">Return request pending approval.</p>` : ""}
        <p class="order-meta">${order.shippingAddressType ? order.shippingAddressType.charAt(0).toUpperCase() + order.shippingAddressType.slice(1) : "Address"} · ${order.shippingCountry || "No country"}</p>
        <p class="order-meta">${(order.items || []).map((item) => `${item.name} (${getShippingLabel(item.shippingMethod || "air")})`).join(" · ")}</p>
        <p class="order-meta">${order.shippingAddress || "No full address saved"}</p>
      </div>
    `
  );

  const linkRequestCards = userLinkRequests.map(
    (request) => `
      <div class="order-card">
        <div class="order-head">
          <strong>${request.id}</strong>
          <strong>${request.quotedPrice ? formatPrice(request.quotedPrice) : "Waiting"}</strong>
        </div>
        <p class="order-meta">Type: Custom link order · Status: ${getLinkRequestStatusLabel(request.status)}</p>
        <div class="link-request-items">
          ${request.items.map((item) => `<div class="order-meta"><a class="link-request-url" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.url)}</a></div><div class="order-meta">${escapeHtml(item.note || "No note added.")}</div>`).join("")}
        </div>
        ${request.quotedPrice ? `<div class="link-request-quote-box"><strong>Admin price: ${formatPrice(request.quotedPrice)}</strong><p class="order-meta">${escapeHtml(request.adminNote || "Quote prepared by the team.")}</p></div>` : `<p class="order-meta">Awaiting review and quotation from the team.</p>`}
        ${request.status === "quoted" ? `<div class="inline-actions"><button class="primary-btn" data-link-request-customer-action="accept" data-id="${request.id}" type="button">Accept Price</button><button class="secondary-btn" data-link-request-customer-action="decline" data-id="${request.id}" type="button">Decline</button></div>` : ""}
      </div>
    `
  );

  accountWishlistList.innerHTML = wishlistProducts.map((product) => `
    <div class="order-card wishlist-account-card">
      <div class="wishlist-account-row">
        <div class="wishlist-account-copy">
          <strong>${escapeHtml(product.name)}</strong>
          <p class="order-meta">${escapeHtml(product.brand || "Sora")} · ${escapeHtml(product.category || "General")}</p>
          <p class="order-meta">${formatPrice(product.discountPrice || product.price)}</p>
        </div>
        <div class="inline-actions wishlist-account-actions">
          <button class="secondary-btn" data-account-wishlist-action="details" data-id="${product.id}" type="button">Details</button>
          <button class="primary-btn" data-account-wishlist-action="add" data-id="${product.id}" type="button">Add to cart</button>
          <button class="ghost-btn" data-account-wishlist-action="remove" data-id="${product.id}" type="button">Remove</button>
        </div>
      </div>
    </div>
  `).join("") || `<div class="order-card"><p class="order-meta">No wishlist items yet. Tap the small heart above any product to save it here.</p></div>`;

  if (accountNotificationsList) {
    accountNotificationsList.innerHTML = userNotifications.length
      ? userNotifications
          .map((item) => `
            <div class="notification-card ${item.read ? "" : "unread"}">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.message)}</p>
              <span class="notification-time">${new Date(item.createdAt).toLocaleString()}</span>
            </div>
          `)
          .join("")
      : `<div class="order-card"><p class="order-meta">No notifications yet.</p></div>`;
  }

  historyList.innerHTML = [...linkRequestCards, ...orderCards].join("") || `<div class="order-card"><p class="order-meta">No orders yet. Your future purchases and sourcing requests will appear here.</p></div>`;

  shippingCard?.classList.remove("hidden-box");
  populateShippingForm(account);
  changePasswordCard.classList.remove("hidden-box");

  $("logoutBtn")?.addEventListener("click", logoutUser);
  $("togglePasswordBtn")?.addEventListener("click", () => {
    changePasswordCard.classList.toggle("hidden-box");
  });
}

function updateSignInUI() {
  const account = getCurrentAccount();

  if (account) {
    if (signInBtn) signInBtn.textContent = account.name;
    openDashboardPanelBtn?.classList.toggle("hidden-box", !isAdmin());
  } else {
    if (signInBtn) signInBtn.textContent = "Sign in";
    openDashboardPanelBtn?.classList.add("hidden-box");
  }

  renderNotificationBell();
}

function renderAdminStats() {
  dashboardTotalUsers.textContent = state.accounts.length;
  dashboardTotalAdmins.textContent = state.accounts.filter((account) => account.role !== "customer").length;
  dashboardMonthlyAccounts.textContent = state.accounts.filter((account) => {
    const date = new Date(account.createdAt);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  dashboardTotalProducts.textContent = state.products.length;
  dashboardTotalOrders.textContent = state.orders.length;
  dashboardBlockedUsers.textContent = state.accounts.filter((account) => account.blocked).length;

  const overview = document.querySelector('[data-dashboard-content="overview"]');
  if (overview) {
    let analytics = document.getElementById('dashboardAnalyticsGrid');
    if (!analytics) {
      analytics = document.createElement('div');
      analytics.id = 'dashboardAnalyticsGrid';
      analytics.className = 'analytics-grid';
      overview.appendChild(analytics);
    }
    analytics.innerHTML = `
      <div class="kpi-card"><span>Total Revenue</span><strong>${formatPrice(getCompletedRevenue())}</strong></div>
      <div class="kpi-card"><span>Total Profit</span><strong>${formatPrice(getCompletedProfit())}</strong></div>
      <div class="kpi-card"><span>Low Stock Items</span><strong>${getLowStockProducts().length}</strong></div>
      <div class="kpi-card"><span>Pending Returns/Cancels</span><strong>${getPendingActionOrders().length}</strong></div>
    `;
  }
}

function renderMonthlyAccountsChart() {
  if (!dashboardMonthlyChart) return;

  dashboardMonthlyChart.innerHTML = "";

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  const monthlyCounts = Array.from({ length: 12 }, (_, monthIndex) =>
    state.accounts.filter((account) => {
      const date = new Date(account.createdAt);
      return date.getFullYear() === currentYear && date.getMonth() === monthIndex;
    }).length
  );

  const maxValue = Math.max(...monthlyCounts, 1);

  monthlyCounts.forEach((count, index) => {
    const column = document.createElement("div");
    column.className = "chart-col";

    const value = document.createElement("span");
    value.textContent = count;

    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.height = `${Math.max((count / maxValue) * 180, 14)}px`;

    const label = document.createElement("span");
    label.textContent = months[index];

    column.appendChild(value);
    column.appendChild(bar);
    column.appendChild(label);
    dashboardMonthlyChart.appendChild(column);
  });
}

function renderDashboardUsers() {
  if (!dashboardUsersList) return;

  dashboardUsersList.innerHTML = "";

  const term = String(state.dashboardUserSearch || "").trim().toLowerCase();

  const visibleAccounts = state.accounts.filter((account) => {
    if (!term) return true;

    return [
      account.name,
      account.email,
      account.phone,
      account.userId,
      account.role,
      getRoleLabel(account.role)
    ].some((value) => String(value || "").toLowerCase().includes(term));
  });

  if (!visibleAccounts.length) {
    dashboardUsersList.innerHTML = `<div class="order-card"><p class="order-meta">No people found for "${state.dashboardUserSearch}".</p></div>`;
    return;
  }

  visibleAccounts.forEach((account) => {
    const row = document.createElement("div");
    row.className = "order-card";

    const makeAdminButton =
      isOwner() && account.role === "customer"
        ? `<button class="primary-btn" data-account-action="make-admin" data-email="${account.email}" type="button">Make Admin</button>`
        : "";

    const removeAdminButton =
      isOwner() && account.role === "admin"
        ? `<button class="secondary-btn" data-account-action="remove-admin" data-email="${account.email}" type="button">Remove Admin</button>`
        : "";

    const toggleBlockButton =
      account.role !== "owner"
        ? `<button class="secondary-btn" data-account-action="toggle-block" data-email="${account.email}" type="button">
             ${account.blocked ? "Unblock Account" : "Block Account"}
           </button>`
        : "";

    row.innerHTML = `
      <div class="user-row">
        <div>
          <strong>${account.name}</strong>
          <p class="order-meta">${account.email} · ${account.phone || "No phone"}</p>
          <p class="order-meta">${account.userId} · ${getRoleLabel(account.role)}</p>
          <p class="order-meta">Orders: ${getUserOrderCount(account.email)} · Total spent: ${formatPrice(getUserTotalSpent(account.email))}</p>
          <p class="order-meta">${account.blocked ? "Blocked account" : "Active account"}</p>
        </div>
        <div class="inline-actions">
          ${toggleBlockButton}
          ${makeAdminButton}
          ${removeAdminButton}
        </div>
      </div>
    `;

    dashboardUsersList.appendChild(row);
  });
}

function renderDashboardProducts() {
  if (!dashboardProductsList) return;

  dashboardProductsList.innerHTML = "";

  if (!state.products.length) {
    dashboardProductsList.innerHTML = `<div class="order-card"><p class="order-meta">No products found.</p></div>`;
    return;
  }

  state.products.forEach((product) => {
    const row = document.createElement("div");
    row.className = "order-card";

    row.innerHTML = `
      <div class="product-row">
        <div>
          <strong>${product.name}</strong>
          <p class="order-meta">${product.brand} · ${getCatalogName(product.catalogId)} · Air: ${formatPrice(getShippingPrice(product, "air"))} · Sea: ${formatPrice(getShippingPrice(product, "sea"))} · Cost: ${formatPrice(product.costPrice || 0)}</p>
          <p class="order-meta">Views: ${product.views || 0} · Wishlist: ${product.wishlistCount || 0} · Added to cart: ${product.addedToCartCount || 0} · Sold: ${product.soldCount || 0}</p>
          ${Number(product.stock || 0) <= 5 ? `<span class="low-stock-badge">Only ${product.stock} left</span>` : ""}
        </div>
        <div class="inline-actions">
          <button class="secondary-btn" data-product-action="edit" data-id="${product.id}" type="button">Edit</button>
          <button class="secondary-btn" data-product-action="delete" data-id="${product.id}" type="button">Delete</button>
        </div>
      </div>
    `;

    dashboardProductsList.appendChild(row);
  });
}

function renderDashboardOrders() {
  if (!dashboardOrdersList) return;

  dashboardOrdersList.innerHTML = "";

  const filteredOrders = state.orders.filter((order) => {
    const matchesStatus = state.dashboardOrderStatus === "all" || order.status === state.dashboardOrderStatus;
    const haystack = `${order.id} ${order.customerName} ${order.userEmail}`.toLowerCase();
    const matchesSearch = !state.dashboardOrderSearch || haystack.includes(state.dashboardOrderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!filteredOrders.length) {
    dashboardOrdersList.innerHTML = `<div class="order-card"><p class="order-meta">No orders found.</p></div>`;
    return;
  }

  const statusOptions = [...ORDER_STEPS, "Cancelled", "Refunded"];

  filteredOrders.forEach((order) => {
    const row = document.createElement("div");
    row.className = "order-card";
    row.innerHTML = `
      <div class="order-head">
        <div>
          <strong>${order.id}</strong>
          <p class="order-meta">${order.customerName} · ${order.status}</p>
          <p class="order-meta">${getCatalogName(order.items?.[0]?.catalogId || "")} · ${new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div class="inline-actions">
          <div>
            <strong>${formatPrice(order.total)}</strong>
            <p class="order-meta profit-text">Profit: ${formatPrice(getOrderProfit(order))}</p>
          </div>
          <select class="dashboard-status-select" data-order-status-select="${order.id}">
            ${statusOptions.map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </div>
      </div>
      ${renderOrderTimeline(order.status)}
      ${order.refundReason ? `<p class="order-meta">Refund reason: ${order.refundReason}</p>` : ""}
      ${order.cancelReason ? `<p class="order-meta">Cancel reason: ${order.cancelReason}</p>` : ""}
      ${order.cancelRequested ? `<p class="order-meta warning-text">Customer requested cancellation${order.cancelReason ? `: ${escapeHtml(order.cancelReason)}` : ""}</p><div class="inline-actions"><button class="primary-btn" data-order-admin-action="approve-cancel" data-id="${order.id}" type="button">Approve Cancel</button></div>` : ""}
      ${order.returnRequested ? `<p class="order-meta warning-text">Customer requested return${order.refundReason ? `: ${escapeHtml(order.refundReason)}` : ""}</p><div class="inline-actions"><button class="primary-btn" data-order-admin-action="approve-return" data-id="${order.id}" type="button">Approve Return</button></div>` : ""}
    `;
    dashboardOrdersList.appendChild(row);
  });
}

function renderReports() {
  if (!dashboardReportsList) return;
  const topProducts = [...state.products]
    .sort((a, b) => ((b.soldCount || 0) + (b.views || 0)) - ((a.soldCount || 0) + (a.views || 0)))
    .slice(0, 6);

  dashboardReportsList.innerHTML = `
    <div class="dashboard-split">
      <div class="order-card">
        <h4>Best performers</h4>
        ${topProducts.length ? topProducts.map((product) => `
          <div class="product-row">
            <div>
              <strong>${escapeHtml(product.name)}</strong>
              <p class="order-meta">Views: ${product.views || 0} · Wishlist: ${product.wishlistCount || 0} · Added to cart: ${product.addedToCartCount || 0} · Sold: ${product.soldCount || 0}</p>
            </div>
            <strong>${formatPrice(product.discountPrice || product.price)}</strong>
          </div>
        `).join("") : `<p class="order-meta">No product activity yet.</p>`}
      </div>
      <div class="order-card">
        <h4>Stock warnings</h4>
        ${getLowStockProducts().length ? getLowStockProducts().map((product) => `
          <div class="product-row">
            <div>
              <strong>${escapeHtml(product.name)}</strong>
              <p class="order-meta">Stock left: ${product.stock}</p>
            </div>
            <span class="low-stock-badge">Low stock</span>
          </div>
        `).join("") : `<p class="order-meta">All products are above the warning level.</p>`}
      </div>
    </div>
  `;
}

function renderCustomerHistory() {
  if (!dashboardCustomerHistory) return;

  dashboardCustomerHistory.innerHTML = "";

  const grouped = state.orders.reduce((acc, order) => {
    if (!acc[order.userEmail]) acc[order.userEmail] = [];
    acc[order.userEmail].push(order);
    return acc;
  }, {});

  const entries = Object.entries(grouped);

  if (!entries.length) {
    dashboardCustomerHistory.innerHTML = `<div class="order-card"><p class="order-meta">No customer history available.</p></div>`;
    return;
  }

  entries.forEach(([email, orders]) => {
    const card = document.createElement("div");
    card.className = "order-card";

    const total = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const customerName = orders[0]?.customerName || email;

    card.innerHTML = `
      <div class="user-row">
        <div>
          <strong>${customerName}</strong>
          <p class="order-meta">${email}</p>
        </div>
        <div>
          <strong>${orders.length} orders</strong>
          <p class="order-meta">${formatPrice(total)}</p>
        </div>
      </div>
    `;

    dashboardCustomerHistory.appendChild(card);
  });
}

function renderNotificationsLog() {
  if (!dashboardNotificationsLog) return;
  const recent = state.notifications.slice(0, 12);
  dashboardNotificationsLog.innerHTML = recent.length
    ? recent.map((item) => `
        <div class="notification-card ${item.read ? "" : "unread"}">
          <div class="order-head"><h5>${escapeHtml(item.title)}</h5><span class="status-badge">${escapeHtml(item.type)}</span></div>
          <p class="order-meta">To: ${escapeHtml(item.targetEmail)}</p>
          <p class="order-meta">${escapeHtml(item.message)}</p>
          <span class="notification-time">${new Date(item.createdAt).toLocaleString()}</span>
        </div>
      `).join("")
    : `<div class="order-card"><p class="order-meta">No notifications sent yet.</p></div>`;
}

function readFilesAsDataURLs(fileList) {
  const files = Array.from(fileList || []);

  return Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
}

function formatPhoneInput(value) {
  const digits = String(value).replace(/\D/g, "").slice(0, 10);
  const parts = [];

  if (digits.length > 0) parts.push(digits.slice(0, 3));
  if (digits.length > 3) parts.push(digits.slice(3, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 10));

  return parts.join(" ");
}

function resetProductForm() {
  dashboardProductForm?.reset();
  populateCatalogSelect();
  if (dashboardEditingProductId) dashboardEditingProductId.value = "";
  if (dashboardProductFormTitle) dashboardProductFormTitle.textContent = "Add product";
  const firstTopLevelCatalog = getCatalogChildren("")[0]?.id || "";
  if (dashboardProductParentCatalog) dashboardProductParentCatalog.value = firstTopLevelCatalog;
  syncProductCatalogSelection();
  dashboardCancelEditBtn?.classList.add("hidden-box");
  if (dashboardEnableAir) dashboardEnableAir.checked = true;
  if (dashboardEnableSea) dashboardEnableSea.checked = true;
}

function editProduct(productId) {
  const product = state.products.find((entry) => entry.id === Number(productId));
  if (!product) return;

  dashboardEditingProductId.value = product.id;
  dashboardProductFormTitle.textContent = "Edit product";
  dashboardCancelEditBtn.classList.remove("hidden-box");
  dashboardProductName.value = product.name || "";
  dashboardProductBrand.value = product.brand || "";
  dashboardProductType.value = product.type || "";
  dashboardProductCategory.value = product.category || "";
  setProductCatalogPicker(product.catalogId || state.catalogs[0]?.id || "");
  dashboardProductPrice.value = product.price || "";
  dashboardProductCostPrice.value = product.costPrice || "";
  dashboardProductDiscountPrice.value = product.discountPrice || "";
  dashboardProductStock.value = product.stock || "";
  dashboardProductDescription.value = product.description || "";
  dashboardProductCountry.value = product.country || "";
  dashboardProductAudience.value = product.audience || "";
  dashboardProductColors.value = (product.colors || []).join(", ");
  dashboardProductSizes.value = (product.sizes || []).join(", ");
  dashboardProductMaterial.value = product.material || "";
  const shippingOptions = normalizeShippingOptions(product);
  if (dashboardEnableAir) dashboardEnableAir.checked = shippingOptions.air.enabled;
  if (dashboardAirPrice) dashboardAirPrice.value = shippingOptions.air.price || "";
  if (dashboardAirNote) dashboardAirNote.value = shippingOptions.air.note || "";
  if (dashboardEnableSea) dashboardEnableSea.checked = shippingOptions.sea.enabled;
  if (dashboardSeaPrice) dashboardSeaPrice.value = shippingOptions.sea.price || "";
  if (dashboardSeaNote) dashboardSeaNote.value = shippingOptions.sea.note || "";

  setDashboardTab("products");
  openPanel(dashboardPanel);
}

function deleteProduct(productId) {
  state.products = state.products.filter((entry) => entry.id !== Number(productId));
  refreshAll();
}

function makeAdmin(email) {
  if (!isOwner()) return alert("Only the owner can create admins.");
  const account = state.accounts.find((entry) => entry.email === email);
  if (!account || account.role === "owner") return;
  account.role = "admin";
  refreshAll();
}

function removeAdmin(email) {
  if (!isOwner()) return alert("Only the owner can remove admins.");
  const account = state.accounts.find((entry) => entry.email === email);
  if (!account || account.role !== "admin") return;
  account.role = "customer";
  refreshAll();
}

function toggleAccountBlock(email) {
  const account = state.accounts.find((entry) => entry.email === email);
  if (!account || account.role === "owner") return;

  account.blocked = !account.blocked;

  if (account.phone) {
    if (account.blocked) {
      if (!state.blockedPhones.includes(account.phone)) {
        state.blockedPhones.push(account.phone);
      }
    } else {
      state.blockedPhones = state.blockedPhones.filter((phone) => phone !== account.phone);
    }
  }

  if (state.signedInUser === account.email && account.blocked) {
    state.signedInUser = null;
  }

  refreshAll();
}

function logoutUser() {
  state.signedInUser = null;
  state.activeChatThreadId = null;
  changePasswordCard?.classList.add("hidden-box");
  refreshAll();
  closeAllPanels();
}

function refreshAll() {
  saveState();
  updateSignInUI();
  renderCart();
  renderProducts();
  renderOrders();
  renderLinkRequestCart();
    renderChatPanel();
  renderAccountSection();
  renderAdminStats();
  renderMonthlyAccountsChart();
  renderHeroImage();
  renderHeroContent();
  applyTranslations();
  renderCatalogFilters();
  renderDashboardUsers();
  renderDashboardCatalogs();
  renderDashboardProducts();
  renderDashboardOrders();
  renderDashboardLinkRequests();
  renderCustomerHistory();
  renderReports();
  renderNotificationsLog();
  renderDashboardChats();
  renderDashboardVisibility();
  setDashboardTab(state.dashboardTab);
}

searchInput?.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

clearFiltersBtn?.addEventListener("click", () => {
  state.search = "";
  state.selectedCatalog = "all";
  if (searchInput) searchInput.value = "";
  refreshAll();
});

catalogFilters?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-catalog-filter]");
  if (!button) return;
  state.selectedCatalog = button.dataset.catalogFilter || "all";
  renderCatalogFilters();
  renderProducts();
});

phoneInput?.addEventListener("input", () => {
  phoneInput.value = formatPhoneInput(phoneInput.value);
});

mobileMenuBtn?.addEventListener("click", openMobileMenu);
closeMobileMenuBtn?.addEventListener("click", () => {
  closeMobileMenu();
  overlay?.classList.remove("show");
});
mobileMenuCartBtn?.addEventListener("click", () => { closeMobileMenu(); openPanel(cartPanel); });
mobileMenuOrdersBtn?.addEventListener("click", () => { closeMobileMenu(); renderOrders(); openPanel(ordersPanel); });
mobileMenuAccountBtn?.addEventListener("click", () => { closeMobileMenu(); state.signedInUser ? openPanel(accountPanel) : openAuth(); });
mobileMenuMessagesBtn?.addEventListener("click", () => { closeMobileMenu(); openChatPanelForCurrentUser(); });
document.querySelectorAll('[data-lang]').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

document.querySelectorAll('.mobile-menu-link').forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileMenu();
    overlay?.classList.remove('show');
  });
});


cartBtn?.addEventListener("click", () => openPanel(cartPanel));
openCartPanelBtn?.addEventListener("click", () => openPanel(cartPanel));
sidebarOpenCartBtn?.addEventListener("click", () => openPanel(cartPanel));

openOrdersPanelBtn?.addEventListener("click", () => {
  renderOrders();
  openPanel(ordersPanel);
});

openChatPanelBtn?.addEventListener("click", () => {
  const account = getCurrentAccount();
  if (account) {
    state.notifications.forEach((item) => {
      if (item.targetEmail === account.email && item.type === "chat") item.read = true;
    });
    renderNotificationBell();
  }
  openChatPanelForCurrentUser();
});
sidebarOpenChatBtn?.addEventListener("click", () => {
  const account = getCurrentAccount();
  if (account) {
    state.notifications.forEach((item) => {
      if (item.targetEmail === account.email && item.type === "chat") item.read = true;
    });
    renderNotificationBell();
  }
  openChatPanelForCurrentUser();
});

openAccountPanelBtn?.addEventListener("click", () => {
  const account = getCurrentAccount();
  if (account) markNotificationsRead(account.email);
  renderAccountSection();
  renderNotificationBell();
  openPanel(accountPanel);
});

notificationBellBtn?.addEventListener("click", () => {
  const account = getCurrentAccount();
  if (!account) {
    openAuth();
    return;
  }
  markNotificationsRead(account.email);
  renderAccountSection();
  renderNotificationBell();
  openPanel(accountPanel);
  document.getElementById("accountNotificationsList")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

openDashboardPanelBtn?.addEventListener("click", () => {
  if (!isAdmin()) return alert("Only authorized team members can open the dashboard.");
  openPanel(dashboardPanel);
});

document.querySelectorAll("[data-close-panel]").forEach((button) => {
  button.addEventListener("click", closeAllPanels);
});

signInBtn?.addEventListener("click", () => {
  state.signedInUser ? openPanel(accountPanel) : openAuth();
});

signInTab?.addEventListener("click", () => setAuthMode("signin"));
createAccountTab?.addEventListener("click", () => setAuthMode("create"));
closeAuthBtn?.addEventListener("click", closeAuth);
closeImageZoomBtn?.addEventListener("click", closeImageZoom);
imageZoomModal?.addEventListener("click", (event) => {
  if (event.target === imageZoomModal) closeImageZoom();
});

overlay?.addEventListener("click", () => {
  closeAllPanels();
  closeAuth();
  closeProductDetails();
  closeImageZoom();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllPanels();
    closeAuth();
    closeProductDetails();
    closeImageZoom();
  }
});

dashboardUserSearchInput?.addEventListener("input", (event) => {
  state.dashboardUserSearch = event.target.value;
  renderDashboardUsers();
});

dashboardTabs?.addEventListener("click", (event) => {
  const button = event.target.closest(".dashboard-tab-btn");
  if (!button) return;
  setDashboardTab(button.dataset.dashboardTab);
});

dashboardPromoteAdminBtn?.addEventListener("click", () => {
  if (!isOwner()) return alert("Only the owner can create admins.");
  const email = String(dashboardRoleEmailInput?.value || "").trim().toLowerCase();
  if (!email) return alert("Enter an email.");
  makeAdmin(email);
  if (dashboardRoleEmailInput) dashboardRoleEmailInput.value = "";
});

dashboardCatalogForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const createdName = String(dashboardCatalogName?.value || "").trim();
  const createdParent = dashboardCatalogParent?.value || "";
  createCatalog(createdName, createdParent);
  if (dashboardCatalogName) dashboardCatalogName.value = "";
  if (dashboardCatalogParent) dashboardCatalogParent.value = "";
});

dashboardCatalogList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-catalog-action]");
  if (!button) return;
  if (button.dataset.catalogAction === "delete") deleteCatalog(button.dataset.id);
});


signInForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!email || !password) return;

  if (state.authMode === "create") {
    const finalName = name || "User";

    if (!PHONE_REGEX.test(phone)) {
      return alert("Phone number must be exactly like this: 770 000 0000");
    }

    if (state.blockedPhones.includes(phone)) {
      return alert("This phone number is blocked.");
    }

    if (state.accounts.some((account) => account.email === email)) {
      return alert("This account already exists.");
    }

    const newId = state.nextAccountId++;

    state.accounts.push({
      id: newId,
      userId: makeUserId(newId),
      name: finalName,
      email,
      password,
      phone,
      role: "customer",
      blocked: false,
      createdAt: new Date().toISOString()
    });

    state.signedInUser = email;
    alert(`Account created for ${finalName}`);
  } else {
    const account = state.accounts.find((entry) => entry.email === email && entry.password === password);

    if (!account) return alert("Incorrect email or password.");
    if (account.blocked) return alert("This account has been restricted.");

    state.signedInUser = email;
    alert(`Welcome ${account.name}`);
  }

  signInForm.reset();
  setAuthMode("signin");
  refreshAll();
  closeAuth();
});

changePasswordForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const account = getCurrentAccount();
  if (!account) return alert("Sign in first.");

  const currentPassword = currentPasswordInput.value.trim();
  const newPassword = newPasswordInput.value.trim();

  if (account.password !== currentPassword) {
    return alert("Current password is wrong.");
  }

  if (newPassword.length < 4) {
    return alert("New password must be at least 4 characters.");
  }

  account.password = newPassword;
  changePasswordForm.reset();
  refreshAll();
  alert("Password changed.");
});

apartmentAddressBtn?.addEventListener("click", () => setShippingAddressType("apartment"));
houseAddressBtn?.addEventListener("click", () => setShippingAddressType("house"));

shippingAddressForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const account = getCurrentAccount();
  if (!account) return alert("Sign in first.");

  const addressType = shippingAddressForm.dataset.addressType || "";
  const country = "Iraq";
  const houseNumber = houseNumberInput.value.trim();
  const houseFloor = houseFloorInput.value.trim();
  const houseStreet = houseStreetInput.value.trim();
  const housePhone = (housePhoneInput.value.trim() || account.phone || "").trim();
  const houseAdditional = houseAdditionalInput.value.trim();
  const houseLabel = houseLabelInput.value.trim();
  const apartmentBuildingName = apartmentBuildingNameInput.value.trim();
  const apartmentNumber = apartmentNumberInput.value.trim();
  const apartmentFloor = apartmentFloorInput.value.trim();
  const apartmentStreet = apartmentStreetInput.value.trim();
  const apartmentAdditional = apartmentAdditionalInput.value.trim();
  const apartmentLabel = apartmentLabelInput.value.trim();

  if (!addressType) return alert("Choose only one address type: House or Apartment.");

  if (addressType === "house") {
    if (!houseNumber) return alert("Please enter the house number.");
    if (!houseStreet) return alert("Please enter the street.");
    if (!housePhone) return alert("Your account phone number is required for the house address.");
  }

  if (addressType === "apartment") {
    if (!apartmentBuildingName) return alert("Please enter the building name.");
    if (!apartmentNumber) return alert("Please enter the apartment number.");
    if (!apartmentFloor) return alert("Please enter the floor.");
    if (!apartmentStreet) return alert("Please enter the street.");
  }

  account.shippingAddressType = addressType;
  account.shippingCountry = country;
  account.shippingCity = "";
  account.houseNumber = houseNumber;
  account.houseFloor = houseFloor;
  account.houseStreet = houseStreet;
  account.housePhone = housePhone;
  account.houseAdditional = houseAdditional;
  account.houseLabel = houseLabel;
  account.apartmentBuildingName = apartmentBuildingName;
  account.apartmentNumber = apartmentNumber;
  account.apartmentFloor = apartmentFloor;
  account.apartmentStreet = apartmentStreet;
  account.apartmentAdditional = apartmentAdditional;
  account.apartmentLabel = apartmentLabel;
  account.houseAddress = getHouseShippingAddress(account);
  account.apartmentAddress = getApartmentShippingAddress(account);

  refreshAll();
  alert("Shipping address saved.");
});

linkRequestForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  addExternalLinkItem();
});

submitLinkRequestBtn?.addEventListener("click", submitExternalLinkRequest);

linkRequestCartList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-link-cart-action]");
  if (!button) return;
  if (button.dataset.linkCartAction === "remove") removeExternalLinkItem(button.dataset.id);
});

cartItems?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const cartId = button.dataset.id;

  if (action === "increase") changeQuantity(cartId, 1);
  if (action === "decrease") changeQuantity(cartId, -1);
  if (action === "remove") removeFromCart(cartId);
});

historyList?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-link-request-customer-action]");
  if (!button) return;
  respondToLinkRequest(button.dataset.id, button.dataset.linkRequestCustomerAction);
});

accountWishlistList?.addEventListener("click", (event) => {
  const button = event.target.closest('[data-account-wishlist-action]');
  if (!button) return;
  const product = state.products.find((entry) => entry.id === Number(button.dataset.id));
  if (!product) return;

  if (button.dataset.accountWishlistAction === 'details') {
    closeAllPanels();
    openProductDetails(product);
    return;
  }

  if (button.dataset.accountWishlistAction === 'add') {
    addToCart(product, (product.colors || [])[0] || 'Default', (product.sizes || [])[0] || 'Default', getAvailableShippingMethods(product)[0] || 'air');
    return;
  }

  if (button.dataset.accountWishlistAction === 'remove') {
    toggleWishlist(product.id);
  }
});

ordersList?.addEventListener("click", (event) => {
  const customerButton = event.target.closest("[data-link-request-customer-action]");
  if (customerButton) {
    respondToLinkRequest(customerButton.dataset.id, customerButton.dataset.linkRequestCustomerAction);
    return;
  }
  const button = event.target.closest("button[data-order-id]");
  if (!button) return;
  advanceOrderStatus(button.dataset.orderId);
});

dashboardUsersList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-account-action]");
  if (!button) return;

  if (button.dataset.accountAction === "toggle-block") {
    toggleAccountBlock(button.dataset.email);
  }

  if (button.dataset.accountAction === "make-admin") {
    makeAdmin(button.dataset.email);
  }

  if (button.dataset.accountAction === "remove-admin") {
    removeAdmin(button.dataset.email);
  }
});

dashboardProductsList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-product-action]");
  if (!button) return;

  if (button.dataset.productAction === "edit") editProduct(button.dataset.id);
  if (button.dataset.productAction === "delete") deleteProduct(button.dataset.id);
});

dashboardOrdersList?.addEventListener("change", (event) => {
  const select = event.target.closest("select[data-order-status-select]");
  if (!select || !isAdmin()) return;
  const order = state.orders.find((entry) => entry.id === select.dataset.orderStatusSelect);
  if (!order) return;
  order.status = select.value;
  sendOrderNotification(order, `Status changed to ${order.status}.`);
  if (select.value === "Refunded") {
    order.refundReason = window.prompt("Refund reason", order.refundReason || "Refund approved") || order.refundReason || "Refund approved";
  }
  if (select.value === "Cancelled") {
    order.cancelReason = window.prompt("Cancel reason", order.cancelReason || "Cancelled by admin") || order.cancelReason || "Cancelled by admin";
  }
  refreshAll();
});

dashboardLinkRequestsList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-link-request-admin-action]");
  if (!button) return;
  const requestId = button.dataset.id;
  const priceInput = dashboardLinkRequestsList.querySelector(`[data-link-request-price="${requestId}"]`);
  const noteInput = dashboardLinkRequestsList.querySelector(`[data-link-request-note="${requestId}"]`);
  if (button.dataset.linkRequestAdminAction === "quote") {
    updateLinkRequestQuote(requestId, priceInput?.value, noteInput?.value);
  }
});

linkRequestsHistoryList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-link-request-customer-action]");
  if (!button) return;
  respondToLinkRequest(button.dataset.id, button.dataset.linkRequestCustomerAction);
});

chatThreadList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-chat-thread-id]");
  if (!button) return;

  state.activeChatThreadId = button.dataset.chatThreadId;
  renderChatPanel();
});

dashboardChatsList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-dashboard-chat-id]");
  if (!button) return;

  state.activeChatThreadId = button.dataset.dashboardChatId;
  renderChatPanel();
  openPanel(chatPanel);
});

chatMessageForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendChatMessage();
});

dashboardProductParentCatalog?.addEventListener("change", () => {
  syncProductCatalogSelection();
});

dashboardProductSubcatalog?.addEventListener("change", () => {
  syncProductCatalogSelection();
});

dashboardCancelEditBtn?.addEventListener("click", resetProductForm);

dashboardProductForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isAdmin()) return alert("You cannot manage products.");

  const images = await readFilesAsDataURLs(dashboardProductImageFiles.files);

  const payload = {
    name: dashboardProductName.value.trim() || `New Product ${state.nextProductId}`,
    brand: dashboardProductBrand.value.trim() || "Sora",
    type: dashboardProductType.value.trim() || "Accessories",
    category: dashboardProductCategory.value.trim() || "General",
    catalogId: dashboardProductCatalog?.value || state.catalogs[0]?.id || "",
    audience: dashboardProductAudience.value || "",
    country: dashboardProductCountry.value || "China",
    colors: splitValues(dashboardProductColors.value, ["Black"]),
    sizes: splitValues(dashboardProductSizes.value, ["Standard"]),
    material: dashboardProductMaterial.value.trim() || "Mixed",
    shippingOptions: {
      air: {
        enabled: Boolean(dashboardEnableAir?.checked),
        price: parsePrice(dashboardAirPrice?.value || dashboardProductPrice.value || "59"),
        note: String(dashboardAirNote?.value || "").trim()
      },
      sea: {
        enabled: Boolean(dashboardEnableSea?.checked),
        price: parsePrice(dashboardSeaPrice?.value || dashboardProductPrice.value || "59"),
        note: String(dashboardSeaNote?.value || "").trim()
      }
    },
    price: parsePrice(dashboardProductPrice.value || "59"),
    costPrice: parsePrice(dashboardProductCostPrice.value || "0"),
    discountPrice: parsePrice(dashboardProductDiscountPrice.value || "0"),
    stock: Number(dashboardProductStock.value || "10"),
    description:
      dashboardProductDescription.value.trim() || "New product added from admin dashboard.",
    accent: getAccentByName(dashboardProductAccent.value)
  };

  const editId = Number(dashboardEditingProductId.value || 0);

  if (editId) {
    const product = state.products.find((entry) => entry.id === editId);
    if (!product) return;

    Object.assign(product, payload);
    if (images.length) product.images = images;
    alert("Product updated.");
  } else {
    const newId = state.nextProductId++;

    state.products.push({
      id: newId,
      productId: makeProductId(newId),
      ...payload,
      images
    });

    alert("Product added.");
  }

  resetProductForm();
  refreshAll();
});


dashboardOrderSearchInput?.addEventListener("input", (event) => {
  state.dashboardOrderSearch = event.target.value;
  renderDashboardOrders();
});

dashboardOrderStatusFilter?.addEventListener("change", (event) => {
  state.dashboardOrderStatus = event.target.value;
  renderDashboardOrders();
});

dashboardOrdersList?.addEventListener("change", (event) => {
  const select = event.target.closest("select[data-order-status-select]");
  if (!select) return;
  const order = state.orders.find((entry) => entry.id === select.dataset.orderStatusSelect);
  if (!order) return;
  order.status = select.value;
  sendOrderNotification(order, `Status changed to ${order.status}.`);
  refreshAll();
});

dashboardRequestSearchInput?.addEventListener("input", (event) => {
  state.dashboardRequestSearch = event.target.value;
  renderDashboardLinkRequests();
});

dashboardRequestStatusFilter?.addEventListener("change", (event) => {
  state.dashboardRequestStatus = event.target.value;
  renderDashboardLinkRequests();
});

dashboardNotificationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!isAdmin()) return alert("Only authorized team members can send notifications.");
  const title = String(dashboardNotificationTitle?.value || "").trim() || "Store update";
  const message = String(dashboardNotificationMessage?.value || "").trim();
  if (!message) return alert("Write a message first.");
  notifyAllCustomers(title, message);
  dashboardNotificationForm.reset();
  refreshAll();
  alert("Notification sent to all customers.");
});

historyList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-order-request]");
  if (!button) return;
  const order = state.orders.find((entry) => entry.id === button.dataset.id);
  if (!order) return;
  if (button.dataset.orderRequest === "cancel") {
    order.cancelRequested = true;
    order.cancelReason = "Customer requested cancellation.";
    pushNotification(ADMIN_EMAIL, "Cancel request", `${order.id} requested cancellation.`, "order");
  }
  if (button.dataset.orderRequest === "return") {
    order.returnRequested = true;
    order.refundReason = "Customer requested return.";
    pushNotification(ADMIN_EMAIL, "Return request", `${order.id} requested a return.`, "order");
  }
  refreshAll();
});

dashboardOrdersList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-order-admin-action]");
  if (!button) return;
  const order = state.orders.find((entry) => entry.id === button.dataset.id);
  if (!order) return;
  if (button.dataset.orderAdminAction === "approve-cancel") {
    order.status = "Cancelled";
    order.cancelRequested = false;
    sendOrderNotification(order, "Your cancellation request was approved.", "Order cancelled");
  }
  if (button.dataset.orderAdminAction === "approve-return") {
    order.status = "Refunded";
    order.returnRequested = false;
    sendOrderNotification(order, "Your return was approved and marked as refunded.", "Return approved");
  }
  refreshAll();
});

dashboardLinkRequestsList?.addEventListener("click", (event) => {
  const quoteButton = event.target.closest("button[data-link-request-action='quote']");
  if (quoteButton) {
    const requestId = quoteButton.dataset.id;
    const priceInput = dashboardLinkRequestsList.querySelector(`[data-request-price="${requestId}"]`);
    const noteInput = dashboardLinkRequestsList.querySelector(`[data-request-note="${requestId}"]`);
    updateLinkRequestQuote(requestId, Number(priceInput?.value || 0), noteInput?.value || "");
    return;
  }

  const statusButton = event.target.closest("button[data-link-request-status]");
  if (!statusButton) return;
  const request = state.linkRequests.find((entry) => entry.id === statusButton.dataset.id);
  if (!request) return;
  request.status = statusButton.dataset.linkRequestStatus;
  pushNotification(request.userEmail, "Sourcing request update", `${request.id} is now ${getLinkRequestStatusLabel(request.status)}.`, "request");
  refreshAll();
});

dashboardHeroContentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isAdmin()) {
    return alert("Only authorized team members can edit the hero section.");
  }

  state.heroContent = {
    tag: dashboardHeroTag.value.trim() || "",
    title: dashboardHeroTitle.value.trim() || "",
    description: dashboardHeroDescription.value.trim() || "",
    card1Label: dashboardHeroCard1Label.value.trim() || "",
    card1Title: dashboardHeroCard1Title.value.trim() || "",
    card2Label: dashboardHeroCard2Label.value.trim() || "",
    card2Title: dashboardHeroCard2Title.value.trim() || "",
    card3Label: dashboardHeroCard3Label.value.trim() || "",
    card3Title: dashboardHeroCard3Title.value.trim() || ""
  };

  const files = await readFilesAsDataURLs(dashboardHeroImageInput.files);
  if (files.length) {
    state.heroImage = files[0];
  }

  refreshAll();
  alert("Hero section updated.");
});

dashboardRemoveHeroImageBtn?.addEventListener("click", () => {
  if (!isAdmin()) {
    return alert("Only authorized team members can remove the hero image.");
  }

  state.heroImage = "";
  refreshAll();
});

checkoutBtn?.addEventListener("click", createOrderFromCart);
closeProductDetailsBtn?.addEventListener("click", closeProductDetails);

function openProductFromHash() {
  const match = String(window.location.hash || "").match(/^#product-(\d+)$/);
  if (!match) {
    if (productDetailsModal?.classList.contains('product-page')) {
      productDetailsModal.classList.add('hidden-box');
      state.activeProductDetailsId = null;
    }
    return;
  }

  const product = state.products.find((entry) => entry.id === Number(match[1]));
  if (product) {
    openProductDetails(product, { preserveScroll: true });
  }
}

window.addEventListener("hashchange", openProductFromHash);

document.addEventListener("click", (event) => {
  const chatButton = event.target.closest("[data-dashboard-chat-id]");
  if (chatButton) {
    state.activeChatThreadId = chatButton.dataset.dashboardChatId;
    openPanel(chatPanel);
    renderChatPanel();
    return;
  }

  const userActionButton = event.target.closest("[data-account-action]");
  if (userActionButton) {
    const email = userActionButton.dataset.email;
    const action = userActionButton.dataset.accountAction;
    if (action === "make-admin") makeAdmin(email);
    if (action === "remove-admin") removeAdmin(email);
    if (action === "toggle-block") toggleAccountBlock(email);
    return;
  }

  const productActionButton = event.target.closest("[data-product-action]");
  if (productActionButton) {
    const productId = Number(productActionButton.dataset.id);
    if (productActionButton.dataset.productAction === "edit") editProduct(productId);
    if (productActionButton.dataset.productAction === "delete") deleteProduct(productId);
    return;
  }

  const orderStatusSelect = event.target.closest("select[data-order-status-select]");
  if (orderStatusSelect) {
    const order = state.orders.find((entry) => entry.id === orderStatusSelect.dataset.orderStatusSelect);
    if (order) {
      order.status = orderStatusSelect.value;
      sendOrderNotification(order, `Status changed to ${order.status}.`);
      refreshAll();
    }
    return;
  }

  const nextOrderButton = event.target.closest("[data-order-id]");
  if (nextOrderButton) {
    advanceOrderStatus(nextOrderButton.dataset.orderId);
  }
});

loadState();
saveState();
setAuthMode("signin");
resetProductForm();
refreshAll();
openProductFromHash();