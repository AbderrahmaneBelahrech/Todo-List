package org.sid.pfa.dao;

import org.springframework.data.jpa.repository.JpaRepository;


import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.sid.pfa.entities.User;

import java.util.List;

@RepositoryRestResource
public interface UserRepository extends JpaRepository<User,Long> {

	boolean existsByEmail(String email);
	List<User> findByEmailIn(List<String> emails);
	User findByEmail(String email);

}