import { IonIcon, IonButton } from '@ionic/react';
import { ellipsisVertical, create, trash } from 'ionicons/icons';
import { useState, useRef, useEffect } from 'react';
import type { Task } from '@/types';

interface TaskMenuProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskMenu({ task, onEdit, onDelete }: TaskMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative" ref={menuRef} onClick={stopPropagation}>
      <IonButton
        fill="clear"
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
      >
        <IonIcon icon={ellipsisVertical} />
      </IonButton>

      {showMenu && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              onEdit();
              setShowMenu(false);
            }}
          >
            <IonIcon icon={create} className="mr-2" />
            Edit
          </button>
          <button
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={() => {
              onDelete();
              setShowMenu(false);
            }}
          >
            <IonIcon icon={trash} className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}