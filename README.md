# functional-express
Functional helpers for dealing with Express.js routes. 
Provides a cleaner API for dealing with extracting request values and completing responses.

## Installation

### Using npm:

```
$ npm install functional-express
```

### Using yarn:

```
$ yarn add functional-express
```

## Usage

### Completers
Completers fulfil the response of a request.

#### async
The `async` completer takes a function which returns a `Promise`. The result of the `Promise`'s
success or failure determines the response. On success, the value of the promise is passed as the body of the response
with an HTTP 200. On failure, an HTTP 500 is sent to the response.
##### Signature
```typescript
<T>(promise: () => Promise<T>) => Complete
```
##### Example
```ecmascript 6
import { Router } from 'express';
import { async } from 'functional-express';

Router()
  .route('/')
  .post(async(
    () => somePromise(),
  ));

```
