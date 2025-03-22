/**
 * Arrr! This be the main component fer keepin' track of our ship's provisions!
 * A mighty fine list of groceries that any seafarin' crew would need fer their voyage.
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { GroceryItem } from '../types/database';
import './GroceryList.css';

const GroceryList: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('grocery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
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
            user_id: 'anonymous' // In a real app, this would come from auth
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setItems([data, ...items]);
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
      setItems(items.map(item =>
        item.id === id ? { ...item, completed: !completed } : item
      ));
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
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your provisions...</div>;
  }

  return (
    <div className="grocery-list">
      <h1>🏴‍☠️ Ship's Grocery List</h1>
      
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new provision..."
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
            <button onClick={() => removeItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList; 