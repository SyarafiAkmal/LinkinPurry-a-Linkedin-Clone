import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export interface ConnectionCardProps {
  name: string,
  imageUrl?: string,
  onDelete: (event:React.MouseEvent) => void,
  navigateTo: string,
};

const ConnectionCard: React.FC<ConnectionCardProps> = ({ name, imageUrl, onDelete, navigateTo }) => {
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
          className="px-4 py-2 w-full text-sm text-red-600 border-2 border-red-600 bg-white rounded-full min-w-32 hover:text-red-800 hover:bg-red-50"
          onClick={onDelete}
        >
          Disconnect
        </Button>
      </div>
    </CardContent>
  </Card>
  );
};

export default ConnectionCard;
