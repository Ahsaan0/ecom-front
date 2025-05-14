'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });

  const API_URL = 'https://nextjs-product-pearl.vercel.app/'; // Express Backend URL

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle adding a new product
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    try {
      await axios.post(`${API_URL}/product`, form);
      setForm({ name: '', price: '' }); 
      fetchProducts(); 
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Handle deleting a product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Handle setting up for editing a product
  const handleEdit = (product) => {
    setEditId(product.id);
    setEditForm({ name: product.name, price: product.price });
  };

  // Handle updating a product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.name || !editForm.price) return; // Ensure name and price are not empty

    try {
      await axios.put(`${API_URL}/products/${editId}`, editForm);
      setEditId(null); // Clear edit mode
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: 'auto' }}>
      <h1>🛍️ Simple E-commerce (Next.js)</h1>

      {/* Add Product Form */}
      <form onSubmit={handleAdd} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit">Add Product</button>
      </form>

      <ul>
        {/* Render the list of products */}
        {products.map(p => (
          <li key={p.id} style={{ marginBottom: '10px' }}>
            {editId === p.id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  value={editForm.price}
                  onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                  required
                />
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                {p.name} - Rs.{p.price}
                <button onClick={() => handleEdit(p)} style={{ marginLeft: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '5px' }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
