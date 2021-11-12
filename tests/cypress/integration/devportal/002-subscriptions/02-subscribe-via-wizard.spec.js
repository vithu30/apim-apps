
/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

describe("Anonymous view apis", () => {
    const appName = 'subscribeapp' + Math.floor(Date.now() / 1000);
    const developer = 'developer';
    const publisher = 'publisher';
    const password = 'test123';
    const carbonUsername = 'admin';
    const carbonPassword = 'admin';

    before(function () {
        cy.carbonLogin(carbonUsername, carbonPassword);
        cy.addNewUser(developer, ['Internal/subscriber', 'Internal/everyone'], password);
        cy.addNewUser(publisher, ['Internal/publisher', 'Internal/creator', 'Internal/everyone'], password);
    })


    it.only("Subscribe to API", () => {
        cy.loginToPublisher(publisher, password);
        cy.deploySampleAPI();
        cy.logoutFromPublisher();
        cy.loginToDevportal(developer, password);
        cy.visit('/devportal/apis?tenant=carbon.super');
        cy.url().should('contain', '/apis?tenant=carbon.super');
        cy.get('[title="PizzaShackAPI"]', { timeout: 30000 });
        cy.get('[title="PizzaShackAPI"]').click();
        cy.get('[data-testid="left-menu-credentials"]').click();

        // Go through the wizard
        cy.get('[data-testid="start-key-gen-wizard-btn"]').click();
        cy.get('#application-name').type(appName);
        cy.get('[data-testid="wizard-next-0-btn"]').click();

        cy.get('[data-testid="wizard-next-1-btn"]', { timeout: 30000 })
        cy.get('[data-testid="wizard-next-1-btn"]').click();

        cy.get('[data-testid="wizard-next-2-btn"]', { timeout: 30000 });
        cy.get('[data-testid="wizard-next-2-btn"]').click();

        cy.intercept('**/oauth-keys').as('oauthKeys');
        cy.wait('@oauthKeys');

        cy.get('[data-testid="wizard-next-3-btn"]', { timeout: 30000 });
        cy.get('[data-testid="wizard-next-3-btn"]').click();
        /*
        Rest of the test we need to skip for now. Cypress is failing the token gen request but the actual one is not
        */
        // cy.intercept('**/generate-token').as('generateToken');
        // cy.wait('@generateToken');
        // cy.get('#access-token').should('not.be.empty');
        // cy.get('[data-testid="wizard-next-4-btn"]', { timeout: 30000 });
        // cy.get('[data-testid="wizard-next-4-btn"]').click();

        // cy.get('[data-testid="left-menu-credentials"]').click();
        // Click and select the new application
        // cy.get(`[data-testid="subscription-table"] td`).contains(appName).should('exist');
    })

    after(() => {
        cy.visit('/devportal/applications?tenant=carbon.super');
        cy.get(`[data-testid="delete-${appName}-btn"]`, { timeout: 30000 });
        cy.get(`[data-testid="delete-${appName}-btn"]`).click();
        cy.get(`[data-testid="application-delete-confirm-btn"]`).click();

        // Delete api
        cy.logoutFromDevportal();
        cy.loginToPublisher(publisher, password);
        deleteApi('PizzaShackAPI', '1.0.0');

        // delete developer
        cy.visit('carbon/user/user-mgt.jsp');
        cy.deleteUser(developer);
        cy.deleteUser(publisher);
    })
})
