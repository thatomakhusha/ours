package com.ours.backend.note;

import com.ours.backend.user.User;
import com.ours.backend.user.UserRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public Note createNote(Long senderId, String content) {

        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Note content cannot be empty.");
        }

        if (senderId == null) {
            throw new IllegalArgumentException("Sender account is required.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender account not found."));

        List<User> partners = userRepository.findByUserIdNot(senderId);

        if (partners.size() != 1) {
            throw new IllegalStateException("Partner account could not be identified.");
        }

        User recipient = partners.get(0);

        Note note = new Note();
        note.setSenderId(sender.getUserId());
        note.setRecipientId(recipient.getUserId());
        note.setContent(content.trim());

        return noteRepository.save(note);
    }

    public List<Note> getSentNotes(Long userId){
        return noteRepository.findBySenderId(userId);
    }

    public List<Note> getReceivedNotes(Long userId) {
        return noteRepository.findByRecipientId(userId);
    }

    public Optional<Note> getLatestReceivedNote(Long userId) {
        return noteRepository.findFirstByRecipientIdOrderByCreatedAtDescNoteIdDesc(userId);
    }
}
