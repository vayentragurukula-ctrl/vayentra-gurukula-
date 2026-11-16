import test from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../index.js';
import { fetchGatewayPayment, registerSandboxPayment, createGatewayOrder } from '../services/razorpayClient.js';

test('P0 release gates: paid admissions and orders fail closed outside test', async () => {
  const before = process.env.NODE_ENV;
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    process.env.NODE_ENV = 'development';
    for (const endpoint of ['/api/v1/admissions/apply', '/api/v1/payments/orders', '/api/v1/payments/verify', '/api/v1/payments/webhook']) {
      const response = await fetch(base + endpoint, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({})
      });
      assert.equal(response.status, 503, endpoint + ' must not accept paid enrolments');
    }
  } finally {
    process.env.NODE_ENV = before;
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  }
});

test('P0 release gates: sandbox registration and prefixed payment IDs fail outside test', async () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalForceMock = process.env.RAZORPAY_FORCE_MOCK;
  try {
    process.env.NODE_ENV = 'development';
    process.env.RAZORPAY_FORCE_MOCK = 'true';
    assert.throws(() => registerSandboxPayment('pay_test_fake', {}), /only permitted in automated tests/);
    for (const paymentId of ['pay_test_fake', 'pay_genuine_fake', 'pay_rzp_fake']) {
      assert.equal(await fetchGatewayPayment(paymentId), null);
    }
    await assert.rejects(() => createGatewayOrder({}), /GATEWAY_NOT_CONFIGURED/);
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalForceMock === undefined) delete process.env.RAZORPAY_FORCE_MOCK;
    else process.env.RAZORPAY_FORCE_MOCK = originalForceMock;
  }
});
