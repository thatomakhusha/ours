package com.ours.backend.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByOwnerIdAndIsSharedFalse(Long ownerId);

    List<Task> findByIsSharedTrue();

    @Query(value = """
        SELECT *
        FROM tasks
        WHERE owner_id = :ownerId
          AND is_shared = FALSE
          AND is_completed = FALSE
        ORDER BY
            CASE priority
                WHEN 'HIGH' THEN 1
                WHEN 'MEDIUM' THEN 2
                WHEN 'LOW' THEN 3
            END ASC,
            due_date ASC NULLS LAST,
            created_at ASC,
            task_id ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<Task> findTopPersonalTask(@Param("ownerId") Long ownerId);
}