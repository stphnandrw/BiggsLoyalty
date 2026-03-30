-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 11:02 AM
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
-- Table structure for table `btc_loyalty`
--

CREATE TABLE `btc_loyalty` (
  `loyalty_id` int(11) NOT NULL,
  `tag_uid` varchar(14) NOT NULL,
  `phone_number` text NOT NULL,
  `activated_flag` tinyint(1) NOT NULL,
  `registered_flag` tinyint(1) NOT NULL,
  `points` int(11) NOT NULL,
  `visits` int(11) NOT NULL,
  `tag_timestamp` datetime NOT NULL,
  `server_timestamp` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `btc_loyalty`
--

INSERT INTO `btc_loyalty` (`loyalty_id`, `tag_uid`, `phone_number`, `activated_flag`, `registered_flag`, `points`, `visits`, `tag_timestamp`, `server_timestamp`) VALUES
(1, '04A6AD40C22A81', '09673169637', 1, 1, 21, 0, '2026-03-30 10:24:57', '2026-03-30 10:24:57');

-- --------------------------------------------------------

--
-- Table structure for table `btc_profile`
--

CREATE TABLE `btc_profile` (
  `tag_uid` varchar(32) NOT NULL,
  `phone_number` varchar(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` text NOT NULL,
  `birthday` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `fave_location` text NOT NULL,
  `fave_item` text NOT NULL,
  `events_flag` tinyint(1) NOT NULL DEFAULT 0,
  `franchising_flag` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `btc_profile`
--

INSERT INTO `btc_profile` (`tag_uid`, `phone_number`, `email`, `name`, `birthday`, `password`, `fave_location`, `fave_item`, `events_flag`, `franchising_flag`) VALUES
('04A6AD40C22A81', '09673169637', '', 'Ian Benedict B. Argote', '1999-08-19', '', 'BRLN', 'CHKN1', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `favorite_id` int(11) NOT NULL,
  `tag_uid` varchar(32) NOT NULL,
  `promo_id` int(11) DEFAULT NULL,
  `menu_id` int(11) DEFAULT NULL,
  `date_redeemed` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`favorite_id`, `tag_uid`, `promo_id`, `menu_id`, `date_redeemed`) VALUES
(26, '04A6AD40C22A81', 9, NULL, NULL),
(27, '04A6AD40C22A81', 10, NULL, NULL),
(28, '04A6AD40C22A81', 11, NULL, NULL),
(29, '04A6AD40C22A81', 12, NULL, NULL),
(33, '04A6AD40C22A81', 4, NULL, NULL),
(37, '04A6AD40C22A81', 3, NULL, NULL),
(38, '04A6AD40C22A81', 6, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `m_id` int(11) NOT NULL,
  `m_code` varchar(20) NOT NULL,
  `m_title` varchar(255) NOT NULL,
  `m_desc` varchar(200) NOT NULL,
  `m_price` varchar(200) NOT NULL,
  `m_creator` varchar(200) NOT NULL,
  `date_create` varchar(200) NOT NULL,
  `filename` varchar(200) NOT NULL,
  `position` varchar(200) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`m_id`, `m_code`, `m_title`, `m_desc`, `m_price`, `m_creator`, `date_create`, `filename`, `position`, `type`) VALUES
(1, 'SIZ04', 'Baby Back Ribs', '   ', '469', 'joer@gmail.com', '2024-09-10 08:38:29', '66dfe965ce14f.png', 'sizzlers', 0),
(2, 'SIZ07', 'Pork Kebab', '   ', '279', 'joer@gmail.com', '2024-09-10 08:38:48', '66dfe97829e53.png', 'sizzlers', 0),
(3, 'CHI12', 'Smoked Chicken', '   ', '309', 'joer@gmail.com', '2024-09-10 08:39:08', '66dfe98c3f5a9.png', 'sizzlers', 0),
(4, 'SIZ10', 'Ribs and Smoked Chicken', '   ', '709', 'joer@gmail.com', '2024-09-10 08:39:47', '66dfe9b31b1a0.png', 'sizzlers', 0),
(5, 'SIZ12', 'Beef Salpicao', '   ', '299', 'joer@gmail.com', '2024-09-10 08:40:29', '66dfe9dd479ed.png', 'sizzlers', 0),
(6, 'SIZ11', 'Tenderloin Tips', '   ', '279', 'joer@gmail.com', '2024-09-10 08:40:37', '66dfe9e545621.png', 'sizzlers', 0),
(7, 'SIZ05', 'Korean Spare Ribs', '   ', '379', 'joer@gmail.com', '2024-09-10 08:40:51', '66dfe9f34c7da.png', 'sizzlers', 0),
(8, 'SIZ08', 'Bicol Special', '   ', '289', 'joer@gmail.com', '2024-09-10 08:41:04', '66dfea00907e8.png', 'sizzlers', 0),
(9, 'SIZ06', 'Pork Cordon Bleu with Creamy Butter Sauce ', '   ', '289', 'joer@gmail.com', '2024-09-10 08:41:13', '66dfea0914529.png', 'sizzlers', 0),
(10, 'SIZ09', 'Original Salisbury Steak', '   ', '269', 'joer@gmail.com', '2024-09-10 08:41:50', '66dfea2e01535.png', 'sizzlers', 0),
(11, 'SIZ15', 'Chicken Salisbury Steak', '   ', '269', 'joer@gmail.com', '2024-09-10 08:41:59', '66dfea371101d.png', 'sizzlers', 0),
(12, 'SIZ01', 'Tuna Salpicao', '   ', '329', 'joer@gmail.com', '2024-09-10 08:42:08', '66dfea4039608.png', 'sizzlers', 0),
(13, 'SIZ16', 'Sizzling Tofu with Mushroom', '   ', '259', 'joer@gmail.com', '2024-09-10 08:42:20', '66dfea4c8b647.png', 'sizzlers', 0),
(14, 'SIZ02', 'Tanguigue Steak', '   ', '319', 'joer@gmail.com', '2024-09-10 08:42:45', '66dfea6532f6e.png', 'sizzlers', 0),
(15, 'BRE01', 'Daing na Bangus', '   ', '299', 'joer@gmail.com', '2024-09-10 08:42:54', '66dfea6e8f7a6.png', 'sizzlers', 0),
(20, 'CHI06', 'Chicken in a Box  (6 pcs)', '   ', ' 679 ', 'joer@gmail.com', '2024-10-29 04:05:12', '67205077d7eb7.png', 'chicken', 1),
(21, 'CHI09', 'Bigg Deal', '   ', '319', 'joer@gmail.com', '2024-10-29 04:06:47', '672051476bcce.png', 'chicken', 1),
(22, 'CHI10', 'Chicken with Kebab Meal', '   ', '279', 'joer@gmail.com', '2024-10-29 04:07:09', '6720515d0030f.png', 'chicken', 1),
(23, 'CHI01', 'Biggs Fried Chicken (1pc)', '   ', '139', 'joer@gmail.com', '2024-10-29 04:07:34', '67205176a19dc.png', 'chicken', 1),
(24, 'CHI03', 'Biggs Fried Chicken  (2 pcs)', '   ', '259', 'joer@gmail.com', '2024-10-29 04:08:11', '6720519b41f5e.png', 'chicken', 1),
(25, 'CHI02', 'Biggs Cajun Chicken (1 pcs)', '   ', '169', 'joer@gmail.com', '2024-10-29 04:09:15', '672051db08f94.png', 'chicken', 1),
(26, 'CHI04', 'Biggs Crispy Cajun (2 pcs)', '   ', '309', 'joer@gmail.com', '2024-10-29 04:09:33', '672051eda0dbb.png', 'chicken', 1),
(27, 'CHI11', 'Chicken with Mac Salad', '   ', '209', 'joer@gmail.com', '2024-10-29 04:10:34', '6720522a8b35c.png', 'chicken', 1),
(31, 'BEV01', 'Signature Iced Coffee', '   ', '119', 'joer@gmail.com', '2024-10-29 04:11:59', '6720527f2c91d.png', 'cold', 0),
(32, 'BEV03', 'Caramel Machiato', '   ', '169', 'joer@gmail.com', '2024-10-29 04:12:10', '6720528a2f57a.png', 'cold', 0),
(33, 'BEV02', 'Sweet Black Coffee', '   ', '109', 'joer@gmail.com', '2024-10-29 04:12:25', '6720529932680.png', 'cold', 0),
(34, 'BEV93', 'Rock N\' Roll Iced Tea', '   ', '79', 'joer@gmail.com', '2024-10-29 04:12:39', '672052a7690a9.png', 'cold', 0),
(35, 'BEV94', 'Pineapple Juice', '   ', '89', 'joer@gmail.com', '2024-10-29 04:12:50', '672052b2d1e96.png', 'cold', 0),
(36, 'BEV95', 'Mango Graham Shake', '   ', '149', 'joer@gmail.com', '2024-10-29 04:13:02', '672052be2bcf8.png', 'cold', 0),
(37, 'BEV96', 'Ripe Mango Shake', '   ', '149', 'joer@gmail.com', '2024-10-29 04:13:13', '672052c95c5f1.png', 'cold', 0),
(38, 'BEV97', 'Cookies and Cream Shake', '   ', '149', 'joer@gmail.com', '2024-10-29 04:13:34', '672052de6f1c5.png', 'cold', 0),
(41, 'BEV18', 'Brewed Coffee', '   ', '99', 'joer@gmail.com', '2024-10-29 04:14:03', '672052fb496ec.png', 'coffee', 1),
(42, 'BEV19', 'Nespresso Brewed Coffee', '   ', '149', 'joer@gmail.com', '2024-10-29 04:14:17', '67205309f2fba.png', 'coffee', 1),
(43, 'BEV20', 'Hot Choco', '   ', '79', 'joer@gmail.com', '2024-10-29 04:14:29', '6720531551163.png', 'coffee', 1),
(165, 'BRE07', 'Beef Tapa', '   ', '239', 'joer@gmail.com', '2024-09-10 08:43:39', '66dfea9b074cc.png', 'breakfast', 1),
(166, 'BRE05', 'Tocilog', '   ', '229', 'joer@gmail.com', '2024-09-10 08:43:50', '66dfeaa6db595.png', 'breakfast', 1),
(167, 'BRE04', 'Country Breakfast', '   ', '249', 'joer@gmail.com', '2024-09-10 08:44:11', '66dfeabbb0830.png', 'breakfast', 1),
(168, 'BRE03', 'Franks and Egg', '   ', '219', 'joer@gmail.com', '2024-09-10 08:44:25', '66dfeac968830.png', 'breakfast', 1),
(169, 'BRE02', 'American Slam', '   ', '259', 'joer@gmail.com', '2024-09-10 08:44:47', '66dfeadf00cf5.png', 'breakfast', 1),
(170, 'BRE10', '', '   ', '99', 'joer@gmail.com', '2024-09-10 08:45:14', '66dfeafaa5ad5.png', 'breakfast', 1),
(171, 'BRE09', 'Biggs Goto', '   ', '89', 'joer@gmail.com', '2024-09-10 08:45:25', '66dfeb05f070e.png', 'breakfast', 1),
(198, 'SID11', 'Nena\'s harvest Salad', '   ', '169', 'joer@gmail.com', '2024-11-13 01:42:09', '6733f5e1078b4.png', 'salad', 1),
(199, 'SID12', 'South Western Salad', '   ', '169', 'joer@gmail.com', '2024-11-13 01:42:21', '6733f5edd4015.png', 'salad', 1),
(200, 'SID13', 'Creamy Macaroni Salad', '   ', '109', 'joer@gmail.com', '2024-11-13 01:42:33', '6733f5f99b454.png', 'salad', 1),
(201, 'SNA13', 'Biggs Spaghetti with Chicken', '   ', '209', 'joer@gmail.com', '2024-11-13 01:44:18', '6733f6621b07c.png', 'pasta', 1),
(202, 'SNA09', 'Biggs Chicken, Spaghetti & Pizza Bread', '   ', '249', 'joer@gmail.com', '2024-11-13 01:44:57', '6733f689b127d.png', 'pasta', 1),
(203, 'SNA12', 'Biggs Chicken, Carbonara & Pizza Bread', '   ', '269', 'joer@gmail.com', '2024-11-13 01:45:11', '6733f697d40a8.png', 'pasta', 1),
(204, 'SNA14', 'Biggs Carbonara with Chicken', '   ', '229', 'joer@gmail.com', '2024-11-13 01:45:28', '6733f6a8e5ed6.png', 'pasta', 1),
(205, 'SNA07', 'Biggs Spaghetti with Pizza Bread ', '   ', '139', 'joer@gmail.com', '2024-11-13 01:45:52', '6733f6c01b162.png', 'pasta', 1),
(206, 'SNA10', 'Biggs Carbonara with Pizza Bread', '   ', '159', 'joer@gmail.com', '2024-11-13 01:46:54', '6733f6fe71f86.png', 'pasta', 1),
(207, 'SNA01', 'Biggs Spaghetti', '   ', '109', 'joer@gmail.com', '2024-11-13 01:47:17', '6733f715ad3de.png', 'pasta', 1),
(208, 'SNA03', 'Bacon Mac N\' Cheese', '   ', '109', 'joer@gmail.com', '2024-11-13 01:48:04', '6733f74421cf9.png', 'pasta', 1),
(209, 'SNA02', 'Biggs Carbonara', '   ', '124', 'joer@gmail.com', '2024-11-13 01:48:32', '6733f760d47ef.png', 'pasta', 1),
(218, 'SID02', 'Coleslaw (Topsider) ', '   ', '59', 'joer@gmail.com', '2024-11-13 01:50:43', '6733f7e3a09fc.png', 'siders', 1),
(219, 'SID05', 'Kimchi (Topsider) ', '   ', '59', 'joer@gmail.com', '2024-11-13 01:50:58', '6733f7f21c32f.png', 'siders', 1),
(220, 'SID06', 'Macaroni Salad (Topsider)', '   ', '59', 'joer@gmail.com', '2024-11-13 01:51:16', '6733f80454a6c.png', 'siders', 1),
(221, 'SID04', 'Mashed Potato (Topsider)', '   ', '59', 'joer@gmail.com', '2024-11-13 01:51:39', '6733f81b6ea54.png', 'siders', 1),
(222, 'SID14', 'Oriental Salad (Topsider)', '   ', '59', 'joer@gmail.com', '2024-11-13 01:51:57', '6733f82d73aec.png', 'siders', 1),
(223, 'SID03', 'Vegetable Medly (Topsider)', '   ', '59', 'joer@gmail.com', '2024-11-13 01:52:17', '6733f84159079.png', 'siders', 1),
(224, 'SNA22', 'Extreme Platter', '   ', '259', 'joer@gmail.com', '2024-11-13 01:42:55', '6733f60f5c21e.png', 'fries', 0),
(225, 'SNA30', 'California Tuna Sandwich', '   ', '119', 'joer@gmail.com', '2024-11-13 01:43:23', '6733f62b2c860.png', 'fries', 1),
(226, 'SNA23', 'French Fries', '   ', '99', 'joer@gmail.com', '2024-11-13 01:43:38', '6733f63ab6cd7.png', 'fries', 0),
(227, 'DES03', 'Berries Cheesecake', '   ', '179', 'joer@gmail.com', '2024-11-13 01:53:49', '6733f882b34e5.png', 'cakes', 0),
(228, 'DES01', 'Carrot Cake', '   ', '179', 'joer@gmail.com', '2024-11-13 01:53:37', '6733f891914cf.png', 'cakes', 0),
(229, 'DES02', 'Psychocolate Cake', '   ', '179', 'joer@gmail.com', '2024-11-13 01:54:06', '6733f8aebf1c3.png', 'cakes', 0),
(230, 'SNA25', 'Tower Burger', '   ', '439', 'joer@gmail.com', '2024-11-13 01:48:49', '6733f771e1801.png', 'burger', 0),
(231, 'SNA26', 'Extreme Supreme Burger', '   ', '259', 'joer@gmail.com', '2024-11-13 01:48:59', '6733f77bd9212.png', 'burger', 0),
(232, 'SNA27', 'Bacon Cheese Burger', '', '129', 'joer@gmail.com', '2024-11-13 01:49:30', '6733f79acb75e.png', 'burger', 0),
(233, 'SNA28', 'Cheesy Burger', '   ', '109', 'joer@gmail.com', '2024-11-13 01:49:45', '6733f7a9da75a.png', 'burger', 0),
(234, 'SNA29', 'Classic Burger', '   ', '89', 'joer@gmail.com', '2024-11-13 01:49:59', '6733f7b71e055.png', 'burger', 0),
(235, 'SID08', 'Cheese Burger Soup', '   ', '59', 'joer@gmail.com', '2024-10-29 04:15:53', '67205369a361b.png', 'soup', 1),
(236, 'SID09', 'Chicken Tomato Soup', '   ', '59', 'joer@gmail.com', '2024-10-29 04:16:07', '67205377ae404.png', 'soup', 1),
(1893, 'SID07', 'Crab N\' Corn Soup', '', '59', 'joer@gmail.com', '2024-10-29 04:17:28', '672053af565f8.png', 'soup', 1),
(1894, 'CHI07', 'Chicken in a Box  (8 pcs) ', '   ', '889', 'joer@gmail.com', '2024-10-29 04:05:12', '67205077d7eb7.png', 'chicken', 1);

-- --------------------------------------------------------

--
-- Table structure for table `otp`
--

CREATE TABLE `otp` (
  `otp_id` int(11) NOT NULL,
  `tag_uid` varchar(32) NOT NULL,
  `phone_number` varchar(11) NOT NULL,
  `otp_code` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otp`
--

INSERT INTO `otp` (`otp_id`, `tag_uid`, `phone_number`, `otp_code`, `expires_at`, `is_verified`) VALUES
(1, '04A6AD40C22A81', '09673169637', '$2y$10$CmEl9bm2aSibu3Y2Us/7WepTG6Th1bduXWIX1ewOBHqfjBG9kcrsG', '2026-03-27 08:00:08', 1),
(2, '04A6AD40C22A81', '09673169637', '$2y$10$YdmyJ1xO5wAypyfZDnM15OPszvExH0vDFgyfWehzH//lZQAkgzOs.', '2026-03-27 08:03:47', 1),
(3, '04A6AD40C22A81', '09673169637', '$2y$10$Zure4yxXUwFC3TSMZgbv5uyFHi9ltnJrJ20JCJaqgw8c1CopRs4wS', '2026-03-27 08:05:24', 1);

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
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `promos`
--

INSERT INTO `promos` (`promo_id`, `promo_name`, `description`, `required_points`, `start_date`, `end_date`, `image_url`, `created_at`) VALUES
(1, '2pc Chicken w/ Rice Discount', 'Enjoy 2pc chicken with rice at a discounted price', 120, '2026-03-27 14:37:23', '2026-04-16 14:37:23', 'chicken_discount.png', '2026-03-27 14:37:23'),
(2, 'Family Chicken Bundle', 'Perfect for sharing! 6pc chicken bundle', 300, '2026-03-27 14:37:23', '2026-04-26 14:37:23', 'family_bundle.png', '2026-03-27 14:37:23'),
(3, 'Breakfast Silog Meal', 'Start your day with a delicious silog meal', 80, '2026-03-27 14:37:23', '2026-04-11 14:37:23', 'silog.png', '2026-03-27 14:37:23'),
(4, 'Free Coffee Upgrade', 'Upgrade your drink to coffee for free', 50, '2026-03-27 14:37:23', '2026-04-06 14:37:23', 'coffee_upgrade.png', '2026-03-27 14:37:23'),
(5, 'Cheesy Burger Combo', 'Burger with fries and drink', 130, '2026-03-27 14:37:23', '2026-04-21 14:37:23', 'burger_combo.png', '2026-03-27 14:37:23'),
(6, 'Double Patty Burger', 'Double patty for double satisfaction', 160, '2026-03-27 14:37:23', '2026-04-16 14:37:23', 'double_burger.png', '2026-03-27 14:37:23'),
(7, 'Spaghetti + Drink Combo', 'Classic spaghetti with refreshing drink', 110, '2026-03-27 14:37:23', '2026-04-14 14:37:23', 'spag_combo.png', '2026-03-27 14:37:23'),
(8, 'Snack Attack Bundle', 'Fries, nuggets, and drinks bundle', 140, '2026-03-27 14:37:23', '2026-04-18 14:37:23', 'snack_bundle.png', '2026-03-27 14:37:23'),
(9, 'Summer Halo-Halo Treat', 'Cool down with halo-halo special', 90, '2026-03-27 14:37:23', '2026-04-08 14:37:23', 'halo_halo.png', '2026-03-27 14:37:23'),
(10, 'Holiday Feast Bundle', 'Limited holiday meal bundle', 350, '2026-03-27 14:37:23', '2026-05-06 14:37:23', 'holiday_bundle.png', '2026-03-27 14:37:23'),
(11, 'Free Fries Reward', 'Claim your free fries', 60, '2026-03-27 14:37:23', '2026-04-11 14:37:23', 'free_fries.png', '2026-03-27 14:37:23'),
(12, 'Free Drink Reward', 'Free regular drink reward', 40, '2026-03-27 14:37:23', '2026-04-11 14:37:23', 'free_drink.png', '2026-03-27 14:37:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_tokens`
--

CREATE TABLE `user_tokens` (
  `token_id` int(11) NOT NULL,
  `tag_uid` varchar(32) NOT NULL,
  `expo_push_token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_tokens`
--

INSERT INTO `user_tokens` (`token_id`, `tag_uid`, `expo_push_token`) VALUES
(1, '04A6AD40C22A81', 'ExponentPushToken[miud_PFC7DITJHLfC7oYl2]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `btc_loyalty`
--
ALTER TABLE `btc_loyalty`
  ADD PRIMARY KEY (`loyalty_id`),
  ADD KEY `tag_uid` (`tag_uid`);

--
-- Indexes for table `btc_profile`
--
ALTER TABLE `btc_profile`
  ADD PRIMARY KEY (`tag_uid`),
  ADD UNIQUE KEY `unique_phone` (`phone_number`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`favorite_id`),
  ADD KEY `promo_id` (`promo_id`),
  ADD KEY `idx_favorites_tag_uid` (`tag_uid`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`m_id`);

--
-- Indexes for table `otp`
--
ALTER TABLE `otp`
  ADD PRIMARY KEY (`otp_id`),
  ADD KEY `idx_otp_tag_uid` (`tag_uid`);

--
-- Indexes for table `promos`
--
ALTER TABLE `promos`
  ADD PRIMARY KEY (`promo_id`);

--
-- Indexes for table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`token_id`),
  ADD KEY `idx_tokens_tag_uid` (`tag_uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `btc_loyalty`
--
ALTER TABLE `btc_loyalty`
  MODIFY `loyalty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1895;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `otp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `promos`
--
ALTER TABLE `promos`
  MODIFY `promo_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user_tokens`
--
ALTER TABLE `user_tokens`
  MODIFY `token_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `btc_loyalty`
--
ALTER TABLE `btc_loyalty`
  ADD CONSTRAINT `btc_loyalty_ibfk_1` FOREIGN KEY (`tag_uid`) REFERENCES `btc_profile` (`tag_uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`tag_uid`) REFERENCES `btc_profile` (`tag_uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`promo_id`) REFERENCES `promos` (`promo_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `otp`
--
ALTER TABLE `otp`
  ADD CONSTRAINT `otp_ibfk_1` FOREIGN KEY (`tag_uid`) REFERENCES `btc_profile` (`tag_uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`tag_uid`) REFERENCES `btc_profile` (`tag_uid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
