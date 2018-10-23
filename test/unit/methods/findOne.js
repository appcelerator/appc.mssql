const test = require('tap').test
const server = require('./../../server.js')
const findOneMethod = require('../../../lib/methods/findOne').findOne
const sinon = require('sinon')
var ARROW
var CONNECTOR

test('### Start Arrow ###', function (t) {
  server()
    .then((inst) => {
      ARROW = inst
      CONNECTOR = ARROW.getConnector('appc.mssql')
      t.ok(ARROW, 'Arrow has been started')
      t.end()
    })
    .catch((err) => {
      t.threw(err)
    })
})

test('FindOne with console.warn', function (t) {
  const logger = CONNECTOR.logger
  const sandbox = sinon.sandbox.create()

  const findByIdStub = sandbox.stub(CONNECTOR.findByID, 'apply').callsFake((values) => { })
  CONNECTOR.logger = false

  // Execution
  findOneMethod.bind(CONNECTOR)()

  t.ok(findByIdStub.calledOnce)

  CONNECTOR.logger = logger
  sandbox.restore()
  t.end()
})

test('FindOne with logger', function (t) {
  const sandbox = sinon.sandbox.create()
  const findByIdStub = sandbox.stub(CONNECTOR.findByID, 'apply').callsFake((values) => { })

  const loggerStub = sandbox.stub(CONNECTOR.logger, 'warn').callsFake((CONNECTOR) => { })

  // Execution
  findOneMethod.bind(CONNECTOR)()
  t.ok(loggerStub.calledOnce)
  t.ok(findByIdStub.calledOnce)

  sandbox.restore()
  t.end()
})

test('### Stop Arrow ###', function (t) {
  ARROW.stop(function () {
    t.pass('Arrow has been stopped!')
    t.end()
  })
})
