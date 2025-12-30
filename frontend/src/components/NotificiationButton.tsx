import React from 'react';
import useSubscribe from '@/hooks/useSubscribe';
import toast from 'react-hot-toast';

export const NotificationButton: React.FC = () => {
  const { requestNotificationPermission, subscribe } = useSubscribe();

  const handleEnableNotifications = async () => {
    try {
      await requestNotificationPermission();
      if (Notification.permission === "granted") {
        await subscribe();
        toast.success('Push notifications enabled!');
      } else {
        console.error("Notification permission denied. Cannot subscribe.");
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
  };

  return (
    <button onClick={handleEnableNotifications}>
      Enable Notifications
    </button>
  );
};