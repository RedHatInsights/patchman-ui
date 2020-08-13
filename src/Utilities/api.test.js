import {
    createApiCall,
    exportAdvisoriesCSV,
    exportAdvisoriesJSON,
    exportSystemsCSV,
    exportSystemsJSON
} from './api';

/* eslint-disable */
window.insights = { chrome : { auth: { getUser : jest.fn(() => Promise.resolve({})) } } };

describe('api', () => {
    describe('test createApiCall function: ', () =>{
        it('Should "get" method in  createApiCall return response as json', () => {
            global.fetch = jest.fn(() => Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                })
            );
            const response = createApiCall('testEndpoint', 'get', { testParam: 1 }, { data: 'testData' });
            response.then((res) => expect(res.success).toBeTruthy()).catch((err) => console.log(err));
        });
    
        it('Should "get" method in  createApiCall return error from backend', () => {
            global.fetch = jest.fn(() => Promise.resolve({
                    ok: false,
                    status: 400,
                    statusText: 'testStatusText',
                    headers: { get: (type) => []}
                })
            );
            const response = createApiCall('testEndpoint', 'get', { testParam: 1 }, { data: 'testData' });
            response.then((res) => console.log(res)).catch((err) => expect(res).toEqual({
                title: 'There was an error getting data',
                detail: 'testStatusTextsssss',
                status: 400
            }));
        });
    
        it('Should "get" method in  createApiCall return network error', () => {
            global.fetch = jest.fn(() => Promise.resolve({
                    ok: false,
                    status: 400,
                    statusText: 'testStatusText',
                    headers: { get: (type) => ['json']}
                })
            );
            const response = createApiCall('testEndpoint', 'get', { testParam: 1 }, { data: 'testData' });
            response.then((res) => expect(res).toEqual({
                title: 'There was an error getting data',
                detail: 'testStatusTextsssss',
                status: 400
            })).catch(err => {});
        });
    });
    
    describe('test export api call functions', () => {

        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

        it('Should export advisory cvs', () => {
            const result = exportAdvisoriesCSV('testParams');
            expect(result).toBeTruthy();
            expect(global.Headers).toHaveBeenCalledWith({ accept: 'text/csv' });    
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v1/export/advisories?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s', 
                { credentials: 'include', headers: {}, method: 'get' }
            );   
            
            global.fetch.mockClear();
        });

        it('Should export advisory json', () => {
            const result = exportAdvisoriesJSON('testParams');
            expect(result).toBeTruthy(); 
            expect(global.Headers).toHaveBeenCalledWith({ accept: 'application/json' });
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v1/export/advisories?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s',
                { credentials: 'include', headers: {}, method: 'get' }
            );
            global.fetch.mockClear();         
        });

        it('Should export system cves', () => {
            const result = exportSystemsCSV('testParams');
            expect(result).toBeTruthy(); 
            expect(global.Headers).toHaveBeenCalledWith({ accept: 'text/csv' }); 
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v1/export/systems?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s',
                { credentials: 'include', headers: {}, method: 'get' }
            );
            global.fetch.mockClear();         
        });

        it('Should export system json', () => {
            const result = exportSystemsJSON('testParams');
            expect(result).toBeTruthy(); 
            expect(global.Headers).toHaveBeenCalledWith({ accept: 'application/json' }); 
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v1/export/systems?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s',
                { credentials: 'include', headers: {}, method: 'get' }
            );
            global.fetch.mockClear();         
        });
    })

});
/* eslint-enable */
