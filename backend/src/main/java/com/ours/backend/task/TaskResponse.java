package com.ours.backend.task;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public class TaskResponse {

    private Long taskId;
    private String title;
    private String description;
    private String priority;

    private LocalDate dueDate;
    private Boolean isCompleted;
    private Boolean isShared;
    private OffsetDateTime completedAt;

    private Long createdBy;
    private Long updatedBy;

    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public TaskResponse(
            Long taskId,
            String title,
            String description,
            String priority,
            LocalDate dueDate,
            Boolean isCompleted,
            Boolean isShared,
            OffsetDateTime completedAt,
            Long createdBy,
            Long updatedBy,
            OffsetDateTime createdAt,
            OffsetDateTime updatedAt
    ) {
        this.taskId = taskId;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.isCompleted = isCompleted;
        this.isShared = isShared;
        this.completedAt = completedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public Boolean getIsShared() {
        return isShared;
    }

    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public Long getUpdatedBy() {
        return updatedBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
