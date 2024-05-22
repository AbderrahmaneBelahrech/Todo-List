package org.sid.pfa.dao;

import java.util.List;

import org.sid.pfa.entities.Task;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task,Long> {

	List<Task> findByOwnerId(Long ownerId);
	List<Task> findByUserGroupId(Long userGroupId);

    List<Task> findByUserGroupIdIn(List<Long> groupIds);
}
