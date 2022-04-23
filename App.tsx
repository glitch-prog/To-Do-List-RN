/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NetworkProvider } from 'react-native-offline';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { TodoItemScreen } from './components/Screens/TodoItemScreen/TodoItemScreen';
import { TodoListScreen } from './components/Screens/TodoListScreen/TodoListScreen';
import Realm from 'realm';
import { parse } from '@babel/core';

const TaskSchema = {
  name: 'Task',
  properties: {
    _id: 'int',
    name: 'string',
    status: 'string?',
  },
  primaryKey: '_id',
};

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NetworkProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Todo List" component={TodoListScreen} />
          <Stack.Screen name="Todo Item" component={TodoItemScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NetworkProvider>
  );
};

export default App;
