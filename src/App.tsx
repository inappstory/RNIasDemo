import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import {MainScreen} from './screen/MainScreen';
import {RNWelcome} from './screen/RNWelcome';

// import {useIas, StoryReader, StoryFavoriteReader} from "./react-native-ias";
import {useIas, StoryReader} from 'react-native-ias';

import {createAppearanceManager, createStoryManager} from './StoriesConfig';

const Stack = createNativeStackNavigator();
// const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'black',
  },
};

// dark colors - like in google podcasts

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            animation: 'default',
            presentation: 'card',
            headerShown: true,
            gestureEnabled: true,
            headerStyle: {
              backgroundColor: '#0c62f3',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="RNWelcome" component={RNWelcome} />
        </Stack.Navigator>

        <StoryReader
          storyManager={
            useIas(createStoryManager, createAppearanceManager).storyManager
          }
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
