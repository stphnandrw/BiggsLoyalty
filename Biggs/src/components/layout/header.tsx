import { ConfirmBottomSheet } from "@/src/components/ui/Modal";
import { getNotificationRecipientsByTagUid } from "@/src/services/api/notifications";
import { getItem, logout } from "@/src/utils/asyncStorage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

type HeaderProps = {
  title?: string;
  hasBackButton?: boolean;
  hasNotifications?: boolean;
  hasHistory?: boolean;
  isLoggedIn?: boolean;
  hasLogout?: boolean;
  onBackPress?: () => void;
  onHistoryPress?: () => void;
  useConfirmation?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
};

const doLogout = () => {
  logout();
  router.replace("/(auth)/login");
};

export default function Header() {
  return (
    <View className="w-full h-16 bg-white items-center justify-between flex-row px-4">
      <Image
        source={require("../../../assets/images/biggs-logo.png")}
        style={{ width: "100%", height: "100%" }}
        contentFit="scale-down"
      />
    </View>
  );
}

export function HeaderBigLogo({
  hasBackButton,
  hasNotifications,
  hasHistory,
  isLoggedIn,
  hasLogout,
  onBackPress,
  onHistoryPress,
  useConfirmation,
  confirmTitle = "Are you sure?",
  confirmDescription = "Any unsaved changes will be lost.",
}: HeaderProps) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<"back" | "logout" | null>(
    null,
  );
  const [tagUid, setTagUid] = useState<string>("");

  useEffect(() => {
    const loadTagUid = async () => {
      const userData = await getItem("userData");
      if (!userData) {
        return;
      }

      try {
        const parsed = JSON.parse(userData) as { tag_uid?: string };
        if (parsed.tag_uid) {
          setTagUid(parsed.tag_uid);
        }
      } catch (error) {
        console.error("Failed to parse userData in header:", error);
      }
    };

    if (hasNotifications && isLoggedIn !== false) {
      void loadTagUid();
    }
  }, [hasNotifications, isLoggedIn]);

  const unreadQuery = useQuery({
    queryKey: ["notificationsUnread", tagUid],
    queryFn: async () => {
      const payload = await getNotificationRecipientsByTagUid(tagUid);
      return payload.unread_count;
    },
    enabled: !!tagUid && !!hasNotifications && isLoggedIn !== false,
    refetchInterval: 60_000,
  });

  const triggerAction = (action: "back" | "logout") => {
    if (useConfirmation) {
      setPendingAction(action);
      setConfirmVisible(true);
    } else {
      if (action === "back") {
        if (onBackPress) {
          onBackPress();
        } else {
          router.back();
        }
      } else {
        doLogout();
      }
    }
  };

  const handleConfirm = () => {
    setConfirmVisible(false);
    if (pendingAction === "back") {
      if (onBackPress) {
        onBackPress();
      } else {
        router.back();
      }
    }
    if (pendingAction === "logout") doLogout();
    setPendingAction(null);
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    setPendingAction(null);
  };

  const confirmLabels = {
    back: {
      title: confirmTitle,
      description: confirmDescription,
      confirm: "Leave",
      cancel: "Stay",
    },
    logout: {
      title: "Log out?",
      description: "You will be returned to the login screen.",
      confirm: "Log out",
      cancel: "Cancel",
    },
  };

  const activeLabels = pendingAction
    ? confirmLabels[pendingAction]
    : confirmLabels.back;

  return (
    <View
      className="w-full h-16 items-center z-10"
      style={{ overflow: "visible" }}
    >
      {/* Blue background bar */}
      <View
        className={`w-full flex-row ${hasBackButton || hasHistory ? "justify-between" : "justify-end"} items-center bg-lightBlue absolute top-0 h-16 px-7`}
      >
        {hasBackButton && (
          <Pressable onPress={() => triggerAction("back")}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        )}

        {hasHistory && (
          <Pressable
            onPress={
              onHistoryPress ??
              (() => router.push("/(vouchers)/voucher-history"))
            }
          >
            <MaterialCommunityIcons name="history" size={30} color="white" />
          </Pressable>
        )}

        <View className="flex-row items-center gap-4">
          {hasNotifications && isLoggedIn !== false && (
            <Pressable
              onPress={() => router.push("/(notifications)/notifications")}
              className="relative"
            >
              <Ionicons name="notifications-outline" size={32} color="white" />
              {(unreadQuery.data ?? 0) > 0 && (
                <View className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 items-center justify-center">
                  <Text className="text-white text-[10px] font-kanitMedium leading-none">
                    {Math.min(unreadQuery.data ?? 0, 99)}
                  </Text>
                </View>
              )}
            </Pressable>
          )}

          {hasLogout && (
            <Pressable onPress={() => triggerAction("logout")}>
              <MaterialCommunityIcons name="logout" size={32} color="white" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Logo — overflows below the blue bar intentionally */}
      <View
        style={{
          position: "absolute",
          top: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 10,
        }}
      >
        <Image
          source={require("../../../assets/images/biggs-logo.png")}
          style={{ width: 200, height: 100 }}
          contentFit="contain"
        />
      </View>

      {useConfirmation && (
        <ConfirmBottomSheet
          visible={confirmVisible}
          title={activeLabels.title}
          description={activeLabels.description}
          confirmLabel={activeLabels.confirm}
          cancelLabel={activeLabels.cancel}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </View>
  );
}

export function HeaderText({
  hasBackButton,
  onBackPress,
  useConfirmation,
  confirmTitle = "Are you sure?",
  confirmDescription = "Any unsaved changes will be lost.",
}: HeaderProps) {
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleBackPress = () => {
    if (useConfirmation) {
      setConfirmVisible(true);
    } else {
      if (onBackPress) {
        onBackPress();
      } else {
        router.back();
      }
    }
  };

  const handleConfirm = () => {
    setConfirmVisible(false);
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      className="w-full h-16 items-center z-10"
      style={{ overflow: "visible" }}
    >
      {/* Blue background bar */}
      <View className="w-full flex-row justify-between items-center bg-lightBlue absolute top-0 h-16 px-4">
        {hasBackButton && (
          <Pressable onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        )}
      </View>

      {/* Logo — overflows below the blue bar intentionally */}
      <View
        style={{
          position: "absolute",
          top: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 10,
        }}
      >
        <Image
          source={require("../../../assets/images/biggs-logo.png")}
          style={{ width: 200, height: 100 }}
          contentFit="contain"
        />
      </View>

      {useConfirmation && (
        <ConfirmBottomSheet
          visible={confirmVisible}
          title={confirmTitle}
          description={confirmDescription}
          confirmLabel="Leave"
          cancelLabel="Stay"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmVisible(false)}
        />
      )}
    </View>
  );
}

export function ProfileHeader() {
  return (
    <View className="w-full h-16 bg-white items-center justify-between flex-row px-4">
      <View>
        <Text className="text-lg font-bold">OwnerName</Text>
      </View>
      <View>
        <Pressable>
          <Text>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
