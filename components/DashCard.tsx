import { BookmarkCheck } from 'lucide-react';
import React from 'react';

interface DashCardProps {
  title: string;
  value: string | number;
}

const DashCard: React.FC<DashCardProps> = ({ title, value }) => {
  return (
    <div className="flex w-50 bg-secondary justify-between items-center p-2 rounded-lg">
      <div className="flex flex-col">
        <p className="font-medium">{title}</p>
        <p className="font-bold text-2xl">{value}</p>
      </div>
      <div className="bg-white p-3 rounded-md">
        <BookmarkCheck />
      </div>
    </div>
  );
};

export default DashCard;
