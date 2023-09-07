Cypress.Commands.add(
    'mockWindowChrome',
    ({ userPermissions } = { userPermissions: ['*:*:*'] }) => {
        cy.window().then(
        // one of the fec dependencies talks to window.insights.chrome
            (window) => {
                window.chrome = {
                    getApp: () => 'patch'
                };
                window.insights = {
                    chrome: {
                        getUserPermissions: () => userPermissions,
                        auth: {
                            getUser: () => {
                                return Promise.resolve({});
                            }
                        },
                        getApp: () => 'patch'
                    }
                };
            }
        );
    }
);

Cypress.Commands.add(
    'shouldHaveAriaDisabled',
    { prevSubject: true },
    (subject) => cy.wrap(subject).should('have.attr', 'aria-disabled', 'true')
);

Cypress.Commands.add(
    'shouldHaveAriaEnabled',
    { prevSubject: true },
    (subject) => cy.wrap(subject).should('have.attr', 'aria-disabled', 'false')
);
