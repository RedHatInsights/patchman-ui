/*global module, process*/

// This is a sample configuration for running the starter app locally.

// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const localhost = process.env.PLATFORM === 'linux' ? 'localhost' : 'host.docker.internal';

module.exports = {
    routes: {
        '/beta/insights/patch': { host: `https://${localhost}:8002` },
        '/insights/patch': { host: `https://${localhost}:8002` },
        '/apps/patch': { host: `https://${localhost}:8002` },
        '/beta/apps/patch': { host: `https://${localhost}:8002` },
        '/insights/inventory': { host: `http://${localhost}:8003` },
        '/apps/inventory': { host: `http://${localhost}:8003` },
        '/apps/dashboard': { host: `http://${localhost}:8002` }
    }
};
