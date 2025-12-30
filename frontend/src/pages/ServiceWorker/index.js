useEffect(() => {
  if ("serviceWorker" in navigator) {
    const handleServiceWorker = async () => {
      const register = await navigator.serviceWorker.register("/sw.js");

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "VAPID_PUBLIC_KEY",
      });

      const res = await fetch("http://localhost:4000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await data.json();
      console.log(data);
    };
    handleServiceWorker();
  }
}, []);