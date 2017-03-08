/* eslint react/no-multi-comp: "off" */

import test from 'ava';
import React from 'react';
// import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import './setupDom';
import connect from '../src/index';

const wrap = (Component, initialProps) => {
  const Wrapped = connect(Component);

  class WrappedWithState extends React.Component {
    constructor(props) {
      super(props);

      this.state = initialProps;
    }
    render() {
      return (<Wrapped {...this.state} />);
    }
  }

  return (<WrappedWithState />);
};

class MessageComp extends React.PureComponent {
  render() {
    const { message } = this.props;

    return (<div>{message}</div>);
  }
}

MessageComp.propTypes = {
  message: React.PropTypes.string.isRequired,
};

class NestedMessageComp extends React.PureComponent {
  render() {
    const { a } = this.props;

    return (<div>{a.b}</div>);
  }
}

NestedMessageComp.propTypes = {
  a: React.PropTypes.shape({
    b: React.PropTypes.string.isRequired,
  }).isRequired,
};

const MESSAGE = 'Don\'t forget to bring a towel!';
const ANOTHER_MESSAGE = 'Go away, I\'m walkin\' on sunshine';

test('Propagates sent props', (t) => {
  const initialProps = { message: MESSAGE };
  const tree = TestUtils.renderIntoDocument(wrap(MessageComp, initialProps));
  const stub = TestUtils.findRenderedComponentWithType(tree, MessageComp);

  t.is(stub.props.message, MESSAGE);
});

test('Exposes watch and unwatch props', (t) => {
  const initialProps = { message: MESSAGE };
  const tree = TestUtils.renderIntoDocument(wrap(MessageComp, initialProps));
  const stub = TestUtils.findRenderedComponentWithType(tree, MessageComp);

  t.truthy(stub.props.watch);
  t.truthy(stub.props.unwatch);
});

test('Triggers watch callback on simple prop change', (t) => {
  const initialProps = { message: MESSAGE };
  const finalProps = { message: ANOTHER_MESSAGE };
  const tree = TestUtils.renderIntoDocument(wrap(MessageComp, initialProps));
  const stub = TestUtils.findRenderedComponentWithType(tree, MessageComp);

  t.plan(1);

  stub.props.watch('message', (newMessage) => {
    t.is(newMessage, ANOTHER_MESSAGE);
  });

  tree.setState(finalProps);
});

test('Triggers watch callback on nested prop change', (t) => {
  const initialProps = { a: { b: MESSAGE } };
  const finalProps = { a: { b: ANOTHER_MESSAGE } };
  const tree = TestUtils.renderIntoDocument(
    wrap(NestedMessageComp, initialProps),
  );
  const stub = TestUtils.findRenderedComponentWithType(tree, NestedMessageComp);

  t.plan(1);

  stub.props.watch('a.b', (newMessage) => {
    t.is(newMessage, ANOTHER_MESSAGE);
  });

  tree.setState(finalProps);
});

test('Does not triggers watch callback on unwatched props', (t) => {
  const initialProps = { message: MESSAGE };
  const finalProps = { message: ANOTHER_MESSAGE };
  const otherProps = { message: 'Gah!' };
  const tree = TestUtils.renderIntoDocument(wrap(MessageComp, initialProps));
  const stub = TestUtils.findRenderedComponentWithType(tree, MessageComp);

  t.plan(1);

  stub.props.watch('message', (newMessage) => {
    t.is(newMessage, ANOTHER_MESSAGE);
  });

  tree.setState(finalProps);

  stub.props.unwatch('message');

  tree.setState(otherProps);
});
