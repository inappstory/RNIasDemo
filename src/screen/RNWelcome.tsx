import { NavigationProp, RouteProp } from "@react-navigation/native";
import { SafeAreaView, StatusBar, StyleSheet, Text, View, useColorScheme } from "react-native";
import React from "react";

import type { Node } from "react";

import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions } from "react-native/Libraries/NewAppScreen";

import { StoryListAnimation, StoryListComponent } from "../StoryListComponent.tsx";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";

const Section = ({ children, title }): Node => {
    const isDarkMode = useColorScheme() === "dark";
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
};

export function RNWelcome({
    navigation,
    route,
}: {
    navigation: NavigationProp<any>;
    route: RouteProp<{ params: { storyFeedId: string; storyListAnimation: StoryListAnimation } }>;
}) {
    const isDarkMode = useColorScheme() === "dark";

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: e => {
            scrollY.value = e.contentOffset.y;
        },
    });

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <Animated.ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle} onScroll={scrollHandler} scrollEventThrottle={1}>
                <Header />
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                        height: 2000,
                    }}>
                    <StoryListComponent
                        scrollY={scrollY}
                        feedId={route.params.storyFeedId}
                        backgroundColor={isDarkMode ? Colors.black : Colors.white}
                        animation={route.params.storyListAnimation}
                    />
                    <Section title="Step One">
                        Edit <Text style={styles.highlight}>App.js</Text> to change this screen and then come back to see your edits.
                    </Section>
                    <Section title="See Your Changes">
                        <ReloadInstructions />
                    </Section>
                    <Section title="Debug">
                        <DebugInstructions />
                    </Section>
                    <Section title="Learn More">Read the docs to discover what to do next:</Section>
                    <LearnMoreLinks />
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "flex-start", alignItems: "flex-start" },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "600",
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "400",
    },
    highlight: {
        fontWeight: "700",
    },
});
