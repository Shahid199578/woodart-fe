import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CartSidebar } from './components/CartSidebar';
import { Footer } from './components/Footer';
import { GeminiChat } from './components/GeminiChat';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { Product, CartItem, User, Page } from './types';

// Pages
import { HomePage } from './pages/Home';
import { CollectionsPage } from './pages/Collections';
import { authService } from './services/authService'; // Add Import
import { AboutPage } from './pages/About';
import { SustainabilityPage } from './pages/Sustainability';
import { JournalPage } from './pages/Journal';
import { JournalPostPage } from './pages/JournalPostPage';
import { SupportPage } from './pages/Support';
import { FAQPage } from './pages/FAQ';
import { ShippingPage } from './pages/Shipping';
import { CarePage } from './pages/Care';
import { WarrantyPage } from './pages/Warranty';
import { ContactPage } from './pages/Contact';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { AdminCustomersPage } from './pages/AdminCustomersPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminBlogPage } from './pages/AdminBlogPage';
import { AdminPartnersPage } from './pages/AdminPartnersPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminCMSPage } from './pages/AdminCMSPage';
import { AdminPaymentPage } from './pages/AdminPaymentPage';
import { AdminLayout } from './components/admin/AdminLayout';

const App: React.FC = () => {
  // --- Navigation State ---
  const [currentPage, setCurrentPage] = useState<Page | 'journal-post'>('home');
  const [selectedPostSlug, setSelectedPostSlug] = useState('');

  // --- Cart State ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // --- Search State ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // --- Initial Auth Check ---
  React.useEffect(() => {
    const initAuth = async () => {
      const profile = await authService.getProfile();
      if (profile) {
        setUser(profile);
      }
    };
    initAuth();
  }, []);

  // --- Handlers ---

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleNavigateToPost = (slug: string) => {
    setSelectedPostSlug(slug);
    setCurrentPage('journal-post');
    window.scrollTo(0, 0);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSearchSubmit = (query: string) => {
    setGlobalSearchQuery(query);
    setCurrentPage('collections');
  };

  const handleProductSelect = (product: Product) => {
    setGlobalSearchQuery(product.name);
    setCurrentPage('collections');
  };

  // --- Render Page Content ---
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'collections':
        return <CollectionsPage onAddToCart={handleAddToCart} initialSearchQuery={globalSearchQuery} />;
      case 'about':
        return <AboutPage />;
      case 'sustainability':
        return <SustainabilityPage />;
      case 'journal':
        return <JournalPage onNavigateToPost={handleNavigateToPost} />;
      case 'journal-post':
        return <JournalPostPage slug={selectedPostSlug} onBack={() => handleNavigate('journal')} />;
      case 'support':
        return <SupportPage onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQPage />;
      case 'shipping':
        return <ShippingPage />;
      case 'care':
        return <CarePage />;
      case 'warranty':
        return <WarrantyPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }
  };

  // --- Layout Logic ---
  const isAdminPage = currentPage.startsWith('admin');

  if (isAdminPage) {
    return (
      <AdminLayout activePage={currentPage} onNavigate={handleNavigate} user={user}>
        {currentPage === 'admin' && <AdminDashboard user={user} />}
        {currentPage === 'admin-products' && <AdminProductsPage />}
        {currentPage === 'admin-categories' && <AdminCategoriesPage />}
        {currentPage === 'admin-partners' && <AdminPartnersPage />}
        {currentPage === 'admin-users' && <AdminCustomersPage />}
        {currentPage === 'admin-blog' && <AdminBlogPage />}
        {currentPage === 'admin-orders' && <AdminOrdersPage />}
        {currentPage === 'admin-cms' && <AdminCMSPage />}
        {currentPage === 'admin-payments' && <AdminPaymentPage />}
        {currentPage === 'admin-settings' && <AdminSettingsPage user={user} onUserUpdate={setUser} />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-gray-200 flex flex-col">
      <Navbar
        cartItems={cartItems}
        user={user}
        activePage={currentPage}
        onNavigate={handleNavigate}
        onCartClick={() => setIsCartOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        onUserClick={() => setIsAuthOpen(true)}
      />

      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer onNavigate={handleNavigate} />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onProductSelect={handleProductSelect}
        onSearchSubmit={handleSearchSubmit}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={setUser}
        onLogout={() => setUser(null)}
      />

      <GeminiChat />
    </div>
  );
};

export default App;
