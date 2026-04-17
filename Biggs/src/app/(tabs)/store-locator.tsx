import BranchDetail from "@/src/components/features/branch-details";
import {
    MiniGhostButton,
    MiniPrimaryButton,
    SmallPrimaryButton,
} from "@/src/components/ui/Buttons";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { getOutlets } from "@/src/services/api/outlets";
import { addFavoriteLocation, checkUserExists } from "@/src/services/api/user";
import type { Outlet } from "@/src/types";
import { getItem, setItem } from "@/src/utils/asyncStorage";
import {
    clearFavoriteBranchSelectionMode,
    getFavoriteBranchSelectionMode,
} from "@/src/utils/favoriteBranch";
import Mapbox, {
    Camera,
    LineLayer,
    LocationPuck,
    MapView,
    PointAnnotation,
    ShapeSource,
} from "@rnmapbox/maps";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import {
    GestureHandlerRootView,
    Pressable,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const MapBoxAccessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

Mapbox.setAccessToken(MapBoxAccessToken ?? null);

const defaultCoordinate: [number, number] = [
  122.56434150000001, 13.652179200000027,
];

// UI-facing type: API shape + parsed coordinate
type MappedOutlet = Outlet & { coordinate: [number, number] };
type OutletFilter = "all" | "functionHall";

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseLongLat(longlat: string): [number, number] | null {
  const [latRaw, lonRaw] = longlat.split(",").map((value) => value.trim());
  const latitude = Number(latRaw);
  const longitude = Number(lonRaw);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  return [longitude, latitude];
}

function outletHasFunctionHall(outlet: Outlet): boolean {
  const anyOutlet = outlet as Outlet & {
    hasVenueHall?: boolean;
    functionHallImages?: string[];
  };

  return Boolean(
    anyOutlet.has_function_hall ||
    anyOutlet.hasVenueHall ||
    (anyOutlet.function_hall_images?.length ?? 0) > 0 ||
    (anyOutlet.functionHallImages?.length ?? 0) > 0,
  );
}

export default function Store() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();

  function mapOutlet(outlet: Outlet): MappedOutlet | null {
    const coordinate = parseLongLat(outlet.longlat);
    if (!coordinate) return null;
    return { ...outlet, coordinate };
  }

  const [zoomLevel, setZoomLevel] = useState(6);
  const [defaultCenter, setDefaultCenter] = useState(defaultCoordinate);
  const [location, setLocation] = useState<MappedOutlet | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [routeGeoJSON, setRouteGeoJSON] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [isFavoriteSelectionMode, setIsFavoriteSelectionMode] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [outletFilter, setOutletFilter] = useState<OutletFilter>("all");

  const bottomSheetRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const ITEM_WIDTH = 60 + 14;
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

  // Fetch outlets with React Query for automatic retry and error handling
  const {
    data: outletsRaw = [],
    isLoading: isLoadingOutlets,
    isError: isErrorOutlets,
    refetch: refetchOutlets,
    isRefetching: isRefetchingOutlets,
  } = useQuery({
    queryKey: ["outlets"],
    queryFn: async () => {
      const response = await getOutlets();
      return Array.isArray(response) ? response : [];
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Map and filter outlets
  const outletLocations = outletsRaw
    .map(mapOutlet)
    .filter((item): item is MappedOutlet => item !== null);

  // Update default center if outlets loaded
  useEffect(() => {
    if (outletLocations.length > 0 && defaultCenter === defaultCoordinate) {
      setDefaultCenter(outletLocations[0].coordinate);
    }
  }, [outletLocations]);

  const visibleOutletLocations =
    outletFilter === "functionHall"
      ? outletLocations.filter(outletHasFunctionHall)
      : outletLocations;

  useFocusEffect(
    useCallback(() => {
      const loadSelectionMode = async () => {
        const modeParam = Array.isArray(params.mode)
          ? params.mode[0]
          : params.mode;
        const isSelectionFromParam = modeParam === "favorite";
        const isSelectionFromStorage = await getFavoriteBranchSelectionMode();
        setIsFavoriteSelectionMode(
          isSelectionFromParam || isSelectionFromStorage,
        );
      };

      loadSelectionMode();

      return () => {};
    }, [params.mode]),
  );

  const fetchRoute = async (destination: [number, number]) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const pos = await Location.getCurrentPositionAsync({});
    const origin = `${pos.coords.longitude},${pos.coords.latitude}`;
    const dest = `${destination[0]},${destination[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${dest}?geometries=geojson&access_token=${MapBoxAccessToken}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry;
        setRouteGeoJSON({
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: route,
            },
          ],
        });
      }
    } catch (e) {
      console.error("Failed to fetch route:", e);
    }
  };

  const handleOpenDetails = (selectedLocation: MappedOutlet) => {
    setIsActive(true);
    setLocation(selectedLocation);
    setDefaultCenter(selectedLocation.coordinate);
    setZoomLevel(15);
    bottomSheetRef.current?.present?.();
    fetchRoute(selectedLocation.coordinate);

    const index = visibleOutletLocations.findIndex(
      (item) => item.id === selectedLocation.id,
    );
    if (index !== -1) {
      const x = index * ITEM_WIDTH - scrollViewWidth / 2 + ITEM_WIDTH / 2;
      scrollViewRef.current?.scrollTo({
        x: Math.max(0, x),
        animated: true,
      });
    }
  };

  const handleCloseDetails = useCallback((isSheetActive: boolean) => {
    if (!isSheetActive) {
      bottomSheetRef.current?.dismiss?.();
      setIsActive(false);
      setLocation(null);
      setRouteGeoJSON(null);
      setDefaultCenter(defaultCoordinate);
      setZoomLevel(6);
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    const locationIsVisible = visibleOutletLocations.some(
      (item) => item.id === location.id,
    );

    if (!locationIsVisible) {
      handleCloseDetails(false);
    }
  }, [handleCloseDetails, location, visibleOutletLocations]);

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentSheetIndex(index);
  }, []);

  const handleOutletFilterChange = useCallback((filter: OutletFilter) => {
    setOutletFilter(filter);
    setIsActive(false);
    setLocation(null);
    setRouteGeoJSON(null);
    setDefaultCenter(defaultCoordinate);
    setZoomLevel(6);
    bottomSheetRef.current?.dismiss?.();
  }, []);

  const handleFindNearest = async () => {
    if (visibleOutletLocations.length === 0) {
      Alert.alert(
        "No Branches",
        outletFilter === "functionHall"
          ? "No outlet locations with function halls are available yet."
          : "No outlet locations are available yet.",
      );
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to find the nearest branch.",
      );
      return;
    }

    const pos = await Location.getCurrentPositionAsync({});
    const userLat = pos.coords.latitude;
    const userLon = pos.coords.longitude;

    let nearest = visibleOutletLocations[0];
    let minDist = Infinity;

    for (const branch of visibleOutletLocations) {
      const dist = getDistanceKm(
        userLat,
        userLon,
        branch.coordinate[1],
        branch.coordinate[0],
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = branch;
      }
    }

    handleOpenDetails(nearest);
  };

  const handleSetFavoriteBranch = async (branch: MappedOutlet) => {
    try {
      setIsSavingFavorite(true);

      const storedUserData = await getItem("userData");
      if (storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        const tagUid = parsedUser?.tag_uid;

        if (tagUid) {
          await addFavoriteLocation(tagUid, branch.id);
        }

        if (parsedUser?.phone_number) {
          const refreshedUser = await checkUserExists(parsedUser.phone_number);
          await setItem("userData", JSON.stringify(refreshedUser));
        }
      }

      await clearFavoriteBranchSelectionMode();
      setIsFavoriteSelectionMode(false);
      bottomSheetRef.current?.dismiss?.();
      Alert.alert("Favorite Updated", "Favorite branch has been set.", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/more"),
        },
      ]);
    } catch (error) {
      console.error("Failed to save favorite branch:", error);
      Alert.alert("Error", "Unable to set favorite branch. Please try again.");
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const handleCancelFavoriteBranchSelection = async () => {
    try {
      await clearFavoriteBranchSelectionMode();
      setIsFavoriteSelectionMode(false);
      bottomSheetRef.current?.dismiss?.();
      router.push("/(tabs)/more");
    } catch (error) {
      console.error("Failed to cancel favorite branch selection:", error);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView
        className="flex-1 items-center justify-center bg-black"
        edges={["top", "left", "right"]}
      >
        {/* Loading State */}
        {isLoadingOutlets && <LoadingOverlay />}

        {/* Error State */}
        {isErrorOutlets &&
          outletLocations.length === 0 &&
          !isLoadingOutlets && (
            <View className="flex-1 w-full bg-white items-center justify-center px-4">
              <Text className="text-red-500 text-base font-kanitMedium mb-4">
                Failed to load store locations.
              </Text>
              <SmallPrimaryButton
                buttonName="Retry"
                onPress={() => void refetchOutlets()}
              />
            </View>
          )}

        {/* Main Content */}
        {!isLoadingOutlets &&
          (!isErrorOutlets || outletLocations.length > 0) && (
            <>
              <View className="flex w-full bg-white px-4">
                {/* Error Indicator (while refreshing with existing data) */}
                {isErrorOutlets && outletLocations.length > 0 && (
                  <View className="bg-red-50 border border-red-200 rounded px-3 py-2 mb-2">
                    <Text className="text-red-600 text-xs font-kanitMedium">
                      Failed to refresh locations. Showing cached data.
                    </Text>
                  </View>
                )}

                {/* Refresh Indicator */}
                {isRefetchingOutlets && outletLocations.length > 0 && (
                  <View className="bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-2">
                    <Text className="text-blue-600 text-xs font-kanitMedium">
                      Updating locations...
                    </Text>
                  </View>
                )}

                {/* Filter Buttons */}
                <View className="flex-row items-center pt-2">
                  <View className="items-center justify-center w-1/3">
                    <View className="w-full justify-center items-center">
                      {outletFilter === "all" ? (
                        <MiniPrimaryButton
                          buttonName="All"
                          buttonWidth={110}
                          isCentered
                          onPress={() => handleOutletFilterChange("all")}
                        />
                      ) : (
                        <MiniGhostButton
                          buttonName="All"
                          buttonWidth={110}
                          isCentered
                          onPress={() => handleOutletFilterChange("all")}
                        />
                      )}
                    </View>
                  </View>
                  <View className="items-center justify-center w-1/3">
                    {outletFilter === "functionHall" ? (
                      <MiniPrimaryButton
                        buttonName="Function Halls"
                        buttonWidth={110}
                        isCentered
                        onPress={() => handleOutletFilterChange("functionHall")}
                      />
                    ) : (
                      <MiniGhostButton
                        buttonName="Function Halls"
                        buttonWidth={110}
                        onPress={() => handleOutletFilterChange("functionHall")}
                      />
                    )}
                  </View>
                  <View className="items-center justify-center w-1/3">
                    <MiniGhostButton
                      buttonName="Nearby"
                      buttonWidth={110}
                      isCentered
                      onPress={handleFindNearest}
                      isDisabled={visibleOutletLocations.length === 0}
                    />
                  </View>
                </View>
                <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefetchingOutlets}
                      onRefresh={() => void refetchOutlets()}
                    />
                  }
                  onLayout={(e) =>
                    setScrollViewWidth(e.nativeEvent.layout.width)
                  }
                  contentContainerStyle={{
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  {visibleOutletLocations.map((item) => (
                    <View
                      key={item.id}
                      className="items-center justify-center gap-1 w-[60px] h-[80px]"
                    >
                      <Pressable
                        className={`rounded-full p-4 ${isActive && location?.id === item.id ? "bg-[#14284d]" : ""}`}
                        onPress={() => handleOpenDetails(item)}
                      >
                        <View
                          className={`rounded-full w-10 h-10 items-center justify-center ${
                            isActive && location?.id === item.id
                              ? "bg-[#14284d] border-4 border-[#fec62b]"
                              : "border-2"
                          }`}
                        />
                      </Pressable>
                      <Text
                        className="text-darkBlue font-kanitBold text-xs text-center"
                        numberOfLines={1}
                      >
                        {item.title.replace(/^BIGGS\s*/i, "").trim()}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
                {visibleOutletLocations.length === 0 && (
                  <Text className="pb-2 text-center font-kanitSemiBold text-sm text-gray-500">
                    No outlets match this filter.
                  </Text>
                )}
                {isFavoriteSelectionMode && (
                  <SmallPrimaryButton
                    buttonName="Cancel"
                    onPress={handleCancelFavoriteBranchSelection}
                    isDisabled={isSavingFavorite}
                  />
                )}
              </View>
              <MapView
                style={{ flex: 1, width: "100%", height: "100%" }}
                logoEnabled={false}
                attributionEnabled={false}
              >
                <Camera
                  zoomLevel={zoomLevel}
                  centerCoordinate={defaultCenter}
                  animationMode="flyTo"
                  animationDuration={1500}
                  padding={{
                    paddingTop: 0,
                    paddingBottom: isActive ? 200 : 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}
                />

                <LocationPuck
                  puckBearingEnabled
                  pulsing={{ isEnabled: true }}
                />

                {routeGeoJSON && (
                  <ShapeSource id="routeSource" shape={routeGeoJSON}>
                    <LineLayer
                      id="routeLine"
                      style={{
                        lineColor: "#003566",
                        lineWidth: 4,
                        lineCap: "round",
                        lineJoin: "round",
                      }}
                    />
                  </ShapeSource>
                )}

                {visibleOutletLocations.map((outlet) => (
                  <PointAnnotation
                    key={outlet.id.toString()}
                    id={`location-${outlet.id}`}
                    coordinate={outlet.coordinate}
                    onSelected={() => handleOpenDetails(outlet)}
                    onDeselected={() => handleCloseDetails(false)}
                  >
                    <View className="h-[20px] w-[20px] bg-[#C00707] rounded-full border-4 border-white" />
                  </PointAnnotation>
                ))}
              </MapView>
              <BranchDetail
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                branch={location}
                currentIndex={currentSheetIndex}
                isFavoriteSelectionMode={isFavoriteSelectionMode}
                isSavingFavorite={isSavingFavorite}
                onSetFavorite={handleSetFavoriteBranch}
              />
            </>
          )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
