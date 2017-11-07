/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

// Requires
var React;
var ReactDOM;
var ReactTestUtils;

// Test components
var LowerLevelComposite;
var MyCompositeComponent;

var expectSingleChildlessDiv;

/**
 * Integration test, testing the combination of JSX with our unit of
 * abstraction, `ReactCompositeComponent` does not ever add superfluous DOM
 * nodes.
 */
describe('ReactCompositeComponentDOMMinimalism', () => {
  beforeEach(() => {
    React = require('react');
    ReactDOM = require('react-dom');
    ReactTestUtils = require('react-dom/test-utils');

    LowerLevelComposite = class extends React.Component {
      render() {
        return <div>{this.props.children}</div>;
      }
    };

    MyCompositeComponent = class extends React.Component {
      render() {
        return <LowerLevelComposite>{this.props.children}</LowerLevelComposite>;
      }
    };

    expectSingleChildlessDiv = function(instance) {
      var el = ReactDOM.findDOMNode(instance);
      expect(el.tagName).toBe('DIV');
      expect(el.children.length).toBe(0);
    };
  });

  it('should not render extra nodes for non-interpolated text', () => {
    var instance = <MyCompositeComponent>A string child</MyCompositeComponent>;
    instance = ReactTestUtils.renderIntoDocument(instance);
    expectSingleChildlessDiv(instance);
  });

  it('should not render extra nodes for non-interpolated text', () => {
    var instance = (
      <MyCompositeComponent>{'Interpolated String Child'}</MyCompositeComponent>
    );
    instance = ReactTestUtils.renderIntoDocument(instance);
    expectSingleChildlessDiv(instance);
  });

  it('should not render extra nodes for non-interpolated text', () => {
    var instance = (
      <MyCompositeComponent>
        <ul>This text causes no children in ul, just innerHTML</ul>
      </MyCompositeComponent>
    );
    instance = ReactTestUtils.renderIntoDocument(instance);
    var el = ReactDOM.findDOMNode(instance);
    expect(el.tagName).toBe('DIV');
    expect(el.children.length).toBe(1);
    expect(el.children[0].tagName).toBe('UL');
    expect(el.children[0].children.length).toBe(0);
  });
});
