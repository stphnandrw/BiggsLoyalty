import { SmallPrimaryButton } from "@/src/components/ui/Buttons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import AppCarousel from "../ui/Carousel";

type BranchDetailsProps = {
  branch?: any; // You can replace 'any' with a specific type for branch details
  onChange?: (index: number) => void;
  currentIndex?: number | null;
};

const BranchDetail = forwardRef<any, BranchDetailsProps>(
  ({ branch, onChange, currentIndex }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const snapPoints = useMemo(() => ["60%"], []);

    const handleBookAppointment = async () => {
      setIsOpen(false);
      (ref as { current: any })?.current?.dismiss();
      // Wait for the modal to dismiss before navigating
      setTimeout(() => {
        router.push(`/book-appointment?branchId=${branch?.id || ""}`);
      }, 300);
    };

    // Images for carousel
    const BASE_IMAGE_URL = "https://biggs.ph/biggs_website/controls/uploads/";
    function withBaseUrl(img: string): string {
      if (!img) return BASE_IMAGE_URL;
      // If already absolute (http/https), return as is
      if (/^https?:\/\//.test(img)) return img;
      // Otherwise, prefix with base URL (replace with correct logic if needed)
      return BASE_IMAGE_URL + img;
    }

    const images: string[] = [
      ...(branch?.images ?? []).map(withBaseUrl),
      ...(branch?.functionHallImages ?? []).map(withBaseUrl),
    ];
    const hasImages = images.length > 0;

    // Block hardware back button while the sheet is open
    useEffect(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (isOpen) {
          (ref as { current: any })?.current?.dismiss();
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [isOpen, ref, currentIndex]);

    function parseBranchDescription(description: string) {
      if (!description) {
        return {
          hours: "",
          features: "",
          address: "",
        };
      }

      // Convert <br> to newline
      const cleanText = description.replace(/<br\s*\/?>/gi, "\n");

      // Remove HTML tags
      const noHtml = cleanText.replace(/<\/?[^>]+(>|$)/g, "");

      // Split and clean lines
      const lines = noHtml
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      return {
        time: lines[0] || "",
        features: lines[1] || "",
        address: lines[2] || "",
      };
    }

    const { time, features, address } = parseBranchDescription(
      branch?.description,
    );

    const renderBackdrop = useCallback(
      (backdropProps: any) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={0.2}
        />
      ),
      [],
    );

    const handleSheetChange = (index: number) => {
      setIsOpen(index >= 0);
      onChange?.(index);
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, gap: 12 }}>
          {/* Scrollable content grows to fill available space */}
          <View className="flex-1 gap-3">
            <View className="flex-row justify-between items-start gap-1 ">
              <View className="flex-1 border">
                <Text className="font-kanitBold text-xl">{branch?.title}</Text>
                <Text className="font-kanitBold text-xl">{address}</Text>
              </View>
              <View className="w-[20%] items-end border">
                <Text className="font-kanitBold">Price</Text>
              </View>
            </View>

            {hasImages && (
              <AppCarousel
                data={images.map((uri) => ({ image: { uri } }))}
                showPagination={images.length > 1}
                autoPlay={images.length > 1}
              />
            )}
            <View className="flex-row justify-between items-start gap-1">
              <View className="flex-1 border">
                <Text className="font-kanitBold text-lg">Description</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-700 text-sm font-kanitSemiBold">
                    {time}
                  </Text>
                  <Text className="text-gray-700 text-sm font-kanitSemiBold">
                    {features}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ paddingBottom: 16 }}>
            <SmallPrimaryButton
              buttonName="Book Event"
              onPress={handleBookAppointment}
              isFontSmall
              buttonWidth="100%"
              isCentered
              isSticky
              fontUsed={"font-kanitBold"}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BranchDetail.displayName = "BranchDetail";

export default BranchDetail;
