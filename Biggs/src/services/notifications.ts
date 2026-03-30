import { getItem, setItem } from "@/src/utils/asyncStorage";
import * as Notifications from "expo-notifications";

const LAST_LOGIN_KEY = "last_login_timestamp";

// ─── Last-login persistence ───────────────────────────────────────────────────

/** Call this right after a successful login. */
export async function saveLastLogin() {
  const now = Date.now().toString();
  await setItem(LAST_LOGIN_KEY, now);
  console.log(
    "[Notifications] saveLastLogin → saved timestamp:",
    now,
    `(${new Date(parseInt(now)).toLocaleString()})`,
  );
}

/**
 * Call this on every app open (from usePushNotifications).
 * If the user hasn't logged in for `thresholdSeconds`, schedule an
 * inactivity local notification.
 *
 * Production:  checkInactivityAndNotify(7 * 24 * 60 * 60)  // 7 days
 * Testing:     checkInactivityAndNotify(30)                // 30 seconds
 */
export async function checkInactivityAndNotify(
  thresholdSeconds = 7 * 24 * 60 * 60,
) {
  console.log(
    "[Notifications] checkInactivityAndNotify → reading AsyncStorage...",
  );

  const raw = await getItem(LAST_LOGIN_KEY);

  if (!raw) {
    console.log(
      "[Notifications] checkInactivityAndNotify → no last_login found (first-time or never logged in), skipping.",
    );
    return;
  }

  const lastLogin = parseInt(raw, 10);
  const secondsSince = (Date.now() - lastLogin) / 1000;
  const remaining = thresholdSeconds - secondsSince;

  console.log(
    `[Notifications] checkInactivityAndNotify →`,
    `\n  last_login : ${new Date(lastLogin).toLocaleString()}`,
    `\n  seconds since: ${secondsSince.toFixed(1)}s`,
    `\n  threshold  : ${thresholdSeconds}s`,
    `\n  status     : ${remaining > 0 ? `⏳ ${remaining.toFixed(1)}s remaining` : "🔔 THRESHOLD REACHED — firing notification"}`,
  );

  if (secondsSince >= thresholdSeconds) {
    await scheduleLocalNotification("INACTIVE_USER");
    const resetTime = Date.now().toString();
    await setItem(LAST_LOGIN_KEY, resetTime);
    console.log(
      "[Notifications] checkInactivityAndNotify → notification fired, timestamp reset to:",
      new Date(parseInt(resetTime)).toLocaleString(),
    );
  }
}

// ─── Category & Action Identifiers ───────────────────────────────────────────

export const NOTIFICATION_CATEGORIES = {
  WE_MISS_YOU: "we-miss-you",
  NEW_OFFERS: "new-offers",
  INACTIVE_USER: "inactive-user",
} as const;

export type NotificationCategory =
  (typeof NOTIFICATION_CATEGORIES)[keyof typeof NOTIFICATION_CATEGORIES];

export const NOTIFICATION_ACTIONS = {
  VIEW_OFFERS: "VIEW_OFFERS",
  SEE_OFFERS: "SEE_OFFERS",
  LOG_IN: "LOG_IN",
  NOT_NOW: "NOT_NOW",
  REMIND_LATER: "REMIND_LATER",
} as const;

// ─── Register Interactive Categories ─────────────────────────────────────────
// Call this once at app startup. Categories define the action buttons that
// appear below the notification banner (iOS) or as notification reply actions
// (Android 7+).

export async function registerNotificationCategories() {
  // "We miss you" — re-engagement, navigates to Promos
  await Notifications.setNotificationCategoryAsync(
    NOTIFICATION_CATEGORIES.WE_MISS_YOU,
    [
      {
        identifier: NOTIFICATION_ACTIONS.VIEW_OFFERS,
        buttonTitle: "View Offers",
        options: { opensAppToForeground: true },
      },
      {
        identifier: NOTIFICATION_ACTIONS.NOT_NOW,
        buttonTitle: "Not Now",
        options: { opensAppToForeground: false },
      },
    ],
  );

  // "New exclusive offers" — promo push, navigates to Promos
  await Notifications.setNotificationCategoryAsync(
    NOTIFICATION_CATEGORIES.NEW_OFFERS,
    [
      {
        identifier: NOTIFICATION_ACTIONS.SEE_OFFERS,
        buttonTitle: "See Offers",
        options: { opensAppToForeground: true },
      },
      {
        identifier: NOTIFICATION_ACTIONS.NOT_NOW,
        buttonTitle: "Dismiss",
        options: { opensAppToForeground: false },
      },
    ],
  );

  // "Inactive user" — nudge to log back in
  await Notifications.setNotificationCategoryAsync(
    NOTIFICATION_CATEGORIES.INACTIVE_USER,
    [
      {
        identifier: NOTIFICATION_ACTIONS.LOG_IN,
        buttonTitle: "Log In",
        options: { opensAppToForeground: true },
      },
      {
        identifier: NOTIFICATION_ACTIONS.REMIND_LATER,
        buttonTitle: "Remind Me Later",
        options: { opensAppToForeground: false },
      },
    ],
  );
}

// ─── Notification Payloads ────────────────────────────────────────────────────

type NotificationPayload = {
  title: string;
  body: string;
  /** Route to navigate to when the user taps the notification or an action */
  screen: string;
  categoryIdentifier: NotificationCategory;
};

const NOTIFICATION_PAYLOADS: Record<
  keyof typeof NOTIFICATION_CATEGORIES,
  NotificationPayload
> = {
  WE_MISS_YOU: {
    title: "Hey, we miss you! 💛",
    body: "Check out our new offers waiting just for you.",
    screen: "/(tabs)/promos",
    categoryIdentifier: NOTIFICATION_CATEGORIES.WE_MISS_YOU,
  },
  NEW_OFFERS: {
    title: "Exclusive offers just for you! 🎉",
    body: "Hey there! New exclusive deals have just dropped — don't miss out.",
    screen: "/(tabs)/promos",
    categoryIdentifier: NOTIFICATION_CATEGORIES.NEW_OFFERS,
  },
  INACTIVE_USER: {
    title: "Hey there! 👋",
    body: "You haven't logged in for a while. Come back and see what's new!",
    screen: "/(auth)/login",
    categoryIdentifier: NOTIFICATION_CATEGORIES.INACTIVE_USER,
  },
};

// ─── Local / On-Device Notifications (for testing) ───────────────────────────
// These fire instantly on the device without going through a server.
// Perfect for development or for scheduling reminder-style nudges.

export async function scheduleLocalNotification(
  type: keyof typeof NOTIFICATION_CATEGORIES,
  /** Optional delay in seconds before the notification fires. Default: 0 (immediate). */
  delaySeconds = 0,
) {
  const payload = NOTIFICATION_PAYLOADS[type];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body,
      sound: "default",
      // 'data' travels with the notification and is readable in your listeners
      data: { screen: payload.screen },
      categoryIdentifier: payload.categoryIdentifier,
    },
    trigger:
      delaySeconds > 0
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: delaySeconds,
          }
        : null,
  });
}

// ─── Remote Push via Expo Push API ───────────────────────────────────────────
// In production you'd call this from your backend server (Node, Python, etc.)
// so that YOU control when each user receives a notification.
// For demo purposes this function can be called from the app using the
// device's own ExpoPushToken.

export async function sendExpoPushNotification(
  expoPushToken: string,
  type: keyof typeof NOTIFICATION_CATEGORIES,
) {
  const payload = NOTIFICATION_PAYLOADS[type];

  const message = {
    to: expoPushToken,
    sound: "default",
    title: payload.title,
    body: payload.body,
    // 'data' is forwarded to the app and readable inside your listeners
    data: { screen: payload.screen },
    // 'categoryId' activates the interactive action buttons you registered
    categoryId: payload.categoryIdentifier,
  };

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const result = await response.json();
  console.log("Expo Push API response:", result);
  return result;
}
