import React from "react";
import { UserPlus } from 'lucide-react'
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

export interface ProfileCardProps {
  name: string,
  imageUrl?: string,
  renderButton?: {
    isAuthenticated: boolean,
    connected: boolean,
  },
  onConnect: () => void,
  navigateTo: string,
};

const ProfileCard: React.FC<ProfileCardProps> = ({ name, imageUrl, renderButton, onConnect, navigateTo }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(navigateTo);
  };

  return (
    <Card
      className="w-full h-full max-w-xs mx-auto hover:cursor-pointer hover:shadow-md overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative h-20 bg-slate-200" />
      <div className="relative flex justify-center items-center">
        <Avatar className="absolute -top-10 h-[72px] w-[72px] border-4 border-white">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="px-4 pb-4 pt-10 text-center">
        <h3 className="text-lg font-semibold">{name || "Guest"}</h3>
        {renderButton?.isAuthenticated && 
          <div className="flex justify-center gap-2 mt-4">
            {renderButton.connected ? (
              <Button className="px-4 py-2 w-full text-sm text-blue-600 bg-white border-blue-600 border-[1px] rounded-full pointer-events-none">
                Connected
              </Button>
              ) : (
              <Button
                className="px-4 py-2 w-full text-sm text-blue-600 bg-white border-blue-600 border-[1px] rounded-full hover:bg-blue-50 hover:border-2"
                onClick={onConnect}
              >
                <UserPlus className="mr-2"/>
                Connect
              </Button>
            )}
          </div>
        }
      </div>
    </Card>
  );
};

export default ProfileCard;
