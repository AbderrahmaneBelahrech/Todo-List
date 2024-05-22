import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from "./src/screens/LoginScreen"
import SignupScreen from "./src/screens/SignupScreen"
import TodoScreen from "./src/screens/TodoScreen"
import InProgressScreen from "./src/screens/InProgressScreen"
import DoneScreen from "./src/screens/DoneScreen"
import GroupsScreen from "./src/screens/GroupsScreen"
import CustomDrawer from './src/components/CustomDrawer';
import { Ionicons } from '@expo/vector-icons'



const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();


function DrawerTabs({ route}) {
  const {email, name, id } = route.params;
  return (
    <Drawer.Navigator initialRouteName="Tasks" drawerContent={props => <CustomDrawer {...props} name={name} email={email}/>}

      screenOptions={{
        drawerLabelStyle: {
          marginLeft: -25,
        },

      }}
    >
      <Drawer.Screen name="Tasks" component={HomeTabs} initialParams={{ name: name, id: id }} 
        options={
          {
            drawerIcon: ({ focused, color }) => (
              <Ionicons name="logo-buffer" size={22} color={color} />
            )

        }
      }
      />
      <Drawer.Screen name='Groups' component={GroupsScreen} initialParams={{ name: name, id: id }}
        options={
          {
            drawerIcon: ({ focused, color }) => (
              <Ionicons name="people" size={22} color={color} />
            )

        }
      }
      />
    </Drawer.Navigator>
  );
}

function HomeTabs({ route}) {
  const { name, id } = route.params;
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
      <Tab.Screen name="ToDo" component={TodoScreen} initialParams={{ name: name, id: id }}/>
      <Tab.Screen name="InProgress" component={InProgressScreen} initialParams={{ name: name, id: id }}/>
      <Tab.Screen name="Done" component={DoneScreen} initialParams={{ name: name, id: id }}/>
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={DrawerTabs} options={{ headerShown: false }}/>
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
