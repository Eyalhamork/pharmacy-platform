// Database types based on schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_name: string | null;
          parent_category_id: string | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_name?: string | null;
          parent_category_id?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_name?: string | null;
          parent_category_id?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          generic_name: string | null;
          brand_name: string | null;
          category_id: string | null;
          description: string | null;
          usage_instructions: string | null;
          dosage_info: string | null;
          side_effects: string | null;
          price: number;
          stock_quantity: number;
          low_stock_threshold: number;
          requires_prescription: boolean;
          prescription_schedule: string | null;
          image_url: string | null;
          sku: string | null;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          generic_name?: string | null;
          brand_name?: string | null;
          category_id?: string | null;
          description?: string | null;
          usage_instructions?: string | null;
          dosage_info?: string | null;
          side_effects?: string | null;
          price: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          requires_prescription?: boolean;
          prescription_schedule?: string | null;
          image_url?: string | null;
          sku?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          generic_name?: string | null;
          brand_name?: string | null;
          category_id?: string | null;
          description?: string | null;
          usage_instructions?: string | null;
          dosage_info?: string | null;
          side_effects?: string | null;
          price?: number;
          stock_quantity?: number;
          low_stock_threshold?: number;
          requires_prescription?: boolean;
          prescription_schedule?: string | null;
          image_url?: string | null;
          sku?: string | null;
          is_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          whatsapp_number: string | null;
          first_name: string | null;
          last_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          whatsapp_number?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          whatsapp_number?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      delivery_zones: {
        Row: {
          id: string;
          name: string;
          delivery_fee: number;
          estimated_delivery_time: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          delivery_fee: number;
          estimated_delivery_time?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          delivery_fee?: number;
          estimated_delivery_time?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          street_address: string;
          area: string | null;
          city: string;
          delivery_zone_id: string | null;
          additional_info: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string | null;
          street_address: string;
          area?: string | null;
          city?: string;
          delivery_zone_id?: string | null;
          additional_info?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string | null;
          street_address?: string;
          area?: string | null;
          city?: string;
          delivery_zone_id?: string | null;
          additional_info?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_whatsapp: string | null;
          customer_email: string | null;
          delivery_address_id: string | null;
          delivery_type: 'delivery' | 'pickup';
          delivery_zone_id: string | null;
          delivery_address_snapshot: Json | null;
          delivery_fee: number;
          subtotal: number;
          total_amount: number;
          payment_method: 'mobile_money' | 'cash_on_delivery';
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          momo_transaction_id: string | null;
          paid_at: string | null;
          order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
          has_prescription_items: boolean;
          prescription_verified: boolean;
          customer_notes: string | null;
          staff_notes: string | null;
          created_at: string;
          updated_at: string;
          confirmed_at: string | null;
          completed_at: string | null;
          cancelled_at: string | null;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_whatsapp?: string | null;
          customer_email?: string | null;
          delivery_address_id?: string | null;
          delivery_type: 'delivery' | 'pickup';
          delivery_zone_id?: string | null;
          delivery_address_snapshot?: Json | null;
          delivery_fee?: number;
          subtotal: number;
          total_amount: number;
          payment_method: 'mobile_money' | 'cash_on_delivery';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          momo_transaction_id?: string | null;
          paid_at?: string | null;
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
          has_prescription_items?: boolean;
          prescription_verified?: boolean;
          customer_notes?: string | null;
          staff_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          confirmed_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_whatsapp?: string | null;
          customer_email?: string | null;
          delivery_address_id?: string | null;
          delivery_type?: 'delivery' | 'pickup';
          delivery_zone_id?: string | null;
          delivery_address_snapshot?: Json | null;
          delivery_fee?: number;
          subtotal?: number;
          total_amount?: number;
          payment_method?: 'mobile_money' | 'cash_on_delivery';
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          momo_transaction_id?: string | null;
          paid_at?: string | null;
          order_status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
          has_prescription_items?: boolean;
          prescription_verified?: boolean;
          customer_notes?: string | null;
          staff_notes?: string | null;
          created_at?: string;
          updated_at?: string;
          confirmed_at?: string | null;
          completed_at?: string | null;
          cancelled_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          product_sku: string | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
          requires_prescription: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          product_sku?: string | null;
          quantity: number;
          unit_price: number;
          subtotal: number;
          requires_prescription?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          product_sku?: string | null;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
          requires_prescription?: boolean;
          created_at?: string;
        };
      };
      prescriptions: {
        Row: {
          id: string;
          order_id: string;
          file_url: string;
          file_type: string | null;
          file_name: string | null;
          file_size: number | null;
          uploaded_at: string;
          verified_by_staff_id: string | null;
          verified_at: string | null;
          verification_status: 'pending' | 'approved' | 'rejected';
          rejection_reason: string | null;
          staff_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          file_url: string;
          file_type?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          uploaded_at?: string;
          verified_by_staff_id?: string | null;
          verified_at?: string | null;
          verification_status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          staff_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          file_url?: string;
          file_type?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          uploaded_at?: string;
          verified_by_staff_id?: string | null;
          verified_at?: string | null;
          verification_status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          staff_notes?: string | null;
          created_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'staff' | 'manager' | 'admin';
          phone: string | null;
          is_active: boolean;
          created_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: 'staff' | 'manager' | 'admin';
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'staff' | 'manager' | 'admin';
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          last_login_at?: string | null;
        };
      };
      order_status_history: {
        Row: {
          id: string;
          order_id: string;
          old_status: string | null;
          new_status: string;
          changed_by_staff_id: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          old_status?: string | null;
          new_status: string;
          changed_by_staff_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          old_status?: string | null;
          new_status?: string;
          changed_by_staff_id?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_by_staff_id: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_by_staff_id?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_by_staff_id?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      order_summary: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_phone: string;
          order_status: string;
          payment_status: string;
          payment_method: string;
          total_amount: number;
          created_at: string;
          item_count: number;
        };
      };
      product_inventory_status: {
        Row: {
          id: string;
          name: string;
          sku: string | null;
          stock_quantity: number;
          low_stock_threshold: number;
          stock_status: string;
          price: number;
          category_name: string | null;
        };
      };
    };
    Functions: {
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
      check_stock_availability: {
        Args: {
          p_product_id: string;
          p_quantity: number;
        };
        Returns: boolean;
      };
    };
  };
}
