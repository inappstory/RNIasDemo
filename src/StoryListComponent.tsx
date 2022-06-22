import {StyleSheet, View, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {createAppearanceManager, createStoryManager} from './StoriesConfig.ts';

import {
  StoriesList,
  useIas,
  AppearanceManager,
  StoryManager,
  ListLoadStatus,
  Option,
} from 'react-native-ias';

import ContentLoader, {Rect} from 'react-content-loader/native';

import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;

enum LoadStatus {
  loading = 'Loading',
  success = 'LoadSuccess',
  fail = 'LoadFail',
}

export function StoryListComponent({
  feedId,
  backgroundColor,
}: {
  feedId: Option<string>;
  backgroundColor: string;
}) {
  feedId = feedId || 'default';

  const [loadStatus, setLoadStatus] = useState<LoadStatus>(LoadStatus.loading);

  const loadStartAtRef = useRef(new Date().getTime());

  const onLoadEnd = (listLoadStatus: ListLoadStatus) => {
    const minTime = 600;
    const now = new Date().getTime();
    const diff = Math.max(0, minTime - (now - loadStartAtRef.current));

    setTimeout(() => {
      if (
        listLoadStatus.defaultListLength > 0 ||
        listLoadStatus.favoriteListLength > 0
      ) {
        setLoadStatus(LoadStatus.success);
      } else {
        setLoadStatus(LoadStatus.fail);
      }

      if (listLoadStatus.error != null) {
        console.log({
          name: listLoadStatus.error.name,
          networkStatus: listLoadStatus.error.networkStatus,
        });
      }
    }, diff);
  };

  const {storyManager, appearanceManager} = useIas(
    createStoryManager,
    createAppearanceManager,
  );

  appearanceManager.setStoriesListOptions({
    layout: {
      backgroundColor,
    },
  });

  return (
    <View
      style={[
        styles.storyListContainer,
        loadStatus === LoadStatus.fail ? {display: 'none'} : null,
      ]}>
      <AnimatedStoryList
        storyManager={storyManager}
        appearanceManager={appearanceManager}
        loadStatus={loadStatus}
        feedId={feedId}
        onLoadEnd={onLoadEnd}
      />
      <StoryListLoader loadStatus={loadStatus} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'},

  storyListContainer: {position: 'relative', width: '100%', height: 140},
  storyList: {flex: 1, width: '100%', position: 'absolute', top: 0, left: 0},
  storyLoader: {
    width: '100%',
    height: 140,
    paddingVertical: 20,
    paddingLeft: 20,
    paddingRight: 0,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

const StoryListLoader = ({loadStatus}: {loadStatus: LoadStatus}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial value for opacity: 1

  useEffect(() => {
    if (loadStatus === LoadStatus.success) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, loadStatus]);

  return (
    <Animated.View
      style={{...styles.storyLoader, opacity: fadeAnim}}
      pointerEvents="none">
      <ContentLoader
        width={windowWidth - 20}
        height={100}
        viewBox={`0 0 ${windowWidth - 20} 100`}
        speed={1}
        backgroundColor="#f0f0f0"
        foregroundColor="#777777">
        <Rect x="0" y="0" rx="20" ry="20" width="100" height="100" />
        <Rect x="110" y="0" rx="20" ry="20" width="100" height="100" />
        <Rect x="220" y="0" rx="20" ry="20" width="100" height="100" />
        <Rect x="330" y="0" rx="20" ry="20" width="100" height="100" />
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
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    if (loadStatus === LoadStatus.success) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, loadStatus]);

  return (
    <Animated.View style={{...styles.storyList, opacity: fadeAnim}}>
      <StoriesList
        storyManager={storyManager}
        appearanceManager={appearanceManager}
        feed={feedId}
        onLoadEnd={onLoadEnd}
      />
    </Animated.View>
  );
};
