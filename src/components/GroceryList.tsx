/**
 * A shared grocery list component that allows authorized users to collaborate
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import './GroceryList.css';

interface GroceryItem {
  id: number;
  created_at: string;
  name: string;
  completed: boolean;
  added_by: string;
}

const GroceryList: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchItems();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('grocery_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'grocery_items' },
        () => { 
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('grocery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim() === '') return;

    try {
      const { data, error } = await supabase
        .from('grocery_items')
        .insert([
          {
            name: newItem,
            completed: false,
            added_by: user?.email
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Add the new item to the local state immediately
      if (data) {
        setItems(currentItems => [data, ...currentItems]);
      }
      setNewItem('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const toggleItem = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .update({ completed: !completed })
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setItems(currentItems => 
        currentItems.map(item =>
          item.id === id ? { ...item, completed: !completed } : item
        )
      );
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const removeItem = async (id: number) => {
    try {
      const { error } = await supabase
        .from('grocery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state immediately
      setItems(currentItems => 
        currentItems.filter(item => item.id !== id)
      );
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading shared grocery list...</div>;
  }

  return (
    <div className="grocery-list">
      <h1>Our Shared Grocery List</h1>
      
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
        />
        <button type="submit">Add to List</button>
      </form>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id, item.completed)}
            />
            <span className={item.completed ? 'completed' : ''}>
              {item.name}
            </span>
            <span className="added-by">
              Added by: {item.added_by}
            </span>
            <button onClick={() => removeItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList; 