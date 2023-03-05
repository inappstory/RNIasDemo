import { GestureHandlerRootView } from "react-native-gesture-handler";

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from "@react-navigation/stack";

import React from "react";
import { Platform, View } from "react-native";
import { MainScreen } from "./screen/MainScreen";
import { RNWelcome } from "./screen/RNWelcome";

import { useIas, StoryReader } from "react-native-ias";

import { createAppearanceManager, createStoryManager } from "./StoriesConfig";

const Stack = createNativeStackNavigator();

import NetworkLogger from "react-native-network-logger";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "black",
    },
};

// dark colors - like in google podcasts

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1, opacity: 0.99 }}>
            <NavigationContainer theme={theme}>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        animationEnabled: Platform.select({
                            ios: true,
                            android: true,
                        }),
                        animation: "default",
                        presentation: "card",
                        headerShown: true,
                        gestureEnabled: false,
                        gestureResponseDistance: 500,
                        transitionSpec: {
                            open: TransitionSpecs.TransitionIOSSpec,
                            close: TransitionSpecs.TransitionIOSSpec,
                        },
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                        headerStyle: {
                            backgroundColor: "#0c62f3",
                        },
                        headerTintColor: "#fff",
                        headerTitleStyle: {
                            fontWeight: "bold",
                        },
                    }}>
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="RNWelcome" component={RNWelcome} />
                    <Stack.Screen name="NetworkLogger" component={NetworkLogger} />
                </Stack.Navigator>
                <StoryReader storyManager={useIas(createStoryManager, createAppearanceManager).storyManager} />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
