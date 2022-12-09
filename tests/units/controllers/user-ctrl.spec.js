const UserController = require('../../../src/controllers/user-ctrl')
const UserService = require('../../../src/services/user-service')
const { getReqMock, getResMock, getResponses } = require('../../mocks/session-mocks')

class UserServiceMock {
    static async userExists(user) {        
        if(user === 'letscode') {
            return true
        } else {
            return false
        }
    }

    static async checkPassword(user, password) {
        return password === '123456'
    }
}

describe('User Controller create', () => {
    it('Should return status 200 if user is provided', async () => {
        const req = getReqMock({
            "name": "letscode",
            "email": "letscode@letscode.com.br",
            "password": "123456"
          })

        const res = getResMock()
        const { invalidName } = getResponses()   

        jest.spyOn(UserService, 'create').mockImplementationOnce(() => {
            return {
                "name": "letscode",
                "email": "letscode@letscode.com.br",
                "password": "123456",
                "_id": "638e7d723af54a8824c5a77d",
                "__v": 0
              }
        })
        const response = await UserController.create(req, res)

        expect(response.status).toBe(200)
        expect(response.data).toMatchObject({
            "user": {
                "name": "letscode",
                "email": "letscode@letscode.com.br",
                "password": "123456",
                "_id": "638e7d723af54a8824c5a77d",
                "__v": 0
              }
        })        
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
        const req = getReqMock({ email: 'letscode@letscode.com.br' })

        const res = getResMock()
        const { invalidPassword } = getResponses()   

        const response = await UserController.create(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidPassword)        
    })
})

describe('User Controller changePassword', () => {

    it('Should return status 400 if email is not provided', async () => {
        const req = getReqMock({
            "email": "",
            "oldPassword": "123456",
            "newPassword": "123457",
            "confirmPassword":"123457"
        })

        const res = getResMock()
        const { invalidEmail } = getResponses()   

        const response = await UserController.changePassword(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidEmail)       
    })
    
    //erro comum em E2E, funciona de 3 em 3 vezes
    /*[E2E] Session Create › Should return 200 for valid credentials

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 401*/
    
    it("should return status 400 if email is invalid", async () => {
        const req = getReqMock({
            "email": "email.com",
            "oldPassword": "123456",
            "newPassword": "123457",
            "confirmPassword":"123457"
        })

        const res = getResMock()
        const { invalidEmail } = getResponses()   

        const response = await UserController.changePassword(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidEmail)       
    })
    
    it("should return status 400 if all passwords are not provided",async () =>{
        const req = getReqMock({
            "email": "email@email.com",
            "oldPassword": "",
            "newPassword": "",
            "confirmPassword":""
        })

        const res = getResMock()
        const { invalidPassword } = getResponses()   

        const response = await UserController.changePassword(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidPassword)     
    })
   
    it("should return status 400 if oldPassword is not provided",async () =>{
        const req = getReqMock({
            "email": "email@email.com",
            "oldPassword": "",
            "newPassword": "1245",
            "confirmPassword":"1245"
        })

        const res = getResMock()
        const { invalidPassword } = getResponses()   

        const response = await UserController.changePassword(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidPassword)     
    })
     
    it("should return status 400 if newPassword is not provided",async () =>{
        const req = getReqMock({
            "email": "email@email.com",
            "oldPassword": "1247",
            "newPassword": "",
            "confirmPassword":"1245"
        })
        
        const res = getResMock()
        const { invalidPassword } = getResponses()   

        const response = await UserController.changePassword(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidPassword)     
    })
    
    it("should return status 400 if confirmPassword is not provided",async () =>{
        const req = getReqMock({
            "email": "email@email.com",
            "oldPassword": "1247",
            "newPassword": "1245",
            "confirmPassword":""
        })

        const res = getResMock()
        const { invalidPassword } = getResponses()   

        const response = await UserController.changePassword(req, res)

        expect(response.status).toBe(400)
        expect(response.data).toMatchObject(invalidPassword)     
    })
    
    it("should return 401 if oldPassword is wrong", async () =>{
        const req = getReqMock({
            "email": "email@email.com",
            "oldPassword": "1247",
            "newPassword": "1245",
            "confirmPassword":"1245"
        })

        const res = getResMock()
        const { invalidCredentials } = getResponses()   
        
        jest.spyOn(UserService,"checkPassword").mockImplementationOnce(()=>false)
        
        const response = await UserController.changePassword(req, res)

        expect(response.status).toBe(401)
        expect(response.data).toMatchObject(invalidCredentials)

    })
    it("should return 200 if the password was updated", async () =>{
        const req = getReqMock({
            "email": "email@email.com",
            "oldPassword": "1247",
            "newPassword": "1245",
            "confirmPassword":"1245"
        })

        const res = getResMock()
        
        jest.spyOn(UserService, "checkPassword").mockImplementationOnce(()=> true)
        
        jest.spyOn(UserService, "updatePassword").mockImplementationOnce(()=> {
            return {
                "name": "nome",
                "email": "email@email.com",
                "password": "1245",
                "_id": "638e76e00034058f1c083a19",
                "__v": 0
            }
        })

        const response = await UserController.changePassword(req, res)
        
        expect(response.status).toBe(200)
        expect(response.data).toMatchObject({"message": "ok"})

    })
})