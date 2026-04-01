import BranchDetail from "@/src/components/features/branch-details";
import { SmallPrimaryButton } from "@/src/components/ui/Buttons";
import { getOutlets } from "@/src/services/api/outlets";
import { addFavoriteLocation, checkUserExists } from "@/src/services/api/user";
import { getItem, setItem } from "@/src/utils/asyncStorage";
import {
  clearFavoriteBranchSelectionMode,
  getFavoriteBranchSelectionMode,
} from "@/src/utils/favoriteBranch";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Mapbox, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  PointAnnotation,
  ShapeSource,
} from "@rnmapbox/maps";
import * as Location from "expo-location";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
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

// API response shape (snake_case, raw coordinate string)
type OutletApi = {
  id: number;
  title: string;
  description?: string;
  images: string[];
  contact?: string;
  longlat: string;
  function_hall_images?: string[];
  has_function_hall?: boolean;
};

// UI-facing type: API shape + parsed coordinate
type MappedOutlet = OutletApi & { coordinate: [number, number] };

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

export default function Store() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();

  function mapOutlet(outlet: OutletApi): MappedOutlet | null {
    const coordinate = parseLongLat(outlet.longlat);
    if (!coordinate) return null;
    return { ...outlet, coordinate };
  }

  const [zoomLevel, setZoomLevel] = useState(6);
  const [defaultCenter, setDefaultCenter] = useState(defaultCoordinate);
  const [outletLocations, setOutletLocations] = useState<MappedOutlet[]>([]);
  const [location, setLocation] = useState<MappedOutlet | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [routeGeoJSON, setRouteGeoJSON] =
    useState<GeoJSON.FeatureCollection | null>(null);
  const [isFavoriteSelectionMode, setIsFavoriteSelectionMode] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  const bottomSheetRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const ITEM_WIDTH = 60 + 16;
  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

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

  useEffect(() => {
    let mounted = true;

    const loadOutlets = async () => {
      try {
        const response = await getOutlets();
        const data = Array.isArray(response) ? (response as OutletApi[]) : [];
        const mapped = data
          .map(mapOutlet)
          .filter((item): item is MappedOutlet => item !== null);

        if (!mounted) return;

        setOutletLocations(mapped);
        if (mapped.length > 0) {
          setDefaultCenter(mapped[0].coordinate);
        }
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };

    loadOutlets();

    return () => {
      mounted = false;
    };
  }, []);

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

    const index = outletLocations.findIndex(
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

  const handleCloseDetails = (isSheetActive: boolean) => {
    if (!isSheetActive) {
      bottomSheetRef.current?.dismiss?.();
      setIsActive(false);
      setLocation(null);
      setRouteGeoJSON(null);
      setDefaultCenter(defaultCoordinate);
      setZoomLevel(6);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    setCurrentSheetIndex(index);
  }, []);

  const handleFindNearest = async () => {
    if (outletLocations.length === 0) {
      Alert.alert("No Branches", "No outlet locations are available yet.");
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

    let nearest = outletLocations[0];
    let minDist = Infinity;

    for (const branch of outletLocations) {
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
        <View className="w-full bg-white px-4 pb-2">
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
            contentContainerStyle={{
              alignItems: "center",
              gap: 16,
              paddingVertical: 8,
            }}
          >
            <View className="items-center justify-center gap-1 w-[60px] h-[80px]">
              <Pressable
                className="rounded-full p-4"
                onPress={handleFindNearest}
              >
                <View className="border-2 rounded-full w-10 h-10 items-center justify-center">
                  <FontAwesome6
                    name="location-crosshairs"
                    size={18}
                    color="#003566"
                  />
                </View>
              </Pressable>
              <Text
                className="text-darkBlue font-kanitBold text-xs text-center"
                numberOfLines={1}
              >
                Nearest
              </Text>
            </View>
            {outletLocations.map((item) => (
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

          <LocationPuck puckBearingEnabled pulsing={{ isEnabled: true }} />

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

          {outletLocations.map((outlet) => (
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
