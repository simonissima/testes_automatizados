const { faker } = require('@faker-js/faker')

exports.generateUserMock = () => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

exports.generateUserCreateMock = () => {
    return {
        "name": "nome",
        "email": "teste@teste.com",
        "password": "senha",
        "_id": "638e76e00034058f1c083a19",
        "__v": 0
      }
}