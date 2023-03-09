import {
    AppearanceManager,
    StoriesListCardViewVariant,
    StoryManager,
    StoryReaderCloseButtonPosition,
    StoryReaderSwipeStyle,
    StoriesListCardTitlePosition,
    StoriesListCardTitleTextAlign,
} from "react-native-ias";

import { Linking } from "react-native";

const storyManagerConfig = {
    apiKey: "test-key",
    userId: null,
    tags: [],
    placeholders: {
        user: "Guest",
    },
    lang: "en",
};

export const createStoryManager = () => {
    const storyManager = new StoryManager(storyManagerConfig);

    storyManager.on("clickOnStory", payload => console.log("clickOnStory", { payload }));
    storyManager.on("clickOnFavoriteCell", payload => console.log("clickOnFavoriteCell", { payload }));
    storyManager.on("showStory", payload => console.log("showStory", { payload }));
    storyManager.on("closeStory", payload => console.log("closeStory", { payload }));
    storyManager.on("showSlide", payload => console.log("showSlide", { payload }));
    storyManager.on("clickOnButton", payload => console.log("clickOnButton", { payload }));
    storyManager.on("likeStory", payload => console.log("likeStory", { payload }));
    storyManager.on("dislikeStory", payload => console.log("dislikeStory", { payload }));
    storyManager.on("favoriteStory", payload => console.log("favoriteStory", { payload }));
    storyManager.on("shareStory", payload => console.log("shareStory", { payload }));
    storyManager.on("shareStoryWithPath", payload => console.log("shareStoryWithPath", { payload }));

    // btn handler
    storyManager.storyLinkClickHandler = (payload: any) => {
        console.log({ payload });
        if (payload.data.url != null) {
            Linking.openURL(payload.data.url);
        }
    };

    return storyManager;
};

export const createAppearanceManager = () => {
    return new AppearanceManager()
        .setCommonOptions({
            hasLike: true,
            hasFavorite: true,
        })
        .setStoriesListOptions({
            title: {
                content: "",
                color: "#000",
                font: "normal",
                marginBottom: 20,
            },
            card: {
                title: {
                    color: "black",
                    font: 'normal normal 14px/16px "InternalPrimaryFont"',
                    padding: "8px 4px",
                    position: StoriesListCardTitlePosition.CARD_OUTSIDE_BOTTOM,
                    // position: "cardOutsideBottom",
                    textAlign: StoriesListCardTitleTextAlign.CENTER,
                    // textAlign: "center",
                    lineClamp: 2,
                },
                gap: 5,
                height: 100,
                variant: StoriesListCardViewVariant.CIRCLE,
                border: {
                    radius: 0,
                    color: "#0AD0A9",
                    width: 4,
                    gap: 0,
                },
                boxShadow: null,
                opacity: 1,
                mask: {
                    color: "transparent",
                },
                svgMask: null,
                opened: {
                    border: {
                        radius: 0,
                        color: "#0AD0A9",
                        width: 4,
                        gap: 0,
                    },
                    boxShadow: null,
                    opacity: null,
                    mask: {
                        color: "transparent",
                    },
                    svgMask: null,
                },
            },
            favoriteCard: {
                title: {
                    content: "Saved",
                },
            },
            layout: {
                /**
                 * 188 = topPadding(20) + bottomPadding(20) + card.height(100) + cardTitleSize(48 = card.title.padding(16 = 8 * 2) + textLines(32 = lineHeight * lineClamp (16 * 2))
                 * Also in StoryListComponent set storyListContainer.height = 188 & storyLoader.height = 188
                 */
                height: 188,
                backgroundColor: "transparent",
            },
            sidePadding: 20,
            topPadding: 20,
            bottomPadding: 20,
            bottomMargin: 0, // для самой ячейки (если используются тени)
            navigation: {
                showControls: false,
                controlsSize: 48,
                controlsBackgroundColor: "white",
                controlsColor: "black",
            },
        })
        .setStoryReaderOptions({
            closeButtonPosition: StoryReaderCloseButtonPosition.RIGHT,
            scrollStyle: StoryReaderSwipeStyle.FLAT,
            // loader: {
            //   default: {
            //     color: "transparent",
            //     accentColor: "white"
            //   }
            // }
        })
        .setStoryFavoriteReaderOptions({
            title: {
                content: "Favorite",
                font: "1.6rem/1.4 InternalPrimaryFont",
                color: "white",
            },
        });
};
