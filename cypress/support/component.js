import '@patternfly/patternfly/patternfly.scss';

import { mount } from 'cypress/react18';

import '@cypress/code-coverage/support';

Cypress.Commands.add('mount', mount);
