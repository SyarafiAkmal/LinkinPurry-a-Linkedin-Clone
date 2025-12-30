import { useEffect, useState } from "react";
import axios from "axios";
import InvitationCard from "@/components/InvitationCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  id: string;
  username: string;
  email: string;
  work_history: string;
  skills: string;
}

export default function ConnectionRequest() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/connection-requests",
          {
            withCredentials: true
          },
        );
        setProfiles(response.data.body.users);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfiles();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await axios.post(`http://localhost:3000/api/connection-requests/${id}/accept`, {}, {
        withCredentials: true,
      });

      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      toast.success("Connection request accepted")
      navigate("/connections")
    } catch (err) {
      toast.error("Failed to accept connection request")
      console.error("Failed to accept connection request:", err);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await axios.post(`http://localhost:3000/api/connection-requests/${id}/decline`, {}, {
        withCredentials: true,
      });

      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      toast.success("Connection request declined")
    } catch (err) {
      toast.success("Failed to decline connection request")
      console.error("Failed to decline connection request:", err);
    }
  };

  return (
    <div className="rounded-sm h-full p-4 bg-white">
      <h2 className="text-left mb-4">Invitations</h2>
      <div className="flex flex-col gap-2">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <InvitationCard
              key={profile.id}
              name={profile.username}
              onDecline={(event: React.MouseEvent) => {
                event.stopPropagation();
                handleDecline(profile.id);
              }}
              onAccept={(event: React.MouseEvent) => {
                event.stopPropagation();
                handleAccept(profile.id);
              }}
              navigateTo="/feed"
            />
          ))
        ) : (
          <div className="text-lg">No invitations available</div>
        )}
      </div>
    </div>
  );
}
