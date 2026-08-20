-- ==========================================================
-- Venue & Event Hall Reservation System Database Schema
-- Compatible with MySQL 8.0+ / MariaDB / Relational SQL
-- ==========================================================

CREATE DATABASE IF NOT EXISTS venue_reservation_db;
USE venue_reservation_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    phone VARCHAR(30) NULL,
    company VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Venues & Event Halls Table
CREATE TABLE IF NOT EXISTS venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    type ENUM('Ballroom', 'Boardroom', 'Amphitheater', 'Rooftop Terrace', 'Glass Pavilion', 'Exhibition Hall') NOT NULL,
    capacity INT NOT NULL,
    sqft INT NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    weekend_multiplier DECIMAL(3, 2) DEFAULT 1.25,
    min_booking_hours INT DEFAULT 2,
    image_url VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    features JSON NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Add-on Amenities Table
CREATE TABLE IF NOT EXISTS amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('A/V & Tech', 'Catering & Dining', 'Staffing & Security', 'Stage & Decor') NOT NULL,
    flat_fee DECIMAL(10, 2) DEFAULT 0.00,
    hourly_fee DECIMAL(10, 2) DEFAULT 0.00,
    icon VARCHAR(50) DEFAULT 'Sparkles',
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Venue-Amenity Many-to-Many Association
CREATE TABLE IF NOT EXISTS venue_amenities (
    venue_id INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (venue_id, amenity_id),
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Bookings & Tentative Holds Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    venue_id INT NOT NULL,
    event_name VARCHAR(150) NOT NULL,
    event_type VARCHAR(80) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('AVAILABLE', 'HELD', 'CONFIRMED', 'EXPIRED', 'CANCELLED') NOT NULL DEFAULT 'HELD',
    is_tentative_hold BOOLEAN DEFAULT TRUE,
    hold_expires_at DATETIME NULL,
    guest_count INT NOT NULL,
    duration_hours DECIMAL(4, 2) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    amenities_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10, 2) NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE RESTRICT,
    INDEX idx_venue_time (venue_id, start_time, end_time),
    INDEX idx_status_hold (status, hold_expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Booking Add-on Amenities Junction
CREATE TABLE IF NOT EXISTS booking_amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amenity_id INT NOT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
