import { HeaderBigLogo } from "@/src/components/layout/header";
import { SmallPrimaryButton } from "@/src/components/ui/Buttons";
import { NormalInput } from "@/src/components/ui/Inputs";
import { handleApiError } from "@/src/services/api/api";
import {
  BookingPackage,
  BookingSlot,
  createBooking,
  getAvailableBookingSlots,
  getBranchPackages,
} from "@/src/services/api/bookings";
import { getItem } from "@/src/utils/asyncStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StoredUser = {
  tag_uid: string;
};

function toIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function toNumber(value: number | string | null | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export default function BookAppointment() {
  const params = useLocalSearchParams<{
    branchId?: string;
    branchTitle?: string;
  }>();
  const queryClient = useQueryClient();

  const branchId = Number(params.branchId || 0);
  const branchTitle = params.branchTitle || "Selected Branch";

  const [tagUid, setTagUid] = useState("");
  const [slotDate, setSlotDate] = useState(toIsoDate());
  const [note, setNote] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null,
  );
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const raw = await getItem("userData");
      if (!raw) return;

      try {
        const user = JSON.parse(raw) as StoredUser;
        setTagUid(user.tag_uid || "");
      } catch (error) {
        console.error("Failed to parse stored userData", error);
      }
    };

    loadUser();
  }, []);

  const { data: packageResponse, isLoading: isLoadingPackages } = useQuery({
    queryKey: ["bookingPackages", branchId],
    queryFn: () => getBranchPackages(branchId),
    enabled: branchId > 0,
  });

  const packages: BookingPackage[] = useMemo(() => {
    return Array.isArray(packageResponse) ? packageResponse : [];
  }, [packageResponse]);

  useEffect(() => {
    if (!packages.length || selectedPackageId) return;
    const first = packages[0];
    setSelectedPackageId(toNumber(first.package_id));
  }, [packages, selectedPackageId]);

  const { data: slotResponse, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["bookingSlots", branchId, slotDate],
    queryFn: () => getAvailableBookingSlots(branchId, slotDate),
    enabled: branchId > 0 && !!slotDate,
  });

  const slots: BookingSlot[] = useMemo(() => {
    return Array.isArray(slotResponse) ? slotResponse : [];
  }, [slotResponse]);

  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      if (tagUid) {
        queryClient.invalidateQueries({ queryKey: ["myBookings", tagUid] });
      }

      Alert.alert("Success", "Your booking request has been submitted.", [
        {
          text: "View Scheduled Events",
          onPress: () => router.replace("/(more)/scheduled-events"),
        },
      ]);
    },
    onError: (error) => {
      Alert.alert("Booking Failed", handleApiError(error));
    },
  });

  const handleSubmit = () => {
    if (!tagUid) {
      Alert.alert("Missing User", "Please login again before booking.");
      return;
    }

    if (!selectedPackageId) {
      Alert.alert("Package Required", "Please select a package.");
      return;
    }

    if (!selectedSlotId) {
      Alert.alert("Slot Required", "Please select an available slot.");
      return;
    }

    createBookingMutation.mutate({
      tag_uid: tagUid,
      slot_id: selectedSlotId,
      package_id: selectedPackageId,
      note,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton={true} hasNotifications={false} />
        <View className="w-full h-auto items-center justify-center mt-10 px-6">
          <Text className="text-gray-600 text-base mt-2 text-center font-kanit">
            {branchTitle}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 36 }}
        >
          <Text className="text-darkBlue font-kanitBold text-lg mt-4 mb-2">
            1) Choose Package
          </Text>

          {isLoadingPackages ? (
            <Text className="text-gray-600 font-kanit">
              Loading packages...
            </Text>
          ) : packages.length === 0 ? (
            <Text className="text-gray-600 font-kanit">
              No packages available for this branch.
            </Text>
          ) : (
            packages.map((item, index) => {
              const packageId = toNumber(item.package_id);
              const packagePaxSize = toNumber(item.pax_size, 1);
              const isSelected = packageId === selectedPackageId;
              const packagePrice = toNumber(item.price);
              const packageKey = `${item.package_id ?? "pkg"}-${item.package_name ?? "unnamed"}-${index}`;

              return (
                <Pressable
                  key={packageKey}
                  onPress={() => {
                    setSelectedPackageId(packageId);
                  }}
                  className={`rounded-xl border p-3 mb-3 ${isSelected ? "border-darkBlue bg-blue-50" : "border-gray-200 bg-white"}`}
                >
                  <Text className="font-kanitBold text-darkBlue text-base">
                    {item.package_name}
                  </Text>
                  <Text className="font-kanit text-gray-700 mt-1">
                    PHP {packagePrice.toFixed(2)} per head
                  </Text>
                  <Text className="font-kanit text-gray-700">
                    Good for {packagePaxSize} pax
                  </Text>
                  {!!item.details && (
                    <Text className="font-kanit text-gray-600 mt-1">
                      {item.details}
                    </Text>
                  )}
                </Pressable>
              );
            })
          )}

          <Text className="text-darkBlue font-kanitBold text-lg mt-2 mb-2">
            2) Pick Date and Slot
          </Text>
          <NormalInput
            inputName="Date (YYYY-MM-DD)"
            value={slotDate}
            onChangeText={setSlotDate}
            inputWidth="100%"
          />

          <View className="mt-3">
            {isLoadingSlots ? (
              <Text className="text-gray-600 font-kanit">Loading slots...</Text>
            ) : slots.length === 0 ? (
              <Text className="text-gray-600 font-kanit">
                No available slots on selected date.
              </Text>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {slots.map((slot, index) => {
                  console.log("Slot details:", slot);
                  const isSelected = selectedSlotId === slot.id;
                  const disabled = !slot.is_available;
                  const slotKey = `${slot.id ?? "slot"}-${slot.time_start}-${slot.time_end}-${index}`;
                  return (
                    <Pressable
                      key={slotKey}
                      onPress={() => !disabled && setSelectedSlotId(slot.id)}
                      disabled={disabled}
                      className={`px-3 py-2 rounded-lg border ${isSelected ? "border-darkBlue bg-blue-100" : "border-gray-200 bg-white"}`}
                      style={{ opacity: disabled ? 0.5 : 1 }}
                    >
                      <Text className="font-kanitBold text-darkBlue text-sm">
                        {slot.time_start} - {slot.time_end}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <Text className="text-darkBlue font-kanitBold text-lg mt-6 mb-2">
            3) Note
          </Text>
          <NormalInput
            inputName="Special Requests"
            value={note}
            onChangeText={setNote}
            inputWidth="100%"
          />

          <View className="mt-6">
            <SmallPrimaryButton
              buttonName={
                createBookingMutation.isPending
                  ? "Submitting..."
                  : "Save Booking"
              }
              onPress={handleSubmit}
              isDisabled={createBookingMutation.isPending || branchId <= 0}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
