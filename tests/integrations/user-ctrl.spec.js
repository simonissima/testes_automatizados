const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const User = require('../../src/models/User')
const { getReqMock, getResMock, getResponses } = require('../mocks/session-mocks')
const { generateUserMock } = require('../mocks/users-mock')

const UserController = require('../../src/controllers/user-ctrl')
const UserService = require('../../src/services/user-service')

const userDataMock = generateUserMock()

describe('[Integration] User Controller create', () => {
    beforeAll(async () => {
        jest.setTimeout(60000);
        await mongoose.connect('mongodb+srv://letscode:letscode@cluster0.nwudzbw.mongodb.net/letscode?retryWrites=true&w=majority')
        await User.create(userDataMock)
    })

    afterAll(async () => {
        await User.deleteMany({})
        mongoose.connection.close()
    })

    it('Should return status 400 if email is not provided or invalid', async () => {
        const req = getReqMock({ name: 'letscode' })

        const res = getResMock()
        const { invalidEmail } = getResponses()   
       
        const response = await UserController.create(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidEmail)        
    })
    it('Should return status 400 if no password is provided', async () => {
        const req = getReqMock({ email: faker.internet.email() })

        const res = getResMock()
        const { invalidPassword } = getResponses()   

        const response = await UserController.create(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidPassword)        
    })
    
    it('Should return status 200 if user was created', async () => {
        const req = getReqMock(userDataMock)

        const res = getResMock()
        jest.spyOn(UserService, "create").mockReturnValue(userDataMock)

        const response = await UserController.create(req, res)
        const userResponseMock = {user:userDataMock}
        
        expect(response.status).toBe(200)
        expect(response.data).toMatchObject(userResponseMock)
    })
})