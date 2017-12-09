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
Completers fulfill the response of a request.

#### async
The `async` completer takes a function which returns a `Promise`. The result of the `Promise`'s
success or failure determines the response. On success, the value of the promise is passed as the body of the response
with an HTTP 200. On failure, an HTTP 500 is sent to the response.
##### Signature
```typescript
<T>(promise: () => Promise<T>) => Complete
```
##### Example
```typescript
import { Router } from 'express';
import { async } from 'functional-express';

Router()
  .route('/')
  .post(
    async(
      () => somePromise(),
    ),
  );

```

### Extractors

#### params
The `params` extractor extracts path parameter values and passes them to an inner function.
##### Signature
```typescript
(params: Params) => AsyncNestedFunc | NestedFunc | Complete
```
##### Example
```typescript
import { Router } from 'express';
import { params } from 'functional-express';

Router()
  .route('/:pathA/:pathB')
  .post(
    params(({ pathA, pathB }) => 
      // Values of pathA and pathB now available here
    ),
  );
```

#### bodyRaw
The `bodyRaw` extractor extracts the request body, unaltered, and passes it to an inner function.
##### Signature
```typescript
<T>(body: T) => AsyncNestedFunc | NestedFunc | Complete
```
##### Example
```typescript
import { Router } from 'express';
import { bodyRaw } from 'functional-express';

Router()
  .route('/')
  .post(
    bodyRaw<any>((body: any) => 
      // The body is now available here
    ),
  );
```

#### body
The `body` extractor extracts the request body and validates it against a 
[class-validator](https://github.com/typestack/class-validator) decorated class. If the class is validated,
it is passed to an inner function and can be used subsequently. If the class fails validation, an HTTP 500
is sent to the response with the validation failure output passed as the body.
##### Signature
```typescript
<T extends object>(classType: ClassType<T>, bodyFunc: BodyFunc<T>) => AsyncNestedFunc | NestedFunc | Complete
```
##### Example
```typescript
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Router } from 'express';
import { body } from 'functional-express';

class SomeClass {
  
  @IsNotEmpty()
  @IsNumber()
  public someNumber: number;
  
}

Router()
  .route('/')
  .post(
    body(SomeClass, (body: SomeClass) => 
      // The validated class is now available here
    ),
  );
```

### Questions?
Open an issue and I'll try to answer asap!

### Contributions?
If you'd like to contribute, open a PR and I'll look over it asap. All contributions will be made 
available under the MIT license.
