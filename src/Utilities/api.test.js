import {
    createApiCall,
    exportAdvisoriesCSV,
    exportAdvisoriesJSON,
    exportSystemsCSV,
    exportSystemsJSON
} from './api';
import { initMocks } from '../Utilities/unitTestingUtilities';

initMocks();

describe('api', () => {
    describe('test createApiCall function: ', () => {
        it('Should "get" method in  createApiCall return error from backend', () => {
            global.fetch = jest.fn(() => Promise.resolve({
                ok: false,
                status: 400,
                statusText: 'testStatusText',
                headers: { get: () => [] }
            })
            );
            const response = createApiCall('testEndpoint', 'v2', 'get', { testParam: 1 }, { data: 'testData' });
            response.catch((err) => {
                expect(err).toEqual({
                    title: 'There was an error getting data',
                    detail: 'testStatusTextsssss',
                    status: 400
                });
            });
        });

        it('Should "get" method in  createApiCall return network error', () => {
            global.fetch = jest.fn(() => Promise.resolve({
                ok: false,
                status: 400,
                statusText: 'testStatusText',
                headers: { get: () => ['json'] }
            })
            );
            const response = createApiCall('testEndpoint', 'v2', 'get', { testParam: 1 }, { data: 'testData' });
            response.catch((res) => expect(res).toEqual({
                title: 'There was an error getting data',
                detail: 'testStatusTextsssss',
                status: 400
            }));
        });
    });

    describe('test export api call functions', () => {

        global.Headers = jest.fn();
        global.fetch = jest.fn(() => Promise.resolve({ success: true }).catch((err) => console.log(err)));

        it('Should export advisory cvs', () => {
            const result = exportAdvisoriesCSV('testParams');
            expect(result).toBeTruthy();
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v3/export/advisories?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s',
                { credentials: 'include', headers: { accept: 'text/csv' }, method: 'get' }
            );

            global.fetch.mockClear();
        });

        it('Should export advisory json', () => {
            const result = exportAdvisoriesJSON('testParams');
            expect(result).toBeTruthy();
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v3/export/advisories?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s',
                { credentials: 'include', headers: { accept: 'application/json' }, method: 'get' }
            );
            global.fetch.mockClear();
        });

        it('Should export system cves', () => {
            const result = exportSystemsCSV('testParams');
            expect(result).toBeTruthy();
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v3/export/systems?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s',
                { credentials: 'include', headers: { accept: 'text/csv' }, method: 'get' }
            );
            global.fetch.mockClear();
        });

        it('Should export system json', () => {
            const result = exportSystemsJSON('testParams');
            expect(result).toBeTruthy();
            expect(global.fetch).toHaveBeenCalledWith(
                '/api/patch/v3/export/systems?0=t&1=e&2=s&3=t&4=P&5=a&6=r&7=a&8=m&9=s',
                { credentials: 'include', headers: { accept: 'application/json' }, method: 'get' }
            );
            global.fetch.mockClear();
        });
    });

});
