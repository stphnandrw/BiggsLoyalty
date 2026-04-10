import { HeaderBigLogo } from "@/src/components/layout/header";
import {
  AppNotification,
  getNotificationRecipientsByTagUid,
  markNotificationsAsRead,
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
    mutationFn: (notificationIds: number[]) =>
      markNotificationsAsRead({
        tag_uid: tagUid,
        notification_ids: notificationIds,
      }),
    onMutate: async (notificationIds) => {
      await queryClient.cancelQueries({ queryKey: ["notifications", tagUid] });

      const previous = queryClient.getQueryData<NotificationsPayload>([
        "notifications",
        tagUid,
      ]);

      if (previous) {
        const markedIds = new Set(notificationIds);
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
          if (!item.is_read && !markReadMutation.isPending) {
            markReadMutation.mutate([item.notification_id]);
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
          <Text className="text-red-500 text-sm font-kanitMedium">
            {unreadCount} unread
          </Text>
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
