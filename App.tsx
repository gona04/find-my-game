import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DiscoverScreen from './src/pages/DiscoverPage';
import { SurpriseMe } from './src/pages/SurpriseMe';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false, // Hides the top bar so your UI looks clean
            tabBarStyle: { height: 70, paddingBottom: 10 },
          }}
        >
          <Tab.Screen name="Discover" component={DiscoverScreen} />
          <Tab.Screen name="Surprise Me" component={SurpriseMe}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}