import {
  AppearanceManager,
  StoriesListCardViewVariant,
  StoryManager,
  StoryReaderCloseButtonPosition,
  StoryReaderSwipeStyle,
} from 'react-native-ias';

const storyManagerConfig = {
  apiKey: 'test-key',
  userId: null,
  tags: [],
  placeholders: {
    user: 'Guest',
  },
  lang: 'en',
};

export const createStoryManager = () => {
  return new StoryManager(storyManagerConfig);
};

export const createAppearanceManager = () => {
  return new AppearanceManager()
    .setCommonOptions({
      hasLike: true,
      hasFavorite: true,
    })
    .setStoriesListOptions({
      title: {
        content: '',
        color: '#000',
        font: 'normal',
        marginBottom: 20,
      },
      card: {
        title: {
          color: 'black',
          font: '14px/16px "InternalPrimary"',
          padding: 8,
        },
        gap: 10,
        height: 100,
        variant: StoriesListCardViewVariant.QUAD,
        border: {
          radius: 20,
          color: 'blue',
          width: 2,
          gap: 3,
        },
        boxShadow: null,
        opacity: 1,
        mask: {
          color: 'rgba(34, 34, 34, 0.3)',
        },
        opened: {
          border: {
            radius: 20,
            color: 'black',
            width: 2,
            gap: 3,
          },
          boxShadow: null,
          opacity: null,
          mask: {
            color: 'rgba(34, 34, 34, 0.1)',
          },
        },
      },
      favoriteCard: {
        title: {
          content: 'Saved',
        },
      },
      layout: {
        height: 0,
        backgroundColor: 'transparent',
      },
      sidePadding: 20,
      topPadding: 20,
      bottomPadding: 20,
      bottomMargin: 0, // для самой ячейки (если используются тени)
      navigation: {
        showControls: false,
        controlsSize: 48,
        controlsBackgroundColor: 'white',
        controlsColor: 'black',
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
        content: 'Favorite',
      },
    });
};
