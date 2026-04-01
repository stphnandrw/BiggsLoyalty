import { HeaderBigLogo } from "@/src/components/layout/header";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookAppointment() {
  const packages = [
    {
      package: 1,
      name: "Basic Package (Snack/Seminar)",
      pricePerHead: 350,
      minPax: 20,
      maxPax: 30, // Typical for a single small function room
      inclusions: [
        "3-hour hall use",
        "Sound system",
        "Plated snack",
        "Bottomless Iced Tea",
      ],
      bestFor: "Small Meetings or Workshops",
    },
    {
      package: 2,
      name: "Classic Buffet",
      pricePerHead: 550,
      minPax: 30,
      maxPax: 50, // Standard capacity for mid-sized rooms
      inclusions: [
        "4-hour hall use",
        "Standard Buffet",
        "Basic Venue Decor",
        "Projector Use",
      ],
      bestFor: "Birthdays and Family Reunions",
    },
    {
      package: 3,
      name: "Grand Celebration",
      pricePerHead: 750,
      minPax: 50,
      maxPax: 100, // For larger halls like Sipocot or Magsaysay
      inclusions: [
        "5-hour hall use",
        "Premium Buffet",
        "Special Setup",
        "Dedicated Coordinator",
      ],
      bestFor: "Corporate Events, Weddings, and Debuts",
    },
  ];

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton={true} hasNotifications={false} />
        <View className="w-full h-auto items-center justify-center mt-16">
          <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
            Book Appointment
          </Text>
        </View>
        <View className="w-full h-auto items-center justify-center mb-6 px-6">
          <Text className="text-gray-700 text-base leading-relaxed text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
            consequatur autem vitae distinctio et saepe doloremque cupiditate
            quae provident reiciendis obcaecati cumque voluptas fugit, maiores
            nesciunt vero expedita labore ullam.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
