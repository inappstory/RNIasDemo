import { StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { createAppearanceManager, createStoryManager } from "./StoriesConfig.ts";

import { StoriesList, useIas, AppearanceManager, StoryManager, ListLoadStatus, Option } from "react-native-ias";

import ContentLoader, { Rect } from "react-content-loader/native";

import { Dimensions } from "react-native";
import Animated, { useAnimatedStyle, interpolate, Extrapolation, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import type SharedValue from "react-native-reanimated";

const windowWidth = Dimensions.get("window").width;

enum LoadStatus {
    loading = "Loading",
    success = "LoadSuccess",
    fail = "LoadFail",
}
export enum StoryListAnimation {
    default,
    on_scroll,
}
type StoryListComponentProps = { scrollY: SharedValue<number>; feedId: Option<string>; backgroundColor: string; animation: StoryListAnimation };
export function StoryListComponent({ scrollY, feedId, backgroundColor, animation }: StoryListComponentProps) {
    feedId = feedId || "default";

    const [loadStatus, setLoadStatus] = useState<LoadStatus>(LoadStatus.loading);

    const loadStartAtRef = useRef(new Date().getTime());

    const onLoadEnd = (listLoadStatus: ListLoadStatus) => {
        const minTime = 600;
        const now = new Date().getTime();
        const diff = Math.max(0, minTime - (now - loadStartAtRef.current));

        setTimeout(() => {
            if (listLoadStatus.defaultListLength > 0 || listLoadStatus.favoriteListLength > 0) {
                setLoadStatus(LoadStatus.success);
            } else {
                setLoadStatus(LoadStatus.fail);
            }

            if (listLoadStatus.error != null) {
                console.log({
                    name: listLoadStatus.error.name,
                    networkStatus: listLoadStatus.error.networkStatus,
                    networkMessage: listLoadStatus.error.networkMessage,
                });
            } else {
                console.log("LOAD SUCCESS", listLoadStatus);
            }
        }, diff);
    };

    const { storyManager, appearanceManager } = useIas(createStoryManager, createAppearanceManager);

    appearanceManager.setStoriesListOptions({
        layout: {
            backgroundColor,
        },
    });

    let list: Option<React.ReactElement>;
    if (animation === StoryListAnimation.default) {
        list = (
            <AnimatedStoryList
                storyManager={storyManager}
                appearanceManager={appearanceManager}
                loadStatus={loadStatus}
                feedId={feedId}
                onLoadEnd={onLoadEnd}
            />
        );
    } else if (animation === StoryListAnimation.on_scroll) {
        list = (
            <AnimatedStoryListScroll
                scrollY={scrollY}
                storyManager={storyManager}
                appearanceManager={appearanceManager}
                loadStatus={loadStatus}
                feedId={feedId}
                onLoadEnd={onLoadEnd}
            />
        );
    }

    return (
        <View style={[styles.storyListContainer, loadStatus === LoadStatus.fail ? { display: "none" } : null]}>
            {list}
            <StoryListLoader loadStatus={loadStatus} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },

    storyListContainer: {
        position: "relative",
        width: "100%",
        height: 188,
    },
    storyList: {
        flex: 1,
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
    },
    storyLoader: {
        width: "100%",
        height: 188,
        paddingVertical: 20,
        paddingLeft: 20,
        paddingRight: 0,
        backgroundColor: "transparent",
        position: "absolute",
        top: 0,
        left: 0,
    },
});

const StoryListLoader = ({ loadStatus }: { loadStatus: LoadStatus }) => {
    const opacity = useSharedValue(1);

    const style = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 250,
                // easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                easing: Easing.linear,
            }),
        };
    }, [opacity]);

    useEffect(() => {
        opacity.value = loadStatus === LoadStatus.success ? 0 : 1;
    }, [loadStatus, opacity]);

    return (
        <Animated.View style={[styles.storyLoader, style]} pointerEvents="none">
            <ContentLoader
                width={windowWidth - 20}
                height={100}
                viewBox={`0 0 ${windowWidth - 20} 100`}
                speed={1}
                backgroundColor="#f0f0f0"
                foregroundColor="#777777">
                <Rect x="0" y="0" rx="50" ry="50" width="100" height="100" />
                <Rect x="105" y="0" rx="50" ry="50" width="100" height="100" />
                <Rect x="210" y="0" rx="50" ry="50" width="100" height="100" />
                <Rect x="315" y="0" rx="50" ry="50" width="100" height="100" />
            </ContentLoader>
        </Animated.View>
    );
};

const AnimatedStoryList = ({
    loadStatus,
    storyManager,
    appearanceManager,
    feedId,
    onLoadEnd,
}: {
    loadStatus: LoadStatus;
    storyManager: StoryManager;
    appearanceManager: AppearanceManager;
    feedId: string;
    onLoadEnd: (listLoadStatus: ListLoadStatus) => void;
}) => {
    const opacity = useSharedValue(0);

    const style = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacity.value, {
                duration: 250,
                // easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                easing: Easing.linear,
            }),
        };
    }, [opacity, loadStatus]);

    useEffect(() => {
        opacity.value = loadStatus === LoadStatus.success ? 1 : 0;
    }, [loadStatus, opacity]);

    return (
        <Animated.View style={[styles.storyList, style]}>
            <StoriesList storyManager={storyManager} appearanceManager={appearanceManager} feed={feedId} onLoadEnd={onLoadEnd} />
        </Animated.View>
    );
};

const AnimatedStoryListScroll = ({
    scrollY,
    storyManager,
    appearanceManager,
    feedId,
    onLoadEnd,
}: {
    scrollY: SharedValue<number>;
    storyManager: StoryManager;
    appearanceManager: AppearanceManager;
    feedId: string;
    onLoadEnd: (listLoadStatus: ListLoadStatus) => void;
}) => {
    const animatedStyles = useAnimatedStyle(() => {
        const opacity = interpolate(scrollY.value, [0, 200], [1, 0], { extrapolateRight: Extrapolation.CLAMP });
        return {
            opacity,
            // transform: [{scale: scale}],
        };
    });

    return (
        <Animated.View style={[animatedStyles]}>
            <StoriesList storyManager={storyManager} appearanceManager={appearanceManager} feed={feedId} onLoadEnd={onLoadEnd} />
        </Animated.View>
    );
};
