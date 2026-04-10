export type AppNotification = {
  notification_id: number;
  notification_recipient_id: number;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  read_at: string | null;
  delivery_status: string;
  data_payload: Record<string, unknown> | null;
  created_at: string;
};

export type NotificationsPayload = {
  notifications: AppNotification[];
  unread_count: number;
  meta: {
    limit: number;
    offset: number;
    count: number;
  };
};

export type MarkReadResult = {
  updated_count: number;
  unread_count: number;
};
