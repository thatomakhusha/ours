package com.ours.backend.task;

import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {

        return new TaskResponse(
                task.getTaskId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getDueDate(),
                task.getIsCompleted(),
                task.getIsShared(),
                task.getCompletedAt(),
                task.getCreatedBy(),
                task.getUpdatedBy(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
