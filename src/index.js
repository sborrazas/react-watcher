import React from 'react';
import _ from 'lodash';

const isEqual = (objA, objB) => objA === objB;

const isEqualShallow = (objA, objB) => {
  if (isEqual(objA, objB)) {
    return true;
  }

  return _.isObject(objA) &&
    _.isObject(objB) &&
    _.every(objA, (v, k) => _.includes(objB, k) && isEqual(v, objB[k])) &&
    _.every(objB, (v, k) => _.includes(objA, k));
};

export default (Component) => {
  class WatcherComponent extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.watch = this.watch.bind(this);
      this.unwatch = this.unwatch.bind(this);
      this.watchers = {};
    }
    componentWillReceiveProps(nextProps) {
      _.forEach(this.watchers, (callback, path) => {
        const oldProp = _.get(this.props, path);
        const newProp = _.get(nextProps, path);

        if (!isEqualShallow(oldProp, newProp)) {
          callback(newProp);
        }
      });
    }
    watch(propPath, callback) {
      const path = _.isArray(propPath) ? propPath.join('.') : propPath;

      this.watchers[path] = callback;
    }
    unwatch(propPath) {
      const path = _.isArray(propPath) ? propPath.join('.') : propPath;

      delete this.watchers[path];
    }
    render() {
      return React.createElement(Component, {
        ...this.props,
        watch: this.watch,
        unwatch: this.unwatch,
      });
    }
  }

  WatcherComponent.displayName = `ConnectWatcher(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WatcherComponent;
};
