'use client'
import { useState, useEffect, JSX } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown, MessageCircle, ChevronLeft } from 'lucide-react';

export default function EcommerceSite(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [cart, setCart] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);

  const mockProducts = [
    { 
      id: 1, 
      name: 'T-shirt Coton 100%', 
      category: 'vetements', 
      price: 12999, 
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      description: 'T-shirt en coton pur, parfait pour le quotidien. Confortable, durable et disponible en plusieurs couleurs. Coupe classique qui s\'adapte à tous les styles.',
      stock: 15 
    },
    { 
      id: 2, 
      name: 'Jean Slim Fit', 
      category: 'vetements', 
      price: 29999, 
      image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=500&h=500&fit=crop',
      description: 'Jean élégant et épuré pour un look intemporel. Coupe ajustée moderne. Tissu de qualité premium avec finitions soignées.',
      stock: 8 
    },
    { 
      id: 3, 
      name: 'Sneakers Blanc', 
      category: 'chaussures', 
      price: 44999, 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      description: 'Sneakers blanches minimalistes. Légères, confortables et versatiles. Parfaites pour tous les styles, du casual au sportif.',
      stock: 12 
    },
    { 
      id: 4, 
      name: 'Robe Midi', 
      category: 'vetements', 
      price: 39999, 
      image: 'https://images.unsplash.com/photo-1595777712802-91d2c4d7c5b2?w=500&h=500&fit=crop',
      description: 'Robe midi élégante et intemporelle. Tissu fluide et confortable. Idéale pour les occasions spéciales ou le quotidien chic.',
      stock: 5 
    },
    { 
      id: 5, 
      name: 'Chaussures Cuir', 
      category: 'chaussures', 
      price: 49999, 
      image: 'https://images.unsplash.com/photo-1548693528-c3d7b9d1e302?w=500&h=500&fit=crop',
      description: 'Chaussures en cuir véritable. Design élégant et intemporel. Confort premium pour un usage quotidien ou professionnel.',
      stock: 10 
    },
    { 
      id: 6, 
      name: 'Mixer Professionnel', 
      category: 'electromenager', 
      price: 74999, 
      image: 'https://images.unsplash.com/photo-1584568694244-14fbbc50d737?w=500&h=500&fit=crop',
      description: 'Mixer haute performance pour smoothies et préparations culinaires. 3 vitesses, moteur puissant, capacité 1,5L. Design moderne et durable.',
      stock: 3 
    },
    { 
      id: 7, 
      name: 'Cafetière Programmable', 
      category: 'electromenager', 
      price: 39999, 
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=500&h=500&fit=crop',
      description: 'Cafetière programmable avec minuterie. Préparez votre café à l\'avance. Capacité 1L, technologie de chauffe optimal.',
      stock: 7 
    },
    { 
      id: 8, 
      name: 'Casquette Unisex', 
      category: 'vetements', 
      price: 9999, 
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
      description: 'Casquette tendance unisex. Tissu de qualité, ajustable à tous les tours de tête. Parfaite pour le style décontracté.',
      stock: 20 
    },
    { 
      id: 9, 
      name: 'Sandales Cuir', 
      category: 'chaussures', 
      price: 22499, 
      image: 'https://images.unsplash.com/photo-1554224311-beee415c15b7?w=500&h=500&fit=crop',
      description: 'Sandales en cuir confortable. Design léger et aéré. Idéales pour l\'été avec style et confort garantis.',
      stock: 14 
    },
    { 
      id: 10, 
      name: 'Grille-pain 2 Fentes', 
      category: 'electromenager', 
      price: 34999, 
      image: 'https://images.unsplash.com/photo-1578500494198-246f612d782d?w=500&h=500&fit=crop',
      description: 'Grille-pain compact et efficace. 2 fentes, 6 niveaux de cuisson. Design rétro moderne pour votre cuisine.',
      stock: 6 
    },
  ];

  useEffect(() => {
    setProducts(mockProducts);
    filterAndSortProducts(mockProducts, 'all', 'newest', '');
  }, []);

  useEffect(() => {
    filterAndSortProducts(products, selectedCategory, sortBy, searchQuery);
  }, [searchQuery, selectedCategory, sortBy, products]);

  const filterAndSortProducts = (prods: any[], category: string, sort: string, query: string): void => {
    let filtered = prods;

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('fr-FR');
  };

  const addToCart = (product: any): void => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number): void => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrderWhatsApp = (product: any, quantity: number): void => {
    const message = `Bonjour, je souhaite commander ${quantity} x ${product.name} - ${formatPrice(product.price)} FCFA. Total: ${formatPrice(product.price * quantity)} FCFA`;
    const whatsappUrl = `https://wa.me/22670000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setCurrentPage('home')} className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
              Store
            </button>

            <nav className="hidden md:flex gap-8">
              <button onClick={() => setCurrentPage('home')} className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">Accueil</button>
              <button onClick={() => setCurrentPage('catalog')} className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">Catalogue</button>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">À propos</a>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">Contact</a>
            </nav>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <ShoppingCart size={20} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded transition-colors"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50">
            <div className="px-4 py-3 space-y-2">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm font-medium">Accueil</button>
              <button onClick={() => { setCurrentPage('catalog'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-sm font-medium">Catalogue</button>
              <a href="#" className="block w-full text-left py-2 text-sm font-medium">À propos</a>
              <a href="#" className="block w-full text-left py-2 text-sm font-medium">Contact</a>
            </div>
          </div>
        )}

        {/* Cart Dropdown */}
        {cartOpen && (
          <div className="absolute right-4 top-16 w-80 bg-white border border-gray-200 rounded shadow-lg p-4 z-50">
            {cart.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">Votre panier est vide</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-gray-100 rounded" />
                      <div className="flex-grow text-sm">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600">{formatPrice(item.price)} FCFA</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-gray-900">−</button>
                          <span className="text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-gray-900">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs text-red-600 hover:text-red-700">Supprimer</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 mb-3">
                  <div className="flex justify-between font-semibold text-gray-900 mb-3">
                    <span>Total:</span>
                    <span>{formatPrice(cartTotal)} FCFA</span>
                  </div>
                  <button onClick={() => setCurrentPage('cart')} className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium">
                    Voir le panier
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>

      {/* Home Page */}
      {currentPage === 'home' && (
        <main>
          {/* Hero */}
          <section 
            className="relative bg-cover bg-center bg-no-repeat min-h-96"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop)' }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Découvrez la Mode et le Style qui Vous Correspondent
                </h1>
                <p className="text-xl text-gray-100 mb-8">
                  Vêtements premium, chaussures tendance et électroménagers innovants. Tout ce qu'il faut pour transformer votre quotidien avec élégance et confort.
                </p>
                <button 
                  onClick={() => setCurrentPage('catalog')}
                  className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium"
                >
                  Explorez notre Collection
                </button>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Parcourir nos Univers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  name: 'Vêtements', 
                  desc: 'Exprimez votre style personnel avec notre sélection de vêtements tendance et intemporels',
                  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
                  cat: 'vetements'
                },
                { 
                  name: 'Chaussures', 
                  desc: 'Marchez avec confiance dans nos chaussures confortables et élégantes pour tous les styles',
                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
                  cat: 'chaussures'
                },
                { 
                  name: 'Électroménagers', 
                  desc: 'Simplifiez votre vie quotidienne avec nos appareils modernes et performants',
                  image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
                  cat: 'electromenager'
                },
              ].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCurrentPage('catalog'); setSelectedCategory(cat.cat); }}
                  className="group relative aspect-square bg-gray-100 border border-gray-200 rounded overflow-hidden hover:border-gray-400 transition-all"
                >
                  <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                  <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                    <p className="text-3xl font-bold text-white mb-2">{cat.name}</p>
                    <p className="text-sm text-gray-100">{cat.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Product Detail Page */}
      {currentPage === 'product-detail' && selectedProduct && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button 
            onClick={() => { setCurrentPage('catalog'); setSelectedProduct(null); setProductQuantity(1); }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ChevronLeft size={20} />
            Retour au catalogue
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden h-96 lg:h-auto">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{formatPrice(selectedProduct.price)} FCFA</p>
                <p className={`text-sm font-semibold mt-2 ${selectedProduct.stock > 5 ? 'text-green-700' : selectedProduct.stock > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                  {selectedProduct.stock > 0 ? `${selectedProduct.stock} en stock` : 'Rupture de stock'}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Quantité</label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                      className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border border-gray-200 rounded">{productQuantity}</span>
                    <button 
                      onClick={() => setProductQuantity(productQuantity + 1)}
                      className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart({ ...selectedProduct, quantity: productQuantity });
                    setCurrentPage('catalog');
                    setSelectedProduct(null);
                    setProductQuantity(1);
                  }}
                  disabled={selectedProduct.stock === 0}
                  className="w-full bg-gray-900 text-white py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium mb-3"
                >
                  Ajouter au panier
                </button>

                <button
                  onClick={() => handleOrderWhatsApp(selectedProduct, productQuantity)}
                  disabled={selectedProduct.stock === 0}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  <MessageCircle size={20} />
                  Commander sur WhatsApp
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Catalog Page */}
      {currentPage === 'catalog' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Filtrer par</h3>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Catégorie</h4>
                  <div className="space-y-2">
                    {['all', 'vetements', 'chaussures', 'electromenager'].map(cat => (
                      <label key={cat} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={selectedCategory === cat}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="ml-3 text-sm text-gray-700 capitalize">{cat === 'all' ? 'Tous' : cat === 'electromenager' ? 'Électroménagers' : cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Trier par</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="price-low">Prix: bas au haut</option>
                    <option value="price-high">Prix: haut au bas</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-4">
              {/* Search and Results */}
              <div className="mb-8">
                <div className="relative mb-6">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher des produits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>
                <p className="text-sm text-gray-600">{filteredProducts.length} résultats</p>
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <button 
                    key={product.id}
                    onClick={() => { setSelectedProduct(product); setCurrentPage('product-detail'); }}
                    className="bg-white border border-gray-200 rounded overflow-hidden hover:border-gray-400 hover:shadow-md transition-all text-left"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)} FCFA</p>
                        <p className={`text-xs font-semibold ${product.stock > 5 ? 'text-green-700' : product.stock > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                          {product.stock > 0 ? `${product.stock}` : 'Rupture'}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={product.stock === 0}
                        className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {product.stock > 0 ? 'Ajouter' : 'Indisponible'}
                      </button>
                    </div>
                  </button>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Aucun produit ne correspond à votre recherche</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-gray-900 hover:text-gray-700 font-medium underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Cart Page */}
      {currentPage === 'cart' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">Votre Panier</h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 mb-6">Votre panier est vide</p>
              <button
                onClick={() => setCurrentPage('catalog')}
                className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-medium"
              >
                Continuer vos achats
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded p-4 flex gap-4">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover bg-gray-100 rounded" />
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{formatPrice(item.price)} FCFA</p>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors text-sm">−</button>
                          <span className="px-4 py-1 border border-gray-200 rounded text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors text-sm">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium">Supprimer</button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="border border-gray-200 rounded p-6 bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Résumé</h2>
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="text-gray-900">{formatPrice(cartTotal)} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="text-gray-900">À calculer</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 mb-6 text-lg">
                    <span>Total</span>
                    <span>{formatPrice(cartTotal)} FCFA</span>
                  </div>
                  <button 
                    onClick={() => {
                      const items = cart.map(i => `${i.quantity}x ${i.name} (${formatPrice(i.price)} FCFA)`).join('\n');
                      const message = `Commande:\n${items}\n\nTotal: ${formatPrice(cartTotal)} FCFA`;
                      const whatsappUrl = `https://wa.me/22670000000?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition-colors font-medium mb-3 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Commander sur WhatsApp
                  </button>
                  <button
                    onClick={() => setCurrentPage('catalog')}
                    className="w-full border border-gray-200 text-gray-900 py-3 rounded hover:bg-gray-100 transition-colors font-medium"
                  >
                    Continuer vos achats
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Aide</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Livraison</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Retours</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Conditions</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Suivez-nous</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 Store. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}