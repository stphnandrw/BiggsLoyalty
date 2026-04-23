import { HeaderBigLogo } from "@/src/components/layout/header";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingDetailsView() {
  const { booking_id } = useLocalSearchParams<{ booking_id?: string }>();
  const bookingId = Array.isArray(booking_id) ? booking_id[0] : booking_id;

  const title = bookingId ? `Booking #${bookingId}` : "Booking Details";
  const description = bookingId
    ? `This is the details view for booking ID ${bookingId}.`
    : "No booking ID was provided.";
  const date = "To be updated";
  const imageUrl = "https://via.placeholder.com/1200x600.png?text=Booking";
  const status: "Confirmed" | "Pending" | "Cancelled" = "Pending";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderBigLogo hasBackButton />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image Section */}
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-64 bg-gray-200"
          resizeMode="cover"
        />

        <View className="p-6">
          {/* Status Badge */}
          <View className="self-start px-3 py-1 rounded-full bg-darkBlue mb-4">
            <Text className="text-white text-xs font-kanitMedium uppercase">
              {status}
            </Text>
          </View>

          {/* Content */}
          <Text className="text-3xl font-kanitMedium text-darkBlue mb-2">
            {title}
          </Text>

          <Text className="text-gray-500 font-kanitLight mb-6">
            Scheduled for: {date}
          </Text>

          <Text className="text-gray-500 font-kanitLight mb-2">
            Booking ID: {bookingId ?? "N/A"}
          </Text>

          <View className="h-[1px] bg-gray-100 mb-6" />

          <Text className="text-gray-700 leading-6 text-base mb-8">
            {description}
          </Text>

          <TouchableOpacity className="w-full bg-darkBlue py-4 rounded-xl items-center opacity-60">
            <Text className="text-white font-kanitMedium text-lg">Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
