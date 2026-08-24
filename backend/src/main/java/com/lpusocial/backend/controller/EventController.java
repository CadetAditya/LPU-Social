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
import com.lpusocial.backend.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // CREATE EVENT
    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event) {

        Event savedEvent = eventService.createEvent(event);

        return ResponseEntity.ok(savedEvent);
    }

    // GET ALL EVENTS
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {

        return ResponseEntity.ok(
                eventService.getAllEvents()
        );
    }

    // GET EVENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long id) {

        Optional<Event> event =
                eventService.getEventById(id);

        return event
                .map(ResponseEntity::ok)
                .orElseGet(
                    () -> ResponseEntity.notFound().build()
                );
    }

    // DELETE EVENT
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long id) {

        Optional<Event> event =
                eventService.getEventById(id);

        if (event.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        eventService.deleteEvent(id);

        return ResponseEntity.noContent().build();
    }
}