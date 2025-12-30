import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../LoadingPage";

type Profile = {
  id: string;
  full_name: string;
  profile_photo_path: string;
}

export default function UserList() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [profileData, setProfileData] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const navigator = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchProfiles = async (query: string) => {
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        params: { search: query },
        withCredentials: true,
      });
      setProfileData(response.data.body.users);
    } catch (err) {
      toast.error("Failed to fetch profiles.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles(debouncedSearch);
  }, [debouncedSearch]);

  const sendConnectionRequest = async (profileId: string) => {
    try {
      const body = { to_id: profileId };
      await axios.post("http://localhost:3000/api/connection-requests", body, {
        withCredentials: true,
      });
      toast.success("Connection request has been sent.");
    } catch {
      console.error("Error sending connection request.");
    }
  };

  useEffect(() => {
    fetchProfiles(debouncedSearch);
  }, [debouncedSearch]);

  const filteredProfiles = profileData.filter((profile) => profile.id !== user?.id);

  if (isLoading) return LoadingPage();

  return (
    <div className="p-4 bg-white">
      <div className="mb-4 flex items-center gap-4 p-1">
        <Label className="whitespace-nowrap text-md">Find Users:</Label>
        <Input
          className="flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
          placeholder="Search users..."
        />
        <Button
          onClick={() => navigator("/connections")}
          className="ml-1 text-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View Connections
        </Button>
      </div>
      <div className="rounded-sm h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProfiles.map((profile) => (
          <ProfileCard
          key={profile.id}
          name={profile.full_name}
          imageUrl={profile.profile_photo_path}
          renderButton={{
            isAuthenticated: isAuthenticated || true,
            connected: false
          }}
          onConnect={() => {
            sendConnectionRequest(profile.id);
          }}
          navigateTo={`/profile/${profile.id}`}
          />
        ))}
      </div>
    </div>
  );
}
