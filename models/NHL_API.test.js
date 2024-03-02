
const axios = require('axios')
const NHL_API = require("./NHL_API")

const { BadRequestError } = require("../expressError");

jest.mock('axios')



describe('getSchedule', ()=>{
    axios.get.mockImplementation((url)=> ({data: url}))
    test('works: calls axios.get()', async()=>{   
        const res = await NHL_API.getSchedule()

        expect(res).toEqual("https://api-web.nhle.com/v1/schedule/now")
    })

    test('works: with correct date format', async()=>{
        const res = await NHL_API.getSchedule('YYYY-MM-DD')

        expect(res).toEqual("https://api-web.nhle.com/v1/schedule/YYYY-MM-DD")
    })
})

describe('getTeamsList', ()=>{
    
    test('works: calls axios.get()', async()=>{
        axios.get.mockImplementation((url)=> ({data: {data: url}}))
        const res = await NHL_API.getTeamsList()
        expect(res).toEqual('rest/en/team')
    })
})

describe('getStandings', ()=>{
    test('works', async ()=>{
        axios.get.mockImplementation(()=> ( {data: { standings : [] } } ) )
        const res = await NHL_API.getStandings()
        expect(res).toEqual({
            'Western': {
                'Pacific':[],
                'Central': [],
            },
            'Eastern':{
                'Atlantic':[],
                'Metropolitan':[]
            }
        })
    })
})

describe('getTeamStats', ()=>{
    

    test('works', async()=>{
        axios.get.mockImplementation((url)=> ({data: url}))
        const res = await NHL_API.getTeamStats('TOR')
        expect(res).toEqual('https://api-web.nhle.com/v1/club-stats/TOR/now')
    })

    test('fails: badRequest error', async()=>{
        expect.assertions(1)
        try{
            const res = await NHL_API.getTeamStats()
        }catch(err){
            expect(err instanceof BadRequestError).toBeTruthy()
        }
        
        
    })
})

describe('getTeamSchedule', ()=>{

    test('works', async ()=>{
        axios.get.mockImplementation((url)=> ({data: url}))
        const res = await NHL_API.getTeamSchedule('TOR')
        expect(res).toEqual('https://api-web.nhle.com/v1/club-schedule/TOR/week/now')
    })

    test('fails: BadRequestError', async ()=>{
        expect.assertions(1)
        try{
            const res = await NHL_API.getTeamSchedule()
        }catch(err){
            expect(err instanceof BadRequestError).toBeTruthy()
        }
        
    })
})



describe('getTeamRoster', ()=>{

    test('works', async ()=>{
        axios.get.mockImplementation((url)=> ({data: url}))
        const res = await NHL_API.getTeamRoster('TOR')
        expect(res).toEqual('https://api-web.nhle.com/v1/roster/TOR/current')
    })

    test('fails: BadRequestError', async ()=>{
        expect.assertions(1)
        try{
            const res = await NHL_API.getTeamRoster()
        }catch(err){
            expect(err instanceof BadRequestError).toBeTruthy()
        }
        
    })
})

describe('getPlayByPlay', ()=>{
    test('works', async ()=>{
        axios.get.mockImplementation((url)=> ({data: url}))
        const res = await NHL_API.getPlayByPlay('gameID')
        expect(res).toEqual('https://api-web.nhle.com/v1/gamecenter/gameID/play-by-play')
    })

    test('fails: BadRequestError', async ()=>{
        expect.assertions(1)
        try{
            const res = await NHL_API.getPlayByPlay()
        }catch(err){
            expect(err instanceof BadRequestError).toBeTruthy()
        }
        
    })
})

describe('getSpotlight', ()=>{
    test('works', async ()=>{
        axios.get.mockImplementation((url)=> ({data: url}))
        const res = await NHL_API.getSpotlight('gameID')
        expect(res).toEqual('https://api-web.nhle.com/v1/player-spotlight')
    })

})