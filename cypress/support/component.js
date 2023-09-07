import '@patternfly/patternfly/patternfly.scss';

import { mount } from 'cypress/react18';

import '@cypress/code-coverage/support';
import './commands';

Cypress.Commands.add('mount', mount);
