package com.lpusocial.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpusocial.backend.model.Event;
import com.lpusocial.backend.model.User;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizer(User organizer);

}