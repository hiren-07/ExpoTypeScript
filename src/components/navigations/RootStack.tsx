import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import Temp from '../pages/Temp';
import {useTheme} from 'dooboo-ui';

export type RootStackParamList = {
  default: undefined;
  Dashboard: undefined;
  Temp: {param: string};
};

export type RootStackNavigationProps<
  T extends keyof RootStackParamList = 'default',
> = StackNavigationProp<RootStackParamList, T>;

const Stack = createStackNavigator<RootStackParamList>();

function RootStack(): React.ReactElement {
  const {theme, themeType} = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerMode: themeType === 'dark' ? 'screen' : 'float',
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTitleStyle: {color: theme.text},
          headerTintColor: theme.primary,
        }}
      >
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Temp" component={Temp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
