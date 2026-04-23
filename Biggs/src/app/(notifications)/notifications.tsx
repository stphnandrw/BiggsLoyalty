import { HeaderBigLogo } from "@/src/components/layout/header";
import LoadingOverlay from "@/src/components/ui/LoadingOverlay";
import {
  AppNotification,
  groupNotificationsByDate,
  NotificationDateGroup,
  NotificationFilter,
  NotificationFilterTabs,
} from "@/src/components/ui/Notifications";
import {
  getNotificationRecipientsByTagUid,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  NotificationsPayload,
} from "@/src/services/api/notifications";
import { getItem } from "@/src/utils/asyncStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [tagUid, setTagUid] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  useEffect(() => {
    const loadTagUid = async () => {
      const userData = await getItem("userData");
      if (!userData) return;
      try {
        const parsed = JSON.parse(userData) as { tag_uid?: string };
        if (parsed.tag_uid) setTagUid(parsed.tag_uid);
      } catch (error) {
        console.error("Failed to parse userData for notifications:", error);
      }
    };
    void loadTagUid();
  }, []);

  const notificationsQuery = useQuery({
    queryKey: ["notifications", tagUid],
    queryFn: () => getNotificationRecipientsByTagUid(tagUid),
    enabled: !!tagUid,
    refetchInterval: 60_000,
  });

  useFocusEffect(
    useCallback(() => {
      if (tagUid) {
        void queryClient.invalidateQueries({
          queryKey: ["notifications", tagUid],
        });
      }
    }, [tagUid, queryClient]),
  );

  const markReadMutation = useMutation({
    mutationFn: async (notificationId: number) =>
      markNotificationAsRead({
        tag_uid: tagUid,
        notification_id: notificationId,
      }),
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", tagUid] });
      const previous = queryClient.getQueryData<NotificationsPayload>([
        "notifications",
        tagUid,
      ]);
      if (previous) {
        const nextNotifications = previous.notifications.map((item) =>
          item.notification_id === notificationId
            ? { ...item, is_read: true, read_at: new Date().toISOString() }
            : item,
        );
        queryClient.setQueryData<NotificationsPayload>(
          ["notifications", tagUid],
          {
            ...previous,
            notifications: nextNotifications,
            unread_count: nextNotifications.filter((i) => !i.is_read).length,
          },
        );
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(["notifications", tagUid], context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["notifications", tagUid],
      });
      void queryClient.invalidateQueries({
        queryKey: ["notificationsUnread", tagUid],
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(tagUid),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications", tagUid] });
      const previous = queryClient.getQueryData<NotificationsPayload>([
        "notifications",
        tagUid,
      ]);
      if (previous) {
        const readAt = new Date().toISOString();
        queryClient.setQueryData<NotificationsPayload>(
          ["notifications", tagUid],
          {
            ...previous,
            notifications: previous.notifications.map((item) =>
              item.is_read ? item : { ...item, is_read: true, read_at: readAt },
            ),
            unread_count: 0,
          },
        );
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(["notifications", tagUid], context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ["notifications", tagUid],
      });
      void queryClient.invalidateQueries({
        queryKey: ["notificationsUnread", tagUid],
      });
    },
  });

  // ── Derived data ─────────────────────────────────────────────────────────────

  const allNotifications = notificationsQuery.data?.notifications ?? [];
  const unreadCount = notificationsQuery.data?.unread_count ?? 0;

  const filteredNotifications =
    activeFilter === "unread"
      ? allNotifications.filter((n) => !n.is_read)
      : allNotifications;

  const groups = groupNotificationsByDate(filteredNotifications);

  const markAllDisabled =
    unreadCount === 0 ||
    markAllReadMutation.isPending ||
    markReadMutation.isPending ||
    notificationsQuery.isLoading;

  const handlePressItem = (item: AppNotification) => {
    if (
      !item.is_read &&
      !markReadMutation.isPending &&
      !markAllReadMutation.isPending
    ) {
      markReadMutation.mutate(item.notification_id);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "left", "right"]}>
      <View className="h-full w-full bg-white">
        <HeaderBigLogo hasBackButton hasLogo title="Notifications" />

        {/* Filter row */}
        <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-2.5">
          <NotificationFilterTabs
            activeFilter={activeFilter}
            allCount={allNotifications.length}
            unreadCount={unreadCount}
            onFilterChange={setActiveFilter}
          />

          <Pressable
            disabled={markAllDisabled}
            onPress={() => {
              if (!markAllDisabled) markAllReadMutation.mutate();
            }}
          >
            <Text
              className={`text-[13px] font-medium ${
                markAllDisabled ? "text-gray-400" : "text-darkBlue"
              }`}
            >
              {markAllReadMutation.isPending ? "Marking…" : "Mark all as read"}
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        {notificationsQuery.isLoading ? (
          <LoadingOverlay />
        ) : (
          <SectionList
            sections={groups.map((g) => ({ title: g.label, data: [g] }))}
            keyExtractor={(group) => group.label}
            renderItem={({ item: group }) => (
              <NotificationDateGroup
                group={group}
                onPressItem={handlePressItem}
                isMarkingRead={
                  markReadMutation.isPending || markAllReadMutation.isPending
                }
              />
            )}
            renderSectionHeader={() => null}
            refreshControl={
              <RefreshControl
                refreshing={notificationsQuery.isRefetching}
                onRefresh={() => void notificationsQuery.refetch()}
              />
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center px-6 py-12">
                <Text className="text-center text-base text-gray-500">
                  {activeFilter === "unread"
                    ? "You're all caught up! No unread notifications."
                    : "You have no notifications yet."}
                </Text>
              </View>
            }
            contentContainerStyle={{
              flexGrow: groups.length === 0 ? 1 : undefined,
              paddingBottom: 32,
            }}
          />
        )}

        {notificationsQuery.isError && (
          <View className="px-4 pb-4">
            <Text className="text-sm text-red-500">
              Failed to load notifications. Pull to refresh to try again.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
