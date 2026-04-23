import type {
    AppNotification,
    NotificationType,
} from "@/src/types/notifications";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { MiniGhostButton, MiniPrimaryButton } from "./Buttons";

// ─── Re-exports ───────────────────────────────────────────────────────────────

export type { AppNotification, NotificationType };

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationGroup {
  label: string; // e.g. "Today", "Yesterday", "Monday, October 11, 2024"
  data: AppNotification[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns a human-readable relative label for a notification timestamp. */
export function getRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  console.log(diffMs);

  const minutes = Math.floor(diffMs / 60_000);
  const hours = Math.floor(diffMs / 3_600_000);
  const days = Math.floor(diffMs / 86_400_000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Groups a flat notifications array into dated sections. */
export function groupNotificationsByDate(
  notifications: AppNotification[],
): NotificationGroup[] {
  const now = new Date();
  const todayStr = now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const map = new Map<string, AppNotification[]>();
  const order: string[] = [];

  for (const n of notifications) {
    const d = new Date(n.created_at);
    const dStr = d.toDateString();

    let label: string;
    if (dStr === todayStr) {
      label = "Today";
    } else if (dStr === yesterdayStr) {
      label = "Yesterday";
    } else {
      label = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(n);
  }

  return order.map((label) => ({ label, data: map.get(label)! }));
}

// ─── Icon ─────────────────────────────────────────────────────────────────────

// NativeWind requires full class strings to be statically analyzable — no
// dynamic template literals for color segments. Map each type to its full class.
const ICON_CONFIG: Record<
  NotificationType,
  { bgClass: string; emoji: string }
> = {
  course: { bgClass: "bg-blue-100", emoji: "📖" },
  assignment: { bgClass: "bg-violet-100", emoji: "📅" },
  announcement: { bgClass: "bg-yellow-100", emoji: "🔔" },
  reading: { bgClass: "bg-blue-100", emoji: "📖" },
  achievement: { bgClass: "bg-rose-100", emoji: "🏆" },
  default: { bgClass: "bg-gray-100", emoji: "📢" },
};

function NotificationIcon({ type = "default" }: { type?: NotificationType }) {
  const { bgClass, emoji } = ICON_CONFIG[type] ?? ICON_CONFIG.default;
  return (
    <View
      className={`mr-3 h-11 w-11 shrink-0 items-center justify-center rounded-full ${bgClass}`}
    >
      <Text className="text-xl">{emoji}</Text>
    </View>
  );
}

// ─── NotificationItem ─────────────────────────────────────────────────────────

interface NotificationItemProps {
  item: AppNotification;
  onPress: (item: AppNotification) => void;
  isMarkingRead?: boolean;
}

export function NotificationItem({
  item,
  onPress,
  isMarkingRead = false,
}: NotificationItemProps) {
  const relativeTime = getRelativeTime(item.created_at);

  return (
    <Pressable
      onPress={() => onPress(item)}
      disabled={isMarkingRead}
      className={`flex-row items-center border-b border-gray-100 px-4 py-3.5 active:bg-gray-50 ${
        isMarkingRead ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* Left icon */}
      <NotificationIcon type={item.type} />

      {/* Text block */}
      <View className="flex-1">
        <Text
          numberOfLines={1}
          className={`mb-0.5 text-sm text-gray-900 ${
            item.is_read ? "font-normal" : "font-semibold"
          }`}
        >
          {item.title}
        </Text>
        <Text
          numberOfLines={2}
          className="text-xs leading-[18px] text-gray-500"
        >
          {item.body}
        </Text>
      </View>

      {/* Right: timestamp + unread dot */}
      <View className="ml-2.5 items-end gap-1.5">
        <Text className="text-[11px] text-gray-400">{relativeTime}</Text>
        {!item.is_read && (
          <View className="h-2.5 w-2.5 rounded-full bg-blue-500" />
        )}
      </View>
    </Pressable>
  );
}

// ─── NotificationDateGroup ────────────────────────────────────────────────────

interface NotificationDateGroupProps {
  group: NotificationGroup;
  onPressItem: (item: AppNotification) => void;
  isMarkingRead?: boolean;
}

export function NotificationDateGroup({
  group,
  onPressItem,
  isMarkingRead = false,
}: NotificationDateGroupProps) {
  return (
    <View>
      {/* Section header */}
      <View className="bg-gray-50 px-4 pb-1.5 pt-5">
        <Text className="text-[13px] font-semibold tracking-wide text-gray-700">
          {group.label}
        </Text>
      </View>

      {/* Items */}
      {group.data.map((item) => (
        <NotificationItem
          key={item.notification_recipient_id}
          item={item}
          onPress={onPressItem}
          isMarkingRead={isMarkingRead}
        />
      ))}
    </View>
  );
}

// ─── NotificationFilterTabs ───────────────────────────────────────────────────

export type NotificationFilter = "all" | "unread";

interface FilterTabsProps {
  activeFilter: NotificationFilter;
  allCount: number;
  unreadCount: number;
  onFilterChange: (filter: NotificationFilter) => void;
}

export function NotificationFilterTabs({
  activeFilter,
  allCount,
  unreadCount,
  onFilterChange,
}: FilterTabsProps) {
  const tabs: { key: NotificationFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: allCount },
    { key: "unread", label: "Unread", count: unreadCount },
  ];

  return (
    <View className="flex-row gap-2">
      {tabs.map((tab) => {
        const isActive = activeFilter === tab.key;
        return (
          <View key={tab.key}>
            {isActive ? (
              <MiniPrimaryButton
                buttonName={`${tab.label} (${tab.count})`}
                onPress={() => onFilterChange(tab.key)}
                buttonWidth={90}
              />
            ) : (
              <MiniGhostButton
                buttonName={`${tab.label} (${tab.count})`}
                onPress={() => onFilterChange(tab.key)}
                buttonWidth={90}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
