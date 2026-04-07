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
  name?: string;
  email?: string;
  phone_number?: string;
};

function toIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export default function BookAppointment() {
  const params = useLocalSearchParams<{ branchId?: string; branchTitle?: string }>();
  const queryClient = useQueryClient();

  const branchId = Number(params.branchId || 0);
  const branchTitle = params.branchTitle || "Selected Branch";

  const [tagUid, setTagUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [slotDate, setSlotDate] = useState(toIsoDate());
  const [note, setNote] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const raw = await getItem("userData");
      if (!raw) return;

      try {
        const user = JSON.parse(raw) as StoredUser;
        setTagUid(user.tag_uid || "");
        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone_number || "");
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
    const data = packageResponse?.data;
    return Array.isArray(data) ? data : [];
  }, [packageResponse]);

  useEffect(() => {
    if (!packages.length || selectedPackageId) return;
    const first = packages[0];
    setSelectedPackageId(first.id);
    setPartySize(String(first.min_pax || 1));
  }, [packages, selectedPackageId]);

  const { data: slotResponse, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["bookingSlots", branchId, slotDate],
    queryFn: () => getAvailableBookingSlots(branchId, slotDate),
    enabled: branchId > 0 && !!slotDate,
  });

  const slots: BookingSlot[] = useMemo(() => {
    const data = slotResponse?.data;
    return Array.isArray(data) ? data : [];
  }, [slotResponse]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === selectedPackageId) || null,
    [packages, selectedPackageId],
  );

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
    const pax = Number(partySize || 0);

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

    if (!name.trim() || !phone.trim()) {
      Alert.alert("Contact Required", "Please provide your name and phone.");
      return;
    }

    if (pax <= 0) {
      Alert.alert("Invalid Party Size", "Please enter a valid party size.");
      return;
    }

    if (selectedPackage && (pax < selectedPackage.min_pax || pax > selectedPackage.max_pax)) {
      Alert.alert(
        "Party Size Out of Range",
        `This package accepts ${selectedPackage.min_pax}-${selectedPackage.max_pax} guests.`,
      );
      return;
    }

    createBookingMutation.mutate({
      tag_uid: tagUid,
      branch_id: branchId,
      slot_id: selectedSlotId,
      package_id: selectedPackageId,
      user_name: name,
      user_email: email,
      user_phone: phone,
      party_size: pax,
      note,
      promo_id: null,
    });
  };

  return (
    <SafeAreaView
      className="flex-1 bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton={true} hasNotifications={false} />
        <View className="w-full h-auto items-center justify-center mt-10 px-6">
          <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
            Book Appointment
          </Text>
          <Text className="text-gray-600 text-base mt-2 text-center font-kanit">
            {branchTitle}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 36 }}>
          <Text className="text-darkBlue font-kanitBold text-lg mt-4 mb-2">
            1) Choose Package
          </Text>

          {isLoadingPackages ? (
            <Text className="text-gray-600 font-kanit">Loading packages...</Text>
          ) : packages.length === 0 ? (
            <Text className="text-gray-600 font-kanit">No packages available for this branch.</Text>
          ) : (
            packages.map((item) => {
              const isSelected = item.id === selectedPackageId;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setSelectedPackageId(item.id);
                    setPartySize(String(item.min_pax || 1));
                  }}
                  className={`rounded-xl border p-3 mb-3 ${isSelected ? "border-darkBlue bg-blue-50" : "border-gray-200 bg-white"}`}
                >
                  <Text className="font-kanitBold text-darkBlue text-base">{item.name}</Text>
                  <Text className="font-kanit text-gray-700 mt-1">
                    PHP {item.price_per_head.toFixed(2)} per head
                  </Text>
                  <Text className="font-kanit text-gray-700">
                    Pax range: {item.min_pax} - {item.max_pax}
                  </Text>
                  {!!item.best_for && (
                    <Text className="font-kanit text-gray-600 mt-1">Best for: {item.best_for}</Text>
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
              <Text className="text-gray-600 font-kanit">No available slots on selected date.</Text>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const disabled = !slot.is_available;
                  return (
                    <Pressable
                      key={slot.id}
                      onPress={() => !disabled && setSelectedSlotId(slot.id)}
                      disabled={disabled}
                      className={`px-3 py-2 rounded-lg border ${isSelected ? "border-darkBlue bg-blue-100" : "border-gray-200 bg-white"}`}
                      style={{ opacity: disabled ? 0.5 : 1 }}
                    >
                      <Text className="font-kanitBold text-darkBlue text-sm">
                        {slot.time_start} - {slot.time_end}
                      </Text>
                      <Text className="font-kanit text-xs text-gray-600">
                        Seats left: {slot.available_seats}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <Text className="text-darkBlue font-kanitBold text-lg mt-6 mb-2">
            3) Booking Details
          </Text>

          <NormalInput inputName="Name" value={name} onChangeText={setName} inputWidth="100%" />
          <View className="h-3" />
          <NormalInput inputName="Email" value={email} onChangeText={setEmail} inputWidth="100%" />
          <View className="h-3" />
          <NormalInput
            inputName="Phone"
            value={phone}
            onChangeText={setPhone}
            inputWidth="100%"
            isNumeric={true}
            maxLength={11}
          />
          <View className="h-3" />
          <NormalInput
            inputName="Party Size"
            value={partySize}
            onChangeText={setPartySize}
            inputWidth="100%"
            isNumeric={true}
          />
          <View className="h-3" />
          <NormalInput
            inputName="Special Requests"
            value={note}
            onChangeText={setNote}
            inputWidth="100%"
          />

          <View className="mt-6">
            <SmallPrimaryButton
              buttonName={createBookingMutation.isPending ? "Submitting..." : "Save Booking"}
              onPress={handleSubmit}
              isDisabled={createBookingMutation.isPending || branchId <= 0}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
