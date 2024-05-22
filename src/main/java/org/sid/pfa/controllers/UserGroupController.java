package org.sid.pfa.controllers;

import org.sid.pfa.dao.UserGroupRepository;
import org.sid.pfa.dao.UserRepository;
import org.sid.pfa.dto.UserGroupDTO;
import org.sid.pfa.entities.UserGroup;
import org.sid.pfa.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/user-groups")
public class UserGroupController {

    @Autowired
    private UserGroupRepository userGroupRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<UserGroup> createUserGroup(@RequestParam("userId") Long userId, @RequestBody UserGroupDTO userGroupDTO) {
        User createdByUser = userRepository.findById(userId).orElse(null);
        if (createdByUser == null) {
            return ResponseEntity.badRequest().body(null);
        }

        List<String> allEmails = new ArrayList<>(userGroupDTO.getUserEmails());
        allEmails.add(createdByUser.getEmail());

        List<User> users = userRepository.findByEmailIn(allEmails);
        if (users.size() != allEmails.size()) {
            return ResponseEntity.badRequest().body(null);
        }

        UserGroup userGroup = new UserGroup();
        userGroup.setName(userGroupDTO.getName());
        userGroup.setUsers(users);
        userGroup.setCreatedBy(createdByUser);

        UserGroup savedUserGroup = userGroupRepository.save(userGroup);
        return new ResponseEntity<>(savedUserGroup, HttpStatus.CREATED);
    }


    @GetMapping
    public List<UserGroup> getAllUserGroups() {
        return userGroupRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserGroup> getUserGroupById(@PathVariable Long id) {
        return userGroupRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserGroup>> getUserGroupsByUserId(@PathVariable Long userId) {
        List<UserGroup> userGroups = userGroupRepository.findByUsers_Id(userId);
        return new ResponseEntity<>(userGroups, HttpStatus.OK);
    }
}
