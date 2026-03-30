/**
 * PushNotificationTest
 *
 * A dev/demo component that lets you trigger every notification type and
 * see the push token. Drop this screen anywhere while learning.
 *
 * HOW NOTIFICATIONS REACH USERS
 * ─────────────────────────────
 * 1. Local  → fires immediately on THIS device; no network/server needed.
 *             Great for testing, scheduled reminders, or single-device alerts.
 *
 * 2. Remote → you send the notification from a server (or from inside the app
 *             for demo purposes) to the Expo Push API, which forwards it to
 *             FCM (Android) or APNs (iOS), which delivers it to the device.
 *             This is how you'd message any user in production.
 */
import { usePushNotifications } from "@/src/hooks/usePushNotifications";
import {
  scheduleLocalNotification,
  sendExpoPushNotification,
} from "@/src/services/notifications";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PushNotificationTest() {
  const { expoPushToken, notification } = usePushNotifications();
  const [sending, setSending] = useState(false);

  // ─── Local notification helpers ──────────────────────────────────────────

  async function fireLocal(
    type: "WE_MISS_YOU" | "NEW_OFFERS" | "INACTIVE_USER",
  ) {
    try {
      await scheduleLocalNotification(type);
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  }

  // ─── Remote push helpers ─────────────────────────────────────────────────

  async function fireRemote(
    type: "WE_MISS_YOU" | "NEW_OFFERS" | "INACTIVE_USER",
  ) {
    if (!expoPushToken) {
      Alert.alert("No token", "ExpoPushToken is not yet available.");
      return;
    }
    setSending(true);
    try {
      await sendExpoPushNotification(expoPushToken, type);
      Alert.alert("Sent!", "Check your notification tray in a few seconds.");
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 20 }}
    >
      {/* ── Push Token ─────────────────────────────────────────────────── */}
      <Text className="text-lg font-bold mb-1">Your ExpoPushToken</Text>
      <Text className="text-xs text-gray-500 mb-1">
        Copy this into the Expo Push Tool at expo.dev/notifications to test
        remote pushes from the browser.
      </Text>
      <View className="bg-gray-100 rounded-lg p-3 mb-6">
        {expoPushToken ? (
          <Text className="text-xs font-mono break-all">{expoPushToken}</Text>
        ) : (
          <ActivityIndicator size="small" />
        )}
      </View>

      {/* ── Explanation ────────────────────────────────────────────────── */}
      <Text className="text-lg font-bold mb-4">Try the notification types</Text>

      {/* ── WE_MISS_YOU ────────────────────────────────────────────────── */}
      <NotificationCard
        title='💛 "We miss you"'
        description='Re-engagement push. Actions: "View Offers" (→ Promos) + "Not Now".'
        onLocal={() => fireLocal("WE_MISS_YOU")}
        onRemote={() => fireRemote("WE_MISS_YOU")}
        sending={sending}
      />

      {/* ── INACTIVE_USER ──────────────────────────────────────────────── */}
      <NotificationCard
        title={"👋 You haven't logged in"}
        description={
          "Inactivity nudge. Actions: 'Log In' (→ Login screen) + 'Remind Me Later'."
        }
        onLocal={() => fireLocal("INACTIVE_USER")}
        onRemote={() => fireRemote("INACTIVE_USER")}
        sending={sending}
      />

      {/* ── NEW_OFFERS ─────────────────────────────────────────────────── */}
      <NotificationCard
        title='🎉 "Exclusive offers just for you"'
        description='Promo push. Actions: "See Offers" (→ Promos) + "Dismiss".'
        onLocal={() => fireLocal("NEW_OFFERS")}
        onRemote={() => fireRemote("NEW_OFFERS")}
        sending={sending}
      />

      {/* ── Last received notification ─────────────────────────────────── */}
      {notification && (
        <View className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <Text className="font-bold mb-1">Last received notification</Text>
          <Text className="text-sm">
            Title: {notification.request.content.title}
          </Text>
          <Text className="text-sm">
            Body: {notification.request.content.body}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Data: {JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Small card component ─────────────────────────────────────────────────────

function NotificationCard({
  title,
  description,
  onLocal,
  onRemote,
  sending,
}: {
  title: string;
  description: string;
  onLocal: () => void;
  onRemote: () => void;
  sending: boolean;
}) {
  return (
    <View className="border border-gray-200 rounded-xl p-4 mb-4">
      <Text className="font-bold text-base mb-1">{title}</Text>
      <Text className="text-xs text-gray-500 mb-3">{description}</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 bg-gray-900 rounded-lg py-2 items-center"
          onPress={onLocal}
        >
          <Text className="text-white text-xs font-medium">
            Local (instant)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-red-600 rounded-lg py-2 items-center"
          onPress={onRemote}
          disabled={sending}
        >
          <Text className="text-white text-xs font-medium">
            {sending ? "Sending…" : "Remote (Expo API)"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
