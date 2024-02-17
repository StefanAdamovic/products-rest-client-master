import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../index.css";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [newName, setNewName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8888/api.predic8.de/shop/v2/products/${productId}`);
        setProduct(response.data);
        setNewName(response.data.name); 
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const updateProduct = async () => {
    try {
      const response = await axios.put(`http://localhost:8888/api.predic8.de/shop/v2/products/${productId}`, {
        ...product, 
        name: newName 
      });
      setProduct(response.data); 
      setIsEditing(false); 
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="p-8">
      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200">Back</button>
      <h2 className="text-3xl font-bold mb-4">Product Details</h2>
      <div className="border p-4 rounded-lg shadow">
        {!isEditing ? (
          <>
            <h3 className="text-xl font-semibold">Product Name: {product.name}</h3>
            <button onClick={toggleEdit} className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200">Edit</button>
          </>
        ) : (
          <>
            <input type="text" value={newName} onChange={handleNameChange} className="text-xl p-2 border rounded" />
            <button onClick={updateProduct} className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 transition duration-200">Update</button>
            <button onClick={toggleEdit} className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition duration-200">Cancel</button>
          </>
        )}
        <p className="text-xl font-semibold">Product ID: {product.id}</p>
      </div>
    </div>
  );
};

export default ProductDetails;
