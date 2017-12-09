/**
 * Util functions for Express
 */

import { transformAndValidate } from 'class-transformer-validator';
import { Request, Response } from 'express';

export type Complete = (req: Request, res: Response) => void;

export type NestedFunc = (req: Request, res: Response) => NestedFunc;

export type AsyncNestedFunc = (req: Request, res: Response) => PromiseLike<NestedFunc>;

export interface ClassType<T> {
    /* tslint:disable-next-line no-any */
    new (...args: Array<any>): T;
}

/**
 * An async completer that finishes the response once the promise is fulfilled, or sends a 500 if the promise fails
 * @typedef {any} T - The future response body type
 * @param {() => Promise<T>} promise - A promise that resolves to the eventually response body
 * @return {RequestHandler} - An Express.js RequestHandler
 */
export const async: <T>(promise: () => Promise<T>) => Complete =
  <T>(promise: () => Promise<T>) => {
    return (_, res: Response) => {
      promise()
        .then(
          (obj: T) => res.status(200).json(obj),
          () => res.sendStatus(500),
        );
    };
  };

export type BodyFunc<T extends object> = (body: T) => AsyncNestedFunc | NestedFunc | Complete;

/**
 * Extract a request body in it's raw form and return another extractor/completer
 * @param {BodyFunc<any>} bodyFunc - A function that accepts the raw body and returns another extractor or completer
 * @return {RequestHandler} - An Express.js RequestHandler
 */
/* tslint:disable no-any */
export const bodyRaw: (bodyFunc: BodyFunc<any>) => AsyncNestedFunc | NestedFunc | Complete =
  (bodyFunc: BodyFunc<any>) => {
    return (req: Request, res: Response) => {
      return bodyFunc(req.body)(req, res);
    };
  };

/**
 * Extract a request body, validate it against a decorated class-validator class and either return
 * another extractor/completer or return a code 500 with validation errors
 * @typedef {object} T - The decorated class-validator class
 * @param {ClassType<T>} classType - The class (function) to be validated against
 * @param {BodyFunc<T>} bodyFunc - A function that accepts the validated class and returns another extractor or completer
 * @return {Promise<RequestHandler> | void} - Either a Promise that resolves to a RequestHandler or sends a 500 to the response
 */
/* tslint:enable no-any */
export const body: <T extends object>(classType: ClassType<T>, bodyFunc: BodyFunc<T>) => AsyncNestedFunc | NestedFunc | Complete =
  <T extends object>(classType: ClassType<T>, bodyFunc: BodyFunc<T>) => {
    return (req: Request, res: Response) => {
      return transformAndValidate(classType, req.body).then(
        (bodyA: T) => bodyFunc(bodyA)(req, res) as NestedFunc | AsyncNestedFunc | Complete,
        (err: {}) => res.status(500).json(err),
      );
    };
  };

export interface Params { [param: string]: string; }

export type ParamFunc = (params: Params) => AsyncNestedFunc | NestedFunc | Complete;

/**
 * Extract url path parameters
 * @param {ParamFunc} paramFunc - A function that accepts path parameters and returns another extractor or completer
 * @return {RequestHandler} - An Express.js RequestHandler
 */
export const params: (paramFunc: ParamFunc) => AsyncNestedFunc | NestedFunc | Complete =
  (paramFunc: ParamFunc) => {
    return (req: Request, res: Response) => {
      return paramFunc(req.params)(req, res);
    };
  };
