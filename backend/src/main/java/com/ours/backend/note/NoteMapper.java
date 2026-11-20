
package com.ours.backend.note;

import com.ours.backend.user.User;
import com.ours.backend.user.UserService;
import org.springframework.stereotype.Component;

@Component
public class NoteMapper {

    private final UserService userService;

    public NoteMapper(UserService userService) {
        this.userService = userService;
    }

    public NoteResponse toResponse(Note note) {

        User sender = userService.findById(note.getSenderId());

        return new NoteResponse(
                note.getNoteId(),
                note.getSenderId(),
                note.getRecipientId(),
                note.getContent(),
                note.getEdited(),
                note.getCreatedAt(),
                note.getUpdatedAt(),
                sender.getDisplayName()
        );
    }
}
