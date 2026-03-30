import React, { useState } from "react";
import { Image, Text, View } from "react-native";

interface Props {
  text: string;
  imageWidth?: number;
  imageHeight?: number;
  offsetX?: number; // negative = move left (inner), positive = move right
  offsetY?: number; // positive = move down, negative = move up
  className?: string;
  textClassName?: string;
}

export function HeadingText({
  text,
  imageWidth = 20,
  imageHeight = 30,
  offsetX = -15,
  offsetY = 8,
  className = "",
}: Props) {
  const [imagePos, setImagePos] = useState<{ x: number; y: number } | null>(
    null,
  );

  return (
    <View className={`relative ${className}`}>
      <Text
        className="text-2xl font-kanitBold text-center mt-1 mb-2 uppercase text-darkBlue"
        onTextLayout={(e) => {
          const lines = e.nativeEvent.lines;
          const last = lines[lines.length - 1];
          setImagePos({ x: last.x + last.width, y: last.y });
        }}
      >
        {text}
        {"  "}
      </Text>

      {imagePos && (
        <Image
          source={require("../../../assets/images/blue_checker.png")}
          className="absolute -rotate-[30deg]"
          style={{
            left: imagePos.x + offsetX, // ← apply offsetX here
            top: imagePos.y + offsetY, // ← apply offsetY here
            width: imageWidth,
            height: imageHeight,
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

export function WelcomeText({
  text,
  imageWidth = 33,
  imageHeight = 30,
  offsetX = -25,
  offsetY = 15,
  className = "",
}: Props) {
  const [imagePos, setImagePos] = useState<{ x: number; y: number } | null>(
    null,
  );

  return (
    <View className={`relative ${className}`}>
      <Text
        className="text-4xl font-kanitBold text-center mt-1 mb-2 uppercase text-darkBlue"
        onTextLayout={(e) => {
          const lines = e.nativeEvent.lines;
          const last = lines[lines.length - 1];
          setImagePos({ x: last.x + last.width, y: last.y });
        }}
      >
        {text}
        {"  "}
      </Text>

      {imagePos && (
        <Image
          source={require("../../../assets/images/blue_checker.png")}
          className="absolute -rotate-[30deg]"
          style={{
            left: imagePos.x + offsetX, // ← apply offsetX here
            top: imagePos.y + offsetY, // ← apply offsetY here
            width: imageWidth,
            height: imageHeight,
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}
