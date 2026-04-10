import { HeaderBigLogo } from "@/src/components/layout/header";
import { SmallPrimaryButton } from "@/src/components/ui/Buttons";
import { ProductCard } from "@/src/components/ui/Cards";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { getAllMenu } from "@/src/services/api/menu";
import {
    addFavoriteMenu,
    getFavoriteMenuByTagUid,
} from "@/src/services/api/user";
import type { MenuItem } from "@/src/types";
import { getItem } from "@/src/utils/asyncStorage";
import {
    clearFavoriteMenuItemSelectionMode,
    getFavoriteMenuItemSelectionMode,
} from "@/src/utils/favoriteBranch";
import { parseHtmlText } from "@/src/utils/htmlParser";
import { useQuery } from "@tanstack/react-query";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const isMenuItemLike = (value: unknown): value is MenuItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    "m_id" in item ||
    "m_title" in item ||
    "m_code" in item ||
    "filename" in item
  );
};

const findMenuArray = (value: unknown, depth = 0): MenuItem[] | null => {
  if (depth > 5 || value == null) {
    return null;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [];
    }

    // Accept arrays that look like menu collections.
    if (value.some((entry) => isMenuItemLike(entry))) {
      return value as MenuItem[];
    }

    for (const entry of value) {
      const nested = findMenuArray(entry, depth + 1);
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    // Prioritize common payload keys first.
    const prioritizedKeys = ["data", "items", "results", "menu"];
    for (const key of prioritizedKeys) {
      if (key in objectValue) {
        const nested = findMenuArray(objectValue[key], depth + 1);
        if (nested) {
          return nested;
        }
      }
    }

    for (const nestedValue of Object.values(objectValue)) {
      const nested = findMenuArray(nestedValue, depth + 1);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
};

const parseMenuResponse = (menuRaw: unknown): MenuItem[] => {
  const nestedItems = findMenuArray(menuRaw);
  if (nestedItems) {
    return nestedItems;
  }

  // Some backends return stringified JSON despite JSON content-type.
  if (typeof menuRaw === "string") {
    try {
      const parsed = JSON.parse(menuRaw) as unknown;
      const parsedItems = findMenuArray(parsed);
      if (parsedItems) {
        return parsedItems;
      }
    } catch {
      return [];
    }
  }

  return [];
};

const normalizedText = (value: unknown) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const getNormalizedposition = (item: MenuItem) => {
  if (Array.isArray(item.position)) {
    console.log(
      "Normalizing position from array for item:",
      item?.m_title,
      item.position,
    );
    return item.position.map((entry) => normalizedText(entry)).filter(Boolean);
  }

  if (typeof item.position === "string") {
    return item.position
      .split(/[|,]/)
      .map((entry) => normalizedText(entry))
      .filter(Boolean);
  }

  // Keep backwards compatibility when API doesn't provide `position` yet.
  console.log(
    "No position field for item, falling back to type for:",
    item?.m_title,
    item,
  );
  return [normalizedText(item.type)].filter(Boolean);
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function FavoriteMenu() {
  const params = useLocalSearchParams<{ mode?: string | string[] }>();
  const [lastSuccessfulMenu, setLastSuccessfulMenu] = useState<MenuItem[]>([]);
  const [favoriteMenuCode, setFavoriteMenuCode] = useState<string | null>(null);
  const [isFavoriteSelectionMode, setIsFavoriteSelectionMode] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedSubFilter, setSelectedSubFilter] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedModalItem, setSelectedModalItem] = useState<MenuItem | null>(
    null,
  );

  useFocusEffect(
    useCallback(() => {
      const loadSelectionMode = async () => {
        const modeParam = Array.isArray(params.mode)
          ? params.mode[0]
          : params.mode;
        const isSelectionFromParam = modeParam === "favorite";
        const isSelectionFromStorage = await getFavoriteMenuItemSelectionMode();
        setIsFavoriteSelectionMode(
          isSelectionFromParam || isSelectionFromStorage,
        );
      };

      loadSelectionMode();

      return () => {};
    }, [params.mode]),
  );

  const filters = [
    { label: "Sizzlers", value: "sizzlers" },
    { label: "Breakfast", value: "breakfast" },
    { label: "Chicken", value: "chicken" },
    { label: "Snacks", value: "snacks" },
    { label: "Drinks", value: "drinks" },
  ];

  const filterGroups = useMemo(
    () => [
      {
        label: "Snacks",
        items: [
          { label: "Fries", value: "fries" },
          { label: "Sider", value: "siders" },
          { label: "Salad", value: "salad" },
          { label: "Soup", value: "soup" },
          { label: "Pasta", value: "pasta" },
          { label: "Cakes", value: "cakes" },
          { label: "Burgers", value: "burger" },
        ],
      },
      {
        label: "Drinks",
        items: [
          { label: "Hot", value: "hot" },
          { label: "Cold", value: "cold" },
        ],
      },
    ],
    [],
  );

  const loadFavoriteMenuCode = async () => {
    try {
      const storedUserData = await getItem("userData");
      if (!storedUserData) {
        setFavoriteMenuCode(null);
        return;
      }

      const parsedUser = JSON.parse(storedUserData);
      const tagUid = parsedUser?.tag_uid;

      if (!tagUid) {
        setFavoriteMenuCode(null);
        return;
      }

      const menuCode = await getFavoriteMenuByTagUid(tagUid);
      setFavoriteMenuCode(menuCode ?? null);
    } catch {
      setFavoriteMenuCode(null);
    }
  };

  const {
    data: menuRaw,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: getAllMenu,
    placeholderData: (previousData) => previousData,
    retry: 2,
  });

  const parsedMenu = useMemo(() => parseMenuResponse(menuRaw), [menuRaw]);

  console.log("Parsed menu items:", parsedMenu);

  useEffect(() => {
    if (parsedMenu.length > 0) {
      setLastSuccessfulMenu(parsedMenu);
    }
  }, [parsedMenu]);

  useEffect(() => {
    loadFavoriteMenuCode();
  }, []);

  const menu = parsedMenu.length > 0 ? parsedMenu : lastSuccessfulMenu;
  const orderedMenu = useMemo(() => {
    if (!favoriteMenuCode || menu.length <= 1) {
      return menu;
    }

    const favoriteIndex = menu.findIndex(
      (item) => item?.m_code === favoriteMenuCode,
    );

    if (favoriteIndex <= 0) {
      return menu;
    }

    const favoriteItem = menu[favoriteIndex];
    const remainingItems = menu.filter((_, index) => index !== favoriteIndex);

    return [favoriteItem, ...remainingItems];
  }, [menu, favoriteMenuCode]);

  // Dynamically generate sub-filters based on items matching the selected main filter
  // Prioritizes hardcoded filterGroups, then falls back to dynamic menu positions
  const subFilterItems = useMemo(() => {
    if (!selectedFilter) {
      return [];
    }

    // First, check if there's a hardcoded filterGroup for this filter
    const hardcodedGroup = filterGroups.find(
      (group) => normalizedText(group.label) === normalizedText(selectedFilter),
    );

    if (hardcodedGroup) {
      return hardcodedGroup.items;
    }

    // If no hardcoded group, extract dynamic items from menu positions
    const itemsForFilter = orderedMenu.filter((item) => {
      const position = getNormalizedposition(item);
      return position.some(
        (pos) =>
          pos === normalizedText(selectedFilter) ||
          pos.includes(normalizedText(selectedFilter)),
      );
    });

    // Get all unique positions from these items
    const uniquePositions = new Set<string>();
    itemsForFilter.forEach((item) => {
      const positions = getNormalizedposition(item);
      positions.forEach((pos) => {
        // Exclude the main filter value itself
        if (pos !== normalizedText(selectedFilter)) {
          uniquePositions.add(pos);
        }
      });
    });

    // Convert to array format for display from dynamic positions
    return Array.from(uniquePositions)
      .sort()
      .map((value) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value: value,
      }));
  }, [selectedFilter, orderedMenu, filterGroups]);

  const filteredMenu = useMemo(() => {
    let result = orderedMenu;

    // Apply filter and subfilter
    if (selectedFilter || selectedSubFilter) {
      // If the selected filter matches a filterGroup, collect all its child values
      // so that e.g. "Snacks" matches items with position "fries", "salad", etc.
      const matchingGroup = selectedFilter
        ? filterGroups.find(
            (group) =>
              normalizedText(group.label) === normalizedText(selectedFilter),
          )
        : null;

      const groupChildValues = matchingGroup
        ? matchingGroup.items.map((i) => normalizedText(i.value))
        : null;

      result = result.filter((item) => {
        const position = getNormalizedposition(item);

        const matchesMainFilter = selectedFilter
          ? groupChildValues
            ? // Group filter: item must belong to one of the group's child positions
              position.some((pos) => groupChildValues.includes(pos))
            : // Regular filter: item position matches the filter value directly
              position.some(
                (pos) =>
                  pos === normalizedText(selectedFilter) ||
                  pos.includes(normalizedText(selectedFilter)),
              )
          : true;

        const matchesSubFilter = selectedSubFilter
          ? position.some(
              (pos) =>
                pos === normalizedText(selectedSubFilter) ||
                pos.includes(normalizedText(selectedSubFilter)),
            )
          : true;

        return matchesMainFilter && matchesSubFilter;
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = normalizedText(searchQuery);
      result = result.filter((item) => {
        const title = normalizedText(item.m_title);
        const desc = normalizedText(item.m_desc);
        const code = normalizedText(item.m_code);
        return (
          title.includes(query) || desc.includes(query) || code.includes(query)
        );
      });
    }

    return result;
  }, [
    orderedMenu,
    selectedFilter,
    selectedSubFilter,
    searchQuery,
    filterGroups,
  ]);

  const hasMenuData = filteredMenu.length > 0;
  const hasSourceMenuData = menu.length > 0;
  const isLoadingMenu = isPending && !hasMenuData;
  const showErrorState = isError && !hasSourceMenuData;
  const showEmptyState = !isPending && !isFetching && !isError && !hasMenuData;

  const handleFilterPress = (value: string) => {
    const isSameFilter = selectedFilter === value;

    if (isSameFilter) {
      setSelectedFilter(null);
      setSelectedSubFilter(null);
      return;
    }

    setSelectedFilter(value);
    setSelectedSubFilter(null);
  };

  const handleSubFilterPress = (value: string) => {
    setSelectedSubFilter((previous) => (previous === value ? null : value));
  };

  function parseMenuTitle(title: any) {
    const lines = parseHtmlText(title ?? "") ?? [];
    return {
      title: lines[0] ?? "",
      data1: lines[1] ?? "",
      data2: lines[2] ?? "",
    };
  }

  function parseMenuPrice(price: any) {
    const lines = parseHtmlText(price ?? "") ?? [];
    return {
      price1: lines[0] ?? "",
      price2: lines[1] ?? "",
    };
  }

  const handleSetFavoriteMenu = async (item: MenuItem) => {
    try {
      if (!isFavoriteSelectionMode) {
        return;
      }

      if (isSavingFavorite) {
        return;
      }

      setIsSavingFavorite(true);

      const storedUserData = await getItem("userData");
      if (!storedUserData) {
        Alert.alert("Unavailable", "Please log in to set a favorite menu.");
        return;
      }

      const parsedUser = JSON.parse(storedUserData);
      const tagUid = parsedUser?.tag_uid;
      const menuId = Number(item?.m_id);

      if (!tagUid || Number.isNaN(menuId)) {
        Alert.alert("Error", "Unable to set favorite menu right now.");
        return;
      }

      await addFavoriteMenu(tagUid, menuId);
      await loadFavoriteMenuCode();

      if (isFavoriteSelectionMode) {
        await clearFavoriteMenuItemSelectionMode();
        setIsFavoriteSelectionMode(false);

        Alert.alert("Favorite Updated", "Favorite menu has been set.", [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/more"),
          },
        ]);
        return;
      }

      Alert.alert("Favorite Updated", "Favorite menu has been set.");
    } catch (error) {
      console.error("Failed to set favorite menu:", error);
      Alert.alert("Error", "Unable to set favorite menu. Please try again.");
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const handleMenuCardPress = (item: MenuItem) => {
    if (isFavoriteSelectionMode) {
      handleSetFavoriteMenu(item);
      return;
    }

    // Open detail modal in browse mode
    setSelectedModalItem(item);
    setShowDetailModal(true);
  };

  const handleCancelFavoriteMenuSelection = async () => {
    try {
      await clearFavoriteMenuItemSelectionMode();
      setIsFavoriteSelectionMode(false);
      router.push("/(tabs)/more");
    } catch (error) {
      console.error("Failed to cancel favorite menu selection:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="w-full flex-1 bg-white">
        <HeaderBigLogo hasNotifications={false} />

        {/* SEARCH BAR */}
        <View className="px-4 py-3 mt-16">
          <TextInput
            placeholder="Search menu items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="w-full bg-gray-100 px-4 py-2.5 rounded-lg text-gray-800"
          />
        </View>

        <View className="w-full items-center justify-between">
          {/* MAIN FILTERS (smaller + cleaner) */}
          <View className="flex-row items-center justify-center px-4 pt-3 pb-2 w-full">
            {filters.map((filter, index) => {
              const isActive = selectedFilter === filter.value;
              const isLast = index === filters.length - 1;

              return (
                <Pressable
                  key={filter.value}
                  onPress={() => handleFilterPress(filter.value)}
                  className={`w-20 items-center justify-center ${!isLast ? "border-r border-gray-300" : ""}`}
                >
                  <Text
                    className={`w-full text-[16px] font-kanitMedium text-center pb-1 ${
                      isActive
                        ? "text-red-500 border-b-2 border-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            {subFilterItems.map((item, index) => {
              const isActive = selectedSubFilter === item.value;
              const isLast = index === subFilterItems.length - 1;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => handleSubFilterPress(item.value)}
                  className={`items-center justify-center px-3 ${!isLast ? "border-r border-gray-300" : ""}`}
                >
                  <Text
                    className={`text-[14px] font-kanitMedium pb-1 ${
                      isActive
                        ? "text-black border-b-2 border-black"
                        : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {isFavoriteSelectionMode && (
          <View className="px-4 pt-2">
            <SmallPrimaryButton
              buttonName="Cancel"
              onPress={handleCancelFavoriteMenuSelection}
              isDisabled={isSavingFavorite}
            />
          </View>
        )}

        {isLoadingMenu ? (
          <LoadingOverlay />
        ) : showErrorState ? (
          <View className="items-center pt-10">
            <Text className="text-red-400 text-sm">Failed to load menu.</Text>
          </View>
        ) : showEmptyState ? (
          <View className="items-center pt-10">
            <Text className="text-gray-400 text-sm">
              No items in this category.
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ padding: 16, width: "100%" }}
            numColumns={2}
            horizontal={false}
            data={filteredMenu}
            keyExtractor={(item, index) => `${item?.m_id ?? "menu"}-${index}`}
            ListHeaderComponent={
              isFetching && hasSourceMenuData ? (
                <View className="w-full items-center pb-3">
                  <Text className="text-xs text-gray-400">
                    Refreshing menu...
                  </Text>
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              const { title, data1, data2 } = parseMenuTitle(item?.m_title);
              const { price1, price2 } = parseMenuPrice(item?.m_price);

              return (
                <View className="w-1/2 p-2">
                  <ProductCard
                    productName={title}
                    subtitle1={data1}
                    subtitle2={data2}
                    price={price1}
                    price2={price2}
                    imageRef={item?.filename}
                    showFavoriteAction={isFavoriteSelectionMode}
                    isFavorited={
                      !!favoriteMenuCode && item?.m_code === favoriteMenuCode
                    }
                    isFavoriteActionDisabled={
                      isSavingFavorite || !isFavoriteSelectionMode
                    }
                    onFavoriteToggle={() => handleSetFavoriteMenu(item)}
                    onAdd={() => handleMenuCardPress(item)}
                  />
                </View>
              );
            }}
          />
        )}
      </View>

      {/* PRODUCT DETAIL MODAL */}
      {selectedModalItem && (
        <Modal
          visible={showDetailModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDetailModal(false)}
        >
          <View className="flex-1 bg-black/75 justify-center items-center p-4">
            <Pressable
              className="absolute inset-0"
              onPress={() => setShowDetailModal(false)}
            />

            {/* Modal Card Container */}
            <View className="w-full max-w-xs h-1/2 rounded-lg shadow-lg overflow-hidden relative">
              {/* Product Image fills entire card */}
              {selectedModalItem.filename ? (
                <Image
                  source={{
                    uri:
                      "https://biggs.ph/biggs_website/controls/uploads/" +
                      selectedModalItem.filename,
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  className="items-center justify-center bg-gray-400"
                >
                  <Text className="text-8xl">🍷</Text>
                </View>
              )}

              {/* Dark overlay at bottom with product info */}
              <View
                style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
                className="bg-black/60 px-4 py-4 flex-row items-end justify-between"
              >
                {/* Left: Title + size variants */}
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-kanitBold text-white mb-1">
                    {parseMenuTitle(selectedModalItem.m_title).title}
                  </Text>

                  {parseMenuTitle(selectedModalItem.m_title).data1 && (
                    <Text className="text-xs text-gray-300 mb-0.5">
                      {parseMenuTitle(selectedModalItem.m_title).data1}
                    </Text>
                  )}

                  {parseMenuTitle(selectedModalItem.m_title).data2 && (
                    <Text className="text-xs text-gray-300">
                      {parseMenuTitle(selectedModalItem.m_title).data2}
                    </Text>
                  )}
                </View>

                {/* Right: Prices stacked */}
                <View className="items-end">
                  <Text className="text-2xl font-extrabold text-yellow-400 leading-tight">
                    {parseMenuPrice(selectedModalItem.m_price).price1}
                  </Text>
                  {parseMenuPrice(selectedModalItem.m_price).price2 && (
                    <Text className="text-2xl font-extrabold text-yellow-400 leading-tight">
                      {parseMenuPrice(selectedModalItem.m_price).price2}
                    </Text>
                  )}
                </View>
              </View>

              {/* Description overlay - scrollable center section */}
              {selectedModalItem.m_desc && (
                <View className="absolute inset-0 justify-center items-center px-4 pb-40">
                  <View className="rounded-xl p-5 max-w-xs">
                    <Text className="text-sm text-gray-100 leading-relaxed text-center">
                      {selectedModalItem.m_desc}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}
