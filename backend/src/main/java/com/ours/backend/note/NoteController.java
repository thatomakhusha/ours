package com.ours.backend.note;

import com.ours.backend.user.UserService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;
    private final NoteMapper noteMapper;
    private final UserService userService;

    public NoteController(NoteService noteService, NoteMapper noteMapper, UserService userService) {
        this.noteService = noteService;
        this.noteMapper = noteMapper;
        this.userService = userService;
    }

    @PostMapping
    public NoteResponse createNote(
            @Valid @RequestBody CreateNoteRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        Note note = noteService.createNote(userId, request.getContent());

        return noteMapper.toResponse(note);
    }
}
