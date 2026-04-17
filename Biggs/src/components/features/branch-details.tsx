import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { SmallPrimaryButton } from "../ui/Buttons";
import AppCarousel from "../ui/Carousel";

type BranchDetailsProps = {
  branch?: any; // You can replace 'any' with a specific type for branch details
  onChange?: (index: number) => void;
  currentIndex?: number | null;
  isFavoriteSelectionMode?: boolean;
  isSavingFavorite?: boolean;
  onSetFavorite?: (branch: any) => Promise<void> | void;
};

const BranchDetail = forwardRef<any, BranchDetailsProps>(
  (
    {
      branch,
      onChange,
      currentIndex,
      isFavoriteSelectionMode = false,
      isSavingFavorite = false,
      onSetFavorite,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const snapPoints = useMemo(() => ["60%"], []);

    const handleBookAppointment = useCallback(async () => {
      setIsOpen(false);
      (ref as { current: any })?.current?.dismiss();
      // Wait for the modal to dismiss before navigating
      setTimeout(() => {
        router.push({
          pathname: "/(booking)/book-appointment",
          params: {
            branchId: String(branch?.id || ""),
            branchTitle: branch?.title || "",
          },
        });
      }, 300);
    }, [ref, branch?.id, branch?.title]);

    console.log("Branch details:", branch);

    const hasFunctionHall = Boolean(
      branch?.has_function_hall ||
        branch?.hasVenueHall ||
        (branch?.function_hall_images?.length ?? 0) > 0 ||
        (branch?.functionHallImages?.length ?? 0) > 0,
    );

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
    const packages: any[] = Array.isArray(branch?.packages)
      ? branch.packages
      : [];

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

    const handleSetAsFavorite = useCallback(async () => {
      if (!branch || !onSetFavorite) return;
      await onSetFavorite(branch);
    }, [branch, onSetFavorite]);

    const renderFooter = useCallback(
      (props: any) => (
        <BottomSheetFooter {...props}>
          {(isFavoriteSelectionMode || hasFunctionHall) && (
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: 24,
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb",
                backgroundColor: "#ffffff",
                gap: 8,
              }}
            >
              {isFavoriteSelectionMode && (
                <SmallPrimaryButton
                  buttonName={
                    isSavingFavorite ? "Saving..." : "Set as Favorite"
                  }
                  onPress={handleSetAsFavorite}
                  isDisabled={isSavingFavorite || !branch?.id}
                />
              )}
              {hasFunctionHall && (
                <SmallPrimaryButton
                  buttonName="Book Event"
                  onPress={handleBookAppointment}
                />
              )}
            </View>
          )}
        </BottomSheetFooter>
      ),
      [
        isFavoriteSelectionMode,
        hasFunctionHall,
        isSavingFavorite,
        branch?.id,
        handleSetAsFavorite,
        handleBookAppointment,
      ],
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        enableHandlePanningGesture={true} // ✅ only allow dragging from the handle
        enableContentPanningGesture={false} // ✅ disable panning from content area
      >
        <BottomSheetView style={{ flex: 1 }}>
          {/* Scrollable area */}
          <BottomSheetScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 100,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-3">
              <View className="flex-row justify-between items-start gap-1">
                <View className="flex-1">
                  <Text className="font-kanitBold text-xl">
                    {branch?.title}
                  </Text>
                  <Text className="font-kanitBold text-xl">{address}</Text>
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
                <View className="flex-1">
                  <Text className="font-kanitBold text-lg">Description</Text>
                  <View className="flex-row items-center">
                    <Text className="text-gray-700 text-sm font-kanitSemiBold">
                      {time}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-700 text-sm font-kanitSemiBold">
                      {features}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="gap-2">
                <Text className="font-kanitBold text-lg">Packages</Text>
                {packages.length === 0 ? (
                  <Text className="text-gray-500 text-sm font-kanitSemiBold">
                    No packages available.
                  </Text>
                ) : (
                  packages.map((item, index) => {
                    const packageTitle =
                      item?.name ||
                      item?.title ||
                      item?.packageName ||
                      `Package ${index + 1}`;
                    const packageDescription =
                      item?.description ||
                      item?.details ||
                      item?.inclusion ||
                      "";
                    const packagePrice = item?.price || item?.amount || "";

                    return (
                      <View
                        key={`${String(packageTitle)}-${index}`}
                        className="rounded-xl border border-gray-200 p-3 gap-1"
                      >
                        <Text className="font-kanitSemiBold text-base text-gray-900">
                          {packageTitle}
                        </Text>
                        {!!packageDescription && (
                          <Text className="text-gray-600 text-sm font-kanitSemiBold">
                            {packageDescription}
                          </Text>
                        )}
                        {!!packagePrice && (
                          <Text className="text-gray-700 text-sm font-kanitSemiBold">
                            PHP {packagePrice}
                          </Text>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            </View>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

BranchDetail.displayName = "BranchDetail";

export default BranchDetail;
