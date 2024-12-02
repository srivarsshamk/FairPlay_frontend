import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./assets/src/screens/LoginScreen";
import HomeScreen from "./assets/src/screens/homescreen";
import GameScreen from "./assets/src/screens/gamescreen";
import Hangman from "./assets/src/components/hangman";
import Sort from "./assets/src/components/sort";
import Simulation from "./assets/src/components/simulation";
import Scramble from "./assets/src/components/scramble";
import Quiz from "./assets/src/components/quiz";
import CrosswordGame from "./assets/src/components/crossword";
import MemoryGame from "./assets/src/components/memory";
import NewsDisplay from "./assets/src/components/News";
import PillRace from "./assets/src/components/pillrace";
import ProfilePage from "./assets/src/screens/profilescreen";
import SignupScreen from "./assets/src/screens/signupscreen";
import LandingPage from "./assets/src/screens/Landingpage";
import CaseStudies from './assets/src/screens/CaseStudies';
import DopingScandals from './assets/src/components/DopingScandalsTimeline';
import ImageTextExtractor from './assets/src/screens/ImageTextExtractor';
import News from './assets/src/components/News';
import Podcastcomp from './assets/src/components/Podcastcomp';

import CaseStud from './assets/src/screens/StatsPage'; // Import your VRArtGallery component
import Journals from "./assets/src/components/Journals";
import Figure from "./assets/src/components/Figure";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ cardStyle: { height: "100%" } }}>
        <Stack.Screen
          name="LandingPage"
          component={LandingPage}
          options={{ headerShown: false }}
        />
        {/* Welcome Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DopingScandals"
          component={DopingScandals}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="News"
          component={News}
          options={{ headerShown: false }}
        />
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CaseStudies"
          component={CaseStudies}
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
          component={ProfilePage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewsDisplay"
          component={NewsDisplay}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="CaseStud"
          component={CaseStud}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImageTextExtractor"
          component={ImageTextExtractor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Podcast"
          component={Podcastcomp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Journals"
          component={Journals}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Figure"
          component={Figure}
          options={{ headerShown: false }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
