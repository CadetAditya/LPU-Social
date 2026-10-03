-- Table setup
DROP TABLE IF EXISTS event_participants;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    registration_number VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'STUDENT'
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    joined INTEGER NOT NULL DEFAULT 0,
    description VARCHAR(2000) NOT NULL,
    image TEXT,
    organizer_id BIGINT NOT NULL,

    CONSTRAINT fk_event_organizer
        FOREIGN KEY (organizer_id)
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE event_participants (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, event_id)
);

-- ================================================
-- INITIAL SEED DATA
-- ================================================

-- Test Organizer & Student
INSERT INTO users (name, registration_number, password, role) VALUES
('Campus Event Cell', 'ORG1001', '123456', 'ORGANIZER'),
('Rahul Sharma', '12204567', '123456', 'STUDENT');

-- Initial Campus Events
INSERT INTO events (title, category, date, start_time, end_time, location, capacity, joined, description, image, organizer_id) VALUES
('AI & Machine Learning Bootcamp', 'Technology', '2026-10-15', '10:00:00', '13:00:00', 'Block 34, Room 402', 100, 1, 'Join us for an intensive hands-on workshop covering Python AI libraries, Neural Networks, and practical machine learning model deployments.', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', 1),
('Inter-Hostel Football Championship', 'Sports', '2026-10-18', '16:00:00', '19:00:00', 'LPU Main Ground', 80, 0, 'Annual hostel football knockout series. Register your teams or come support your hostel squad in this high-energy tournament!', 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&w=800&q=80', 1),
('Open Mic Night: Music & Poetry', 'Cultural', '2026-10-22', '18:00:00', '21:00:00', 'Student Center Amphitheatre', 50, 0, 'Showcase your vocal, instrumental, poetry, and stand-up skills in front of an enthusiastic audience. Snacks and drinks provided.', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80', 1);

-- Initial Participation
INSERT INTO event_participants (user_id, event_id) VALUES (2, 1);