import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, ScrollView, Image, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SortLevelSelectorScreen from "../components/sortlevel";

// Import your social media icons statically
const socialMediaIcons = {
  instagram: require("../../images/socialmedia/instagram.png"),
  facebook: require("../../images/socialmedia/facebook.png"),
  linkedin: require("../../images/socialmedia/linkedin.png"),
  gmail: require("../../images/socialmedia/gmail.png"),
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [iconScale, setIconScale] = useState({});
  const shimmerAnim = new Animated.Value(0);
  const scanButtonAnim = new Animated.Value(0);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  useEffect(() => {
    // Shimmer animation for title text
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shimmer animation for scan button
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanButtonAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(scanButtonAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Shimmer effect for title text
  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [1, 0.6, 1],
    }),
  };

  // Shimmer effect for scan button
  const scanButtonStyle = {
    opacity: scanButtonAnim.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [1, 0.3, 1],
    }),
  };

  const handleIconPressIn = (icon) => {
    setIconScale((prev) => ({ ...prev, [icon]: 1.2 }));
  };

  const handleIconPressOut = (icon) => {
    setIconScale((prev) => ({ ...prev, [icon]: 1 }));
  };

  return (
    <ImageBackground
      source={require("../../images/homepic2.jpg")}
      style={styles.imageBackground}
      resizeMode="cover"
      blurRadius={7}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Chat List")}>
            <Text style={styles.navButtonText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate("Post")}
            >
            <Text style={styles.navButtonText}>Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}
          onPress={() => navigation.navigate("Forum")}
          >
            <Text style={styles.navButtonText}>Discussion Forum</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Game")}
          >
            <Text style={styles.navButtonText}>Play</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Animated.Text style={[styles.title, shimmerStyle]}>Fair Play</Animated.Text>
          <Text style={styles.subtitle}>
            Champion integrity, celebrate fairness – because true victory is earned, not taken.
          </Text>
        </View>

        {/* Updated Profile Icon with onPress handler */}
        <TouchableOpacity 
          style={styles.profileIcon}
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          <Ionicons name="person-circle" size={50} color="green" />
        </TouchableOpacity>

        <View style={styles.greenRectangle}>
          <View style={styles.iconContainer}>
            {["instagram", "facebook", "linkedin", "gmail"].map((icon) => (
              <TouchableOpacity
                key={icon}
                onPressIn={() => handleIconPressIn(icon)}
                onPressOut={() => handleIconPressOut(icon)}
              >
                <Image
                  source={socialMediaIcons[icon]}
                  style={[styles.socialIcon, { transform: [{ scale: iconScale[icon] || 1 }] }]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.rectangleText}>Next Section Content</Text>
        </View>

        <StatusBar style="auto" />
      </ScrollView>

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("TUE")}
      >
        <Animated.View style={[scanButtonStyle]}>
          <Ionicons name="scan-outline" size={30} color="white" />
        </Animated.View>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "220%",
  },
  titleContainer: {
    alignItems: "flex-start",
    position: "absolute",
    top: 150,
    left: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 100,
    fontWeight: "bold",
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    color: "black",
    marginTop: 5,
  },
  navBar: {
    position: "absolute",
    top: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "70%",
    padding: 10,
    backgroundColor: "rgba(0, 128, 0, 0.7)",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  profileIcon: {
    position: "absolute",
    top: 40,
    right: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  scanButton: {
    position: "absolute",
    bottom: 30,
    left: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  greenRectangle: {
    position: "absolute",
    width: "100%",
    height: 200,
    backgroundColor: "rgba(0, 128, 0, 0.7)",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: -1000,
    paddingTop: 30,
  },
  rectangleText: {
    color: "#fff",
    fontSize: 18,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  socialIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 30,
  },
});
