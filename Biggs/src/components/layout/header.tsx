import { ConfirmBottomSheet } from "@/src/components/ui/Modal";
import { logout } from "@/src/utils/asyncStorage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

type HeaderProps = {
  title?: string;
  hasBackButton?: boolean;
  hasNotifications?: boolean;
  isLoggedIn?: boolean;
  hasLogout?: boolean;
  onBackPress?: () => void;
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
  isLoggedIn,
  hasLogout,
  useConfirmation,
  confirmTitle = "Are you sure?",
  confirmDescription = "Any unsaved changes will be lost.",
}: HeaderProps) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState<"back" | "logout" | null>(
    null,
  );

  const triggerAction = (action: "back" | "logout") => {
    if (useConfirmation) {
      setPendingAction(action);
      setConfirmVisible(true);
    } else {
      if (action === "back") {
        router.back();
      } else {
        doLogout();
      }
    }
  };

  const handleConfirm = () => {
    setConfirmVisible(false);
    if (pendingAction === "back") router.back();
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
        className={`w-full flex-row ${hasBackButton ? "justify-between" : "justify-end"} items-center bg-lightBlue absolute top-0 h-16 px-7`}
      >
        {hasBackButton && (
          <Pressable onPress={() => triggerAction("back")}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        )}

        {hasNotifications && isLoggedIn !== false && (
          <Pressable
            onPress={() => router.push("/(notifications)/notifications")}
          >
            <Ionicons name="notifications-outline" size={32} color="white" />
          </Pressable>
        )}

        {hasLogout && (
          <Pressable onPress={() => triggerAction("logout")}>
            <MaterialCommunityIcons name="logout" size={32} color="white" />
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
