# React Watcher

[![Build Status](https://travis-ci.org/sborrazas/react-watcher.svg?branch=master)](https://travis-ci.org/sborrazas/react-watcher)

Simple helper to watch your React components prop changes.

Requires [React](https://github.com/facebook/react) to render components.

**Note:** Using this library for watching prop changes is highly discouraged.
It is however the only way of watching prop changes when using external
libraries or very complex component trees prop configurations.

## Install

```
npm install react-watcher
```

## Examples

### Quickstart

Wrap a component to access `watch` (and `unwatch`) binding functions.

```js
import connect from 'react-watcher';

class UserDetail extends React.PureComponent {
  render() {
    const { id } = this.props;

    return (<div>{id}</div>);
  }
  componentWillMount() {
    const { watch } = this.props;

    watch('id', (newId) => {
      // New ID assigned, you can use this to dispatch a user fetch action or
      // any other Redux action dispatch or function call.
    });
  }
}

export default connect(UserDetail);
```

**Note:** The prop to watch can be any value accepted by
[Lodash _.get function](https://lodash.com/docs/4.17.4#get). Examples:
`'params.id'`, `'users[0].id'`, `['users', 0, 'id']`.

## API

### `connect`

Connect the React component to get the `watch` and `unwatch` props for binding
the prop change events.

#### Arguments

* `Component` (required) – The React component to connect to.

#### Exposed props

* `watch(propPath, callback)` – Binds the prop change to the given callback.
* `unwatch(propPath)` – Removes the binding. Note: `unwatch` doesn't need to be
called on component unmount. Bindings will be freed automatically.

## Common pitfalls

Using this library for watching prop changes that you change directly is highly
discouraged. Instead, call the prop change callback when the change is performed.

```js
/* Bad */
class UsersList extends React.Component {
  render() {
    const { activeFilter, users } = this.props;

    return (/* ... */);
  }
  toggleActive(event) {
    dispatch(toggleActiveAction());
  }
  componentWillMount() {
    this.props.watch('activeFilter', (activeFilter) => {
      alert('Active filter has changed!');
    })
  }
}

export default connect(UsersList);

/* Good */
class UsersList extends React.Component {
  render() {
    const { activeFilter, users } = this.props;

    return (/* ... */);
  }
  toggleActive(event) {
    dispatch(toggleActiveAction());
    alert('Active filter has changed!');
  }
}
```


## Authors

**Sebastián Borrazás**

* [sborrazas.com](http://sborrazas.com)

## License

MIT
