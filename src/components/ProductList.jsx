import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [formError, setFormError] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      const start = (page - 1) * limit;
      try {
        const response = await axios.get(`http://localhost:8888/api.predic8.de/shop/v2/products?start=${start}&limit=${limit}`);
        setProducts(response.data.products);
        setTotalCount(response.data.meta.count);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [page]); 

  const handleNewProductChange = (event) => {
    setNewProductName(event.target.value);
  };

  const validateForm = () => {
    if (newProductName.length < 2 || newProductName.length > 50) {
      setFormError('Product name must be between 2 and 50 characters');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:8888/api.predic8.de/shop/v2/products', { name: newProductName });
      setProducts([...products, response.data]);
      setTotalCount(prevCount => prevCount + 1);
      setShowForm(false);
      setNewProductName('');
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:8888/api.predic8.de/shop/v2/products/${productId}`);
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      setTotalCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="p-8 flex flex-wrap">
      <h2 className="w-full text-3xl font-bold text-center mb-4 text-blue-700">Our Products</h2>
<p className="w-full text-center text-md text-gray-700 mb-6">Total Products: {totalCount}</p>

      <button onClick={() => setShowForm(!showForm)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200">
        {showForm ? 'Cancel Adding' : 'Add New Product'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input type="text" value={newProductName} onChange={handleNewProductChange} placeholder="Enter product name" className="p-2 border rounded" />
          <button type="submit" className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-200">Add Product</button>
          {formError && <p className="text-red-500">{formError}</p>}
        </form>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {products.map(product => (
          <div key={product.id} className="product-item-container bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out flex-grow">
            <Link to={`/productdetails/${product.id}`} className="p-6 block">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            </Link>
            <button onClick={() => handleDelete(product.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-200 m-4">
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-8 w-full">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`px-4 py-2 mx-1 ${page === p ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded hover:bg-blue-700 transition duration-200`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
