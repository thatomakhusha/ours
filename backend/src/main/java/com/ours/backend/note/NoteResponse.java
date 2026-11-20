
package com.ours.backend.note;

import java.time.OffsetDateTime;

public class NoteResponse {

    private Long noteId;
    private Long senderId;
    private Long recipientId;

    private String content;
    private Boolean isEdited;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    private String senderDisplayName;

    public NoteResponse(
            Long noteId,
            Long senderId,
            Long recipientId,
            String content,
            Boolean isEdited,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt,
            String senderDisplayName
    ) {
        this.noteId = noteId;
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.content = content;
        this.isEdited = isEdited;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.senderDisplayName = senderDisplayName;
    }

    public Long getNoteId() {
        return noteId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public String getContent() {
        return content;
    }

    public Boolean getIsEdited() {
        return isEdited;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getSenderDisplayName() {
        return senderDisplayName;
    }
}
