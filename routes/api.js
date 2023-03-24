'use strict';

module.exports = function (app, issueModel) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      let queries = { ...req.query };
      queries['project'] = project;
      issueModel.find(
        queries,
        'assigned_to status_text open _id issue_title issue_text created_by created_on updated_on',
        function (err, data) {
          if (err) return console.error(err);
          else {
            res.json(data);
          }
        }
      );
    })

    .post(function (req, res) {
      let project = req.params.project;
      if (
        [
          req.params.project,
          req.body.issue_title,
          req.body.issue_text,
          req.body.created_by,
        ].includes(undefined)
      ) {
        return res.json({ error: 'required field(s) missing' });
      }
      let newIssue = new issueModel({
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        open: true,
        status_text: req.body.status_text || '',
      });
      newIssue.save(function (err, data) {
        if (err) return console.error(err);
        else {
          res.json({
            assigned_to: data.assigned_to,
            status_text: data.status_text,
            open: data.open,
            _id: data._id,
            issue_title: data.issue_title,
            issue_text: data.issue_text,
            created_by: data.created_by,
            created_on: data.created_on,
            updated_on: data.updated_on,
          });
        }
      });
    })

    .put(function (req, res) {
      let queries = { ...req.body };
      delete queries._id;
      queries.updated_on = new Date().toISOString();
      queries.open = !req.body.open;
      for (const [key, value] of Object.entries(queries)) {
        if (value === '') {
          delete queries[key];
        }
      }
      if (req.body._id === undefined) {
        res.json({ error: 'missing _id' });
      } else if (Object.keys(queries).length < 3) {
        res.json({ error: 'no update field(s) sent', _id: req.body._id });
      } else {
        issueModel.findByIdAndUpdate(
          req.body._id,
          queries,
          function (err, data) {
            if (err) res.json({ error: 'could not update', _id: req.body._id });
            else {
              res.json({ result: 'successfully updated', _id: req.body._id });
            }
          }
        );
      }
    })

    .delete(function (req, res) {
      if (req.body._id === undefined) {
        res.json({ error: 'missing _id' });
      } else {
        issueModel.findByIdAndRemove(req.body._id, function (err, data) {
          if (err) res.json({ error: 'could not delete', _id: req.body._id });
          else {
            res.json({ result: 'successfully deleted', _id: req.body._id });
          }
        });
      }
    });
};
