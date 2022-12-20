import '@patternfly/patternfly/patternfly.scss';

import { mount } from 'cypress/react';

import '@cypress/code-coverage/support';

Cypress.Commands.add('mount', mount);
