import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// TYPES
// ============================================

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// ============================================
// PRODUCT SERVICES
// ============================================

export const productService = {
  // Récupérer tous les produits
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Récupérer un produit par ID
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProduct(
    productData: {
      name: string;
      category: string;
      price: number;
      stock: number;
      description: string;
    },
    image: File | null
  ): Promise<Product | null> {
    let imageUrl = "";

    // Upload de l'image si elle existe
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, image);

      if (uploadError) {
        console.error("Erreur upload image:", uploadError);
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      imageUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ ...productData, image: imageUrl }])
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la création du produit:", error);
      return null;
    }
    return data;
  },

  // Mettre à jour un produit (admin)
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Supprimer un produit (admin)
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
  },

  // Rechercher des produits
  async search(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("name", `%${query}%`);

    if (error) throw error;
    return data || [];
  },

  // Filtrer par catégorie
  async getByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

// ============================================
// CART SERVICES
// ============================================

export const cartService = {
  // Récupérer le panier de l'utilisateur
  async getCart(userId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from("cart")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  },

  // Ajouter au panier
  async addToCart(
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<CartItem> {
    // Vérifier si le produit existe déjà dans le panier
    const { data: existing } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (existing) {
      // Mettre à jour la quantité
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Ajouter nouveau
      const { data, error } = await supabase
        .from("cart")
        .insert({ user_id: userId, product_id: productId, quantity })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  // Mettre à jour la quantité
  async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", cartItemId);

    if (error) throw error;
  },

  // Supprimer du panier
  async removeFromCart(cartItemId: string): Promise<void> {
    const { error } = await supabase.from("cart").delete().eq("id", cartItemId);

    if (error) throw error;
  },

  // Vider le panier
  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  },
};

// ============================================
// ORDER SERVICES
// ============================================

export const orderService = {
  // Créer une commande
  async create(
    userId: string,
    totalAmount: number,
    items: any[]
  ): Promise<Order> {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: userId, total_amount: totalAmount })
      .select()
      .single();

    if (orderError) throw orderError;

    // Ajouter les items de la commande
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  },

  // Récupérer toutes les commandes (admin)
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Récupérer les commandes d'un utilisateur
  async getByUser(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
