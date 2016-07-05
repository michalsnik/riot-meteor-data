# riot-meteor-data

This package is a `riot` version of `react-meteor-data`.
It provides an integration between [`Riot`](http://riotjs.com/) and [`tracker`](https://atmospherejs.com/meteor/tracker), Meteor's reactive data system.

## Installation

```bash
meteor add michalsnik:riot-meteor-data
```

## Usage

This package exports a symbol `createContainer`, which you can use to create a Higher Order Container to wrap your data using container.

You're example component can look like this:

```js
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/michalsnik:riot-meteor-data';

import { Tasks } from '../api/tasks.js';

const tasks = `
  <ul class="todo-list { loading: data.listLoading }">
    <li each="{ data.tasks }">
      { text }
    </li>
  </ul>
`;

createContainer('tasks', tasks, function (opts) {
  const handle = Meteor.subscribe('tasks');

  return () => ({
    currentUser: Meteor.user(),
    listLoading: ! handle.ready(),
    tasks: Tasks.find().fetch()
  });
});
```

It creates a tag named `tasks` with given HTML as second argument.
Third argument is a function where you should keep your subscriptions and return a reactive function that will re-run whenever it's reactive input changes. This is also a place where you should keep all your `riot` component's logic.

You can access data in view by `data.xxxx`, where `xxxx` is a key (eg. `data.tasks`);
