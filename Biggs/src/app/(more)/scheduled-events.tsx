import { HeaderBigLogo } from "@/src/components/layout/header";
import { MiniGhostButton } from "@/src/components/ui/Buttons";
import {
  BookingRecord,
  cancelBooking,
  getMyBookings,
} from "@/src/services/api/bookings";
import { getItem } from "@/src/utils/asyncStorage";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StoredUser = {
  tag_uid: string;
};

function statusColor(status?: string) {
  if (status === "confirmed") return "#166534";
  if (status === "cancelled") return "#991b1b";
  return "#92400e";
}

export default function ScheduledEvents() {
  const [tagUid, setTagUid] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const raw = await getItem("userData");
      if (!raw) return;

      try {
        const user = JSON.parse(raw) as StoredUser;
        setTagUid(user.tag_uid || "");
      } catch (error) {
        console.error("Failed to parse userData for scheduled events", error);
      }
    };

    loadUser();
  }, []);

  const {
    data: bookingsResponse,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["myBookings", tagUid],
    queryFn: () => getMyBookings(tagUid),
    enabled: !!tagUid,
  });

  const handleCancelSchedule = useCallback(
    async (bookingId: number, tagUid: string) => {
      try {
        console.log(
          "Attempting to cancel booking with ID:",
          bookingId,
          "for tag UID:",
          tagUid,
        );
        await cancelBooking(bookingId, tagUid);
        await refetch();
        Alert.alert("Success", "Booking cancelled successfully.");
      } catch (error) {
        console.error("Failed to cancel booking", error);
        Alert.alert("Error", "Failed to cancel the booking. Please try again.");
      }
    },
    [refetch],
  );

  const bookings: BookingRecord[] = useMemo(() => {
    const data = bookingsResponse?.data;
    return Array.isArray(data) ? data : [];
  }, [bookingsResponse]);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton={true} hasNotifications={false} />
        <View className="w-full h-auto items-center justify-center mt-16">
          <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
            Scheduled Events
          </Text>
        </View>

        <ScrollView
          className="px-4 mt-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          {isLoading ? (
            <Text className="text-gray-600 font-kanit">
              Loading your events...
            </Text>
          ) : bookings.length === 0 ? (
            <Text className="text-gray-600 font-kanit">
              No scheduled events yet.
            </Text>
          ) : (
            bookings.map((booking) => (
              <View
                key={booking.id}
                className="rounded-xl border border-gray-200 bg-white p-4 mb-3"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="font-kanitBold text-darkBlue text-base">
                    Booking #{booking.id}
                  </Text>
                  <Text
                    className="font-kanitBold uppercase text-xs"
                    style={{ color: statusColor(booking.status) }}
                  >
                    {booking.status || "pending"}
                  </Text>
                </View>

                <Text className="font-kanit text-gray-700 mt-2">
                  Branch ID: {booking.branch_id}
                </Text>

                {!!booking.package_name && (
                  <Text className="font-kanit text-gray-700">
                    Package: {booking.package_name}
                  </Text>
                )}

                <Text className="font-kanit text-gray-700">
                  Schedule: {booking.slot_date || "-"}{" "}
                  {booking.time_start || ""}
                  {booking.time_end ? ` - ${booking.time_end}` : ""}
                </Text>

                {!!booking.created_at && (
                  <Text className="font-kanit text-gray-500 text-xs mt-1">
                    Requested: {booking.created_at}
                  </Text>
                )}

                {booking.status !== "cancelled" && (
                  <View>
                    <MiniGhostButton
                      buttonName="Cancel Booking"
                      onPress={() => handleCancelSchedule(booking.id, tagUid)}
                    />
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
