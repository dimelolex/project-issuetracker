'use strict';

module.exports = function (app, issueModel) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
    })

    .post(function (req, res) {
      let newIssue = new issueModel({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date().toDateString(),
        updated_on: new Date().toDateString(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || '',
      });
      newIssue.save(function (err, data) {
        if (err) return console.error(err);
        else {
          res.json({
            _id: data._id,
            issue_title: data.issue_title,
            issue_text: data.issue_text,
            created_on: data.created_on,
            updated_on: data.updated_on,
            created_by: data.created_by,
            assigned_to: data.assigned_to,
            open: data.open,
            status_text: data.status_text,
          });
        }
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
