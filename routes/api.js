'use strict';

module.exports = function (app, issueModel, projectModel) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {})

    .post(function (req, res) {
      let project = req.params.project;
      let theProject = projectModel.findOneAndUpdate(
        { project: project },
        { $push: { log: ['here goes a issueModel'] } },
        { upsert: true, new: true },
        function (err, data) {
          if (err) return console.error(err);
          else {
            //res.json('blah');
            res.json(data.log.slice(-1));
          }
        }
      );
      //res.json(testEntry);
      //issueModel.findOneAndUpdate(
      //  { issueName: 'anissue' },
      //  [
      //    {
      //      log: ['test'],
      //      //$set: {
      //      //  log: { $concat: ['$log', ['new thing']] },
      //      //},
      //    },
      //  ],
      //  { upsert: true }
      //);

      /*
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
            */
    })

    .put(function (req, res) {
      let project = req.params.project;
    })

    .delete(function (req, res) {
      let project = req.params.project;
    });
};
