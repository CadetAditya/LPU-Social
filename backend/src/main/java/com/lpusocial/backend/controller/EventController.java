package com.lpusocial.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lpusocial.backend.model.Event;
import com.lpusocial.backend.model.EventParticipant;
import com.lpusocial.backend.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }


    // ==========================================
    // CREATE EVENT
    // ==========================================

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event) {

        Event savedEvent =
                eventService.createEvent(event);

        return ResponseEntity.ok(savedEvent);
    }


    // ==========================================
    // GET ALL EVENTS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }


    // ==========================================
    // GET EVENT BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long id) {

        Optional<Event> event =
                eventService.getEventById(id);

        return event
                .map(ResponseEntity::ok)
                .orElseGet(
                        () -> ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // ==========================================
    // DELETE EVENT
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id) {

        Optional<Event> event =
                eventService.getEventById(id);

        if (event.isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        eventService.deleteEvent(id);

        return ResponseEntity
                .noContent()
                .build();
    }


    // ==========================================
    // JOIN EVENT
    // ==========================================

    @PostMapping("/{eventId}/join/{userId}")
    public ResponseEntity<?> joinEvent(
            @PathVariable Long eventId,
            @PathVariable Long userId) {

        try {

            EventParticipant participant =
                    eventService.joinEvent(
                            eventId,
                            userId
                    );

            return ResponseEntity.ok(participant);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            java.util.Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // ==========================================
    // GET USER'S JOINED EVENTS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Event>> getUserEvents(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                eventService.getEventsJoinedByUser(userId)
        );
    }


    // ==========================================
    // CHECK WHETHER USER JOINED EVENT
    // ==========================================

    @GetMapping("/{eventId}/joined/{userId}")
    public ResponseEntity<Boolean> hasUserJoinedEvent(
            @PathVariable Long eventId,
            @PathVariable Long userId) {

        boolean joined =
                eventService.hasUserJoinedEvent(
                        eventId,
                        userId
                );

        return ResponseEntity.ok(joined);
    }
}