import { Calendar } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface TaskCardProps {
  id: string;
  title: string;
  status: string;
  description: string;
  date: string;
}

const TaskCard = ({ id, title, status, description, date }: TaskCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-200';
      case 'in_progress':
        return 'text-blue-700 bg-blue-200';
      default:
        return 'text-orange-700 bg-orange-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };
  return (
    <Link href={`/tasks/${id}`}> 
    <div className="w-90 p-3 rounded-sm bg-secondary flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{title}</p>
                    <p className={`text-[10px] p-1 rounded-3xl ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </p>                  </div>
                  <p className="text-sm font-light">{description}</p>
                  <div className="flex gap-2 justify-start items-center">
                    <Calendar size={12} />
                    <p className="text-sm">{date}</p>
                  </div>

                </div>
    </Link>
    
  )
}

export default TaskCard