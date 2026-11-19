package com.ours.backend.task;

import com.ours.backend.common.ForbiddenException;
import com.ours.backend.user.User;
import com.ours.backend.user.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.OffsetDateTime;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public Task createPersonalTask(Long userId, String title, String description, String priority, LocalDate dueDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."));

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Task title cannot be empty.");
        }

        String validatedTitle = title.trim();

        if (validatedTitle.length() > 150) {
            throw new IllegalArgumentException("Task title cannot exceed 150 characters.");
        }

        String validatedDescription = null;

        if (description != null) {
            validatedDescription = description.trim();

            if (validatedDescription.isEmpty()) {
                throw new IllegalArgumentException("Task description cannot be empty.");
            }
        }

        String validatedPriority = (priority == null || priority.isBlank())
                ? "MEDIUM"
                : priority.trim().toUpperCase(Locale.ROOT);

        if (!validatedPriority.equals("HIGH")
                && !validatedPriority.equals("MEDIUM")
                && !validatedPriority.equals("LOW")) {
            throw new IllegalArgumentException("Priority must be HIGH, MEDIUM or LOW.");
        }

        Task task = new Task();

        task.setTitle(validatedTitle);
        task.setDescription(validatedDescription);
        task.setPriority(validatedPriority);
        task.setDueDate(dueDate);

        task.setIsCompleted(false);
        task.setCompletedAt(null);

        task.setOwnerId(user.getUserId());
        task.setIsShared(false);

        task.setCreatedBy(user.getUserId());
        task.setUpdatedBy(user.getUserId());

        return taskRepository.save(task);
    }

    public Task createSharedTask(Long userId, String title, String description, String priority, LocalDate dueDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."));

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Task title cannot be empty.");
        }

        String validatedTitle = title.trim();

        if (validatedTitle.length() > 150) {
            throw new IllegalArgumentException("Task title cannot exceed 150 characters.");
        }

        String validatedDescription = null;

        if (description != null) {
            validatedDescription = description.trim();

            if (validatedDescription.isEmpty()) {
                throw new IllegalArgumentException("Task description cannot be empty.");
            }
        }

        String validatedPriority = (priority == null || priority.isBlank())
                ? "MEDIUM"
                : priority.trim().toUpperCase(Locale.ROOT);

        if (!validatedPriority.equals("HIGH")
                && !validatedPriority.equals("MEDIUM")
                && !validatedPriority.equals("LOW")) {
            throw new IllegalArgumentException("Priority must be HIGH, MEDIUM or LOW.");
        }

        Task task = new Task();

        task.setTitle(validatedTitle);
        task.setDescription(validatedDescription);
        task.setPriority(validatedPriority);
        task.setDueDate(dueDate);

        task.setIsCompleted(false);
        task.setCompletedAt(null);

        task.setOwnerId(null);
        task.setIsShared(true);

        task.setCreatedBy(user.getUserId());
        task.setUpdatedBy(user.getUserId());

        return taskRepository.save(task);
    }

    public List<Task> getMyTasks(Long userId) {
        return taskRepository.findByOwnerIdAndIsSharedFalse(userId);
    }

    public List<Task> getPartnerTasks(Long userId) {
        List<User> partners = userRepository.findByUserIdNot(userId);

        if (partners.size() != 1) {
            throw new IllegalStateException("Could not identify the partner account.");
        }

        Long partnerId = partners.get(0).getUserId();

        return taskRepository.findByOwnerIdAndIsSharedFalse(partnerId);
    }

    public List<Task> getSharedTasks() {
        return taskRepository.findByIsSharedTrue();
    }

    public Optional<Task> getTopPersonalTask(Long userId){
        return taskRepository.findTopPersonalTask(userId);
    }
    public Optional<Task> getTopSharedTask(){
        return taskRepository.findTopSharedTask();
    }

    private Task findTaskForEditing(Long userId, Long taskId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."));

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found."));

        if (!task.getIsShared() && !task.getOwnerId().equals(user.getUserId())) {
            throw new ForbiddenException("You are not allowed to edit this task.");
        }

        return task;
    }

    public Task updateTask(Long userId, Long taskId, String title,
                           String description, String priority, LocalDate dueDate) {

        Task task = findTaskForEditing(userId, taskId);

        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Task title cannot be empty.");
        }

        String validatedTitle = title.trim();

        if (validatedTitle.length() > 150) {
            throw new IllegalArgumentException("Task title cannot exceed 150 characters.");
        }

        String validatedDescription = null;

        if (description != null) {
            validatedDescription = description.trim();

            if (validatedDescription.isEmpty()) {
                throw new IllegalArgumentException("Task description cannot be empty.");
            }
        }

        String validatedPriority = (priority == null || priority.isBlank())
                ? "MEDIUM"
                : priority.trim().toUpperCase(Locale.ROOT);

        if (!validatedPriority.equals("HIGH")
                && !validatedPriority.equals("MEDIUM")
                && !validatedPriority.equals("LOW")) {
            throw new IllegalArgumentException("Priority must be HIGH, MEDIUM or LOW.");
        }

        task.setTitle(validatedTitle);
        task.setDescription(validatedDescription);
        task.setPriority(validatedPriority);
        task.setDueDate(dueDate);
        task.setUpdatedBy(userId);

        return taskRepository.save(task);
    }

    public Task toggleTaskCompletion(Long userId, Long taskId) {

        Task task = findTaskForEditing(userId, taskId);

        if (task.getIsCompleted()) {
            task.setIsCompleted(false);
            task.setCompletedAt(null);
        } else {
            task.setIsCompleted(true);
            task.setCompletedAt(OffsetDateTime.now());
        }

        task.setUpdatedBy(userId);

        return taskRepository.save(task);
    }

    public void deleteTask(Long userId, Long taskId) {

        Task task = findTaskForEditing(userId, taskId);

        taskRepository.delete(task);
    }
}
