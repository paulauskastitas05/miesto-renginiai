-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 17, 2025 at 12:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `miesto-renginiai`
--

-- --------------------------------------------------------

--
-- Table structure for table `renginiai`
--

CREATE TABLE `renginiai` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` enum('Music','Sport','Art') NOT NULL,
  `date` datetime NOT NULL,
  `location` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` float DEFAULT 0,
  `votes` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `renginiai`
--

INSERT INTO `renginiai` (`id`, `title`, `category`, `date`, `location`, `image`, `rating`, `votes`) VALUES
(15, 'Sporto renginys', 'Sport', '2025-12-10 00:16:00', 'Klaipeda', 'https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg', 3, 2),
(16, 'Meno renginys', 'Art', '2025-01-22 15:22:00', 'Klaipėda', 'https://img.freepik.com/free-photo/abstract-nature-painted-with-watercolor-autumn-leaves-backdrop-generated-by-ai_188544-9806.jpg?semt=ais_hybrid', 2, 1),
(17, 'Koncertas', 'Music', '2025-01-28 16:23:00', 'Kaunas', 'https://img.freepik.com/premium-photo/colourful-smoke-with-music-notes-illustration-generative-ai_841229-644.jpg', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `vartotojai`
--

CREATE TABLE `vartotojai` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vartotojai`
--

INSERT INTO `vartotojai` (`id`, `username`, `email`, `password`, `role`, `status`, `created_at`) VALUES
(13, 'vartotojas1', 'vartotojas1@gmail.com', '$2a$10$qun0A4vAm7FbS9OvYaANju9/ax5.fHVCbwmZAgzI4yIqWL0c.Gjo2', 'user', 'active', '2024-12-12 10:32:38'),
(14, 'admin', 'admin@gmail.com', '$2a$10$JHXwlfzBxfPMBS0m4Qs8DujheElb6nOUq0115zs35EuQHSf78Dovm', 'admin', 'active', '2024-12-12 10:48:13'),
(15, 'adminz', 'adminz@inbox.lt', '$2a$10$XFfyys3YyZjinlKFH/.iXun2vAWgYwwVk9LIYtwS6700XusZIJYxu', 'user', 'active', '2025-01-17 10:24:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `renginiai`
--
ALTER TABLE `renginiai`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vartotojai`
--
ALTER TABLE `vartotojai`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `renginiai`
--
ALTER TABLE `renginiai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `vartotojai`
--
ALTER TABLE `vartotojai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
