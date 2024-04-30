const User = require('../authentication/userModel');

setInterval(async () => {
  const users = await User.find();
  if (users.length === 0) return;
  for (let user of users){
    for (let order of user.orderList){
      if (order.status === "Pending"){
        order.status = "Delivered";
        order.deliveredAt = new Date();
      }
    }
    await user.save();
  }
}, 180000);

const addOrder = async (userId, products, total) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        const orderNumber = Math.floor(100000 + Math.random() * 900000);

        // Add the new order to the user's orderList
        user.orderList.push({ orderNumber, total, products});
        await user.save();

        return { status: 200, orderNumber, message: 'Order added successfully' };
    } catch (err) {
        return { status: 500, message: err.message };
    }
};

const filterOrdersByDate = (orders, date) => {
  if (date.length === 0) return;
  const filteredOrders = orders.filter(order => new Date(order.createdAt) >= new Date(date));
  return filteredOrders;
}

const filterOrdersByPrice = (orders, price) => {
  if (price === 1) return orders;
  const filteredOrders = orders.filter(order => parseFloat(order.total) >= price);
  return filteredOrders;
}

// Controller to get all orders
const getAllOrders = async (userId, pageSize = 10, page = 1, filters ) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        const filteredByPriceOrders = filterOrdersByPrice(user.orderList, parseFloat(filters.totalPrice));
        let filteredByDateOrders = filteredByPriceOrders;
        if (filters.date){
          filteredByDateOrders = filterOrdersByDate(filteredByPriceOrders, filters.date);
        }
        const orders = filteredByDateOrders.sort((firstOrder, secondOrder) => new Date(secondOrder.createdAt) - new Date(firstOrder.createdAt));

        // Apply pagination
        const totalPage = Math.ceil(orders.length / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedOrders = orders.slice(startIndex, endIndex);
    
        return {status: 200, 
        result: {
            totalPage,
            paginatedOrders
        }};
    } catch (err) {
        return { status: 500, message: err.message };
    }
};

// Controller to get a specific order by ID
const getOrderByOrderNumber = async (userId, orderNumber) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
        return { status: 404, message: 'User not found' };
    }
    const order = user.orderList.find(order => order.orderNumber === orderNumber);
    if (!order) {
      return { status: 404, message: 'Order not found' };
    }

    return { status: 200, order};
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

// Controller to update the status of an order
const updateOrderStatus = async (userId, orderId, newStatus) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
        return { status: 404, message: 'User not found' };
    }
    const order = user.orderList.find(order => order.id === orderId);
    if (!order) {
      return { status: 404, message: 'Order not found' };
    }
    order.status = newStatus;
    if (newStatus === 'Cancelled'){
      order.cancelledAt = new Date();
    } else {
      order.deliveredAt = new Date();
    }
    await user.save();
    return { status: 200, result: order};

  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = {
    addOrder,
    getAllOrders,
    getOrderByOrderNumber,
    updateOrderStatus,
};



