const User = require('../../../src/models/User')
const { userExists } = require('../../../src/services/user-service')
const UserService = require('../../../src/services/user-service')

class UserMock {
    static async findOne({ email }) {
        const users = {
            'esdras@lets.com.br': {
                _id: "63815037f041b254122338c3",
                name: "Esdras Aguilar",
                email: "esdras@lets.com",
                password: "123456"
            }
        }
        
        if(users[email]) {
            return users[email]
        }

        return null
    }
    static async create({name,email,password}){
        return {
            "name": "nome",
            "email": "teste@teste.com",
            "password": "senha",
            "_id": "638e76e00034058f1c083a19",
            "__v": 0
          }
    };
    static async updateOne({email},{password}){
        return {
            "name": "nome",
            "email": "teste@teste.com",
            "password": "senha",
            "_id": "638e76e00034058f1c083a19",
            "__v": 0
          }
    }
}

describe('User Service "userExists"', () => {
    it('Should return true if user exists', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.findOne)
        
        const userExists = await UserService.userExists('esdras@lets.com.br')

        expect(userExists).toBe(true)
    })

    it('Should return false if user not found', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.findOne)
        
        const userExists = await UserService.userExists('esdras.nao.existente@lets.com.br')

        expect(userExists).toBe(false)
    })

    it('Should capture if User model throws', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(() => {
            throw new Error('User model fails')
        })
        
        try {
            await UserService.userExists('esdras.nao.existente@lets.com.br')
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
        }
    })
})

describe('User Service "checkPassword"', () => {
    it('Should returns false if password does not match', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.findOne)

        const isValidPassword = await UserService.checkPassword('esdras@lets.com.br', '123455')

        expect(isValidPassword).toBe(false)
    }) 

    it('Should returns false user not found', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.findOne)

        const isValidPassword = await UserService.checkPassword('invalid@lets.com.br', '123456')

        expect(isValidPassword).toBe(false)
    })

    it('Should returns true if password is valid', async () => {
        jest.spyOn(User, 'findOne').mockImplementationOnce(UserMock.findOne)

        const isValidPassword = await UserService.checkPassword('esdras@lets.com.br', '123456')

        expect(isValidPassword).toBe(true)
    })
})

describe('User Service "create"', () => {
    it('should create user if userExists is false', async () => {
        jest.spyOn(UserService,"userExists").mockImplementationOnce(()=>false)

        jest.spyOn(User, 'create').mockImplementationOnce(UserMock.create)
        
        const userCreated = await UserService.create({
            "name":"nome",
            "email":"teste@teste.com",
            "password":"senha"})

        expect(userCreated).toMatchObject({
            "name": "nome",
            "email": "teste@teste.com",
            "password": "senha",
            "_id": "638e76e00034058f1c083a19",
            "__v": 0
          })
    }),
    it("should throw error if user exists", async () => {
       jest.spyOn(UserService,"userExists").mockImplementationOnce(()=>true);

       try {
        await UserService.create({
            "name":"nome",
            "email":"teste@teste.com",
            "password":"senha"})

       } catch (error) {
           expect(error).toMatchObject({ status: 404, message: 'User Already exists' })
       }
       
    })
})


describe('UserService "updatePassword"', () => {
    it("should throw error if user doesn't exists", async () => {
       jest.spyOn(UserService,"userExists").mockImplementationOnce(()=>false);

       try {
        await UserService.updatePassword(
            "teste@teste.com",
            "senha",
            "senha")
       } catch (error) {
           expect(error).toMatchObject({ status: 404, message: 'User Not Found' })
       }
       
    }),
    it("should throw error if newPassword is different from confirmPassword", async () => {
        jest.spyOn(UserService,"userExists").mockImplementationOnce(()=>true);
 
        try {
         await UserService.updatePassword(
            "teste@teste.com",
            "novaSenha",
            "senha")
        } catch (error) {
            expect(error).toMatchObject({ status: 400, message: 'Password does not match' })
        }
        
     }),
     it('should update password if new newPassword = confirmPassword', async () => {
        jest.spyOn(UserService,"userExists").mockImplementationOnce(()=>true)

        jest.spyOn(User, 'updateOne').mockImplementationOnce(UserMock.updateOne)
        
        const userUpdated = await UserService.updatePassword(
            "teste@teste.com",
            "senha",
            "senha")

        expect(userUpdated).toMatchObject({
            "name": "nome",
            "email": "teste@teste.com",
            "password": "senha",
            "_id": "638e76e00034058f1c083a19",
            "__v": 0
          })
    })
})