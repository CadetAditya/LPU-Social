package com.lpusocial.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lpusocial.backend.model.Event;
import com.lpusocial.backend.model.User;
import com.lpusocial.backend.repository.EventRepository;
import com.lpusocial.backend.repository.UserRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(
            EventRepository eventRepository,
            UserRepository userRepository) {

        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    // ========================================
    // CREATE EVENT
    // ========================================

    public Event createEvent(Event event) {

        // Check whether organizer was provided
        if (event.getOrganizer() == null ||
            event.getOrganizer().getId() == null) {

            throw new RuntimeException(
                "Organizer is required."
            );
        }

        // Find the actual user from the database
        User organizer = userRepository
                .findById(event.getOrganizer().getId())
                .orElseThrow(() ->
                    new RuntimeException(
                        "Organizer not found."
                    )
                );

        // Attach the actual user to the event
        event.setOrganizer(organizer);

        // New event starts with zero participants
        event.setJoined(0);

        // Save event
        return eventRepository.save(event);
    }


    // ========================================
    // GET ALL EVENTS
    // ========================================

    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }


    // ========================================
    // GET EVENT BY ID
    // ========================================

    public Optional<Event> getEventById(Long id) {

        return eventRepository.findById(id);
    }


    // ========================================
    // DELETE EVENT
    // ========================================

    public void deleteEvent(Long id) {

        eventRepository.deleteById(id);
    }
}