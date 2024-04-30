import axios from 'axios';

const BASE_URL = 'http://localhost:3000/orders'; // Assuming your server is running on port 3000


export const getOrders = async (filters, page = 1, pageSize = 10, token) => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                pageSize: pageSize,
                page: page,
                filters: filters
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            }
        });
        return response.data; // Assuming your API returns products data
    } catch (error) {
        console.error('Error fetching products:', error);
        return 'error';
    }
};

export const addOrder = async (orderData, token) => {
    try {
        const response = await axios.post(`${BASE_URL}`, orderData, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding order:', error);
        return 'error';
    }
};

export const getOrder = async (orderNumber, token) => {
    try {

        const response = await axios.get(`${BASE_URL}/${orderNumber}`, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting order:', error);
        return 'error';
    }
}

// Function to update an order
export const updateOrder = async (orderId, status, token) => {
    try {
        const response = await axios.put(`${BASE_URL}/${orderId}`, { status }, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        return 'error';
    }
  };