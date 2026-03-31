import { HeaderBigLogo } from "@/src/components/layout/header";
import { ProductCard } from "@/src/components/ui/Cards";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import { getAllMenu } from "@/src/services/api/menu";
import { parseHtmlText } from "@/src/utils/htmlParser";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function FavoriteMenu() {
  const {
    data: menuRaw,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: getAllMenu,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  console.log("Raw menu data from API:", menuRaw);

  const baseUrl = "https://biggs.ph/biggs_website/controls/uploads/";

  const isLoadingMenu = isPending;

  const rawItems = Array.isArray(menuRaw?.data) ? menuRaw.data : [];

  const menu = rawItems.map((item: any) => ({
    ...item,
    filename: baseUrl + item.filename,
  }));

  console.log(
    "Is array?",
    Array.isArray(menuRaw?.data),
    "Length:",
    menuRaw?.data?.length,
  );
  console.log("Parsed menu data:", menu);

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

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="flex-1 bg-white">
        <HeaderBigLogo hasBackButton hasNotifications={false} />

        {isLoadingMenu ? (
          <LoadingOverlay />
        ) : isError ? (
          <View className="items-center pt-10">
            <Text className="text-red-400 text-sm">Failed to load menu.</Text>
          </View>
        ) : menu.length === 0 ? (
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
            data={menu}
            keyExtractor={(item) => item.m_id.toString()}
            renderItem={({ item }) => {
              console.log(
                "Rendering item:",
                item?.m_id,
                item?.m_title,
                item?.m_price,
              );
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
                  />
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
