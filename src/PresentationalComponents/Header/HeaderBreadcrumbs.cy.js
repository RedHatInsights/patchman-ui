import React from 'react';
import { mount } from 'cypress/react';

import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import { MemoryRouter } from 'react-router-dom';

describe('HeaderBreadcrumbs', () => {
    it('renders two breadcrumbs', () => {
        mount(
            <HeaderBreadcrumbs
                items={[
                    {
                        title: 'foobar',
                        isActive: false
                    },
                    {
                        title: 'foobar last',
                        isActive: true
                    }
                ]}
            />
        );
        cy.get('.pf-v6-c-breadcrumb__list').children().should('have.length', 2);
    });

    it('renders one breadcrumb with link', () => {
        mount(
            // Router wrapper is needed since one of the child components render Route
            <MemoryRouter>
                <HeaderBreadcrumbs
                    items={[
                        {
                            title: 'foobar',
                            isActive: false,
                            to: 'test'
                        },
                        {
                            title: 'foobar last',
                            isActive: true
                        }
                    ]}
                />
            </MemoryRouter>
        );
        cy.get('.pf-v6-c-breadcrumb__list').children().should('have.length', 2);
        cy.get('.pf-v6-c-breadcrumb__list')
        .children()
        .eq(0)
        .find('a')
        .should('have.attr', 'href', '/test');
    });
});
