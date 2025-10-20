"use client";
import { useState, useEffect, JSX } from "react";
import {
  X,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Eye,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Upload,
} from "lucide-react";
import { productService, analyticsService} from "../lib/supabase";

export default function AdminDashboard(): JSX.Element {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProductForm, setShowProductForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [analytics, setAnalytics] = useState<any>({
    totalViews: 0,
    totalCartAdds: 0,
    totalConversions: 0,
    conversionRate: 0,
    topProducts: [0],
  });

  const [formData, setFormData] = useState({
    name: "",
    category: "vetements",
    price: "",
    stock: "",
    description: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadProducts();
    loadAnalytics();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des produits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const stats = await analyticsService.getOverallStats();
      setAnalytics(stats);
    } catch (err) {
      console.error("Erreur analytics:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.stock) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description,
        image: "", // Sera mis à jour après upload si nécessaire
      };

      if (editingProduct) {
        const updates = {
          name: formData.name,
          category: formData.category,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
          description: formData.description,
        };
        await productService.updateProduct(
          editingProduct.id,
          updates,
          formData.image
        );
      } else {
        if (!formData.image) {
          setError("Veuillez ajouter une image pour le produit");
          setLoading(false);
          return;
        }
        await productService.createProduct(
          {
            name: formData.name,
            category: formData.category,
            price: parseInt(formData.price),
            stock: parseInt(formData.stock),
            description: formData.description,
          },
          formData.image,
          productData
        );
      }

      await loadProducts();
      resetForm();
      setError("");
    } catch (err) {
      setError("Erreur lors de l'enregistrement du produit");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: null,
    });
    setImagePreview(product.image || "");
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    setLoading(true);
    try {
      await productService.deleteProduct(id);
      await loadProducts();
      setError("");
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "vetements",
      price: "",
      stock: "",
      description: "",
      image: null,
    });
    setImagePreview("");
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString("fr-FR");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Connecté en tant qu'Admin
              </span>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border-b border-red-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-red-200">
            <AlertCircle size={20} />
            {error}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="border-b border-gray-800 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                currentTab === "dashboard"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <BarChart3 size={18} />
              Tableau de bord
            </button>
            <button
              onClick={() => setCurrentTab("products")}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                currentTab === "products"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <ShoppingCart size={18} />
              Produits ({products.length})
            </button>
            <button
              onClick={() => setCurrentTab("analytics")}
              className={`py-4 px-2 border-b-2 transition-colors flex items-center gap-2 ${
                currentTab === "analytics"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <TrendingUp size={18} />
              Analytics
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Dashboard Tab */}
        {currentTab === "dashboard" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Vue d'ensemble</h2>

            {/* KPI Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Vues totales</p>
                    <p className="text-3xl font-bold">{analytics.totalViews}</p>
                  </div>
                  <Eye className="text-blue-500" size={32} />
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">
                      Ajouts au panier
                    </p>
                    <p className="text-3xl font-bold">
                      {analytics.totalCartAdds}
                    </p>
                  </div>
                  <ShoppingCart className="text-green-500" size={32} />
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Conversions</p>
                    <p className="text-3xl font-bold">
                      {analytics.totalConversions}
                    </p>
                  </div>
                  <TrendingUp className="text-orange-500" size={32} />
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">
                      Taux de conversion
                    </p>
                    <p className="text-3xl font-bold">
                      {analytics.conversionRate}%
                    </p>
                  </div>
                  <BarChart3 className="text-purple-500" size={32} />
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Produits les plus vus</h3>
              <div className="space-y-4">
                {analytics.topProducts && analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((product: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-400">
                          Vues: {product.views} | Clics: {product.clicks}
                        </p>
                      </div>
                      <div className="w-32 bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(
                              (product.views /
                                (analytics.topProducts[0]?.views || 1)) *
                                100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Aucune donnée disponible
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {currentTab === "products" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Gestion des produits</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowProductForm(true);
                }}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded transition-colors"
              >
                <Plus size={20} />
                Ajouter un produit
              </button>
            </div>

            {/* Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">
                      {editingProduct ? "Modifier" : "Ajouter"} un produit
                    </h3>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-white"
                      disabled={loading}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nom du produit *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="Ex: T-shirt Coton"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Catégorie
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="vetements">Vêtements</option>
                          <option value="chaussures">Chaussures</option>
                          <option value="electromenager">
                            Électroménagers
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Prix (FCFA) *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                          placeholder="12999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Stock *
                      </label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        placeholder="15"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Image du produit {editingProduct ? "" : "*"}
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-400">
                                <span className="font-semibold">
                                  Cliquez pour uploader
                                </span>{" "}
                                ou glissez-déposez
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG (MAX. 5MB)
                              </p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        {imagePreview && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-700">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => {
                                setFormData({ ...formData, image: null });
                                setImagePreview("");
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-20 resize-none"
                        placeholder="Description du produit..."
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleAddProduct}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded px-4 py-2 font-medium transition-colors"
                      >
                        {loading
                          ? "Chargement..."
                          : editingProduct
                          ? "Mettre à jour"
                          : "Ajouter"}
                      </button>
                      <button
                        onClick={resetForm}
                        disabled={loading}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700 rounded px-4 py-2 font-medium transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {products.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <p>
                    Aucun produit.{" "}
                    <button
                      onClick={() => setShowProductForm(true)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Ajouter le premier
                    </button>
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50 border-b border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Produit
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Catégorie
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Prix
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <p className="font-medium">{product.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 capitalize">
                            {product.category === "electromenager"
                              ? "Électroménagers"
                              : product.category}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {formatPrice(product.price)} FCFA
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                product.stock > 5
                                  ? "bg-green-900/30 text-green-400"
                                  : product.stock > 0
                                  ? "bg-yellow-900/30 text-yellow-400"
                                  : "bg-red-900/30 text-red-400"
                              }`}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                disabled={loading}
                                className="p-2 hover:bg-gray-700 disabled:hover:bg-transparent rounded transition-colors text-blue-400"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={loading}
                                className="p-2 hover:bg-gray-700 disabled:hover:bg-transparent rounded transition-colors text-red-400"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {currentTab === "analytics" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">Analytiques détaillées</h2>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Événements suivis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 rounded p-4 border border-gray-600">
                  <p className="text-gray-400 text-sm mb-2">
                    Événements de vue produit
                  </p>
                  <p className="text-2xl font-bold">{analytics.totalViews}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Nombre total de pages produit consultées
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded p-4 border border-gray-600">
                  <p className="text-gray-400 text-sm mb-2">
                    Clics "Ajouter au panier"
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.totalCartAdds}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Nombre d'ajouts au panier
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded p-4 border border-gray-600">
                  <p className="text-gray-400 text-sm mb-2">
                    Commandes WhatsApp
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.totalConversions}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Nombre de commandes générées
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded p-4 border border-gray-600">
                  <p className="text-gray-400 text-sm mb-2">
                    Taux de conversion global
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.conversionRate}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Conversions / Vues totales
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm leading-relaxed">
                💡 <strong>Comment fonctionnent les événements tracés :</strong>
                <br />• <strong>Product View</strong> : Enregistré quand un
                utilisateur consulte une page produit
                <br />• <strong>Add to Cart</strong> : Enregistré quand
                l'utilisateur clique sur "Ajouter au panier"
                <br />• <strong>Conversions</strong> : Enregistré quand
                l'utilisateur clique sur "Commander sur WhatsApp"
                <br />• <strong>Search</strong> : Enregistré à chaque recherche
                de produit
                <br />• <strong>Category Filter</strong> : Enregistré quand un
                filtre de catégorie est appliqué
              </p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700/50 rounded">
                  <p className="text-sm text-gray-400 mb-1">
                    Produit le plus populaire
                  </p>
                  <p className="font-semibold">
                    {analytics?.topProducts?.length
                      ? analytics.topProducts[0].name
                      : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded">
                  <p className="text-sm text-gray-400 mb-1">
                    Ratio panier / vues
                  </p>
                  <p className="font-semibold">
                    {analytics.totalViews > 0
                      ? (
                          (analytics.totalCartAdds / analytics.totalViews) *
                          100
                        ).toFixed(1)
                      : "0"}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
