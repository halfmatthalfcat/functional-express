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

/* tslint:disable no-any */
export const bodyRaw: (bodyFunc: BodyFunc<any>) => AsyncNestedFunc | NestedFunc | Complete =
    (bodyFunc: BodyFunc<any>) => {
        return (req: Request, res: Response) => {
            return bodyFunc(req.body)(req, res);
        };
    };

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

export const params: (paramFunc: ParamFunc) => AsyncNestedFunc | NestedFunc | Complete =
    (paramFunc: ParamFunc) => {
        return (req: Request, res: Response) => {
            return paramFunc(req.params)(req, res);
        };
    };
