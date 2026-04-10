import { HeaderBigLogo } from "@/src/components/layout/header";
import {
  AppNotification,
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
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const queryClient = useQueryClient();
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
    mutationFn: async (notificationId: number) => {
      console.log("[Notifications] markNotificationAsRead request", {
        tag_uid: tagUid,
        notification_id: notificationId,
      });

      const response = await markNotificationAsRead({
        tag_uid: tagUid,
        notification_id: notificationId,
      });

      console.log("[Notifications] markNotificationAsRead response", response);
      return response;
    },
    onMutate: async (notificationId: number) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", tagUid] });

      const previous = queryClient.getQueryData<NotificationsPayload>([
        "notifications",
        tagUid,
      ]);

      if (previous) {
        const markedIds = new Set([notificationId]);
        const nextNotifications = previous.notifications.map((item) =>
          markedIds.has(item.notification_id)
            ? { ...item, is_read: true, read_at: new Date().toISOString() }
            : item,
        );

        const nextUnread = nextNotifications.filter(
          (item) => !item.is_read,
        ).length;

        queryClient.setQueryData<NotificationsPayload>(
          ["notifications", tagUid],
          {
            ...previous,
            notifications: nextNotifications,
            unread_count: nextUnread,
          },
        );
      }

      return { previous };
    },
    onError: (error, _variables, context) => {
      console.log("[Notifications] markNotificationAsRead error", error);
      const errorWithResponse = error as {
        response?: { status?: number; data?: unknown };
      };
      if (errorWithResponse.response) {
        console.log("[Notifications] markNotificationAsRead error response", {
          status: errorWithResponse.response.status,
          data: errorWithResponse.response.data,
        });
      }
      if (context?.previous) {
        queryClient.setQueryData(["notifications", tagUid], context.previous);
      }
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
      if (context?.previous) {
        queryClient.setQueryData(["notifications", tagUid], context.previous);
      }
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

  const renderNotification = ({ item }: { item: AppNotification }) => {
    const createdAtText = new Date(item.created_at).toLocaleString();

    return (
      <Pressable
        className="w-full rounded-xl border border-gray-200 bg-white p-4 mb-3"
        onPress={() => {
          console.log("[Notifications] pressed notification", {
            notification_id: item.notification_id,
            notification_recipient_id: item.notification_recipient_id,
            is_read: item.is_read,
            markReadPending: markReadMutation.isPending,
            markAllPending: markAllReadMutation.isPending,
            tag_uid: tagUid,
          });

          if (
            !item.is_read &&
            !markReadMutation.isPending &&
            !markAllReadMutation.isPending
          ) {
            console.log("[Notifications] triggering mark-as-read", {
              notification_id: item.notification_id,
            });
            markReadMutation.mutate(item.notification_id);
          } else {
            console.log("[Notifications] mark-as-read skipped", {
              reason: item.is_read
                ? "already_read"
                : markReadMutation.isPending
                  ? "single_mark_pending"
                  : markAllReadMutation.isPending
                    ? "mark_all_pending"
                    : "unknown",
            });
          }
        }}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-darkBlue text-base font-kanitMedium">
              {item.title}
            </Text>
            <Text className="text-gray-700 text-sm mt-1">{item.body}</Text>
            <Text className="text-gray-400 text-xs mt-2">{createdAtText}</Text>
          </View>
          {!item.is_read && (
            <View className="h-3 w-3 rounded-full bg-red-500 mt-1" />
          )}
        </View>
      </Pressable>
    );
  };

  const notifications = notificationsQuery.data?.notifications ?? [];
  const unreadCount = notificationsQuery.data?.unread_count ?? 0;
  const markAllDisabled =
    unreadCount === 0 ||
    markAllReadMutation.isPending ||
    markReadMutation.isPending ||
    notificationsQuery.isLoading;

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-black"
      edges={["top", "left", "right"]}
    >
      <View className="w-full h-full bg-white">
        <HeaderBigLogo hasBackButton hasNotifications isLoggedIn />

        <View className="w-full px-6 mt-16 mb-4 flex-row items-center justify-between">
          <Text className="text-darkBlue text-2xl leading-none font-kanitMedium uppercase">
            Notifications
          </Text>
          <View className="items-end gap-1">
            <Text className="text-red-500 text-sm font-kanitMedium">
              {unreadCount} unread
            </Text>
            <Pressable
              className="rounded-md border border-darkBlue px-3 py-1"
              disabled={markAllDisabled}
              onPress={() => {
                if (!markAllDisabled) {
                  markAllReadMutation.mutate();
                }
              }}
            >
              <Text
                className={`text-xs font-kanitMedium ${
                  markAllDisabled ? "text-gray-400" : "text-darkBlue"
                }`}
              >
                {markAllReadMutation.isPending
                  ? "Marking..."
                  : "Mark all as read"}
              </Text>
            </Pressable>
          </View>
        </View>

        {notificationsQuery.isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#0A4B78" />
            <Text className="text-gray-600 mt-2">Loading notifications...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => String(item.notification_recipient_id)}
            renderItem={renderNotification}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: 24,
              flexGrow: notifications.length === 0 ? 1 : undefined,
            }}
            refreshControl={
              <RefreshControl
                refreshing={notificationsQuery.isRefetching}
                onRefresh={() => {
                  void notificationsQuery.refetch();
                }}
              />
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-600 text-base text-center">
                  You have no notifications yet.
                </Text>
              </View>
            }
          />
        )}

        {notificationsQuery.isError && (
          <View className="px-6 pb-6">
            <Text className="text-red-500 text-sm">
              Failed to load notifications. Pull to refresh to try again.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
