/**
 * Arrr! These be the sacred scrolls of our database structure!
 * The ancient TypeScript runes that define how our grocery items be stored in the great Supabase sea!
 */

export interface GroceryItem {
  id: number;
  created_at: string;
  name: string;
  completed: boolean;
  user_id: string;
}

export interface Database {
  public: {
    Tables: {
      grocery_items: {
        Row: GroceryItem;
        Insert: Omit<GroceryItem, 'id' | 'created_at'>;
        Update: Partial<Omit<GroceryItem, 'id' | 'created_at'>>;
      };
    };
  };
} 