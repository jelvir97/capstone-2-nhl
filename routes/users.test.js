"use strict";

const requests = require('supertest')

const app = require('../app.js')
const MockAuth = require('../middleware/MockAuth.js')


const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


const u1 = { googleID: 'u1',
    firstName: 'u1-first',
    lastName:  'u1-last',
    email: 'u1@test.com',
    isAdmin: true,
    nhlGames: [] 
} 

const u2 = { googleID: 'u2',
    firstName: 'u2-first',
    lastName:  'u2-last',
    email: 'u2@test.com',
    isAdmin: false,
    nhlGames : [] 
}

jest.mock('../middleware/MockAuth.js')

describe('GET /users', ()=>{

    test('should work with admin user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u1;
            next()
        })
        const res = await requests(app)
                        .get('/users')

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([
            { googleID: 'u1',
                firstName: 'u1-first',
                lastName:  'u1-last',
                email: 'u1@test.com',
                isAdmin: true,  
            },
            { googleID: 'u2',
                firstName: 'u2-first',
                lastName:  'u2-last',
                email: 'u2@test.com',
                isAdmin: false,
            }
        ])
    })

    test('should fail with non-admin user', async ()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u2;
            next()
        })

        const res = await requests(app).get('/users')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be admin', status: 401 } })
    })

    test('should fail with unauthenticated user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            next()
        })
        const res = await requests(app).get('/users')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be logged in', status: 401 } })
    })


})

describe('GET /users/id', ()=>{
    
    test('should work with admin user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u1;
            next()
        })
        const res = await requests(app)
                        .get('/users/u1')


        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(
            { googleID: 'u1',
                firstName: 'u1-first',
                lastName:  'u1-last',
                email: 'u1@test.com',
                isAdmin: true,
                nhlGames:[]  
            }
        )
    })

    test('should fail with non-admin user', async ()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u2;
            next()
        })

        const res = await requests(app).get('/users/u1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be admin', status: 401 } })
    })

    test('should fail with unauthenticated user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            next()
        })
        const res = await requests(app).get('/users/u1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be logged in', status: 401 } })
    })

    test('fails 404 not found', async()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u1;
            next()
        })
        const res = await requests(app)
                        .get('/users/u3')


        expect(res.statusCode).toBe(404)
    })
})

describe('DELETE /users/:id', ()=>{

    test('should work for admin', async()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u1;
            next()
        })

        await requests(app).delete('/users/u2')
        
        const res = await requests(app).get('/users/u2')

        expect(res.statusCode).toBe(404)
    })

    test('should fail with non-admin user', async ()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u2;
            next()
        })

        const res = await requests(app).delete('/users/u2')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be admin', status: 401 } })
    })

    test('should fail with unauthenticated user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            next()
        })
        const res = await requests(app).delete('/users/u2')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be logged in', status: 401 } })
    })
})

describe('POST /users/:gameType/:gameID', ()=>{
    test('should work with authenticated user', async()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u1;
            next()
        })

        const res = await requests(app).post('/users/track/nhl_games/game1')
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({msg: 'u1 tracking game1'})
    })

    test('should fail with BadRequest', async()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u1;
            next()
        })

        const res = await requests(app).post('/users/track/notagametype/game1')

        expect(res.statusCode).toBe(400)
        expect(res.body).toEqual({ error: { message: 'Must include gameType argument', status: 400  } })
    })

    test('should fail with unauthenticated user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            next()
        })
        const res = await requests(app).post('/users/track/nhl_games/game1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be logged in', status: 401 } })
    })
})


describe('DELETE /users/track/:gameType/:gameID', ()=>{

    test('should work with authenticated user', async()=>{
        MockAuth.mockImplementation((req,res,next)=>{
            req.session.user = u1;
            next()
        })
        await requests(app).post('/users/track/nhl_games/game1')

        const res = await requests(app).delete('/users/track/nhl_games/game1')
        expect(res.statusCode).toBe(200)

        const {body} = await requests(app).get('/users/u1')
    
        expect(body.nhlGames).toEqual([])
    })

    test('should fail with unauthenticated user', async ()=>{

        MockAuth.mockImplementation((req,res,next)=>{
            next()
        })
        const res = await requests(app).delete('/users/track/nhl_games/game1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toEqual({ error: { message: 'Must be logged in', status: 401 } })
    })
})