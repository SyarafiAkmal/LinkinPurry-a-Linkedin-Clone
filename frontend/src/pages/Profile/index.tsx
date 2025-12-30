import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
// import { parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

interface FeedPost {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  name: string;
  username: string;
  email: string;
  work_history?: string;
  skills?: string;
  profile_photo: string;
  connection_count: number;
  relevant_posts: FeedPost[];
  isButton?: boolean;
}

export default function ProfilePage() {
  const params = useParams();
  const [userId, setUserId] = useState<string | undefined>(params.user_id);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { profileId } = useParams();

  const fetchCurrentUser = async (): Promise<string> => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/me", {
        withCredentials: true,
      });
      return response.data.body.id;
    } catch (err) {
      throw new Error("Failed to fetch current user");
    }
  };

  const fetchProfile = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/profile/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setProfile(response.data.body);
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error fetching profile");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (!userId) {
          const fetchedUserId = await fetchCurrentUser();
          setUserId(fetchedUserId);
          await fetchProfile(fetchedUserId);
        } else {
          await fetchProfile(userId);
        }
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };
    init();
  }, [userId]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/profile/${user_id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setProfile(response.data.body);
        setIsEdit(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error updating profile");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (isLoading) return <ProfileSkeleton />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!profile) return <div className="text-center">No profile data available</div>;

  if (isEdit) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={profile.name} required />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue={profile.username} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={profile.email} required />
              </div>
              <div>
                <Label htmlFor="work_history">Work History</Label>
                <Textarea id="work_history" name="work_history" defaultValue={profile.work_history} />
              </div>
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Textarea id="skills" name="skills" defaultValue={profile.skills} />
              </div>
              <div>
                <Label htmlFor="profile_photo">Profile Photo</Label>
                <Input id="profile_photo" name="profile_photo" type="file" />
              </div>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setIsEdit(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <ProfileInfoCard profile={profile} id={profileId} onEdit={() => setIsEdit(true)}  />
      <WorkHistoryCard workHistory={profile.work_history} />
      <SkillsCard skills={profile.skills} />
      <RelevantPostsCard posts={profile.relevant_posts} />
    </div>
  );
}

function ProfileInfoCard({ profile, id, onEdit }: { profile: Profile; id: string |undefined;onEdit: () => void }) {
  const sendConnectionRequest = async (profileId: string |undefined) => {
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
  const handleDelete = async (id: string | undefined) => {
    try {
      await axios.delete(`http://localhost:3000/api/connections/${id}`, {
        withCredentials: true,
      });

      toast.success("Connection has been deleted")
    } catch (err) {
      toast.error("Failed to delete connection")
      console.error("Failed to delete connection:", err);
    }
  };
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-slate-300 to-slate-200" />
        <Avatar className="absolute -bottom-12 left-6 h-32 w-32 border-4 border-white">
          <AvatarImage src={profile.profile_photo} alt={profile.name} />
          <AvatarFallback className="text-4xl bg-teal-500 text-white">
            {profile.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <CardContent className="pt-16 px-6 pb-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.username}</p>
              <p className="text-blue-600 cursor-pointer">Informasi kontak</p>
              <p className="text-sm text-gray-500">{profile.connection_count} koneksi</p>
          </div>
          <div>
            {profile.isButton !== undefined ? (
              <Button 
                variant={profile.isButton ? "default" : "destructive"}
                className="w-32"
                onClick={() => {
                  if (profile.isButton) {
                    sendConnectionRequest(id);
                  } else {
                    handleDelete(id);
                  }
                }}
              >
                {profile.isButton ? "Connect" : "Disconnect"}
              </Button>
            ) : (
              profile.relevant_posts && <Button 
                onClick={onEdit}
                variant="outline"
                className="w-32"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
        </div>
      </CardContent>
    </Card>
  );
}

function WorkHistoryCard({ workHistory }: { workHistory?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Work History</CardTitle>
      </CardHeader>
      <CardContent>
        {workHistory ? (
          <p>{workHistory}</p>
        ) : (
          <p className="text-gray-500">No work history available</p>
        )}
      </CardContent>
    </Card>
  );
}

function SkillsCard({ skills }: { skills?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {skills ? (
          <p>{skills}</p>
        ) : (
          <p className="text-gray-500">No skills listed</p>
        )}
      </CardContent>
    </Card>
  );
}

function RelevantPostsCard({ posts }: { posts: FeedPost[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relevant Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {posts?.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="border-b pb-4 last:border-b-0">
                <p>{post.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on: {new Date(post.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No relevant posts</p>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}