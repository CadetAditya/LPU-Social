package com.lpusocial.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lpusocial.backend.model.Event;
import com.lpusocial.backend.model.EventParticipant;
import com.lpusocial.backend.model.User;
import com.lpusocial.backend.repository.EventParticipantRepository;
import com.lpusocial.backend.repository.EventRepository;
import com.lpusocial.backend.repository.UserRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository eventParticipantRepository;
    private final UserRepository userRepository;


    public EventService(
            EventRepository eventRepository,
            EventParticipantRepository eventParticipantRepository,
            UserRepository userRepository) {

        this.eventRepository = eventRepository;
        this.eventParticipantRepository =
                eventParticipantRepository;
        this.userRepository = userRepository;
    }


    // ==========================================
    // CREATE EVENT
    // ==========================================

    public Event createEvent(Event event) {

        // Make sure joined starts from 0
        if (event.getJoined() == null) {
            event.setJoined(0);
        }

        return eventRepository.save(event);
    }


    // ==========================================
    // GET ALL EVENTS
    // ==========================================

    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }


    // ==========================================
    // GET EVENT BY ID
    // ==========================================

    public Optional<Event> getEventById(Long id) {

        return eventRepository.findById(id);
    }


    // ==========================================
    // DELETE EVENT
    // ==========================================

    public void deleteEvent(Long id) {

        eventRepository.deleteById(id);
    }


    // ==========================================
    // JOIN EVENT
    // ==========================================

    public EventParticipant joinEvent(
            Long eventId,
            Long userId) {

        // Find event
        Event event = eventRepository
                .findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found."
                        )
                );


        // Find user
        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        )
                );


        // Check if user already joined
        Optional<EventParticipant> existingParticipant =
                eventParticipantRepository
                        .findByEventAndUser(event, user);


        if (existingParticipant.isPresent()) {

            throw new RuntimeException(
                    "You have already joined this event."
            );
        }


        // Check event capacity
        int joined =
                event.getJoined() != null
                        ? event.getJoined()
                        : 0;

        int capacity =
                event.getCapacity() != null
                        ? event.getCapacity()
                        : 0;


        if (joined >= capacity) {

            throw new RuntimeException(
                    "This event is already full."
            );
        }


        // Create participant record
        EventParticipant participant =
                new EventParticipant();

        participant.setEvent(event);
        participant.setUser(user);


        EventParticipant savedParticipant =
                eventParticipantRepository
                        .save(participant);


        // Increase joined count
        event.setJoined(joined + 1);

        eventRepository.save(event);


        return savedParticipant;
    }


    // ==========================================
    // GET EVENTS JOINED BY USER
    // ==========================================

    // ==========================================
// GET EVENTS JOINED BY USER
// ==========================================

public List<Event> getEventsJoinedByUser(Long userId) {

    User user = userRepository
            .findById(userId)
            .orElseThrow(() ->
                    new RuntimeException("User not found.")
            );

    List<EventParticipant> participants =
            eventParticipantRepository.findByUser(user);

    return participants.stream()
            .map(EventParticipant::getEvent)
            .toList();
}

    // ==========================================
    // CHECK WHETHER USER JOINED EVENT
    // ==========================================

    public boolean hasUserJoinedEvent(
            Long eventId,
            Long userId) {

        Optional<Event> event =
                eventRepository.findById(eventId);

        Optional<User> user =
                userRepository.findById(userId);


        if (event.isEmpty() || user.isEmpty()) {
            return false;
        }


        return eventParticipantRepository
                .findByEventAndUser(
                        event.get(),
                        user.get()
                )
                .isPresent();
    }
}