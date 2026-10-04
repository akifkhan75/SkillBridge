jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View {...props} />,
    MaterialIcons: (props: any) => <View {...props} />,
    FontAwesome: (props: any) => <View {...props} />,
  };
});
