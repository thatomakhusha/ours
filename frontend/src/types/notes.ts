export interface Note {
  noteId: number;
  senderId: number;
  recipientId: number;
  senderDisplayName: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}
