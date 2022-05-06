import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
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

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [cityName, setCityName] = useState("");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const [week, setWeek] = useState("");

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

  //오늘 날짜 가져오기
  const getWeek = async () => {};

  useEffect(() => {
    getWeather();
    getWeek();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
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
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              size="large"
              color="white"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, idx) => (
            <View key={idx} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={40}
                  color="white"
                />
              </View>
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
    backgroundColor: "#189CC4",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityname: {
    fontSize: 70,
    fontWeight: "800",
    color: "white",
  },
  weather: {
    // backgroundColor: "teal",
  },
  day: {
    // flex: 1,
    // backgroundColor: "teal",
    width: SCREEN_WIDTH,
    // alignItems: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    fontSize: 90,
    marginTop: 50,
    fontWeight: "700",
    color: "white",
  },
  description: {
    fontSize: 40,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  },
});
