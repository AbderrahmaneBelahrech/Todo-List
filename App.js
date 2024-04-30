import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LoginScreen from "./src/screens/LoginScreen"
import SignupScreen from "./src/screens/SignupScreen"
import TodoScreen from "./src/screens/TodoScreen"
import InProgressScreen from "./src/screens/InProgressScreen"
import DoneScreen from "./src/screens/DoneScreen"


const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          marginBottom: 10,
        },
        headerTitle: () => (
          <View style={styles.headerStyle}>
            <Image
              source={require('./assets/adaptive-icon.png')}
              style={styles.logo}
            />
            <Text style={styles.headerText}>To Do List</Text>
          </View>
        ),
      }}
    >
      <Tab.Screen name="ToDo" component={TodoScreen} />
      <Tab.Screen name="InProgress" component={InProgressScreen} />
      <Tab.Screen name="Done" component={DoneScreen} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeTabs} options={({ route }) => ({
            title: `Welcome, ${route.params.name}`, 
          })}
          initialParams={{ name: 'Guest' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


const styles = StyleSheet.create({
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,   // Adjust size accordingly
    height: 30,  // Adjust size accordingly
    marginRight: 10,
    backgroundColor: 'red'
  },
  headerText: {
    fontSize: 18,
  },
});
