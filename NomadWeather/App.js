import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

// 현재 기기 넓이 알아보는법
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// 날씨 받아오는 API_KEY

const API_KEY = "3ec77581799218a8534c31f41598f3f4";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [cityName, setCityName] = useState("");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  // 현재 위치 알아보는법
  const getWeather = async () => {
    let url = "";

    const { granted } = await Location.requestForegroundPermissionsAsync();

    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    setCityName(location[0].name);

    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`;
    await axios
      .get(url, {
        withCredentials: false,
      })
      .then((res) => {
        console.log("날씨 정보", res.data.daily);
        setDays(res.data.daily);
      });
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityname}>
          {city} {cityName}
        </Text>
      </View>
      {/* 스크롤 방법  */}
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          days.map((day, idx) => (
            <View key={idx} style={styles.day}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}℃
              </Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityname: {
    fontSize: 50,
    fontWeight: "500",
  },
  weather: {
    // backgroundColor: "teal",
  },
  day: {
    // flex: 1,
    // backgroundColor: "teal",
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 90,
  },
  description: {
    fontSize: 70,
  },
  tinyText: {
    fontSize: 20,
  },
});
