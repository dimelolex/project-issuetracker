'use strict';

module.exports = function (app, issueModel, projectModel) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {})

    .post(function (req, res) {
      let project = req.params.project;
      let newIssue = new issueModel({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || '',
      });
      let theProject = projectModel.findOneAndUpdate(
        { project: project },
        { $push: { log: newIssue } },
        { upsert: true, new: true },
        function (err, data) {
          if (err) return console.error(err);
          else {
            res.json({
              assigned_to: data.log.slice(-1)[0].assigned_to,
              status_text: data.log.slice(-1)[0].status_text,
              open: data.log.slice(-1)[0].open,
              _id: data.log.slice(-1)[0]._id,
              issue_title: data.log.slice(-1)[0].issue_title,
              issue_text: data.log.slice(-1)[0].issue_text,
              created_by: data.log.slice(-1)[0].created_by,
              created_on: data.log.slice(-1)[0].created_on,
              updated_on: data.log.slice(-1)[0].updated_on,
            });
          }
        }
      );
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
