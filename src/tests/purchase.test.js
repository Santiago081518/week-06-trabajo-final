require('../models')

const request = require("supertest");
const app = require("../app");
const Product = require('../models/Product');
const Cart = require('../models/Cart');

const BASE_URL = '/api/v1/purchase';

let TOKEN;
let userId;
let product;
let productBody;
let cart;
let cartBody;

beforeAll(async () => {
    const user = {
        email: "yoneison@gmail.com",
        password: "yoneison1234"
    };

    const res = await request(app)
        .post('/api/v1/users/login')
        .send(user);

    TOKEN = res.body.token;
    userId = res.body.user.id

    productBody = {
        title: "Producto de prueba",
        description: "Descripción del producto de prueba",
        price: 10.0,
    };

    product = await Product.create(productBody);

    cartBody = {
        quantity: 2,
        productId: product.id
    };

    cart = await Cart.create(cartBody);
});

test("POST -> '/api/v1/purchase', should return status code 201 and purchased quantity", async () => {
    const res = await request(app)
        .post(BASE_URL)
        .send(cart, 'userId')
        .set('Authorization', `Bearer ${TOKEN}`);

    expect(res.status).toBe(201);
    expect(res.body).toBeDefined();
});

test("GET ALL -> '/api/v1/purchase', should return statusCode 200 and body with purchases", async () => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);
});