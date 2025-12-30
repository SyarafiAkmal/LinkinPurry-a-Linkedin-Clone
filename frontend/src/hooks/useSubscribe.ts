import axios from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";

interface SubscriptionResponse {
  message?: string;
  error?: string;
}

const useSubscribe = () => {
  const requestNotificationPermission = useCallback(async () => {
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.error("Notification permission denied.");
    }
  }, []);

  const subscribe = useCallback(async () => {
    if ("serviceWorker" in navigator) {
      try {
        const register = await navigator.serviceWorker.register("/sw.js");

        const existingSubscription = await register.pushManager.getSubscription();

        if (existingSubscription) {
          console.log("Already subscribed:", existingSubscription);
          return;
        }

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });

        const res = await axios.post<SubscriptionResponse>(
          "http://localhost:3000/api/subscribe",
          subscription,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        toast.success('Push notifications enabled!');
        console.log("Subscription successful:", res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error during subscription:",
            error.response?.data || error.message
          );
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    } else {
      console.warn("Service Worker is not supported in this browser.");
    }
  }, []);

  return { requestNotificationPermission, subscribe };
};

export default useSubscribe;