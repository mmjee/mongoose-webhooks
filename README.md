Mongoose Webhooks
========

[![npm version](https://badge.fury.io/js/mongoose-webhooks.svg)](https://badge.fury.io/js/mongoose-webhooks)
[![Build Status](https://travis-ci.org/amalfra/mongoose-webhooks.svg?branch=master)](https://travis-ci.org/amalfra/mongoose-webhooks)

Sends webhook on mongoose model events. Fork of [amalfra/mongoose-webhooks](https://github.com/amalfra/mongoose-webhooks) to implement per-document URLs.

## Installation
In your project root, run the following:

```sh
npm install git+https://github.com/mmjee/mongoose-webhooks.git
```

## Usage
To use `mongoose-webhooks` plugin in your model you will have to first require the plugin as

```javascript
const mongooseWebhooks = require('mongoose-webhooks');
```

The following schema definition defines a "User" schema, and uses mongoose-webhooks plugin

```javascript
const mongoose = require('mongoose')
const mongooseWebhooks = require('mongoose-webhooks')

const Schema = mongoose.Schema
// Require the plugin

const User = new Schema({
  username : { type : String, required : true},
  password : { type : String, required : true },
  email : { type : String, required : true},
  lastModified : Date,
  created : Date,
  webhookUrl: { type: String, required: true }
})

// The plugin will make a request to the URL returned by the url function
User.plugin(mongooseWebhooks, {
  url (doc) {
    return doc.webhookUrl
  }
})
```

Now you will be getting a webhook POST request to configured url. The webhook payload will be

```javascript
{
  "event": "save",
  "data": {
    "__v": 0,
    "username": "test",
    "password": "test",
    "email": "test@test.com"
    "_id": "576cf0eacdefabd20a52ac89"
  }
}
```

The event key can have following values
  * **save** : When the mongoose document is inserted
  * **update** : When the mongoose document is updated
  * **remove** : When the mongoose document is removed

The data key will have the JSON seralized document from mongoose.

## Options

The two options supported by plugin are
  * **useragent** : Lets you specify the `User-Agent` header for the webhook request. This is optional.

## Development

Questions, problems or suggestions? Please post them on the [issue tracker](https://github.com/mmjee/mongoose-webhooks/issues).

You can contribute changes by forking the project and submitting a pull request. Feel free to contribute :heart_eyes:

UNDER MIT LICENSE
=================

The MIT License (MIT)

Copyright (c) 2016 Amal Francis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
