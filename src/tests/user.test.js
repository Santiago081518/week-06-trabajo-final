const request = require("supertest")
const app = require("../app")

const BASE_URL = '/api/v1/users'

let TOKEN
let userId

beforeAll(async () => {
    const user = {
        email: "yoneison@gmail.com",
        password: "yoneison1234"
    }

    const res = await request(app)
        .post(`${BASE_URL}/login`)
        .send(user)

    TOKEN = res.body.token
})

test("GET -> 'BASE_URL', should return statusCode 200 and body.length === 1", async () => {
    const res = await request(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("POST 'BASE_URL', should return status code 201 and res.body.firstName === user.firstName", async () => {
    const user = {
        firstName: "Maicol",
        lastName: "Salazar",
        email: "maicol@gmail.com",
        password: "maicol1234",
        phone: "12345"
    }
    const res = await request(app)
        .post(BASE_URL)
        .send(user)

    console.log(res.body.id)
    userId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(user.firstName)
})