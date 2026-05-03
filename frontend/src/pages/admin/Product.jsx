import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import PRODUCT_API from "../../services/productApi";
import { FaEdit, FaTrash } from "react-icons/fa";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: null,
  });

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        PRODUCT_API.get("/products/products/"),
        PRODUCT_API.get("/products/categories/"),
      ]);
      setProducts(Array.isArray(pRes.data) ? pRes.data : []);
      setCategories(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      if (!form.category_id) {
        alert("Please select category");
        return;
      }
      formData.append("category_id", form.category_id);
      if (form.image) formData.append("image", form.image);

      if (editId) {
        await PRODUCT_API.put(`/products/products/${editId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await PRODUCT_API.post(`/products/products/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        name: "", description: "", price: "", stock: "", category_id: "", image: null,
      });
      setEditId(null);
      loadData();
    } catch (err) {
      console.error("SUBMIT ERROR:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await PRODUCT_API.delete(`/products/products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name || "",
      description: p.description || "",
      price: p.price || "",
      stock: p.stock || "",
      category_id: p.category?.id || "",
      image: null,
    });
    setEditId(p.id);
  };

  const filteredProducts = (Array.isArray(products) ? products : [])
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (filterCategory ? p.category?.id === Number(filterCategory) : true));

  if (loading) return <AdminLayout><div className="p-6">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
        <div className="mb-6 p-5 rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <p className="text-sm text-gray-500">Manage products CRUD system</p>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded flex-1"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-6 p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <h2 className="font-bold mb-3">{editId ? "Edit Product" : "Add Product"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={handleChange} className="p-2 bg-gray-100 dark:bg-gray-800 rounded" placeholder="Name" />
            <input name="price" value={form.price} onChange={handleChange} className="p-2 bg-gray-100 dark:bg-gray-800 rounded" placeholder="Price" />
            <input name="stock" value={form.stock} onChange={handleChange} className="p-2 bg-gray-100 dark:bg-gray-800 rounded" placeholder="Stock" />
            <select name="category_id" value={form.category_id} onChange={handleChange} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
              <option value="">Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input type="file" name="image" onChange={handleChange} className="col-span-2" />
            <textarea name="description" value={form.description} onChange={handleChange} className="col-span-2 p-2 bg-gray-100 dark:bg-gray-800 rounded" placeholder="Description" />
          </div>
          <button onClick={handleSubmit} className="mt-3 bg-yellow-500 text-black px-5 py-2 rounded">
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Category</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-t dark:border-gray-800 text-center">
                  <td className="p-4">
                    {p.image ? <img src={p.image} className="w-10 h-10 rounded object-cover" /> : "-"}
                  </td>
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">${p.price}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">{p.category?.name}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-500 text-black rounded flex items-center gap-1">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Product;