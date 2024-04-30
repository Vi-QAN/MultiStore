import axios from 'axios';

const BASE_URL = 'http://localhost:3000/products'; // Assuming your server is running on port 3000

export const getProducts = async (search = '', categories = [], maxPrice, sortedBy, page = 1, pageSize = 10) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                search: search,
                categories: categories.length > 0 ? categories.join(',') : '', 
                maxPrice: maxPrice,
                sortedBy: sortedBy,
                pageSize: pageSize,
                page: page
            }
        });
        return response.data; // Assuming your API returns products data
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};