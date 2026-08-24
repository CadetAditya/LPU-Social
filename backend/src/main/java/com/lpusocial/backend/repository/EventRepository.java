package com.lpusocial.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpusocial.backend.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}