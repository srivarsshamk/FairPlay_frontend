import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./assets/src/screens/welcomescreen";
import HomeScreen from "./assets/src/screens/homescreen";
import GameScreen from "./assets/src/screens/gamescreen";
import Hangman from "./assets/src/components/hangman";
import Sort from "./assets/src/components/sort";
import Simulation from "./assets/src/components/simulation";
import Scramble from "./assets/src/components/scramble";
import Quiz from "./assets/src/components/quiz";
import CrosswordGame from "./assets/src/components/crossword";
import MemoryGame from "./assets/src/components/memory";
import PillRace from "./assets/src/components/pillrace";
import profilescreen from "./assets/src/screens/profilescreen";
import SignupScreen from "./assets/src/screens/signupscreen";
import Post from "./assets/src/screens/post";
import EditProfile from "./assets/src/components/profile/EditProfile";
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        {/* Welcome Screen */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        {/* Other Screens */}
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Hangman"
          component={Hangman}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Sort"
          component={Sort}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Simulation"
          component={Simulation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Scramble"
          component={Scramble}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Crossword"
          component={CrosswordGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Memory Game"
          component={MemoryGame}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Pill Race"
          component={PillRace}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={profilescreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Post"
          component={Post}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
