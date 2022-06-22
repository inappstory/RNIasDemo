import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  StyleSheet,
  BackHandler,
  Alert,
  useColorScheme,
} from 'react-native';
import React, {useCallback} from 'react';
import Button from 'react-native-button';

import {Colors} from 'react-native/Libraries/NewAppScreen';

export function MainScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}) {
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []),
  );

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View
        style={{
          ...backgroundStyle,
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            width: '80%',
          }}>
          <Button
            containerStyle={{
              padding: 10,
              height: 'auto',
              width: '100%',
              overflow: 'hidden',
              borderRadius: 6,
              backgroundColor: '#0c62f3',
            }}
            style={{fontSize: 18, color: 'white'}}
            styleDisabled={{color: 'red'}}
            onPress={() => navigation.navigate('RNWelcome', {storyFeedId: 'rniasdemo'})}>
            Success loading
          </Button>
          <View style={{height: 32}} />

          <Button
            containerStyle={{
              padding: 10,
              height: 'auto',
              width: '100%',
              overflow: 'hidden',
              borderRadius: 6,
              backgroundColor: '#0c62f3',
            }}
            style={{fontSize: 18, color: 'white'}}
            styleDisabled={{color: 'red'}}
            onPress={() => navigation.navigate('RNWelcome', {storyFeedId: 'undefinedFeed'})}>
            Fail loading
          </Button>
          <View style={{height: 32}} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
