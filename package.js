Package.describe({
  name: 'michalsnik:riot-meteor-data',
  version: '1.0.0',
  summary: 'Data integration between Riot and Meteor Tracker',
  git: 'git@github.com:michalsnik/riot-meteor-data.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.4.1');
  api.use('ecmascript');
  api.mainModule('riot-meteor-data.js');
});
