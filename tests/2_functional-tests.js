const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { test, Test } = require('mocha');
const mongoose = require('mongoose');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  setTimeout(function () {
    console.log('timeout to allow tests to pass');
  }, 5000);
  this.timeout(5000);
  test('Create an issue with every field: POST request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'to delete',
        issue_text: 'test1b',
        created_by: 'test1c',
        assigned_to: 'test1d',
        status_text: 'test1e',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'to delete');
        assert.equal(res.body.issue_text, 'test1b');
        assert.equal(res.body.created_by, 'test1c');
        assert.equal(res.body.assigned_to, 'test1d');
        assert.equal(res.body.status_text, 'test1e');
      });
    done();
  });

  test('Create an issue with only required fields: POST request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: 'test2a',
        issue_text: 'test2b',
        created_by: 'test2c',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'test2a');
        assert.equal(res.body.issue_text, 'test2b');
        assert.equal(res.body.created_by, 'test2c');
      });
    done();
  });

  test('Create an issue with missing required fields: POST request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_text: 'test1b',
        created_by: 'test1c',
        assigned_to: 'test1d',
        status_text: 'test1e',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
      });
    done();
  });

  test('View issues on a project: GET request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(res.body), true, 'res.body is array');
        assert.equal(typeof res.body[0], 'object', 'res.body[0] is object');
        assert.equal(
          res.body[0].hasOwnProperty('assigned_to'),
          true,
          'res.body[0] has own property "assigned_to"'
        );
        assert.equal(
          res.body[0].hasOwnProperty('status_text'),
          true,
          'res.body[0] has own property "status_text"'
        );
        assert.equal(
          res.body[0].hasOwnProperty('open'),
          true,
          'res.body[0] has own property "open"'
        );
      });
    done();
  });

  test('View issues on a project with one filter: GET request to /api/issues/apitest', function (done) {
    chai
      .request(server)
      .get('/api/issues/apitest?issue_title=test1a')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(res.body), true, 'res.body is array');
        assert.equal(typeof res.body[0], 'object', 'res.body[0] is object');
        assert.equal(
          res.body[0].hasOwnProperty('assigned_to'),
          true,
          'res.body[0] has own property "assigned_to"'
        );
        assert.equal(
          res.body[0].issue_title,
          'test1a',
          'res.body[0].issue_title is "test1a"'
        );
      });
    done();
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .get(
        '/api/issues/apitest?issue_title=test1a&created_by=test1c&assigned_to=test1d'
      )
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(Array.isArray(res.body), true, 'res.body is array');
        assert.equal(typeof res.body[0], 'object', 'res.body[0] is object');
        assert.equal(
          res.body[0].hasOwnProperty('assigned_to'),
          true,
          'res.body[0] has own property "assigned_to"'
        );
        assert.equal(
          res.body[0].issue_title,
          'test1a',
          'res.body[0].issue_title is "test1a"'
        );
        assert.equal(
          res.body[0].created_by,
          'test1c',
          'res.body[0].created_by is "test1c"'
        );
        assert.equal(
          res.body[0].assigned_to,
          'test1d',
          'res.body[0].assigned_to is "test1d"'
        );
      });
    done();
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: '641486d3fee8f1bab2aed549',
        issue_title: 'updated title',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '641486d3fee8f1bab2aed549');
      });
    done();
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: '641486d3fee8f1bab2aed545',
        issue_title: 'updated title',
        issue_text: 'updated text',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '641486d3fee8f1bab2aed545');
      });
    done();
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        issue_title: 'updated title',
        issue_text: 'updated text',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
      });
    done();
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: '641486d3fee8f1bab2aed545',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, '641486d3fee8f1bab2aed545');
      });
    done();
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({
        _id: '641486d3fglibglobd545',
        issue_title: 'updated title',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, '641486d3fglibglobd545');
      });
    done();
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    module.exports = function (issueModel) {
      issueModel.findOne({ issue_title: 'to delete' }, function (err, data) {
        if (err) return console.error(err);
        console.log(data);
        chai
          .request(server)
          .delete('/api/issues/apitest')
          .send({
            _id: data._id,
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');
            assert.equal(res.body._id, data._id);
          });
      });
    };
    done();
  });
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({
        _id: 'invalidid',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, 'invalidid');
      });
    done();
  });
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({
        status_text: 'test',
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
      });
    done();
  });
});
