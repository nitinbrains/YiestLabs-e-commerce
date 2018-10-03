import React, { Component } from "react";
import {
  Dimensions,
  StatusBar,
  Linking,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";
import {
  Container,
  List,
  ListItem,
  Icon,
  Left,
  Right,
  Body,
  Text,
  Button,
  Title
} from "native-base";

import {
  VictoryPie,
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryScatter,
  VictoryTheme
} from "victory-native";

var DataVisualization = (function() {
  function getPie(data) {
    getPie = (
      <View>
        <VictoryPie
          data={data}
          colorScale={data.map(data => data.color)}
          theme={VictoryTheme.material}
          width={Dimensions.get("window").width - 40}
          animate={{
            onLoad: {
              duration: 1000
            }
          }}
        />

        {data.map((data, i) => {
          return (
            <View key={i} style={styles.pieLegend}>
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.pieLegendColor,
                    { backgroundColor: data.color }
                  ]}
                />
              </View>
              <View style={{ flex: 3 }}>
                <Text>{data.x}</Text>
              </View>
              <View style={{ flex: 3, alignItems: "flex-end" }}>
                <Text>{data.y} users</Text>
              </View>
            </View>
          );
        })}
      </View>
    );

    return getPie;
  }

  function getLine(data) {
    getLine = (
      <View>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryLine
            data={data}
            style={{
              data: { stroke: "#f28411" }
            }}
            width={Dimensions.get("window").width - 40}
            animate={{
              duration: 2000,
              onLoad: {
                duration: 1000
              }
            }}
          />
        </VictoryChart>

        {data.map((data, i) => {
          return (
            <View
              key={i}
              style={[styles.pieLegend, { marginLeft: 20, marginRight: 20 }]}
            >
              <View style={{ flex: 3 }}>
                <Text>{data.x}</Text>
              </View>
              <View style={{ flex: 3, alignItems: "flex-end" }}>
                <Text>{data.y} users</Text>
              </View>
            </View>
          );
        })}
      </View>
    );

    return getLine;
  }

  function getBar(data) {
    getBar = (
      <View>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryBar
            data={data}
			domainPadding={{ x: 25 }}
            style={{
              data: {
                fill: d => d.color
              }
            }}
            width={Dimensions.get("window").width - 40}
            animate={{
              onLoad: {
                duration: 1000
              }
            }}
          />
        </VictoryChart>

        {data.map((data, i) => {
          return (
            <View
              key={i}
              style={[styles.pieLegend, { marginLeft: 20, marginRight: 20 }]}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.pieLegendColor,
                    { backgroundColor: data.color }
                  ]}
                />
              </View>
              <View style={{ flex: 3 }}>
                <Text>{data.x}</Text>
              </View>
              <View style={{ flex: 3, alignItems: "flex-end" }}>
                <Text>{data.y} users</Text>
              </View>
            </View>
          );
        })}
      </View>
    );

    return getBar;
  }

  function getScatter(data) {
    getScatter = (
      <View>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryScatter
            data={data}
			domainPadding={{ x: 25 }}
            size={7}
            style={{
              data: {
                fill: d => d.color
              }
            }}
			width={Dimensions.get("window").width - 40}
            animate={{
              onLoad: {
                duration: 1000
              }
            }}
          />
        </VictoryChart>

        {data.map((data, i) => {
          return (
            <View
              key={i}
              style={[styles.pieLegend, { marginLeft: 20, marginRight: 20 }]}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={[
                    styles.pieLegendColor,
                    { backgroundColor: data.color }
                  ]}
                />
              </View>
              <View style={{ flex: 3 }}>
                <Text>{data.x}</Text>
              </View>
              <View style={{ flex: 3, alignItems: "flex-end" }}>
                <Text>{data.y} users</Text>
              </View>
            </View>
          );
        })}
      </View>
    );

    return getScatter;
  }

  return {
    getPie: getPie,
    getLine: getLine,
    getBar: getBar,
    getScatter: getScatter
  };
})();

const styles = StyleSheet.create({
  pieLegend: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5
  },
  pieLegendColor: {
    width: 15,
    height: 15,
    borderRadius: 5
  }
});

module.exports.DataVisualization = DataVisualization;
