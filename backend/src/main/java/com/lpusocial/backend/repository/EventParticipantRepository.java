package com.lpusocial.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpusocial.backend.model.Event;
import com.lpusocial.backend.model.EventParticipant;
import com.lpusocial.backend.model.User;

public interface EventParticipantRepository
        extends JpaRepository<EventParticipant, Long> {

    // Check whether a user has already joined an event
    Optional<EventParticipant> findByEventAndUser(
            Event event,
            User user
    );

    // Get all participants of an event
    List<EventParticipant> findByEvent(Event event);

    // Get all events joined by a user
    List<EventParticipant> findByUser(User user);

    // Count participants in an event
    long countByEvent(Event event);
}