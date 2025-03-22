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