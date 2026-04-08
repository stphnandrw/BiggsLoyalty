import {
    NOTIFICATION_ACTIONS,
    checkInactivityAndNotify,
    registerNotificationCategories,
} from "@/src/services/notifications";
import { setItem } from "@/src/utils/asyncStorage";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export interface PushNotificationState {
  expoPushToken: string;
  notification: Notifications.Notification | undefined;
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    // handleRegistrationError("Must use physical device for push notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    handleRegistrationError(
      "Permission not granted to get push token for push notification!",
    );
    return;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    handleRegistrationError("Project ID not found");
  }

  try {
    const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log("ExpoPushToken:", pushTokenString);
    return pushTokenString;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

export function usePushNotifications(): PushNotificationState {
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener =
    useRef<Notifications.EventSubscription>(undefined);
  const responseListener = useRef<Notifications.EventSubscription>(undefined);

  useEffect(() => {
    // Decides where to navigate when the user taps the notification or an action button.
    function handleNotificationResponse(
      response: Notifications.NotificationResponse,
    ) {
      const actionId = response.actionIdentifier;
      const data = response.notification.request.content.data as
        | { screen?: string }
        | undefined;

      if (
        // User tapped the notification banner itself
        actionId === Notifications.DEFAULT_ACTION_IDENTIFIER ||
        // User tapped "View Offers" or "See Offers" buttons
        actionId === NOTIFICATION_ACTIONS.VIEW_OFFERS ||
        actionId === NOTIFICATION_ACTIONS.SEE_OFFERS
      ) {
        router.push("/(tabs)/vouchers");
      } else if (actionId === NOTIFICATION_ACTIONS.LOG_IN) {
        router.push("/(auth)/login");
      } else if (data?.screen) {
        // Fallback: use the screen embedded in the notification data
        router.push(data.screen as any);
      }
      // REMIND_LATER and NOT_NOW actions do nothing - opensAppToForeground: false
      // means the app won't even open for those.
    }

    // Register interactive action buttons (do this before listening for responses)
    registerNotificationCategories();

    // Check if the user has been inactive and schedule a nudge if so.
    // Uses the default production threshold of 7 days.
    checkInactivityAndNotify();

    registerForPushNotificationsAsync()
      .then((token) => {
        const t = token ?? "";
        setExpoPushToken(t);
        // Persist so verify.tsx / personal-details.tsx can always read it,
        // regardless of whether it was passed as a nav param.
        if (t) void setItem("expoPushToken", t);
      })
      .catch((error: any) => setExpoPushToken(`${error}`));

    // Fired when a notification arrives while the app is in the foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Fired when the user taps a notification or an action button
    // (app was in background or foreground)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationResponse(response);
      });

    // Handle the case where the app was fully killed and the user tapped a notification
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationResponse(response);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [router]);

  return { expoPushToken, notification };
}
