package com.ours.backend.note;

import org.springframework.stereotype.Component;

@Component
public class NoteMapper {

    public NoteResponse toResponse(Note note) {

        return new NoteResponse(
                note.getNoteId(),
                note.getSenderId(),
                note.getRecipientId(),
                note.getContent(),
                note.getEdited(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
