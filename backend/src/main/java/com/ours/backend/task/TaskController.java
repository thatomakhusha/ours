package com.ours.backend.task;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import com.ours.backend.user.UserService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;
    private final UserService userService;

    public TaskController(TaskService taskService, TaskMapper taskMapper, UserService userService) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
        this.userService = userService;
    }

    @PostMapping("/personal")
    public TaskResponse createPersonalTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        Task task = taskService.createPersonalTask(
                userId,
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getDueDate()
        );

        return taskMapper.toResponse(task);
    }

    @PostMapping("/shared")
    public TaskResponse createSharedTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        Task task = taskService.createSharedTask(
                userId,
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getDueDate()
        );

        return taskMapper.toResponse(task);
    }

    @GetMapping("/mine")
    public List<TaskResponse> getMyTasks(Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        List<Task> tasks = taskService.getMyTasks(userId);

        return tasks.stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @GetMapping("/partner")
    public List<TaskResponse> getPartnerTasks(Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        List<Task> tasks = taskService.getPartnerTasks(userId);

        return tasks.stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @GetMapping("/shared")
    public List<TaskResponse> getSharedTasks() {

        List<Task> tasks = taskService.getSharedTasks();

        return tasks.stream()
                .map(taskMapper::toResponse)
                .toList();
    }

    @GetMapping("/top/personal")
    public TaskResponse getTopPersonalTask(Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        return taskService.getTopPersonalTask(userId)
                .map(taskMapper::toResponse)
                .orElse(null);
    }

    @GetMapping("/top/shared")
    public TaskResponse getTopSharedTask() {

        return taskService.getTopSharedTask()
                .map(taskMapper::toResponse)
                .orElse(null);
    }

    @PutMapping("/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        Task task = taskService.updateTask(
                userId,
                taskId,
                request.getTitle(),
                request.getDescription(),
                request.getPriority(),
                request.getDueDate()
        );

        return taskMapper.toResponse(task);
    }

    @PatchMapping("/{taskId}/completion")
    public TaskResponse toggleTaskCompletion(
            @PathVariable Long taskId,
            Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        Task task = taskService.toggleTaskCompletion(userId, taskId);

        return taskMapper.toResponse(task);
    }

    @DeleteMapping("/{taskId}")
    public void deleteTask(
            @PathVariable Long taskId,
            Authentication authentication) {

        String email = authentication.getName();

        Long userId = userService.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User account not found."))
                .getUserId();

        taskService.deleteTask(userId, taskId);
    }
}
