const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        required: true,
        unique: true
    },
    total: {
        type: Number,
    },
    products: [
        {
            productId: {
                type: Number,
                required: true
            },
            productName: {
                type: String,
            },
            quantity: {
                type: Number,
                required: true
            },
            imageUrl: {
                type: String,
            }
        }
    ],
    status: {
        type: String,
        enum: ['Pending', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date
    },
    cancelledAt: {
        type: Date
    }
    
});

//const Order = mongoose.model('Order', orderSchema);

module.exports = orderSchema;
