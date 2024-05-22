package org.sid.pfa.controllers;

import org.sid.pfa.dao.TaskRepository;
import org.sid.pfa.dao.UserGroupRepository;
import org.sid.pfa.dao.UserRepository;
import org.sid.pfa.entities.Task;
import org.sid.pfa.entities.User;
import org.sid.pfa.entities.UserGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        if (task.getOwner() != null) {
            User owner = userRepository.findById(task.getOwner().getId()).orElse(null);
            if (owner == null) {
                return ResponseEntity.badRequest().body(null);
            }
            task.setOwner(owner);
        } else {
            return ResponseEntity.badRequest().body(null);
        }

        if (task.getUserGroup() != null) {
            UserGroup userGroup = userGroupRepository.findById(task.getUserGroup().getId()).orElse(null);
            if (userGroup == null) {
                return ResponseEntity.badRequest().body(null);
            }
            task.setUserGroup(userGroup);
        }

        Task savedTask = taskRepository.save(task);
        return new ResponseEntity<>(savedTask, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getUserTasks(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Get user-specific tasks
        List<Task> userTasks = taskRepository.findByOwnerId(userId);

        // Get group tasks
        List<UserGroup> userGroups = user.getUserGroups();
        List<Long> groupIds = userGroups.stream().map(UserGroup::getId).collect(Collectors.toList());
        List<Task> groupTasks = taskRepository.findByUserGroupIdIn(groupIds);

        // Combine both lists
        List<Task> allTasks = new ArrayList<>();
        allTasks.addAll(userTasks);
        allTasks.addAll(groupTasks);

        return ResponseEntity.ok(allTasks);
    }

    @GetMapping("/user-group/{userGroupId}")
    public ResponseEntity<List<Task>> getTasksByUserGroupId(@PathVariable("userGroupId") Long userGroupId) {
        List<Task> tasks = taskRepository.findByUserGroupId(userGroupId);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }
    @GetMapping("/group/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByGroupUserId(@PathVariable Long userId) {
        List<UserGroup> userGroups = userGroupRepository.findByUsers_Id(userId);
        Set<Task> groupTasks = new HashSet<>();

        for (UserGroup group : userGroups) {
            groupTasks.addAll(group.getTasks());
        }

        return new ResponseEntity<>(new ArrayList<>(groupTasks), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable("id") Long id, @RequestBody Task taskDetails) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setName(taskDetails.getName());
                    task.setDescription(taskDetails.getDescription());
                    task.setDueDate(taskDetails.getDueDate());
                    task.setStatus(taskDetails.getStatus());
                    task.setPriority(taskDetails.getPriority());
                    task.setUserGroup(taskDetails.getUserGroup());
                    Task updatedTask = taskRepository.save(task);
                    return ResponseEntity.ok(updatedTask);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<Object> deleteTask(@PathVariable("taskId") Long id) {
        return taskRepository.findById(id)
                .map(task -> {
                    taskRepository.delete(task);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
