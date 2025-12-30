import { useEffect, useState } from "react";
import axios from "axios";
import ConnectionCard from "@/components/ConnectionCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ConnectionData {
  id: string;
  full_name: string;
  imageUrl?: string;
}

export default function ConnectionsList() {
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/connections", {
          withCredentials: true,
        });
        setConnections(response.data.body.users);
      } catch (err) {
        toast.error("Error fetching connections")
        console.error(err);
      }
    };

    fetchConnections();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/connections/${id}`, {
        withCredentials: true,
      });

      toast.success("Connection has been deleted")
      setConnections((prev) => prev.filter((connection) => connection.id !== id));
    } catch (err) {
      toast.error("Failed to delete connection")
      console.error("Failed to delete connection:", err);
    }
  };

  return (
    <div className="rounded-sm h-full p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2>Connections</h2>
        <Button
          className="text-md text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => navigator("/connection-requests")}
        >
          View Connection Requests
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        {connections.length > 0 ? (
          connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              name={connection.full_name}
              imageUrl={connection.imageUrl}
              onDelete={(event: React.MouseEvent) => {
                event.stopPropagation();
                handleDelete(connection.id);
              }}
              navigateTo="/feed"
            />
          ))
        ) : (
          <div className="text-lg">No connections available</div>
        )}
      </div>
    </div>
  );
}
