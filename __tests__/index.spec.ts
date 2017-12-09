/**
 * Unit tests
 */

import {
  async,
  AsyncNestedFunc,
  body,
  bodyRaw,
  Complete,
  NestedFunc,
  Params,
  params,
} from "../index";

import { Request } from 'express';

import { DummyClassMock } from "../__mocks__/dummyClass.mock";

// tslint:disable-next-line
const response = require('jest-mock-express').response();

const dummyFunc: Complete = ({}, {}) => void 0;

describe('functional-express', () => {

  beforeEach(() => response.reset());

  describe('async', () => {

    it('should return a function', () => {

      const asyncFn: Complete = async(() => Promise.resolve());

      expect(typeof asyncFn === 'function').toBeTruthy();
      expect(asyncFn.length).toBe(2);

    });

    it('should send a 200 on promise success', (done: DoneFn) => {

      const asyncFn: Complete = async(() => Promise.resolve(null));

      const spy: jasmine.Spy = spyOn(response, 'status').and.callFake(() => {
        expect(spy.calls.first().args.length > 0).toBeTruthy();
        expect(spy.calls.first().args[0]).toEqual(200);
        done();
        // Promise fails if mock response isn't returned
        return response;
      });

      asyncFn({} as Request, response);

    });

    it('should send the resulting response body on promise success', (done: DoneFn) => {

      const asyncFn: Complete = async(() => Promise.resolve({}));

      const spy: jasmine.Spy = spyOn(response, 'json').and.callFake(() => {
        expect(spy.calls.first().args.length > 0).toBeTruthy();
        expect(spy.calls.first().args[0]).toEqual({});
        done();
      });

      asyncFn({} as Request, response);

    });

    it('should send a 500 on promise failure', (done: DoneFn) => {

      const asyncFn: Complete = async(() => Promise.reject(null));

      const spy: jasmine.Spy = spyOn(response, 'sendStatus').and.callFake(() => {
        expect(spy.calls.first().args.length > 0).toBeTruthy();
        expect(spy.calls.first().args[0]).toEqual(500);
        done();
      });

      asyncFn({} as Request, response);

    });

  });

  describe('params', () => {

    it('should return a function', () => {

      const paramFunc: AsyncNestedFunc | NestedFunc | Complete = params(() => dummyFunc);

      expect(typeof paramFunc === 'function').toBeTruthy();
      expect(paramFunc.length).toBe(2);

    });

    it('should return an empty object when there are no params in the request', (done: DoneFn) => {

      const paramFunc: AsyncNestedFunc | NestedFunc | Complete = params((p: Params) => {
        expect(p).toEqual({});
        done();
        return dummyFunc;
      });

      paramFunc({ params: {} } as Request, response);

    });

    it('should return an object of params when there are params in the request', (done: DoneFn) => {

      const paramFunc: AsyncNestedFunc | NestedFunc | Complete = params(({ a, b, c }) => {
        expect(a).toEqual(1);
        expect(b).toEqual(2);
        expect(c).not.toBeDefined();
        done();
        return dummyFunc;
      });

      paramFunc({ params: { a: 1, b: 2 } } as Request, response);

    });

  });

  describe('bodyRaw', () => {

    it('should return a function', () => {

      const bodyRawFunc: AsyncNestedFunc | NestedFunc | Complete = bodyRaw(() => dummyFunc);

      expect(typeof bodyRawFunc === 'function').toBeTruthy();
      expect(bodyRawFunc.length).toBe(2);

    });

    it('should return a request body', (done: DoneFn) => {

      // tslint:disable-next-line no-any
      const bodyRawFunc: AsyncNestedFunc | NestedFunc | Complete = bodyRaw((b: any) => {
        expect(b).toBeDefined();
        done();
        return dummyFunc;
      });

      bodyRawFunc({ body: {} } as Request, response);

    });

  });

  describe('body', () => {

    it('should return a function', () => {

      const bodyFunc: AsyncNestedFunc | NestedFunc | Complete = body(DummyClassMock, () => dummyFunc);

      expect(typeof bodyFunc === 'function').toBeTruthy();
      expect(bodyFunc.length).toBe(2);

    });

    it('should correctly validate the class when given valid input', (done: DoneFn) => {

      const bodyFunc: AsyncNestedFunc | NestedFunc | Complete = body(DummyClassMock, (mock: DummyClassMock) => {
        expect(mock).toBeDefined();
        done();
        return dummyFunc;
      });

      bodyFunc({ body: { a: 1, b: 'abc' }} as Request, response);

    });

    it('should correctly throw a 500 when there\'s invalid input', (done: DoneFn) => {

      const bodyFunc: AsyncNestedFunc | NestedFunc | Complete = body(DummyClassMock, (_mock: DummyClassMock) => dummyFunc);

      const spy: jasmine.Spy = spyOn(response, 'status').and.callFake(() => {
        expect(spy.calls.first().args.length > 0).toBeTruthy();
        expect(spy.calls.first().args[0]).toEqual(500);
        done();
        // Promise fails if mock response isn't returned
        return response;
      });

      bodyFunc({ body: { someVal: 'abc' }} as Request, response);

    });

    it('should correctly emit error messages in the response body when there\'s invalid input', (done: DoneFn) => {

      const bodyFunc: AsyncNestedFunc | NestedFunc | Complete = body(DummyClassMock, (_mock: DummyClassMock) => dummyFunc);

      const spy: jasmine.Spy = spyOn(response, 'json').and.callFake(() => {
        expect(spy.calls.first().args.length > 0).toBeTruthy();
        expect(spy.calls.first().args[0]).toBeDefined();
        done();
        // Promise fails if mock response isn't returned
        return response;
      });

      bodyFunc({ body: { someVal: 'abc' }} as Request, response);

    });

  });

});
