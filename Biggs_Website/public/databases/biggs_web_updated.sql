-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 07, 2026 at 04:02 PM
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
-- Table structure for table `biggs_branches`
--

CREATE TABLE `biggs_branches` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `images` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `contact` varchar(50) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `has_venue_hall` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `biggs_branches`
--

INSERT INTO `biggs_branches` (`id`, `title`, `code`, `description`, `images`, `created_at`, `updated_at`, `contact`, `latitude`, `longitude`, `has_venue_hall`) VALUES
(14, 'BIGGS GOA', 'GOA', '7:00AM - 8:00PM, With Function Hall, San Jose St., Goa, Camarines Sur', '66cfc35ea11a53.96310693.png', '2024-07-04 17:08:33', '2024-09-10 23:40:53', '0928-664-4114', 13.698134654934885, 123.4897009251598, 1),
(15, 'BIGGS IRIGA', 'IRIGA', '8:00AM - 9:00PM, With FoodPanda & Function Hall, San Roque, Iriga City', '66cfc377c70269.53103733.png', '2024-07-04 17:09:20', '2024-09-12 00:17:40', '0907-904-1992', 13.421369382411509, 123.4121244123936, 1),
(17, 'BIGGS SM NAGA', 'SMNAG', '10:00AM - 9:00PM, SM City Naga Triangulo', '66cfc38323d474.17095477.png', '2024-07-04 17:23:33', '2024-09-10 23:05:21', '0994-230-9660', 13.620584135135939, 123.18990514721712, 0),
(27, 'BIGGS BIA', 'BIA', '4:00AM - 7:00PM, Airport, Daraga', '66cfc38d5b1b80.27307739.png', '2024-08-02 02:18:57', '2024-09-10 23:08:17', '0935-110-1728', 13.111230687175443, 123.68198464957464, 0),
(28, 'Biggs CAMALIG', 'CAMALIG', '24HRS, Camalig', '66cfc39916bc82.93169621.png', '2024-08-02 02:19:30', '2024-09-10 23:07:59', '0917-143-0122', 13.178164157615797, 123.64360104930417, 1),
(29, 'Biggs SM SORSOGON', 'B-SMS', '8:00AM - 11:00PM, SM Sorsogon', '66cfc3a3def788.38085444.png', '2024-08-02 02:20:09', '2024-09-10 23:07:41', '0995-192-1944', 12.975703894789698, 124.01977122577422, 0),
(31, 'BIGGS BARLIN', 'BRLN', '7:00AM - 10:00PM, With FoodPanda & Function Hall, Naga City', '66cfc3b1993744.61993949.png', '2024-08-04 20:56:54', '2024-09-10 23:07:27', '0916-332-2258', 13.62714418756896, 123.18655325212642, 1),
(32, 'BIGGS Robinson', 'ROB-FRN', '10:00AM - 9:00PM, Robinsons Place Naga', '66cfc3bbad9b67.52558676.png', '2024-08-04 20:58:53', '2024-09-10 23:07:07', '0995-842-4394', 13.614724683883027, 123.19275224297968, 0),
(33, 'BIGGS Emerald', 'EME', '9AM-9PM, With FoodPanda & Function Hall, Naga City', '66cfc3c67b5e40.59990367.png', '2024-08-04 21:01:13', '2024-09-10 23:06:51', '0992 961 9982', 13.643278673717752, 123.20481463392119, 1),
(34, 'BIGGS Centro NAGA', 'CNTRO', '24HRS, With FoodPanda & Function Hall, Naga City', '66cfc3d889cd52.61111850.png', '2024-08-04 22:03:17', '2024-09-10 23:06:38', '0956-934-0799', 13.624735393757605, 123.18573540267226, 1),
(35, 'BIGGS PILI', 'SANPILI', '24HRS, With FoodPanda & Function Hall, Pili, Cam Sur', '66cfc3e3c61d31.17410180.png', '2024-08-04 22:04:56', '2024-09-10 23:06:24', '0917-172-4447', 13.570567389434569, 123.26536290376461, 1),
(36, 'Biggs Pacific Mall', 'PACML', '10AM-8PM, Legazpi', '66cfc3f25edf53.62313944.png', '2024-08-04 22:06:54', '2024-09-10 23:45:08', '0916-332-2158', 13.145523064780104, 123.74994515040025, 1),
(37, 'BIGGS Magsaysay', 'MAGS', '24HRS, With FoodPanda & Function Hall, Naga City', '66e137179edec5.34862951.png', '2024-09-10 23:22:15', '2024-09-11 02:01:33', '0993-613-7348', 13.630974473427537, 123.19669837546351, 1),
(38, 'BIGGS SM LEGAZPI', 'SMLGZ-FRN', '10AM-9PM, SM Legazpi', '66e2949022957.jpg', '2024-09-12 00:13:20', '2024-09-12 00:13:20', '0917-715-3367', 13.144111858438341, 123.74482240795365, 0),
(39, 'BIGGS AYALA MALLS', 'AYALA-FRN', '10AM-8PM, Ayala Legazpi', '66e294c99bc2a.png', '2024-09-12 00:14:17', '2024-09-12 00:14:17', '0917-165-5000', 13.147258699763764, 123.75215040283474, 0),
(40, 'BIGGS SM LIPA', 'SMLIP', '10AM-9PM, SM Lipa', '672c7801eac71.jpg', '2024-11-07 01:17:34', '2024-11-07 01:17:34', '0916-332-2017', 13.954507532912212, 121.16403834666019, 0),
(41, 'BIGGS BMC', 'BMC', '7AM-9PM, Naga', '673159eb7e645.JPG', '2024-11-10 18:12:12', '2024-11-10 18:12:12', '0970-668-1150', 13.623093832632762, 123.19949269292583, 0),
(43, 'BIGGS DAET', 'DAET', '10AM-9PM, SM Daet', '6731701c13b57.jpg', '2024-11-10 19:46:52', '2024-11-10 19:46:52', '0991-176-7214', 14.12128240255378, 122.94592373599205, 0),
(44, 'BIGGS SIPOCOT', 'SIPOCOT', '24HRS, Sipocot', '67329df07e215.jpg', '2024-11-11 17:14:42', '2024-11-11 17:14:42', '0994-757-1807', 13.747749733198745, 122.97398426118464, 1),
(45, 'BIGGS MASBATE', 'MAS', '8:30AM - 8PM, Masbate', '67329ed827ab8.jpg', '2024-11-11 17:18:32', '2024-11-11 17:18:32', '0916-332-2123', 12.360038006950026, 123.62533945034058, 1),
(46, 'BIGGS OLD ALBAY', 'OLA', '24HRS, Legazpi', '6732a223080c2.JPG', '2024-11-11 17:32:35', '2024-11-11 17:32:35', '0916-332-2177', 13.138718810373124, 123.7362143753515, 1),
(48, 'BIGGS Polangui', 'B-CPOL', '9AM-10PM, Polangui', '675819bb143bb.jpeg', '2024-12-10 03:34:00', '2024-12-10 03:34:00', '09076311821', 13.292606001050626, 123.49013962469664, 1),
(49, 'BIGGS PAGBILAO', 'BPAG', '24HRS, Quezon', '693920dfd1185.jpg', '2025-12-10 00:27:29', '2025-12-10 00:27:29', '09278854651', 13.959918822632648, 121.65252165077797, 1),
(50, 'Biggs Grande', 'BGRAN', '24HRS, Naga', '693921b9854ee.jpg', '2025-12-10 00:31:06', '2025-12-10 00:31:06', '09275852042', 13.621516627043208, 123.2172549243273, 1),
(51, 'BIGGS TABACO', 'BTAB', '24HRS, Tabaco', '6964bd068d779.jpg', '2026-01-12 02:21:11', '2026-01-12 02:21:11', '09369558498', 13.355738692596226, 123.73056753458862, 1);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `tag_uid` varchar(32) NOT NULL,
  `party_size` int(11) NOT NULL DEFAULT 1,
  `note` text DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_slots`
--

CREATE TABLE `booking_slots` (
  `slot_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `slot_date` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `max_seats` int(11) NOT NULL DEFAULT 20,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('04A6AD40C22A81', '09673169637', '', 'Ian Benedict B. Argote', '1999-08-19', '', 'GOA', 'SIZ04', 0, 0);

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
(29, '04A6AD40C22A81', 12, NULL, NULL),
(33, '04A6AD40C22A81', 4, NULL, NULL),
(37, '04A6AD40C22A81', 3, NULL, NULL),
(38, '04A6AD40C22A81', 6, NULL, NULL),
(39, '04A6AD40C22A81', 2, NULL, NULL),
(40, '04A6AD40C22A81', 1, NULL, NULL);

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
(1, 'SIZ04', 'Baby Back Ribs', '   ', '499', 'mkt@gmail.com', '2025-05-26 07:43:44', 'LOWRES_0075_BBR.png', 'sizzlers', 0),
(2, 'SIZ07', 'Pork Kebab', '   ', '333', 'mkt@gmail.com', '2025-05-26 07:44:12', 'LOWRES_0071_Pork-Kebab.png', 'sizzlers', 0),
(3, 'CHI12', 'Smoked Chicken', '   ', '342', 'mkt@gmail.com', '2025-05-26 07:44:35', 'LOWRES_0074_SMOKED-CHICKEN.png', 'sizzlers', 0),
(4, 'SIZ10', 'Ribs and Smoked Chicken', '   ', '784', 'mkt@gmail.com', '2025-05-26 07:44:51', 'LOWRES_0017_Ribs-and-Smoked-Chicken.png', 'sizzlers', 0),
(5, 'SIZ12', 'Beef Salpicao', '   ', '332', 'mkt@gmail.com', '2025-05-31 09:37:17', 'LOWRES_0076_SALPICAO.png', 'sizzlers', 0),
(6, 'SIZ11', 'Tenderloin Tips', '   ', '323', 'mkt@gmail.com', '2025-05-31 09:37:33', 'LOWRES_0072_Tenderloin-Tips.png', 'sizzlers', 0),
(7, 'SIZ05', 'Korean Spare Ribs', '   ', '433', 'mkt@gmail.com', '2025-05-31 09:37:53', 'LOWRES_0073_KSR.png', 'sizzlers', 0),
(8, 'SIZ08', 'Bicol Special', '   ', '333', 'mkt@gmail.com', '2025-05-31 09:38:05', 'LOWRES_0065_BICOL-SPECIAL.png', 'sizzlers', 0),
(9, 'SIZ06', 'Pork Cordon Bleu <br> <small><small><small>with Creamy Butter Sauce </small></small></small>', '   ', '333', 'mkt@gmail.com', '2025-05-31 09:38:19', 'LOWRES_0069_Cordon-Bleu.png', 'sizzlers', 0),
(10, 'SIZ09', 'Original Salisbury Steak', '   ', '323', 'mkt@gmail.com', '2025-05-31 09:38:38', 'LOWRES_0064_SALISBURY-STEAK.png', 'sizzlers', 0),
(11, 'SIZ15', 'Chicken Salisbury Steak', '   ', '322', 'mkt@gmail.com', '2025-05-31 09:38:59', 'LOWRES_0064_SALISBURY-STEAK.png', 'sizzlers', 0),
(12, 'SIZ01', 'Tuna Salpicao', '   ', '367', 'mkt@gmail.com', '2025-05-31 09:39:16', 'LOWRES_0067_Tuna-Salpicao.png', 'sizzlers', 0),
(14, 'SIZ02', 'Tanguigue Steak', '   ', '384', 'mkt@gmail.com', '2025-05-31 09:45:25', 'LOWRES_0068_Tanguigue.png', 'sizzlers', 0),
(15, 'BRE01', 'Daing na Bangus', '   ', '362', 'mkt@gmail.com', '2025-05-31 09:45:46', 'LOWRES_0070_Daing-na-Bangus.png', 'sizzlers', 0),
(20, 'CHI06', 'Chicken in a Box <br><small><small><small> (6 pcs) </small></small></small><br> <small><small><small> (8 pcs) </small></small></small>', '   ', '<br> 739 <br> 984', 'mkt@gmail.com', '2025-05-31 09:49:37', 'LOWRES_0038_Chicken-in-a-Box.png', 'chicken', 1),
(21, 'CHI09', 'Bigg Deal <br><small><small><small> (Chicken, Spaghetti, & Pork  Kebab) </small></small></small>', '   ', '342', 'mkt@gmail.com', '2025-05-31 09:50:31', 'LOWRES_0049_Bigg-Deal.png', 'chicken', 1),
(22, 'CHI10', 'Chicken with Kebab Meal', '   ', '298', 'mkt@gmail.com', '2025-05-31 09:50:54', 'LOWRES_0037_chicken-with-Kebab.png', 'chicken', 1),
(23, 'CHI01', 'Biggs Fried Chicken <br> <small><small><small>(1pc)</small></small></small>', '   ', '149', 'mkt@gmail.com', '2025-05-31 09:51:14', 'LOWRES_0052_1pc-Chicken.png', 'chicken', 1),
(24, 'CHI03', 'Biggs Fried Chicken <br> <small><small><small> (2 pcs) </small></small></small>', '   ', '278', 'mkt@gmail.com', '2025-05-31 09:51:52', 'LOWRES_0051_2pcs-Chicken-copy.png', 'chicken', 1),
(25, 'CHI02', 'Biggs Cajun Chicken <br> <small><small><small> (1 pcs) </small></small></small>', '   ', '174', 'mkt@gmail.com', '2025-05-31 09:52:10', 'LOWRES_0003_1pc-Cajun.png', 'chicken', 1),
(26, 'CHI04', 'Biggs Crispy Cajun <br> <small><small><small> (2 pcs) </small></small></small>', '   ', '328', 'mkt@gmail.com', '2025-05-31 09:52:27', 'LOWRES_0050_2pcs-Cajun.png', 'chicken', 1),
(27, 'CHI11', 'Chicken with Mac Salad', '   ', '229', 'mkt@gmail.com', '2025-05-31 09:52:52', 'LOWRES_0002_Chicken-with-Macaroni-Salad.png', 'chicken', 1),
(34, 'BEV93', 'Rock N\' Roll Iced Tea', '   ', '99', 'mkt@gmail.com', '2025-02-28 19:20:05', 'LOWRES_0022_Rock-N_-Roll-Iced-Tea.png', 'cold', 0),
(35, 'BEV94', 'Pineapple Juice', '   ', '99', 'mkt@gmail.com', '2025-02-28 19:20:36', 'LOWRES_0006_Pineapple-Juice.png', 'cold', 0),
(36, 'BEV95', 'Mango Graham Shake', '   ', '159', 'mkt@gmail.com', '2025-02-28 19:20:59', 'LOWRES_0007_Mango-Graham-Shake.png', 'cold', 0),
(37, 'BEV96', 'Ripe Mango Shake', '   ', '159', 'mkt@gmail.com', '2025-02-28 19:21:31', 'LOWRES_0005_Ripe-Mango-Shake.png', 'cold', 0),
(38, 'BEV97', 'Cookies and Cream Shake', '   ', '159', 'mkt@gmail.com', '2025-02-28 19:21:46', 'LOWRES_0023_Cookies-_N-Cream.png', 'cold', 0),
(41, 'BEV18', 'Brewed Coffee', '   ', '109', 'mkt@gmail.com', '2025-02-28 19:22:15', 'LOWRES_0019_Brewed-Cofee-copy.png', 'coffee', 1),
(42, 'BEV19', 'Nespresso Brewed Coffee', '   ', '149', 'joer@gmail.com', '2024-09-08 16:28:45', 'LOWRES_0020_Nespresso-Brewed-Cofee.png', 'coffee', 1),
(43, 'BEV20', 'Hot Choco', '   ', '89', 'mkt@gmail.com', '2025-02-28 19:22:47', 'LOWRES_0021_Hot-Choco.png', 'coffee', 1),
(165, 'BRE07', 'Beef Tapa', '   ', '267', 'mkt@gmail.com', '2025-05-31 09:47:16', 'LOWRES_0047_TAPA.png', 'breakfast', 1),
(166, 'BRE05', 'Tocilog', '   ', '269', 'mkt@gmail.com', '2025-05-31 09:47:40', 'LOWRES_0048_TOCILOG.png', 'breakfast', 1),
(167, 'BRE04', 'Country Breakfast', '   ', '286', 'mkt@gmail.com', '2025-05-31 09:47:58', 'LOWRES_0056_Country-Breakfast.png', 'breakfast', 1),
(168, 'BRE03', 'Franks and Egg', '   ', '248', 'mkt@gmail.com', '2025-05-31 09:48:16', 'LOWRES_0055_Franks-and-Eggs.png', 'breakfast', 1),
(169, 'BRE02', 'American Slam', '   ', '297', 'mkt@gmail.com', '2025-05-31 09:48:48', 'LOWRES_0057_AMERICAN-SLAM.png', 'breakfast', 1),
(170, 'BRE10', 'Goto With Egg', '   ', '119', 'mkt@gmail.com', '2025-02-28 18:13:05', 'LOWRES_0054_Goto-with-Egg.png', 'breakfast', 1),
(171, 'BRE09', 'Biggs Goto', '   ', '99', 'mkt@gmail.com', '2024-11-07 07:20:23', 'LOWRES_0053_Goto-.png', 'breakfast', 1),
(198, 'SID11', 'Nena\'s harvest Salad', '   ', '189', 'mkt@gmail.com', '2025-02-28 19:04:29', 'LOWRES_0000_1M6A5271.png', 'salad', 1),
(199, 'SID12', 'South Western Salad', '   ', '189', 'mkt@gmail.com', '2025-02-28 19:04:52', 'LOWRES_0001_Southwestern-Salad.png', 'salad', 1),
(200, 'SID13', 'Creamy Macaroni Salad', '   ', '119', 'mkt@gmail.com', '2025-02-28 19:06:16', 'LOWRES_0011_Creamy-Macaroni-Salad.png', 'salad', 1),
(201, 'SNA13', 'Biggs Spaghetti with Chicken', '   ', '238', 'mkt@gmail.com', '2025-05-31 09:54:18', 'LOWRES_0044_Chicken-with-Spaghetti.png', 'pasta', 1),
(202, 'SNA09', 'Biggs Chicken, Spaghetti & Pizza Bread', '   ', '267', 'mkt@gmail.com', '2025-05-31 09:54:44', 'LOWRES_0014_Spaghetti-Platter.png', 'pasta', 1),
(203, 'SNA12', 'Biggs Chicken, Carbonara & Pizza Bread', '   ', '298', 'mkt@gmail.com', '2025-05-31 10:10:05', 'LOWRES_0015_Carbonara-Platter.png', 'pasta', 1),
(204, 'SNA14', 'Biggs Carbonara with Chicken', '   ', '263', 'mkt@gmail.com', '2025-05-31 10:06:03', 'LOWRES_0043_Chicken-withcarbonara.png', 'pasta', 1),
(205, 'SNA07', 'Biggs Spaghetti <br> <small><small><small>with Pizza Bread </small></small></small>', '   ', '144', 'mkt@gmail.com', '2025-05-31 10:10:34', 'LOWRES_0045_Spaghetti-w_-Pizza-Bread.png', 'pasta', 1),
(206, 'SNA10', 'Biggs Carbonara <br> <small><small><small>with Pizza Bread</small></small></small>', '   ', '174', 'mkt@gmail.com', '2025-05-31 10:08:58', 'LOWRES_0041_Carbonara-with-Pizza-Bread.png', 'pasta', 1),
(207, 'SNA01', 'Biggs Spaghetti', '   ', '114', 'mkt@gmail.com', '2025-05-31 10:07:33', 'LOWRES_0046_Spaghetti.png', 'pasta', 1),
(208, 'SNA03', 'Bacon Mac N\' Cheese', '   ', '129', 'mkt@gmail.com', '2025-02-28 19:13:56', 'LOWRES_0040_Bacon-Mc-n-Cheese.png', 'pasta', 1),
(209, 'SNA02', 'Biggs Carbonara', '   ', '134', 'mkt@gmail.com', '2025-02-28 19:10:49', 'LOWRES_0042_Carbonara.png', 'pasta', 1),
(218, 'SID02', 'Coleslaw <br> <small><small><small>(Topsider) </small></small></small>', '   ', '59', 'joer@gmail.com', '2024-09-08 16:42:54', 'LOWRES_0031_Coleslaw.png', 'siders', 1),
(219, 'SID05', 'Kimchi <br> <small><small><small>(Topsider) </small></small></small>', '   ', '59', 'joer@gmail.com', '2024-09-08 16:43:53', 'LOWRES_0032_Kimchi.png', 'siders', 1),
(220, 'SID06', 'Macaroni Salad <br> <small><small><small>(Topsider)</small></small></small>', '   ', '59', 'joer@gmail.com', '2024-09-08 16:44:37', 'LOWRES_0034_Macaroni-Salad.png', 'siders', 1),
(221, 'SID04', 'Mashed Potato <br> <small><small><small>(Topsider)</small></small></small>', '   ', '59', 'joer@gmail.com', '2024-09-08 16:45:17', 'LOWRES_0030_Mashed-Potato.png', 'siders', 1),
(222, 'SID14', 'Oriental Salad <br> <small><small><small>(Topsider)</small></small></small>', '   ', '59', 'joer@gmail.com', '2024-09-08 16:45:46', 'LOWRES_0035_Oriental-Salad.png', 'siders', 1),
(223, 'SID03', 'Vegetable Medly <br> <small><small><small>(Topsider)</small></small></small>', '   ', '59', 'joer@gmail.com', '2024-09-08 16:46:12', 'LOWRES_0033_Vegetable-Medly.png', 'siders', 1),
(224, 'SNA22', 'Extreme Platter', '   ', '264', 'mkt@gmail.com', '2025-05-31 09:53:41', 'LOWRES_0016_extreme-platter.png', 'fries', 0),
(225, 'SNA30', 'California Tuna Sandwich', '   ', '119', 'joer@gmail.com', '2024-09-08 16:34:26', 'LOWRES_0058_CALIFORNIA-TUNA-SANDWICH.png', 'fries', 1),
(226, 'SNA23', 'French Fries', '   ', '99', 'joer@gmail.com', '2024-09-08 16:34:56', 'LOWRES_0039_French-Fries.png', 'fries', 0),
(227, 'DES03', 'Berries Cheesecake', '   ', '179', 'mkt@gmail.com', '2024-11-07 07:21:19', 'LOWRES_0024_Brries-Cheesecake.png', 'cakes', 0),
(228, 'DES01', 'Carrot Cake', '   ', '179', 'mkt@gmail.com', '2024-11-07 07:21:32', 'LOWRES_0026_Carrot-Cake.png', 'cakes', 0),
(229, 'DES02', 'Psychocolate Cake', '   ', '179', 'mkt@gmail.com', '2024-11-07 07:21:45', 'LOWRES_0025_Psychocolate.png', 'cakes', 0),
(230, 'SNA25', 'Tower Burger', '   ', '467', 'mkt@gmail.com', '2025-05-31 10:25:59', 'LOWRES_0060_TOWER-BURGER.png', 'burger', 0),
(231, 'SNA26', 'Extreme Supreme Burger', '   ', '298', 'mkt@gmail.com', '2025-05-31 10:29:11', 'LOWRES_0063_Extreme-Supreme-Burger.png', 'burger', 0),
(232, 'SNA27', 'Bacon Cheese Burger', '', '149', 'mkt@gmail.com', '2025-02-28 19:16:13', 'LOWRES_0059_BACON-CHEESE-BURGER.png', 'burger', 0),
(233, 'SNA28', 'Cheesy Burger', '   ', '119', 'mkt@gmail.com', '2025-02-28 19:16:35', 'LOWRES_0062_Cheesy-Burger.png', 'burger', 0),
(234, 'SNA29', 'Classic Burger', '   ', '109', 'mkt@gmail.com', '2025-02-28 19:16:53', 'LOWRES_0061_Classic-Burger.png', 'burger', 0),
(235, 'SID08', 'Cheese Burger Soup', '   ', '59', 'joer@gmail.com', '2024-09-08 16:29:59', 'LOWRES_0027_Cheese-Burger.png', 'soup', 1),
(236, 'SID09', 'Chicken Tomato Soup', '   ', '59', 'joer@gmail.com', '2024-09-08 16:30:18', 'LOWRES_0028_Chicken-Tomato-.png', 'soup', 1),
(237, 'SID07', 'Crab N\' Corn Soup', '   ', '59', 'joer@gmail.com', '2024-12-13 09:10:03', 'LOWRES_0029_Crab-N_-Corn.png', 'soup', 1);

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
(3, '04A6AD40C22A81', '09673169637', '$2y$10$Zure4yxXUwFC3TSMZgbv5uyFHi9ltnJrJ20JCJaqgw8c1CopRs4wS', '2026-03-27 08:05:24', 1),
(4, '04A6AD40C22A81', '09673169637', '$2y$10$R0xoTPhty0b6pik6ap6ciubkstEPC2HelSpHLqyaeQXGL.IbyoTDS', '2026-03-31 06:23:52', 1),
(5, '04A6AD40C22A81', '09673169637', '$2y$10$cHy5HuXR7.5MvKE272qw8umrhW7hyKLdnTArTRjuyK7qMxqdyUqvG', '2026-03-31 07:23:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `package_id` int(11) NOT NULL,
  `package_name` varchar(100) NOT NULL,
  `details` text NOT NULL,
  `price` double(2,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for table `biggs_branches`
--
ALTER TABLE `biggs_branches`
  ADD KEY `idx_biggs_branches_id` (`id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `idx_bookings_slot` (`slot_id`),
  ADD KEY `idx_bookings_branch` (`package_id`),
  ADD KEY `idx_bookings_status` (`status`),
  ADD KEY `tag_uid` (`tag_uid`);

--
-- Indexes for table `booking_slots`
--
ALTER TABLE `booking_slots`
  ADD PRIMARY KEY (`slot_id`),
  ADD UNIQUE KEY `uq_branch_slot` (`branch_id`,`slot_date`,`time_start`),
  ADD KEY `idx_slots_branch_date` (`branch_id`,`slot_date`);

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
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`package_id`);

--
-- Indexes for table `promos`
--
ALTER TABLE `promos`
  ADD PRIMARY KEY (`promo_id`),
  ADD KEY `idx_promos_promo_id` (`promo_id`);

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
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_slots`
--
ALTER TABLE `booking_slots`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `btc_loyalty`
--
ALTER TABLE `btc_loyalty`
  MODIFY `loyalty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=238;

--
-- AUTO_INCREMENT for table `otp`
--
ALTER TABLE `otp`
  MODIFY `otp_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `package_id` int(11) NOT NULL AUTO_INCREMENT;

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
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`slot_id`) REFERENCES `booking_slots` (`slot_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`tag_uid`) REFERENCES `btc_profile` (`tag_uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
