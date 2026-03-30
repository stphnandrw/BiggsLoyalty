-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2026 at 09:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `biggs_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `favorite_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `promo_id` int(11) DEFAULT NULL,
  `menu_id` int(11) DEFAULT NULL,
  `date_redeemed` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`favorite_id`, `user_id`, `promo_id`, `menu_id`, `date_redeemed`) VALUES
(4, 2, NULL, 3, NULL),
(5, 3, 4, NULL, NULL),
(6, 3, NULL, 7, NULL),
(7, 4, 3, NULL, NULL),
(8, 4, NULL, 2, NULL),
(9, 5, 5, NULL, NULL),
(10, 5, NULL, 1, NULL),
(11, 1, 4, NULL, NULL),
(12, 1, 6, 1, NULL),
(14, 1, 1, NULL, NULL),
(15, 1, 5, NULL, NULL),
(61, 2, 7, NULL, NULL),
(62, 2, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `otp_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `phone_number` varchar(11) NOT NULL,
  `otp_code` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otp`
--

INSERT INTO `otp` (`otp_id`, `user_id`, `phone_number`, `otp_code`, `expires_at`, `is_verified`) VALUES
(1, 1, '', '$2y$10$ODREfSUqoAndEjtxxx5YROJO9yADDh1b7S6YJnBNL2dt6YsCxrt/.', '2026-03-24 01:05:53', 0),
(2, 1, '', '$2y$10$ssDh0SDLlxYz2q/noe/7YuEaiG9.A0Ntypyz1V/WdF7vmoHu9vWZu', '2026-03-24 01:08:09', 1),
(3, 1, '', '$2y$10$ccR8dl1LtewkM3cxpxwBluJW8I6I8GYLRx75vG/mxcK8ki2qPG/4q', '2026-03-24 01:08:26', 1),
(4, 1, '', '$2y$10$43yoigxWhpKw9GTtnZVfU..RUiPZykpE5s19rYxl8Ffe449TCT9VW', '2026-03-24 01:12:04', 0),
(5, 1, '', '$2y$10$tiv8VVLhNo0MhUPvKlNmNehcDJxDEdVjisA3FWufUVsuLkQ1rvWtK', '2026-03-24 01:12:47', 1),
(6, 1, '', '$2y$10$sDiPibOULHJXAMVzKRq/qe2BgQR3q/JPQe6ovWjXkFyTkfsktQWM2', '2026-03-24 01:19:44', 0),
(7, 1, '', '$2y$10$h6nlClMIEKzFCa.DNjWryOjPzuJQ5oE835TBzBUL3rq/DJ.mxLa7a', '2026-03-24 01:19:56', 0),
(8, 1, '', '$2y$10$Ct3X3tg.geIp4nlc9UpGCOSLZYzfzvRFNwmm2k2udYF.qpwNb/TM6', '2026-03-24 01:22:33', 1),
(9, NULL, '9151234567', '$2y$10$TpoyL4wzeH9LDdPPSFW/m./d5C8U9Mm6/shnSWxXT0Ipgx6gSXV/O', '2026-03-24 02:57:02', 1),
(10, NULL, '09151234567', '$2y$10$v9/9kXk199Y1Ct.Eap9JUelOmCn5aPp9jEbvBeTTMcAPht9rdi.lG', '2026-03-24 03:20:34', 0),
(11, NULL, '09151234567', '$2y$10$zleeT14SnCQb.imuxddnXOBTmOIGNQO57WGIvKvEj5izcRwKAozJG', '2026-03-24 03:21:11', 0),
(12, NULL, '09151234567', '$2y$10$e3AfqAEY01Ar6B123TKJWOqlZxFhtReS0FvIQesvPVRYJBHikZ/X6', '2026-03-24 03:24:46', 0),
(13, NULL, '09151234567', '$2y$10$uATuOA6vyBrAVgEqexuM7uXXpl/z8BXor1XTx/c1sBsysi09ieInO', '2026-03-24 03:26:18', 0),
(14, NULL, '09151234567', '$2y$10$Rwouy8XRAHJjbanaQObYyuURYJFXnyuludMNTmXoGxt6MOR8JLtDm', '2026-03-24 03:26:59', 0),
(15, NULL, '09151234567', '$2y$10$9fVFnQ2fzV86Ilj0qjO9R.9eeBPnCRma13IdCL1FELT6gRYVcA2IW', '2026-03-24 03:36:46', 0),
(16, NULL, '09151234567', '$2y$10$BEIjsAj8ebcMP9SblqHe1.O31k3N/tu1RSGHXHou/JcEbo32pSKYm', '2026-03-24 03:43:20', 0),
(17, NULL, '09151234567', '$2y$10$fW6HMU7kgUhfl2zUIL2dmutD6w4JKbAO91f73AezEkcEpBHeNpTvi', '2026-03-24 03:43:20', 0),
(18, NULL, '09151234567', '$2y$10$FQ/AcoSwaNJuLEf2NgZLcuFLQIo9q7zoZmnGX7qbKt9hYubKOuUGy', '2026-03-24 03:43:21', 0),
(19, NULL, '09151234567', '$2y$10$ELDX9Gi66hT9R4V6lqb7mu6OueGWUN8Rd.OZbds4DEgmjBtuoezZm', '2026-03-24 03:49:37', 0),
(20, NULL, '09151234567', '$2y$10$8PZyoJr7BrnyfgKHiq8aE.xxLYBmw01qFjX7fCaORsHIv.pEcDWJe', '2026-03-24 03:49:53', 0),
(21, NULL, '09151234567', '$2y$10$GK13K/M3QfrB5lKpf2LMUOBvLGVvmE2HIDfbq5QDzTyiGS7VOwph.', '2026-03-24 03:49:53', 0),
(22, NULL, '09151234567', '$2y$10$Sw0fAUauDg3Pt4IlfXPItuyWfWDiTY9MmJS9cCZ01wrK8jYnkPsQy', '2026-03-24 03:49:53', 0),
(23, NULL, '09151234567', '$2y$10$PfrW91SuucFJ5eFfjaExoOPcsdBB47BTIzN29g3OVDEY0n2IDewWG', '2026-03-24 03:58:41', 1),
(24, NULL, '09161234567', '$2y$10$dmVjnLsaeDWZgxC5g4XwUOxvO1gR7O0yCynF88NRWZgqCtzAPAL4.', '2026-03-24 03:59:24', 1),
(25, NULL, '09151234567', '$2y$10$RJmuHplTP4hxZvDuhDOwiOTSseLoZihVVs7GmEKiKL5cqQ1vR889q', '2026-03-24 08:20:35', 1),
(26, NULL, '09161234567', '$2y$10$pWtLkATGKd9pcsbTvvAi8uAUfqA1QDNGQEX2u3KTvyQcgIb7Jpuwe', '2026-03-24 08:23:22', 1),
(27, NULL, '09151234567', '$2y$10$WBuEykzvD8JoTLDJse2E8etgx4CnahTvPX0gu6CBMh1HxdtPjicxC', '2026-03-24 08:48:20', 0),
(28, NULL, '09151234567', '$2y$10$rZl2e1/BK2nCYMRF1CgZmO4i2GUgHc/bHANsoZ/vIZxeRkXO0ZNHK', '2026-03-24 08:51:38', 1);

-- --------------------------------------------------------

--
-- Table structure for table `promos`
--

CREATE TABLE `promos` (
  `promo_id` int(11) NOT NULL,
  `promo_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `required_points` int(11) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `image_url` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promos`
--

INSERT INTO `promos` (`promo_id`, `promo_name`, `description`, `required_points`, `start_date`, `end_date`, `image_url`, `created_at`) VALUES
(1, 'Free Appetizer', 'Redeem a free appetizer with any main course order.', 120, '2026-03-01 00:00:00', '2026-03-31 00:00:00', 'images/promos/appetizer.jpg', '2026-03-01 09:00:00'),
(2, '15% Off Family Meal', 'Enjoy 15% discount on family meal bundles.', 250, '2026-03-05 00:00:00', '2026-04-05 00:00:00', 'images/promos/family_meal.jpg', '2026-03-05 10:30:00'),
(3, 'Free Drink Upgrade', 'Upgrade your regular drink to large for free.', 80, '2026-03-10 00:00:00', '2026-03-25 00:00:00', 'images/promos/drink_upgrade.jpg', '2026-03-10 11:45:00'),
(4, 'Buy 1 Take 1 Burger', 'Buy one burger and get another one free.', 200, '2026-03-12 00:00:00', '2026-04-12 00:00:00', 'images/promos/burger_b1t1.jpg', '2026-03-12 13:15:00'),
(5, 'Free Dessert Treat', 'Get a free dessert for orders worth ₱500 and above.', 180, '2026-03-15 00:00:00', '2026-04-10 00:00:00', 'images/promos/dessert.jpg', '2026-03-15 15:00:00'),
(6, 'Lunch Special Combo', 'Redeem a discounted lunch combo meal.', 100, '2026-03-18 00:00:00', '2026-04-18 00:00:00', 'images/promos/lunch_combo.jpg', '2026-03-18 10:00:00'),
(7, 'Free Delivery Voucher', 'Enjoy free delivery within selected areas.', 300, '2026-03-20 00:00:00', '2026-04-20 00:00:00', 'images/promos/free_delivery.jpg', '2026-03-20 08:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `is_interested_events` tinyint(1) DEFAULT 0,
  `is_interested_franchising` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `middle_name`, `last_name`, `birth_date`, `email`, `phone`, `password`, `is_interested_events`, `is_interested_franchising`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, '09151234567', NULL, 0, 0),
(2, 'Jose', 'Protacio', 'Rizal', '1988-06-19', 'jp_rizal@yahoo.com.ph', '09161234567', '$2y$10$8K1p/a...', 1, 1),
(3, 'Angelo', 'Reyes', 'Guevarra', '1995-11-30', 'aguevarra@outlook.com', '09182223344', '$2y$10$H67jL...', 0, 1),
(4, 'Carmela', 'Castro', 'Bautista', '2000-01-25', 'carm.bautista@gmail.com', '09225556677', '$2y$10$99fG...', 1, 0),
(5, 'Ricardo', 'Dalisay', 'Arellano', '1985-08-14', 'carding_dalisay@gmail.com', '09278889900', '$2y$10$W2kS...', 0, 0),
(6, 'Kristina', 'Bernardo', 'Pascual', '1998-03-12', 'krispascual98@gmail.com', '09951112233', '$2y$10$Pq34...', 1, 1),
(7, 'Antonio', 'Luna', 'Trinidad', '1990-10-29', 'heneral_luna@protonmail.com', '09084445566', '$2y$10$LmN1...', 0, 1),
(8, 'Elena', 'Guinto', 'Aquino', '1993-12-08', 'elena_aquino@icloud.com', '09167778899', '$2y$10$vXz2...', 1, 0),
(9, 'Fernando', 'Poe', 'Magbanua', '1982-02-14', 'fp.magbanua@gmail.com', '09453334455', '$2y$10$AbC5...', 0, 0),
(10, 'Jasmine', 'Villanueva', 'Salvador', '1997-07-04', 'j_salvador@skybroadband.com.ph', '09196667788', '$2y$10$Z1xY...', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_tokens`
--

CREATE TABLE `user_tokens` (
  `token_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expo_push_token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_tokens`
--

INSERT INTO `user_tokens` (`token_id`, `user_id`, `expo_push_token`) VALUES
(1, 1, 'ExponentPushToken[miud_PFC7DITJHLfC7oYl2]'),
(2, 1, 'Error: Must use physical device for push notifications'),
(3, 2, 'ExponentPushToken[miud_PFC7DITJHLfC7oYl2]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`favorite_id`),
  ADD KEY `promo` (`promo_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`otp_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `promos`
--
ALTER TABLE `promos`
  ADD PRIMARY KEY (`promo_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `phone_UNIQUE` (`phone`);

--
-- Indexes for table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `fk_users_user_id_user_tokens_user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `otp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `promos`
--
ALTER TABLE `promos`
  MODIFY `promo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `user_tokens`
--
ALTER TABLE `user_tokens`
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`promo_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `otp`
--
ALTER TABLE `otp`
  ADD CONSTRAINT `otp_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `fk_users_user_id_user_tokens_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
