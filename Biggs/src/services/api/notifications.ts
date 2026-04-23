import { api, isNotFoundError } from "@/src/services/api/api";
import {
  MarkReadResultSchema,
  NotificationRowListSchema,
} from "@/src/services/api/schemas/notifications";
import type {
  AppNotification,
  MarkReadResult,
  NotificationsPayload,
  NotificationType,
} from "@/src/types";

export type {
  AppNotification,
  MarkReadResult,
  NotificationsPayload
} from "@/src/types";

type RawNotificationRow = {
  notification_id?: number | string;
  notification_recipient_id?: number | string;
  title?: string | null;
  body?: string | null;
  message?: string | null;
  type?: string | null;
  is_read?: boolean | number | string;
  read_at?: string | null;
  delivery_status?: string | null;
  data_payload?: Record<string, unknown> | string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const VALID_NOTIFICATION_TYPES = new Set<NotificationType>([
  "course",
  "assignment",
  "announcement",
  "reading",
  "achievement",
  "default",
]);

const normalizeNotificationType = (
  value: string | null | undefined,
): NotificationType => {
  if (value && VALID_NOTIFICATION_TYPES.has(value as NotificationType)) {
    return value as NotificationType;
  }

  return "default";
};

interface NotificationsResponse {
  status?: string;
  data?: NotificationsPayload | RawNotificationRow[];
  notifications?: RawNotificationRow[];
  unread_count?: number | string;
  meta?: {
    limit?: number;
    offset?: number;
    count?: number;
  };
}

const toNumber = (value: unknown, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    return value === "1" || value.toLowerCase() === "true";
  }

  return false;
};

const parseDataPayload = (
  value: RawNotificationRow["data_payload"],
): Record<string, unknown> | null => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return value;
};

const normalizeNotificationRow = (row: RawNotificationRow): AppNotification => {
  const notificationId = toNumber(row.notification_id);
  const createdAt =
    row.created_at ?? row.updated_at ?? new Date().toISOString();

  return {
    notification_id: notificationId,
    notification_recipient_id: toNumber(
      row.notification_recipient_id,
      notificationId,
    ),
    title: row.title?.trim() || `Notification #${notificationId}`,
    body: row.body?.trim() || row.message?.trim() || "You have a new update.",
    type: normalizeNotificationType(row.type),
    is_read: toBoolean(row.is_read),
    read_at: row.read_at ?? null,
    delivery_status: row.delivery_status ?? "sent",
    data_payload: parseDataPayload(row.data_payload),
    created_at: createdAt,
  };
};

export const normalizeNotificationsPayload = (
  raw:
    | NotificationsResponse
    | NotificationsPayload
    | RawNotificationRow[]
    | unknown,
): NotificationsPayload => {
  if (!raw) {
    return {
      notifications: [],
      unread_count: 0,
      meta: { limit: 0, offset: 0, count: 0 },
    };
  }

  if (Array.isArray(raw)) {
    const safeRows = NotificationRowListSchema.parse(raw);
    const notifications = safeRows.map(normalizeNotificationRow);
    return {
      notifications,
      unread_count: notifications.filter((item) => !item.is_read).length,
      meta: {
        limit: notifications.length,
        offset: 0,
        count: notifications.length,
      },
    };
  }

  const response = raw as NotificationsResponse | NotificationsPayload;

  if (
    "notifications" in response &&
    Array.isArray((response as NotificationsPayload).notifications)
  ) {
    const payload = response as NotificationsPayload;
    const notifications = payload.notifications.map(normalizeNotificationRow);
    return {
      notifications,
      unread_count:
        typeof payload.unread_count === "number"
          ? payload.unread_count
          : notifications.filter((item) => !item.is_read).length,
      meta: {
        limit: payload.meta?.limit ?? notifications.length,
        offset: payload.meta?.offset ?? 0,
        count: payload.meta?.count ?? notifications.length,
      },
    };
  }

  if ("data" in response) {
    return normalizeNotificationsPayload(response.data);
  }

  return {
    notifications: [],
    unread_count: 0,
    meta: { limit: 0, offset: 0, count: 0 },
  };
};

export const getNotificationRecipientsByTagUid = async (
  tag_uid: string,
): Promise<NotificationsPayload> => {
  try {
    const response = await api.post<
      NotificationsResponse | RawNotificationRow[]
    >(`/user/getNotificationRecipientsByTagUid`, {
      tag_uid,
    });
    console.log(
      "Get Notification Recipients By Tag UID API Response:",
      response.data,
    );
    return normalizeNotificationsPayload(response.data);
  } catch (error) {
    if (isNotFoundError(error)) {
      return {
        notifications: [],
        unread_count: 0,
        meta: { limit: 0, offset: 0, count: 0 },
      };
    }

    console.error("Get Notification Recipients By Tag UID API Error:", error);
    throw error;
  }
};

// mark a single notification as read
export const markNotificationAsRead = async (params: {
  tag_uid: string;
  notification_id: number;
}): Promise<MarkReadResult> => {
  try {
    const response = await api.post("user/markNotificationAsRead", {
      tag_uid: params.tag_uid,
      notification_ids: [params.notification_id],
    });

    console.log("Mark Notification As Read API Response:", response.data);
    const parsed = MarkReadResultSchema.parse(response.data);

    return {
      updated_count: parsed.updated_count ?? parsed.data?.updated_count ?? 0,
      unread_count: parsed.unread_count ?? parsed.data?.unread_count ?? 0,
    };
  } catch (error) {
    if (!isNotFoundError(error)) {
      console.error("Mark Notification As Read API Error:", error);
    }
    throw error;
  }
};

// mark all notifications as read for a user
export const markAllNotificationsAsRead = async (
  tag_uid: string,
): Promise<MarkReadResult> => {
  try {
    const response = await api.post("user/markAllNotificationsAsRead", {
      tag_uid,
    });
    console.log("Mark All Notifications As Read API Response:", response.data);
    const parsed = MarkReadResultSchema.parse(response.data);

    return {
      updated_count: parsed.updated_count ?? parsed.data?.updated_count ?? 0,
      unread_count: parsed.unread_count ?? parsed.data?.unread_count ?? 0,
    };
  } catch (error) {
    if (!isNotFoundError(error)) {
      console.error("Mark All Notifications As Read API Error:", error);
    }
    throw error;
  }
};
