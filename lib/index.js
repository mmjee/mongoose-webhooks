const fetch = require('node-fetch')
const OptionError = require('./errors/optionError')
const HttpError = require('./errors/httpError')

function MongooseWebhooksPlugin (schema, opts) {
  let isNew = false

  if (!opts) {
    opts = {}
  }

  // The plugin accepts only `Object` as options
  if (!opts || (opts.constructor !== Object)) {
    throw new OptionError('Invalid options - Options passed to' +
        'plugin must be Object.')
  }

  // Make url an array for multiple webhooks
  if (typeof opts.url !== 'function') {
    throw new OptionError('URL function missing.')
  }

  // Set the isNew flag which determines whether its insert or update
  schema.pre('save',
    function (next) {
      // WARNING: Potentially unsafe, requires further research
      // There's no guarantee that the isNew flag will not be overwritten inbetween a pre-save and post-save on the same document
      // Id est, events can occur in this order: pre-save on document 1, pre-save on document 2 (overwriting isNew),
      // post-save on document 1 (unintentionally signalling the wrong operation), post-save on document 2
      isNew = this.isNew
      return next()
    }
  )

  schema.post('save',
    function (doc) {
      // If we have isNew flag then it's an update
      const event = isNew ? 'save' : 'update'
      const url = opts.url(doc)
      _sendWebhook(event, doc, url, opts.useragent)
    }
  )

  schema.post('remove',
    function (doc) {
      const url = opts.url(doc)
      _sendWebhook('remove', doc, url, opts.useragent)
    }
  )
}

function _sendWebhook (event, doc, url, useragent) {
  // The JSON payload that will be send. eg:
  //    {
  //      "event": "save",
  //      "data": {"__v":0,"name":"dummy","_id":"576cf0eacdefabd20a52ac89"}
  //    }
  const payload = {
    event: event,
    data: doc
  }

  const requestOpts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }

  // If `useragent` option is present set the header
  if (useragent) {
    requestOpts.headers['User-Agent'] = useragent
  }

  fetch(url, requestOpts)
    .then(function (res) {
      if (!res.ok) {
        throw new HttpError('Failed to send Webhook: HTTP error - ' +
            res.status)
      }
    })
    .catch(function (err) {
      if (err) {
        throw new HttpError('Failed to send Webhook: HTTP error - ' +
            err.code)
      }
    })
}

module.exports = MongooseWebhooksPlugin
