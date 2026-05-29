import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {configureGoogleSignIn, getStoredSession} from '../services/authService';
import {LoginScreen} from '../screens/LoginScreen';
import {LegalScreen} from '../screens/LegalScreen';
import {MangaSelectionScreen} from '../screens/MangaSelectionScreen';
import {ReaderScreen} from '../screens/ReaderScreen';
import type {RootStackParamList} from '../types/manga';

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    configureGoogleSignIn();

    getStoredSession()
      .then(session => setInitialRoute(session ? 'Library' : 'Login'))
      .catch(() => setInitialRoute('Login'));
  }, []);

  if (!initialRoute) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color="#f6c453" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Library" component={MangaSelectionScreen} />
        <Stack.Screen name="Reader" component={ReaderScreen} />
        <Stack.Screen name="Legal" component={LegalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101010',
  },
});
