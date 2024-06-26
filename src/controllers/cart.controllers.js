const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Product = require('../models/Product');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async (req, res) => {
    const userId = req.user.id;
    const results = await Cart.findAll({ where: { userId }, include: [User, Product] });
    return res.json(results);
});

const create = catchError(async (req, res) => {
    const userId = req.user.id;
    req.body.userId = userId;
    const result = await Cart.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await Cart.findOne({ where: { id, userId }, include: [User, Product] });

    if (!result) return res.sendStatus(404);

    return res.json(result);
});

const remove = catchError(async (req, res) => {
    const userId = req.user.id;
    const result = await Cart.destroy({ where: { userId } });

    if (!result) return res.sendStatus(404);

    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;

    delete req.body.userId
    delete req.body.productId

    const result = await Cart.update(
        req.body,
        { where: { id }, returning: true }
    );
    if (result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}