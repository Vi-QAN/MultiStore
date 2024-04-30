// productService/productService.js
const Product = require('./productModel');
const axios = require('axios');

let tempMemory = {
  searchTerm: '',
  categories: '',
  maxPrice: 0.00,
  data: []
}

const readData = async () => {
    try {
        // Make a GET request to the URI
        const response = await axios.get('https://raw.githubusercontent.com/BestBuyAPIs/open-data-set/master/products.json'); // Replace with your URI
        // Parse the JSON data
        const jsonData = response.data;
        // Send the JSON data as the response
        return jsonData;
      } catch (error) {
        // Handle error if request fails
        console.error('Error reading JSON file:', error);
    }
}

const filterProductsByCategories = (products = [], categories = []) => {
  if (categories.length === 0) return products;
  const filteredProducts = products.filter(product => {
    if (!product.category) return;
    const included = product.category.filter(cat => categories.includes(cat.id));
    if (included.length === 0) return;
    return product;
  });
  return filteredProducts;
}

const filterProductsBySearchTerm = (products, search) => {
  if (search.length === 0) return products;
  const filteredProducts = products.filter(product => {
    if (!product.name) return false;
    return product.name.toLowerCase().includes(search.toLowerCase());
  })
  return filteredProducts;
}

const filterProductsByPrice = (products, maxPrice) => {
  if (maxPrice < 1) return products;
  const filteredProducts = products.filter(product => parseFloat(product.price) <= maxPrice);
  return filteredProducts;
}

const sortProducts = (products, sortedBy) => {
  if (sortedBy.length === 0) return products;
  let sortedProducts = [...products];
  if (sortedBy === 'A-Z'){
    sortedProducts = sortedProducts.sort((firstProduct, secondProduct) => firstProduct.name.charAt(0) - secondProduct.name.charAt(0));
  } else if (sortedBy === 'Z-A'){
    sortedProducts = sortedProducts.sort((firstProduct, secondProduct) => secondProduct.name.charAt(0) - firstProduct.name.charAt(0));
  } else if (sortedBy === 'Cheapest'){
    sortedProducts = sortedProducts.sort((firstProduct, secondProduct) => parseFloat(firstProduct.price) - parseFloat(secondProduct.price));
  } else {
    sortedProducts = sortedProducts.sort((firstProduct, secondProduct) => parseFloat(secondProduct.price) - parseFloat((firstProduct.price)));
  }  
  return sortedProducts
}

const getAllProducts = async (search = '', categories = '', maxPrice = 0, sortedBy, pageSize = 10, page = 1) => {
    try {
      let filteredData;
      if (tempMemory.data.length === 0 || search !== tempMemory.searchTerm 
          || categories !== tempMemory.categories || tempMemory.maxPrice !== maxPrice){
            // Fetch the JSON data directly from the URL
            const products = await readData();
          
            // Apply category filter if specified
            const filteredProductsByPrice = filterProductsByPrice(products, maxPrice);
            const filteredProductsBySearchTerm = filterProductsBySearchTerm(filteredProductsByPrice, search);
            const categoryList = categories ? categories.split(',') : []; // Convert comma-separated string to array
            const filteredProductsByCategories = filterProductsByCategories(filteredProductsBySearchTerm, categoryList)
            filteredData = filteredProductsByCategories;
            tempMemory.searchTerm = search;
            tempMemory.categories = categories;
            tempMemory.maxPrice = maxPrice;
            tempMemory.data = filteredData;

          } else {
            filteredData = tempMemory.data;
          }
      
      const sortedData = sortProducts(filteredData, sortedBy)
      
      // Apply pagination
      const totalPage = Math.ceil(sortedData.length / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedProducts = sortedData.slice(startIndex, endIndex);
  
      return {
        totalPage,
        paginatedProducts
      };
    } catch (error) {
      throw error;
    }
};

const getProductById = async (id) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    throw error;
  }
};

// Add more functions as needed, e.g., createProduct, updateProduct, deleteProduct, etc.

module.exports = {
  getAllProducts,
  getProductById,
  readData
  // Export other functions as needed
};
