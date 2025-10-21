// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnalyticsEvent {
  id?: string;
  event_type: string;
  product_id?: string;
  user_session_id: string;
  page_name: string;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsConversion {
  id?: string;
  user_session_id: string;
  total_amount: number;
  items_count: number;
  whatsapp_clicked: boolean;
  timestamp?: string;
}

// Product Services
export const productService = {
  // Récupérer tous les produits
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      return [];
    }
    return data || [];
  },

  // Récupérer un produit par ID
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération du produit:", error);
      return null;
    }
    return data;
  },

async createProduct(
  productData: { name: string; category: string; price: number; stock: number; description: string; }, image: File): Promise<Product | null> {
  try {
    if (!image) throw new Error("Image requise");

    // Générer un nom unique pour l'image
    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload dans le bucket 'produit'
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, image);

    if (uploadError) throw uploadError;

    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    const newProduct = {
      ...productData,
      image: urlData.publicUrl, // on stocke l'URL
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insérer dans la table products
    const { data, error } = await supabase.from("products").insert([newProduct]).select().single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Erreur création produit:", err);
    return null;
  }
},


  // Modifier un produit
  async updateProduct(
id: string, updates: Partial<Product>, image?: File | null  ): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      return null;
    }
    return data;
  },

  // Supprimer un produit
  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Erreur lors de la suppression du produit:", error);
      return false;
    }
    return true;
  },

  // Filtrer les produits par catégorie
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des produits:", error);
      return [];
    }
    return data || [];
  },

  // Rechercher des produits
  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error("Erreur lors de la recherche:", error);
      return [];
    }
    return data || [];
  },
};

// Analytics Services
export const analyticsService = {
  // Enregistrer un événement
  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    const { error } = await supabase.from("analytics_events").insert([
      {
        ...event,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Erreur lors de l'enregistrement de l'événement:", error);
      return false;
    }
    return true;
  },

  // Enregistrer une conversion
  async trackConversion(conversion: AnalyticsConversion): Promise<boolean> {
    const { error } = await supabase.from("analytics_conversions").insert([
      {
        ...conversion,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Erreur lors de l'enregistrement de la conversion:", error);
      return false;
    }
    return true;
  },

  // Récupérer les stats globales
  async getOverallStats() {
    try {
      // Total vues
      const { count: viewsCount } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "product_view");

      // Total ajouts panier
      const { count: cartCount } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "add_to_cart");

      // Total conversions
      const { count: conversionsCount } = await supabase
        .from("analytics_conversions")
        .select("*", { count: "exact", head: true });

      // Récupérer les top produits
      const topProducts = await this.getTopProducts(5);

      return {
        totalViews: viewsCount || 0,
        totalCartAdds: cartCount || 0,
        totalConversions: conversionsCount || 0,
        conversionRate: viewsCount
          ? (((conversionsCount || 0) / viewsCount) * 100).toFixed(2)
          : 0,
        topProducts: topProducts || [], // AJOUT ICI
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
      return {
        totalViews: 0,
        totalCartAdds: 0,
        totalConversions: 0,
        conversionRate: 0,
        topProducts: [], // AJOUT ICI
      };
    }
  },

  // Récupérer les produits les plus vus
  async getTopProducts(limit: number = 10) {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("product_id, event_type")
      .eq("event_type", "product_view")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erreur lors de la récupération des top produits:", error);
      return [];
    }

    // Compter les occurrences
    const productCounts: Record<string, number> = {};
    data?.forEach((event) => {
      if (event.product_id) {
        productCounts[event.product_id] =
          (productCounts[event.product_id] || 0) + 1;
      }
    });

    const sorted = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return sorted;
  },

  // Récupérer les événements récents
  async getRecentEvents(limit: number = 20) {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erreur lors de la récupération des événements:", error);
      return [];
    }
    return data || [];
  },
};

// Utilitaires
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getOrCreateSessionId = (): string => {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};
