
describe("do nothing", () => {
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    before(function () {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
        cy.loginToPublisher(publisher, password);
    })

    it.only("Add Authorization Header for the api", () => {
        cy.createAPIByRestAPIDesign();
        cy.get('[data-testid="left-menu-itemsubscriptions"]').click();
        cy.get('[data-testid="policy-checkbox-unlimited"]').click();
        cy.get('[data-testid="policy-checkbox-silver"]').click();
        cy.get('[data-testid="subscriptions-save-btn"]').click();

        // Going to lifecycle page
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();

        // Publishing
        cy.get('button[data-testid="Publish"]').click();
        cy.get('button[data-testid="Redeploy"]').should('exist');
        // Even though this step is redundant we need to do this. The component is behaving
        // It removes the buttons after some time of initial rendering.
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();


        // Redeploy
        cy.get('button[data-testid="Redeploy"]').then(() => {
            cy.get('button[data-testid="Redeploy"]').click();
        });
        cy.get('button[data-testid="Demote to Created"]').should('exist');
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();


        // Demote to created
        cy.get('button[data-testid="Demote to Created"]').click();
        cy.get('button[data-testid="Publish"]').then(() => {
            cy.get('button[data-testid="Publish"]').click();
        });
        cy.get('button[data-testid="Demote to Created"]').should('exist');
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();

        // Block
        cy.get('button[data-testid="Block"]').then(() => {
            cy.get('button[data-testid="Block"]').click();
        });
        cy.get('button[data-testid="Re-Publish"]').should('exist');
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();

        // Re-Publish
        cy.get('button[data-testid="Re-Publish"]').then(() => {
            cy.get('button[data-testid="Re-Publish"]').click();
        });
        cy.get('button[data-testid="Deprecate"]').should('exist');
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();

        // Deprecate
        cy.get('button[data-testid="Deprecate"]').then(() => {
            cy.get('button[data-testid="Deprecate"]').click();
        });
        cy.get('button[data-testid="Retire"]').should('exist');
        cy.get('[data-testid="left-menu-itemlifecycle"]').click();


        cy.get('button[data-testid="Retire"]').then(() => {
            cy.get('button[data-testid="Retire"]').click();
        });
    });

    after(function () {
        // Test is done. Now delete the api
        cy.get(`[data-testid="itest-id-deleteapi-icon-button"]`).click();
        cy.get(`[data-testid="itest-id-deleteconf"]`).click();

        cy.visit('carbon/user/user-mgt.jsp');
        cy.deleteUser(publisher);
    })
});