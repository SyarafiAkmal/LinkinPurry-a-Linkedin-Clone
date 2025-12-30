import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";

export interface InvitationCardProps {
  name: string,
  imageUrl?: string,
  onDecline: (event:React.MouseEvent) => void,
  onAccept: (event:React.MouseEvent) => void,
  navigateTo: string,
};

const InvitationCard: React.FC<InvitationCardProps> = ({ name, imageUrl, onDecline, onAccept, navigateTo }) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(navigateTo);
  };

  return (
    <Card
      className="hover:cursor-pointer hover:shadow-md"
      onClick={handleCardClick}
    >
      <CardContent className="flex flex-col md:flex-row p-4 justify-between">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Avatar>
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <h3 className="text-xl">{name}</h3>
        </div>
        <div className="flex mt-4 md:mt-0 gap-2">
          <Button
            className="px-4 py-2 w-full text-sm text-gray-600 border-2 border-white bg-white rounded-full min-w-32 hover:text-gray-800 hover:bg-gray-100"
            onClick={onDecline}
          >
            Decline
          </Button>
          <Button
            className="px-4 py-2 w-full text-sm text-blue-600 bg-white border-blue-600 border-[1px] rounded-full min-w-32 hover:bg-blue-50 hover:border-blue-800"
            onClick={onAccept}
          >
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationCard;
