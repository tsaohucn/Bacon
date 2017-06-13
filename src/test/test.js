import 'react-native';
import React from 'react';
import meetQTest from '../app/views/AboutMe/Show/Profile/meetQTest';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

test('renders correctly', () => {
  const tree = renderer.create(
    <meetQTest />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});