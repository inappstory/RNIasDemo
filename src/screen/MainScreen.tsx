import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, StatusBar, Text, View, StyleSheet, BackHandler, Alert, useColorScheme, ScrollView } from "react-native";
import React, { useCallback } from "react";
import Button from "react-native-button";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { useIas } from "react-native-ias";
import { createAppearanceManager, createStoryManager } from "../StoriesConfig";

import Toast from "react-native-simple-toast";
import { StoryListAnimation } from "../StoryListComponent";

export function MainScreen({ navigation, route }: { navigation: NavigationProp<any>; route: RouteProp<any> }) {
    useFocusEffect(
        useCallback(() => {
            const backAction = () => {
                Alert.alert("Hold on!", "Are you sure you want to go back?", [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel",
                    },
                    { text: "YES", onPress: () => BackHandler.exitApp() },
                ]);
                return true;
            };

            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, []),
    );

    const isDarkMode = useColorScheme() === "dark";

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const { storyManager, appearanceManager } = useIas(createStoryManager, createAppearanceManager);

    return (
        <SafeAreaView style={[styles.container, backgroundStyle]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <View
                style={{
                    ...backgroundStyle,
                    flex: 1,
                    alignItems: "center",
                    // backgroundColor: "white",
                    width: "100%",
                    height: "100%",
                }}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        width: "80%",
                    }}>
                    <Button
                        containerStyle={{
                            padding: 10,
                            height: "auto",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 6,
                            backgroundColor: "#0c62f3",
                        }}
                        style={{ fontSize: 18, color: "white" }}
                        styleDisabled={{ color: "red" }}
                        onPress={() => navigation.navigate("RNWelcome", { storyFeedId: "rniasdemo", storyListAnimation: StoryListAnimation.default })}>
                        Success loading (default)
                    </Button>
                    <View style={{ height: 32 }} />

                    <Button
                        containerStyle={{
                            padding: 10,
                            height: "auto",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 6,
                            backgroundColor: "#0c62f3",
                        }}
                        style={{ fontSize: 18, color: "white" }}
                        styleDisabled={{ color: "red" }}
                        onPress={() => navigation.navigate("RNWelcome", { storyFeedId: "rniasdemo", storyListAnimation: StoryListAnimation.on_scroll })}>
                        Success loading (opacity on scroll)
                    </Button>
                    <View style={{ height: 32 }} />

                    <Button
                        containerStyle={{
                            padding: 10,
                            height: "auto",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 6,
                            backgroundColor: "#0c62f3",
                        }}
                        style={{ fontSize: 18, color: "white" }}
                        styleDisabled={{ color: "red" }}
                        onPress={() => navigation.navigate("RNWelcome", { storyFeedId: "undefinedFeed", storyListAnimation: StoryListAnimation.default })}>
                        Fail loading
                    </Button>
                    <View style={{ height: 32 }} />
                    <Button
                        containerStyle={{
                            padding: 10,
                            height: "auto",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 6,
                            backgroundColor: "#0c62f3",
                        }}
                        style={{ fontSize: 18, color: "white" }}
                        styleDisabled={{ color: "red" }}
                        onPress={() => {
                            storyManager.showStory(26702, appearanceManager).then(res => {
                                console.log({ res });
                                res.loaded === false && Toast.show("Failed to load story");
                            });
                        }}>
                        Open one story(success)
                    </Button>
                    <View style={{ height: 32 }} />
                    <Button
                        containerStyle={{
                            padding: 10,
                            height: "auto",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 6,
                            backgroundColor: "#0c62f3",
                        }}
                        style={{ fontSize: 18, color: "white" }}
                        styleDisabled={{ color: "red" }}
                        onPress={() => {
                            storyManager.showStory("undefinedId", appearanceManager).then(res => {
                                console.log({ res });
                                res.loaded === false && Toast.show("Failed to load story");
                            });
                        }}>
                        Open one story(fail)
                    </Button>
                    <View style={{ height: 32 }} />
                    <Button
                        containerStyle={{
                            padding: 10,
                            height: "auto",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 6,
                            backgroundColor: "#0c62f3",
                        }}
                        style={{ fontSize: 18, color: "white" }}
                        styleDisabled={{ color: "red" }}
                        onPress={() => {
                            storyManager.showOnboardingStories(appearanceManager).then(res => {
                                let onboardingOpened = false;
                                if (res.success && res.defaultListLength > 0) {
                                    onboardingOpened = true;
                                }
                                console.log({ onboardingOpened });
                            });
                        }}>
                        Open onboarding
                    </Button>

                    <View style={{ height: 32 }} />
                    <Button
                        containerStyle={{
                            padding: 10,
                            height: "auto",
                            width: "100%",
                            overflow: "hidden",
                            borderRadius: 6,
                            backgroundColor: "#0c62f3",
                        }}
                        style={{ fontSize: 18, color: "white" }}
                        styleDisabled={{ color: "red" }}
                        onPress={() => {
                            navigation.navigate("NetworkLogger");
                        }}>
                        NetworkLogger
                    </Button>

                    <View style={{ height: 32 }} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
