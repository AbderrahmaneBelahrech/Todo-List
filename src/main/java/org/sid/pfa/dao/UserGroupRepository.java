package org.sid.pfa.dao;

import org.sid.pfa.entities.UserGroup;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserGroupRepository extends JpaRepository<UserGroup,Long> {
    List<UserGroup> findByUsers_Id(Long userId);
}
