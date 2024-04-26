const User = require('./User')
const category = require('./Category')
const Product = require('./Product')
const Category = require('./Category')
const Cart = require('./Cart')

// Products -> categoryId
Product.belongsTo(Category)
Category.hasMany(Product)

// Cart -> userId
Cart.belongsTo(User)
User.hasMany(Cart)

// Cart -> productId
Product.hasMany(Cart)
Cart.belongsTo(Product)