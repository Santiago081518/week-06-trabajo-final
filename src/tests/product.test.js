require('../models')

const request = require("supertest")
const app = require("../app")
const Category = require("../models/Category")


const BASE_URL = '/api/v1/products'

let TOKEN
let productId
let product
let category

beforeAll(async () => {
    const user = {
        email: "yoneison@gmail.com",
        password: "yoneison1234"
    }

    category = await Category.create({
        name: "Ropa"
    })

    const res = await request(app)
        .post('/api/v1/users/login')
        .send(user)

    TOKEN = res.body.token
})

test("POST -> 'BASE_URL', should return status code 201 and res.body.price === product.price", async () => {
    product = {
        title: "Chaqueta acolchada",
        description: "Chaqueta para los dias frios",
        price: "320.000",
        categoryId: category.id
    }
    const res = await request(app)
        .post(BASE_URL)
        .send(product)
        .set('Authorization', `Bearer ${TOKEN}`)

    productId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.price).toBe(product.price)
})

test("GET ALL -> 'BASE_URL', should return statusCode 200 and body.length === 1", async () => {
    const res = await request(app)
        .get(BASE_URL)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET ONE -> 'BASE_URL', should return statusCode 200 and res.body.title === product.title", async () => {
    const res = await request(app)
        .get(`${BASE_URL}/${productId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
})

test("PUT -> 'BASE_URL/:id', should status code 200, res.body.price === bodyUpdate.price", async () => {

    const bodyUpdate = {
        price: "200.000"
    }

    const res = await request(app)
        .put(`${BASE_URL}/${productId}`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(bodyUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.price).toBe(bodyUpdate.price)
})

test("DELETE -> 'BASE_URL/:id', should return statusCode 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${productId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)

    await category.destroy()
})