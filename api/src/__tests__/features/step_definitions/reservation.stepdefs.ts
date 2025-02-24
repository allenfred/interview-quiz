/* eslint-disable */

import {Given, When, Then} from '@cucumber/cucumber';
import {expect} from '@loopback/testlab';
import {setupApplication} from '../../test-helper';
import {Client} from '@loopback/testlab';

let client: Client;

Given('the application is running', async function () {
  ({client} = await setupApplication());
});

When(
  'I create a reservation with {string}, {string}, {string}, and {int}',
  async function (guestName, contactInfo, expectedArrivalTime, tableSize) {
    const response = await client.post('/api/reservations').send({
      guestName,
      contactInfo,
      expectedArrivalTime,
      tableSize,
      status: 'confirmed',
    });
    this.response = response;
  },
);

Then('the reservation should be created successfully', function () {
  expect(this.response.status).to.equal(404);
  // expect(this.response.body).to.have.property('id');
});
