'use strict';
import AWS from 'aws-sdk-mock';
import feathers from 'feathers';
import {should as Should} from 'chai';
import credstash from '../src/index.js';

const should = Should();
AWS.setSDK('credstash/node_modules/aws-sdk');

describe('Feathers Credstash', () => {
  afterEach(() => {
    AWS.restore();
  });

  it('should set app param as Array', (done) => {
    AWS.mock('DynamoDB', 'query', mockQuery('test-table'));
    AWS.mock('KMS', 'decrypt', mockKMS);

    const app = feathers();
    app.configure(credstash('test-table', ['secret']));
    should.exist(app.get('secret'));
    try {
      app.get('secret').should.equal('magic');
      return done();
    } catch (err) {
      return done(err);
    }
  });

  it('should set app param as Object', (done) => {
    AWS.mock('DynamoDB', 'query', mockQuery('test-table'));
    AWS.mock('KMS', 'decrypt', mockKMS);

    const app = feathers();
    app.configure(credstash('test-table', {secret: 'testParam'}));
    should.exist(app.get('testParam'));
    try {
      app.get('testParam').should.equal('magic');
      return done();
    } catch (err) {
      return done(err);
    }
  });

  var mockKMS = (params, done) => {
    var ret = {
      Plaintext: new Buffer('KvQ7FPrc2uYXHjW8n+Y63HHCvyRjujeaIZepV/eUkfkz8ZbM9oymmzC69+XLTlbtvRV1MNmo3ngqE+7dJHoDMw==', 'base64')
    };

    return done(null, ret);
  };

  var mockQuery = (expectedTable) => {
    return (params, done) => {
      params.TableName.should.equal(expectedTable);
      var ret = {
        Items: [{
          name: {
            S: 'name'
          },
          key: {
            S: 'CiBzvX0zBm6hGu0EnbpRJ+eO+HfPOIsG5oq1UDiK+pi/vBLLAQEBAQB4c719MwZuoRrtBJ26USfnjvh3zziLBuaKtVA4ivqYv7wAAACiMIGfBgkqhkiG9w0BBwaggZEwgY4CAQAwgYgGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMKNQYv5K9wPp+EvLQAgEQgFsITbvzf75MiY6aeIG2v/OzH2ThW5EJrfgNSekCGXONJSs3R8qkOlxFOfnoISvCXylMwBr+iAZFydgZiSyudPE+qocnYi++aVsv+iV9rR7o+FGQtSWKj2UH9PHm'
          },
          hmac: {
            S: 'ada335c27410033b16887d083aba629c17ad8f88b7982f331e4f6f8df92c41a9'
          },
          contents: {
            S: 'H2T+k+c='
          }
        }]
      };

      return done(null, ret);
    };
  };
});
