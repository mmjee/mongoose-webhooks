class MongooseWebhookHttpError extends Error {
  constructor (message, extra) {
    super()

    this.name = this.constructor.name
    this.message = message
    this.extra = extra
  }
}

module.exports = MongooseWebhookHttpError
