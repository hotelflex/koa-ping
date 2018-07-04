const Id = require('@hotelflex/id')

module.exports = () => (ctx, next) => {
  ctx.request.meta = {
    transactionId: ctx.headers['transaction-id'] || Id.create(),
    operationId: ctx.headers['operation-id'] || Id.create(),
  }
  return next()
}
