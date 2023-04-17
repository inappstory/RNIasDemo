import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native";
import { Alert, BackHandler, SafeAreaView, StatusBar, StyleSheet, useColorScheme, View, ScrollView, RefreshControl } from "react-native";
import React, { useCallback, useRef } from "react";
import Button from "react-native-button";

import { Colors } from "react-native/Libraries/NewAppScreen";
import { StoriesListViewModel, useIas } from "react-native-ias";
import { createAppearanceManager, createStoryManager } from "../StoriesConfig";

import Toast from "react-native-simple-toast";
import { StoryListAnimation, StoryListComponent } from "../StoryListComponent";

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

    const storiesListViewModel = useRef<StoriesListViewModel>(undefined);
    const viewModelExporter = useCallback(viewModel => (storiesListViewModel.current = viewModel), []);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await storiesListViewModel.current.reload();
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={[styles.container, backgroundStyle]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewInnerContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <StoryListComponent
                    scrollY={null}
                    feedId="rniasdemo"
                    backgroundColor="transparent"
                    animation={StoryListAnimation.default}
                    viewModelExporter={viewModelExporter}
                />
                <View style={{ height: 0 }} />
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
                    onPress={async () => {
                        if (storiesListViewModel.current) {
                            console.log(await storiesListViewModel.current.reload());
                        }
                    }}>
                    Reload StoriesList
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
                    onPress={() => navigation.navigate("RNWelcome", { storyFeedId: "default", storyListAnimation: StoryListAnimation.default })}>
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
                {/*</View>*/}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // container: { flex: 1, justifyContent: "center", alignItems: "center" },
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    scrollView: {},
    scrollViewInnerContainer: {
        marginHorizontal: 20,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 42,
    },
});
