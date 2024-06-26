const catchError = require('../utils/catchError');
const Purchase = require('../models/Purchase');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');

const getAll = catchError(async (req, res) => {
    const userId = req.user.id;
    const results = await Purchase.findAll({
        where: { userId },
        include: [
            {
                model: Product,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [{
                    model: Category,
                    attributes: ['name']
                }]
            }
        ]
    });
    return res.json(results);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findAll({
        where: { userId },
        raw: true,
        attributes: ['quantity', 'userId', 'productId']
    });

    if (!cart || cart.length === 0) {
        return res.status(404).json({ message: "El carrito está vacío" });
    }

    const purchaseItems = await Purchase.bulkCreate(cart);
    if (!purchaseItems) res.sendStatus(404)

    await Cart.destroy({ where: { userId } });

    return res.status(201).json(purchaseItems);
});

module.exports = {
    getAll,
    create
}