package com.ours.backend.note;

import com.ours.backend.user.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import jakarta.validation.Valid;

import java.util.List;
import com.ours.backend.common.NotFoundException;

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
                .orElseThrow(() -> new NotFoundException("User account not found."))
                .getUserId();

        Note note = noteService.createNote(userId, request.getContent());

        return noteMapper.toResponse(note);
    }

    @GetMapping("/sent")
    public List<NoteResponse> getSentNotes(Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User account not found."))
                .getUserId();

        return noteService.getSentNotes(userId)
                .stream()
                .map(noteMapper::toResponse)
                .toList();
    }

    @GetMapping("/received")
    public List<NoteResponse> getReceivedNotes(Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User account not found."))
                .getUserId();

        return noteService.getReceivedNotes(userId)
                .stream()
                .map(noteMapper::toResponse)
                .toList();
    }

    @GetMapping("/latest")
    public NoteResponse getLatestReceivedNote(Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User account not found."))
                .getUserId();

        return noteService.getLatestReceivedNote(userId)
                .map(noteMapper::toResponse)
                .orElse(null);
    }

    @PutMapping("/{noteId}")
    public NoteResponse updateNote(
            @PathVariable Long noteId,
            @Valid @RequestBody UpdateNoteRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User account not found."))
                .getUserId();

        Note note = noteService.updateNote(
                noteId,
                userId,
                request.getContent()
        );

        return noteMapper.toResponse(note);
    }

    @DeleteMapping("/{noteId}")
    public void deleteNote(
            @PathVariable Long noteId,
            Authentication authentication) {
        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User account not found."))
                .getUserId();

        noteService.deleteNote(userId, noteId);
    }
}
