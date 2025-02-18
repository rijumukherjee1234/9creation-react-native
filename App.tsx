/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Login from './component';
import Dashboard from './component/Dashboard';
import Terms from './component/Terms';
import AssetDetails from './component/AssetDetails';
import AssetDetailstwo from './component/AssetDetailstwo';
import Profile from './component/Profile';
import ChangePassword from './component/ChangePassword';
import VerifiedAsset from './component/VerifiedAsset';
import NewVefifiedAsset from './component/NewVefifiedAsset';
import PreviousWorkDetails from './component/PreviousWorkDetails';
import ViewInvoice from './component/ViewInvoice';

type SectionProps = PropsWithChildren<{
  title: string;
}>;
const Stack = createStackNavigator();


function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
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
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home" screenOptions={{ cardStyle: { backgroundColor: '#fff' },headerShown:false }}>
       <Stack.Screen name="Home" component={Login} />
       <Stack.Screen name='Dashboardpage' component={Dashboard} />
       <Stack.Screen name='Terms' component={Terms}/>
       <Stack.Screen name='AssetDetailspage' component={AssetDetails}/>
       <Stack.Screen name='AssetDetailstwopage' component={AssetDetailstwo}/>
       <Stack.Screen name='Profilepage' component={Profile}/>
       <Stack.Screen name='ChangePasswordpage' component={ChangePassword}/>
       <Stack.Screen name='VerifiedAssetPage' component={VerifiedAsset}/>
       <Stack.Screen name='NewVefifiedAssetpage' component={NewVefifiedAsset}/>
       <Stack.Screen name='PreviousWorkDetailspage' component={PreviousWorkDetails}/>
       <Stack.Screen name='ViewInvoicepage' component={ViewInvoice}/>
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
