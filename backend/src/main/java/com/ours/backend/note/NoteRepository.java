package com.ours.backend.note;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findBySenderId(Long senderId);

    List<Note> findByRecipientId(Long recipientId);

    Optional<Note> findFirstByRecipientIdOrderByCreatedAtDescNoteIdDesc(Long recipientId);

    Optional<Note> findByNoteIdAndSenderId(Long noteId, Long senderId);
}
