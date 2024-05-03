require('../models')

const request = require("supertest")
const app = require("../app")
const path = require("path");

const BASE_URL = '/api/v1/product_images'

let TOKEN

beforeAll(async () => {
    const user = {
        email: "yoneison@gmail.com",
        password: "yoneison1234"
    }

    const res = await request(app)
        .post('/api/v1/users/login')
        .send(user)

    TOKEN = res.body.token
})

test("POST -> 'BASE_URL', should return status code 201 and res.body.url to be defined and res.body.filename to be defined", async () => {
    const localImage = path.join(__dirname, '..', 'public', 'imagen.jpg')

    const res = await request(app)
        .post(BASE_URL)
        .attach('image', localImage)
        .set('Authorization', `Bearer ${TOKEN}`)

    productImageId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()

    expect(res.body.url).toBeDefined()
    expect(res.body.filename).toBeDefined()
})

test("GET ALL -> 'BASE_URL', should return statusCode 200 and body.length === 1", async () => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("DELETE -> 'BASE_URL/:id', should return statusCode 204", async () => {
    const res = await request(app)
        .delete(`${BASE_URL}/${productImageId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
})