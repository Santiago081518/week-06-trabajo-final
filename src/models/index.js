const User = require('./User')
const category = require('./Category')
const Product = require('./Product')
const Category = require('./Category')
const Cart = require('./Cart')
const Purchase = require('./Purchase')
const ProductImg = require('./ProductImg')

// Products -> categoryId
Product.belongsTo(Category)
Category.hasMany(Product)

// Cart -> userId
Cart.belongsTo(User)
User.hasMany(Cart)

// Cart -> productId
Product.hasMany(Cart)
Cart.belongsTo(Product)

// Purchase -> userId
Purchase.belongsTo(User)
User.hasMany(Purchase)

// Purchase -> productId
Product.hasMany(Purchase)
Purchase.belongsTo(Product)

// ProductImg -> productId
ProductImg.belongsTo(Product)
Product.hasMany(ProductImg)