export interface Note {
  noteId: number;
  senderId: number;
  recipientId: number;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}
