-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 17, 2024 at 03:21 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `demiray_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryId` int NOT NULL,
  `categoryName` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryId`, `categoryName`) VALUES
(0, 'Traktör Arkası Çapa Ekipmanları'),
(1, 'Çapa Makinası Ekipmanları'),
(2, 'Bahçe Çapaları');

-- --------------------------------------------------------

--
-- Table structure for table `discount_byuser`
--

CREATE TABLE `discount_byuser` (
  `discountId` int NOT NULL,
  `ownerId` int NOT NULL,
  `productId` int NOT NULL,
  `discount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int NOT NULL,
  `orderOwner` int NOT NULL,
  `orderCreatedDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `orderCreatedTime` text COLLATE utf8mb4_general_ci NOT NULL,
  `orderStatus` int NOT NULL,
  `orderPaymentType` int NOT NULL,
  `orderData` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` int NOT NULL,
  `productName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `productCategory` int NOT NULL,
  `productSubCategory` int NOT NULL,
  `productDescription` text COLLATE utf8mb4_general_ci NOT NULL,
  `productCode` text COLLATE utf8mb4_general_ci NOT NULL,
  `productAmount` int NOT NULL,
  `productBox` int NOT NULL DEFAULT '1',
  `productModel` text COLLATE utf8mb4_general_ci NOT NULL,
  `productLength` int NOT NULL,
  `productWidth` int NOT NULL,
  `productThickness` int NOT NULL,
  `productMaxStock` int NOT NULL,
  `productPrice` int NOT NULL,
  `productDiscountedPrice` int NOT NULL,
  `productImage` text COLLATE utf8mb4_general_ci NOT NULL,
  `productSizeImage` text COLLATE utf8mb4_general_ci NOT NULL,
  `productState` int NOT NULL,
  `createdDate` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productId`, `productName`, `productCategory`, `productSubCategory`, `productDescription`, `productCode`, `productAmount`, `productBox`, `productModel`, `productLength`, `productWidth`, `productThickness`, `productMaxStock`, `productPrice`, `productDiscountedPrice`, `productImage`, `productSizeImage`, `productState`, `createdDate`) VALUES
(9, 'ürün1', 0, 1, 'qawsedaqwsde aqwsde awsqedsaq', 'awqesdraqwsed', 50, 1, 'awsqdawqde', 20, 20, 20, 20, 250, 0, '/cdn/file-1709462775118.jpg', '/cdn/file-1709462775124.jpg', 1, '01.03.2024'),
(10, 'ürün2', 0, 2, 'ürün2 şlqwased aqklşdewasqed', 'awqesdraqwsed', 0, 1, 'awsqdawqde', 20, 20, 20, 20, 250, 0, '/cdn/file-1709462793592.jpg', '/cdn/file-1709462792182.jpg', 1, '03.03.2024'),
(11, 'ürün3', 1, 7, 'swadqaqdeawd', 'awsqde', 1, 1, 'aqwsdeaqd', 20, 20, 20, 20, 20, 10, '/cdn/file-1709912299620.png', '/cdn/file-1709912299622.png', 1, '08.03.2024'),
(12, 'ürün4', 0, 1, 'wesadfaqwsed', 'aqwsdeaqde', 0, 1, 'qawsed', 10, 10, 10, 1, 500, 0, '/cdn/file-1709990263963.png', '/cdn/file-1709990263969.png', 1, '09.03.2024'),
(13, 'ürün5', 0, 1, 'wqasedsaqdewaqsed aqd', 'awqsdeaqed', 25, 1, 'wqasedaqed', 25, 25, 23, 3, 500, 150, '/cdn/file-1710637777624.jpg', '/cdn/file-1710637777627.png', 1, '17.03.2024');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `subCategoryId` int NOT NULL,
  `categoryId` int NOT NULL,
  `subCategoryName` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_categories`
--

INSERT INTO `sub_categories` (`subCategoryId`, `categoryId`, `subCategoryName`) VALUES
(0, 0, 'Rotovatör Grubu'),
(1, 0, 'Kazayağı Grubu'),
(2, 0, 'Pulluk-Bıçak Grubu'),
(3, 0, 'Yer Kazma Bıçak Grubu'),
(4, 0, 'Çizel Bıçak Grubu'),
(5, 1, 'Çapa Makinası Bıçakları'),
(6, 1, 'Çapalama Makinası Alt Ekipmanları'),
(7, 1, 'Römorklar'),
(8, 1, 'Çapa Makinası Aparatları'),
(9, 1, 'Teker Grubu'),
(10, 2, 'Bahçe El Çapaları'),
(11, 2, 'Harman Ekipmanları');

-- --------------------------------------------------------

--
-- Table structure for table `unconfirmed_orders`
--

CREATE TABLE `unconfirmed_orders` (
  `orderId` int NOT NULL,
  `customerId` int NOT NULL,
  `orderDate` text COLLATE utf8mb4_general_ci NOT NULL,
  `orderDetails` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `unverified_users`
--

CREATE TABLE `unverified_users` (
  `userId` int NOT NULL,
  `userName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userSurName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userCommercialTitle` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userAdress` text COLLATE utf8mb4_general_ci NOT NULL,
  `userMail` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userPassword` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userTaxNumber` int NOT NULL,
  `userPhone` int NOT NULL,
  `userRegisteredDate` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userAdminLevel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int NOT NULL,
  `userName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userSurName` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userCommercialTitle` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userAdress` text COLLATE utf8mb4_general_ci NOT NULL,
  `userMail` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userPassword` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userTaxNumber` int NOT NULL,
  `userPhone` int NOT NULL,
  `userRegisteredDate` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `userAdminLevel` int NOT NULL,
  `isBanned` tinyint(1) NOT NULL DEFAULT '0',
  `basket` text COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `userName`, `userSurName`, `userCommercialTitle`, `userAdress`, `userMail`, `userPassword`, `userTaxNumber`, `userPhone`, `userRegisteredDate`, `userAdminLevel`, `isBanned`, `basket`) VALUES
(15, '4WAY', 'Dev', 'test', 'adres içerik', 'info@4way.dev', '$2b$10$qVFywJgc37v4uXufUwrOXeSYk0ZxnJFcAdM.sfXIsUXh7xzIpbRA2', 111111, 111111, '17.03.2024', 5, 0, '\'[]\'');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryId`);

--
-- Indexes for table `discount_byuser`
--
ALTER TABLE `discount_byuser`
  ADD PRIMARY KEY (`discountId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`subCategoryId`);

--
-- Indexes for table `unconfirmed_orders`
--
ALTER TABLE `unconfirmed_orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Indexes for table `unverified_users`
--
ALTER TABLE `unverified_users`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `discount_byuser`
--
ALTER TABLE `discount_byuser`
  MODIFY `discountId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `unconfirmed_orders`
--
ALTER TABLE `unconfirmed_orders`
  MODIFY `orderId` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `unverified_users`
--
ALTER TABLE `unverified_users`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
