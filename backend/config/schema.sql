CREATE DATABASE IF NOT EXISTS hackathon;
USE hackathon;

CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    university VARCHAR(255) NOT NULL,
    track ENUM('computational physics', 'computational biology', 'computational chemistry', 'computational mathematics') NOT NULL,
    experience ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    skills TEXT NOT NULL,
    teamPreference ENUM('solo', 'team', 'matching') NOT NULL,
    motivation TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_track (track)
);
