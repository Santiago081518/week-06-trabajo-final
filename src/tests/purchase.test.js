require('../models')

const request = require("supertest");
const app = require("../app");
const Product = require('../models/Product');

const BASE_URL = '/api/v1/purchase';

let TOKEN;
let userId;
let product;
let productBody;

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
        quantity: 1,
        productId: product.id
    }

    await request(app)
        .post('/api/v1/cart')
        .send(cartBody)
        .set('Authorization', `Bearer ${TOKEN}`)
});

test("POST -> '/api/v1/purchase', should return status code 201 and purchased quantity", async () => {
    const res = await request(app)
        .post(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`);

    expect(res.status).toBe(201);
    expect(res.body[0].quantity).toBe(cartBody.quantity);
});

test("GET ALL -> '/api/v1/purchase', should return statusCode 200 and body with purchases", async () => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body).toHaveLength(1);

    expect(res.body[0].userId).toBeDefined();
    expect(res.body[0].userId).toBe(userId);

    expect(res.body[0].product).toBeDefined();
    expect(res.body[0].product.id).toBe(product.id);
});