package com.springboot.SpringBackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.SpringBackend.model.User;

import java.util.List;

@Repository
//public interface UserRepo extends CrudRepository<Users, Long> { }
public interface UserRepo extends JpaRepository<User, Long>{
    //List<User> findUserByName(String name);
    //List<User> findUserBySurname(String name);
    //List<User> findUserByFullName(String name);
    //List<User> findUserByRole(String role);
}