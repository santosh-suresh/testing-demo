const request = require('supertest')
const server = require('./server')

describe("Server tests", () => {
    it("should return 200 when called", () => {
        return request(server)
            .get("/")
            .then((res) => {
                const contentType = res.headers['content-type']
                expect(res.status).toBe(200)
                expect(contentType).toEqual('application/json')
            })
    })

    it("should return 200 when hello is called", () => {
        return request(server)
            .get("/hello")
            .then((res) => {
                const { hello } = res.body
                const contentType = res.headers['content-type']
                expect(res.status).toBe(200)
                expect(contentType).toEqual('application/json')
                expect(hello).toBe("world")
            })
    })
    it("should return 404 when non existing route is called", () => {
        return request(server)
            .get("/not-there")
            .then((res) => {
                const contentType = res.headers['content-type']
                expect(res.status).toBe(404)
                expect(contentType).toEqual('application/json')
            })
    })

})