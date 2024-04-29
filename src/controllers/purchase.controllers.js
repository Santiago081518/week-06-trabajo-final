const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');

const getAll = catchError(async (req, res) => {
    const results = await Purchase.findAll();
    return res.json(results);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id;

    // Paso 1:
    const cartItems = await Cart.findAll({ where: { userId } });

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Paso 2:
    const purchaseItems = await Purchase.bulkCreate(cartItems.map(item => ({
        productId: item.productId,
        userId: item.userId,
        quantity: item.quantity
    })));

    // Paso 3:
    await Cart.destroy({ where: { userId } });

    return res.status(201).json(purchaseItems);
});

module.exports = {
    getAll,
    create
}