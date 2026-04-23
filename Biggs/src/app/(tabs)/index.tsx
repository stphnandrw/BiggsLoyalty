import { HeaderBigLogo } from "@/src/components/layout/header";
import { PrimaryButton } from "@/src/components/ui/Buttons";
import AppCarousel from "@/src/components/ui/Carousel";
import { HorizontalLine } from "@/src/components/ui/Lines";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import {
  AuthRequiredBottomSheet,
  VoucherModal,
} from "@/src/components/ui/Modal";
import { HeadingText } from "@/src/components/ui/Texts";
import { useAuthStatus } from "@/src/hooks/useAuthStatus";
import { baseApiUrl } from "@/src/services/api/api";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { isLoggedIn } = useAuthStatus();
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [showVoucher, setShowVoucher] = useState(true);
  const [isLandingImageLoading, setIsLandingImageLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate fetch - you can add actual data refetching here if needed
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleVoucherItemPress = (item: any) => {
    console.log("Voucher item pressed!", item);
    // navigate or open details here
  };

  const carouselData = [
    {
      id: 1,
      image: require("../../../assets/events/Biggs_Fair_Caravan.png"),
      title: "BIGGS Fair Caravan",
      description:
        "In celebration of the 40th year anniversary of BIGGS, we proudly presented the BIGGest event of the year: the BIGGS Fair Caravan, a celebration that traversed across various BIGGS stores throughout Bicol! This celebration brought together communities, families, and friends for an unforgettable experience filled with joy, excitement, and nostalgia from fun games with exciting prizes and performances from local artists.",
    },
    {
      id: 2,
      image: require("../../../assets/events/Biggs_Shocktober.png"),
      title: "BIGGS Shocktober",
      description:
        "Horror met creativity in a spine-chilling night at #BIGGS 21st Shocktober at Eternal Gardens. From the Costume Competition to the Dance of the Dead, attendees unleashed their inner horrors and creativity in chilling performances and costumes. With screams and applause filling the air, it has become the BIGGest Shocktober up-to-date. It left everyone eagerly awaiting the next spine-tingling chapter!",
    },
    {
      id: 3,
      image: require("../../../assets/events/Biggs_Emerald_Grand_Opening.png"),
      title: "BIGGS Emerald Grand Opening",
      description:
        "The coolest BIGGS store has finally opened its doors, promising not only exceptional food but an experience that transcends the ordinary. Stepping inside, you're greeted by its unique and cool interior design that exudes style and sophistication. Whether you're catching up with friends or enjoying a solo dining excursion, this coolest BIGGS store offers more than just a meal - it offers an unforgettable experience that will leave you craving more.",
    },
    {
      id: 4,
      image: require("../../../assets/events/Go_Bigg_Wellness_Run.png"),
      title: "Go BIGG Wellness Run",
      description:
        "The first-ever Go Bigg Wellness Run was an epic journey that merged delightful experiences with a commitment to health, brought to you by BIGGS. Participants laced up their sneakers and joined fellow enthusiasts for a revitalizing adventure and delighting experience. Whether they were seasoned athletes or novice explorers, the Go Bigg Wellness Run offered something for everyone - a chance to sweat, smile, and savor the joy of movement.",
    },
    {
      id: 5,
      image: require("../../../assets/events/Biggs_Sipocot_Grand_Opening.png"),
      title: "BIGGS SIPOCOT GRAND OPENING",
      description:
        "Welcome to BIGGS Sipocot, our largest location yet! With seating for 220 customers, a function hall for up to 100 guests, and our first-ever specialty coffee bar, this store is designed to delight. Enjoy our signature good food, carefully crafted coffee, and warm hospitality, perfect for gatherings, celebrations, and everyday moments.",
    },
    {
      id: 6,
      image: require("../../../assets/events/Biggs_Made_It_Media_Lunch.jpg"),
      title: "BIGGS Made It Media Launch",
      description:
        "Celebrate in true BIGGS style with the debut collection of BIGGS Made It merchandise! From trendy tees to versatile tote bags, stylish hats, cozy socks, and sleek flasks, there's something for everyone to make any day a BIG day. The collection was unveiled in a memorable and exciting media launch on November 29, 2024 - marking another milestone in BIGGS' journey of bringing delight beyond the plate.",
    },
    {
      id: 7,
      image: require("../../../assets/events/Biggs_Coffee_Media_Lunch.jpg"),
      title: "BIGGS Coffee Media Launch",
      description:
        "BIGGS is excited to announce the launch of its specialty coffee offerings, further enhancing the dining experience for our valued customers. Our inaugural coffee bar, located at BIGGS Sipocot, provides a welcoming atmosphere for those seeking high-quality coffee and non-coffee beverages, adding value and delight to the customer experience.",
    },
    {
      id: 8,
      image: require("../../../assets/events/Biggs_Camalig_Grand_Opening.png"),
      title: "BIGGS Camalig Grand Opening",
      description:
        "The biggest stand-alone BIGGS Store with the grandeur view of Mt. Mayon, tagged as the Most Scenic BIGGS store is finally open to serve the locals and tourists with the ultimate good food 24/7.",
    },
    {
      id: 9,
      image: require("../../../assets/events/Biggs_Centro_Grand_Opening.png"),
      title: "BIGGS Centro Grand Opening",
      description:
        'The most "Iconic" BIGGS store is officially back in action to serve you the ultimate good food and share the nostalgic experience that every Bicolano remembers fondly. Nestled in the heart of Naga City, BIGGS has been a cornerstone of the community for decades, bringing together families and friends over its signature dishes.',
    },
    {
      id: 10,
      image: require("../../../assets/events/Biggs_Fair.png"),
      title: "BIGGS Fair",
      description:
        "In celebration of the 40th year anniversary of BIGGS, the BIGGest event of the year The BIGGS Fair at Plaza Quezon, Naga City was held. It was a showcase of exceptional talents from our very own local artists, featuring performances, dance showdowns, and battle of the bands, and entertaining games for everyone to enjoy with exciting prizes.",
    },
  ];

  const handleOpenEventDetails = (item: any) => {
    // Implement navigation to event details screen or open a modal with event details
    console.log("Event item pressed!", item);
  };

  const handleBookNowPress = () => {
    if (!isLoggedIn) {
      setShowAuthSheet(true);
      return;
    }

    router.push("/(booking)/book-appointment");
  };
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="flex-1 w-full bg-dirtyWhite">
        <HeaderBigLogo hasNotifications isLoggedIn={isLoggedIn} hasPointsDisplay/>
        <ScrollView
          className="flex-1 w-full"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        >
          <View className="w-full relative">
            <Image
              source={{ uri: `${baseApiUrl}/img/landing_page.gif` }}
              style={{ width: "100%", aspectRatio: 16 / 9 }}
              contentFit="cover"
              onLoadStart={() => setIsLandingImageLoading(true)}
              onLoadEnd={() => setIsLandingImageLoading(false)}
              onError={() => setIsLandingImageLoading(false)}
            />
            {isLandingImageLoading && (
              <View className="absolute inset-0">
                <LoadingOverlay />
              </View>
            )}
          </View>

          <View className="w-full h-auto items-center bg-dirtyWhite px-4 pb-2 pt-2">
            <View className="mb-3 w-[90%]">
              <HeadingText text="Join us for an unforgettable experience!" />
            </View>
            <View className="w-[70%]">
              <PrimaryButton
                buttonName="Book Now"
                buttonWidth="[100%]"
                isFontSmall
                isCentered
                onPress={handleBookNowPress}
              />
            </View>
          </View>

          <HorizontalLine />

          <View className="w-full h-auto items-center bg-dirtyWhite px-4 pb-4 pt-2">
            <View className="w-[90%]">
              <HeadingText text="MAKING EVERY MEAL DELIGHTFUL At BIGGS" />
            </View>
            <Text className="font-kanit text-lg">
              At BIGGS, we believe that every meal should be an experience that
              delights your senses and satisfies your cravings. More than just
              fast food, we are dedicated to serving good food - the kind that
              takes time to prepare.
            </Text>
            <Text className="font-kanit text-lg">
              Step into BIGGS and savor the taste of meals made with care and
              passion, a memorable experience that awaits you at every visit.
            </Text>
          </View>

          <HorizontalLine />

          {/* Push Notification Test (remove before release) */}
          {/* <PushNotificationTest /> */}

          <View className="w-full items-center justify-center p-4">
            <AppCarousel
              data={carouselData}
              onItemPress={(item) => handleOpenEventDetails(item)}
            />
          </View>
        </ScrollView>
      </View>

      <VoucherModal
        visible={showVoucher}
        onClose={() => setShowVoucher(false)}
        voucherItems={carouselData}
        onVoucherItemPress={handleVoucherItemPress}
      />

      <AuthRequiredBottomSheet
        visible={showAuthSheet}
        onClose={() => setShowAuthSheet(false)}
      />
    </SafeAreaView>
  );
}
