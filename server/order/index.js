// productService/routes.js
const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { addOrder, getAllOrders, getOrderByOrderNumber, updateOrderStatus } = require('./orderController');

const router = express.Router();


router.get('/', verifyToken, async (req, res) => {
    const { pageSize, page, filters } = req.query;
    const userId = req.user.userId;
    
    const result = await getAllOrders(userId, parseInt(pageSize), parseInt(page), filters);

    if (result.status === 200){
        res.json(result.result);
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { products, totalPrice } = req.body;
    const userId = req.user.userId;

    const result = await addOrder(userId, products, parseFloat(totalPrice));
    if (result.status === 200){
        res.status(200).json(result);
    }
});

router.get('/:ordernumber', verifyToken, async (req, res) => {
    const orderNumber = req.params.ordernumber;
    const userId = req.user.userId;
    
    const result = await getOrderByOrderNumber(userId, orderNumber);
    if (result.status === 201){
        res.json(result.result);
    }
})

router.put('/:orderid', verifyToken, async (req,res) => {
    const orderId = req.params.orderid;
    const userId = req.user.userId;
    const { status } = req.body;

    
    const result = await updateOrderStatus(userId, orderId, status);
    if (result.status === 200){
        res.status(200).json(result.result);
    }
});



module.exports = router;