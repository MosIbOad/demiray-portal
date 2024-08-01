-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost:3306
-- Üretim Zamanı: 01 Ağu 2024, 16:37:03
-- Sunucu sürümü: 8.0.39-0ubuntu0.22.04.1
-- PHP Sürümü: 8.1.2-1ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `demiray_portal`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `categories`
--

CREATE TABLE `categories` (
  `categoryId` int NOT NULL,
  `categoryName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `categories`
--

INSERT INTO `categories` (`categoryId`, `categoryName`) VALUES
(0, 'Traktör Arkası Çapa Ekipmanları'),
(1, 'Çapa Makinası Ekipmanları'),
(2, 'Bahçe Çapaları');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `discount_byuser`
--

CREATE TABLE `discount_byuser` (
  `discountId` int NOT NULL,
  `ownerId` int NOT NULL,
  `productId` int NOT NULL,
  `discount` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `orders`
--

CREATE TABLE `orders` (
  `orderId` int NOT NULL,
  `orderOwner` int NOT NULL,
  `orderCreatedDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `orderCreatedTime` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `orderStatus` int NOT NULL,
  `orderPaymentType` int NOT NULL,
  `orderData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `orders`
--

INSERT INTO `orders` (`orderId`, `orderOwner`, `orderCreatedDate`, `orderCreatedTime`, `orderStatus`, `orderPaymentType`, `orderData`) VALUES
(32, 16, '17.03.2024', '16:46', 0, 0, '[{\"productId\":14,\"productName\":\"Örnek 1\",\"productAmount\":1,\"productPrice\":200}]'),
(33, 16, '17.03.2024', '21:46', 0, 1, '[{\"productId\":18,\"productName\":\"Federli Süper Çelik Çapa Bıçağı 22 cm\",\"productAmount\":1,\"productPrice\":850}]'),
(34, 16, '18.03.2024', '05:44', 1, 0, '[{\"productId\":18,\"productName\":\"Federli Süper Çelik Çapa Bıçağı 22 cm\",\"productAmount\":3,\"productPrice\":850}]'),
(35, 16, '18.03.2024', '13:42', 1, 1, '[{\"productId\":20,\"productName\":\"C Tipi Rotavatör Bıçağı 8 mm\",\"productAmount\":6,\"productPrice\":84}]'),
(36, 16, '18.03.2024', '13:55', 0, 1, '[{\"productId\":20,\"productName\":\"C Tipi Rotavatör Bıçağı 8 mm\",\"productAmount\":17,\"productPrice\":84}]');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `products`
--

CREATE TABLE `products` (
  `productId` int NOT NULL,
  `productName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `productCategory` int NOT NULL,
  `productSubCategory` int NOT NULL,
  `productDescription` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `productCode` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `productAmount` int NOT NULL,
  `productBox` int NOT NULL DEFAULT '1',
  `productModel` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `productLength` int NOT NULL,
  `productWidth` int NOT NULL,
  `productThickness` int NOT NULL,
  `productMaxStock` int NOT NULL,
  `productPrice` int NOT NULL,
  `productDiscountedPrice` int NOT NULL,
  `productImage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `productSizeImage` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `productState` int NOT NULL,
  `createdDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `products`
--

INSERT INTO `products` (`productId`, `productName`, `productCategory`, `productSubCategory`, `productDescription`, `productCode`, `productAmount`, `productBox`, `productModel`, `productLength`, `productWidth`, `productThickness`, `productMaxStock`, `productPrice`, `productDiscountedPrice`, `productImage`, `productSizeImage`, `productState`, `createdDate`) VALUES
(18, 'Federli Süper Çelik Çapa Bıçağı 22 cm', 1, 5, 'Özel bor alaşımlı çelik malzeme ', 'f-01', 996, 24, 'Kayışlı Çapalar', 210, 35, 5, 5, 850, 0, '/cdn/file-1710711928160.png', '/cdn/file-1710711928202.png', 1, '17.03.2024'),
(21, 'Federli Süper Çelik Çapa Bıçağı 24 cm', 1, 5, '- Özel Bor Alaşımlı Malzeme\n- Profesyonel Isıl İşlem', 'F-02', 1000, 24, 'Benzinli Modeller', 235, 40, 6, 5, 950, 0, '/cdn/file-1710793148032.jpg', '/cdn/file-1710793148021.jpg', 1, '18.03.2024'),
(23, 'Federli Süper Çelik Çapa Bıçağı 26 CM', 1, 5, '-Özel bor alaşımlı çelik malzeme\n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik\n-Feder patentli (Feder, kırılma dayanımı sağlar)\n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya karşı garantilidir. ', 'F-03', 1000, 24, 'Dizel Çapalar', 260, 45, 6, 3, 1050, 0, '/cdn/file-1710833074767.jpg', '/cdn/file-1710833074798.jpg', 1, '19.03.2024'),
(24, 'Federli Süper Çelik Çapa Bıçağı 28 cm', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik \n-Federli patentli (Federli, kırılma dayınımı sağlar)\n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya garantilidir', 'F-04', 1000, 24, '12 HP Çapalar', 280, 45, 6, 1, 1590, 0, '/cdn/file-1710834758542.jpg', '/cdn/file-1710834758579.jpg', 1, '19.03.2024'),
(25, 'Federli Süper Çelik Çapa Bıçağı 30 cm', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik \n-Federli patentli (Federli, kırılma dayınımı sağlar)\n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya garantilidir', 'F-04-S', 1000, 24, '12 HP ve Üzeri Çapalar', 300, 50, 4, 3, 1850, 0, '/cdn/file-1710835132493.jpg', '/cdn/file-1710835132421.jpg', 1, '19.03.2024'),
(26, 'Federli Kıvrık Süper Çelik Çapa Bıçağı', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik \n-Federli patentli (Federli, kırılma dayınımı sağlar)\n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya garantilidir', 'F-05', 1000, 23, 'Bertolini Kıvrık', 235, 40, 5, 3, 1249, 0, '/cdn/file-1710835391783.jpg', '/cdn/file-1710835391843.jpg', 1, '19.03.2024'),
(27, 'Federli Süper Çelik Çapa Bıçağı 23,5 cm', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik \n-Federli patentli (Federli, kırılma dayınımı sağlar)\n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya garantilidir', 'F-06', 1000, 24, 'Antrac Çapalar', 235, 35, 6, 2, 1185, 0, '/cdn/file-1710835630846.jpg', '/cdn/file-1710835630889.jpg', 1, '19.03.2024'),
(28, 'Kama KDT Süper Çelik Çapa Bıçağı', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik \n-Federli patentli (Federli, kırılma dayınımı sağlar)\n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya garantilidir', 'F-08', 1000, 18, 'Kama KDT Çapalar', 310, 35, 6, 3, 1350, 0, '/cdn/file-1710835917528.jpg', '/cdn/file-1710835917472.jpg', 1, '19.03.2024'),
(29, 'Kama SRZ Süper Çelik Çapa Bıçağ', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik \n-Federli patentli (Federli, kırılma dayınımı sağlar)\n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya garantilidir\n', 'F-08-Y', 1000, 18, 'Kama SRZ Çapalar', 220, 55, 6, 3, 1500, 0, '/cdn/file-1710836123652.jpg', '/cdn/file-1710836123677.jpg', 1, '19.03.2024'),
(31, 'Honda Çelik Çapa Bıçağı', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyonel ısıl işlem (Atmosfer kontrollü fırında)\n-48-50 HRC sertlik \n-Kumlama uygulanmış olup parlak vernik boyalıdır\n-Kırılma ve kıvrılmaya garantilidir', 'E-05', 1000, 24, 'Özel Üretim', 235, 40, 5, 3, 1150, 0, '/cdn/file-1710836818768.jpg', '/cdn/file-1710836818797.jpg', 1, '19.03.2024'),
(32, 'Eko Star Çelik Çapa Bıçağı 22 cm', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Isıl işlemli çelik\n-45 HRC sertlik \n-Kumlama uygulanmış olup parlak vernik boyalıdır\n\n', 'E-01', 1000, 24, 'Kayışlı Çapalar', 220, 35, 5, 3, 975, 0, '/cdn/file-1710837127906.jpg', '/cdn/file-1710837127936.jpg', 1, '19.03.2024'),
(33, 'Eko Star Çelik Çapa Bıçağı 24 cm', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Isıl işlemli çelik\n-45 HRC sertlik \n-Kumlama uygulanmış olup parlak vernik boyalıdır\n', 'E-02', 1000, 24, 'Benzinli Çapalar', 235, 35, 5, 3, 1025, 0, '/cdn/file-1710837330227.jpg', '/cdn/file-1710837330258.jpg', 1, '19.03.2024'),
(34, 'Eko Star Çelik Çapa Bıçağı 26 cm', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Isıl işlemli çelik\n-45 HRC sertlik \n-Kumlama uygulanmış olup parlak vernik boyalıdır\n', 'E-03', 1000, 24, 'Dizel Çapalar', 260, 45, 5, 3, 1151, 0, '/cdn/file-1710837523527.jpg', '/cdn/file-1710837523476.jpg', 1, '19.03.2024'),
(35, 'Eko Star Çelik Çapa Bıçağı 23cm', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Isıl işlemli çelik\n-45 HRC sertlik \n-Kumlama uygulanmış olup parlak vernik boyalıdır', 'E-04', 1000, 24, 'Antrac Çapalar', 230, 35, 5, 3, 951, 0, '/cdn/file-1710837810858.jpg', '/cdn/file-1710837810885.jpg', 1, '19.03.2024'),
(36, 'Kekik Aparatı Çapalama Bıçağı', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Isıl işlemli çelik\n-45 HRC sertlik \n-Kumlama uygulanmış olup parlak vernik boyalıdır\n', 'K-06', 1000, 40, 'Kekik Bıçağı', 205, 50, 5, 3, 1, 0, '/cdn/file-1710838911429.jpg', '/cdn/file-1710838911376.jpg', 1, '19.03.2024'),
(37, 'Soğan Aparatı Çapalama Bıçağı', 1, 5, '-Özel bor alaşımlı çelik malzeme \n-Profesyenel ısıl işlemli çelik\n-48-50 HRC sertlik \n-Kumlama uygulanmış olup parlak vernik boyalıdır', 'S-07', 1000, 40, 'Soğan Bıçağı', 175, 35, 4, 3, 37, 0, '/cdn/file-1710839184866.jpg', '/cdn/file-1710839184895.jpg', 1, '19.03.2024'),
(38, 'C Tipi Rotavatör Bıçağı 8 mm', 0, 0, '-Özel bor alaşımlı çelik malzeme\n-Keskin (Dövme ağız yapısı)\n-Dereceli kıvrık kesim\n-48-50 HRC sertlik\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili', 'R-01', 50000, 1, 'Tüm modeller', 275, 85, 8, 5000, 119, 0, '/cdn/file-1710839610778.jpg', '/cdn/file-1710839610818.jpg', 1, '19.03.2024'),
(39, 'C Tipi Rotavatör Bıçağı 7 mm', 0, 0, '-Özel bor alaşımlı çelik malzeme\n-Keskin (Dövme ağız yapısı)\n-Dereceli kıvrık kesim\n-48-50 HRC sertlik\n-Kumlama malzeme yüzeyi\n', 'R-02', 50000, 1, 'Tüm Modeller', 275, 85, 6, 5000, 110, 0, '/cdn/file-1710839773313.jpg', '/cdn/file-1710839773346.jpg', 1, '19.03.2024'),
(40, 'Mini Bahçe Rotavatör Bıçağı 7 mm', 0, 0, '-Özel bor alaşımlı çelik malzeme\n-Keskin (Dövme ağız yapısı)\n-Dereceli kıvrık kesim\n-48-50 HRC sertlik\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'R-05', 50000, 1, 'Tüm modeller', 225, 60, 7, 5000, 74, 0, '/cdn/file-1710840168068.jpg', '/cdn/file-1710840168011.jpg', 1, '19.03.2024'),
(41, 'Sıra Arası Çapalama Bıçağı 6 mm', 0, 0, '-Özel bor alaşımlı çelik malzeme\n-Keskin (Dövme ağız yapısı)\n-48-50 HRC sertlik\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'R-06', 50000, 1, 'Türkay-Köylü', 175, 55, 6, 5000, 45, 0, '/cdn/file-1710840369757.jpg', '/cdn/file-1710840369788.jpg', 1, '19.03.2024'),
(42, 'Sıra Arası Çapalama Bıçağı 6 mm', 0, 0, '-Özel bor alaşımlı çelik malzeme\n-Keskin (Dövme ağız yapısı)\n-48-50 HRC sertlik\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'R-07', 50000, 1, 'Yurdusar-Hisarlar Özkurt', 170, 55, 6, 5000, 45, 0, '/cdn/file-1710840525367.jpg', '/cdn/file-1710840525393.jpg', 1, '19.03.2024'),
(43, '24 cm Kazayağı Yatay Bıçağı 7 mm', 0, 1, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave ön destek burun\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'KZ-01', 50000, 1, 'Tüm modeller', 250, 255, 6, 5000, 163, 0, '/cdn/file-1710840827723.jpg', '/cdn/file-1710840827757.jpg', 1, '19.03.2024'),
(44, '24 cm Kazayağı Dikey Bıçağı 7 mm', 0, 1, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave ön destek burun\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'KZ-02', 50000, 1, 'Tüm modeller', 230, 261, 6, 5000, 163, 0, '/cdn/file-1710840994302.jpg', '/cdn/file-1710840994334.jpg', 1, '19.03.2024'),
(45, '24 cm Kazayağı Yatay Bıçağı 6 mm', 0, 1, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave ön destek burun\n-Kumlama malzeme yüzeyi\n', 'KZ-03', 50000, 1, 'Tüm modeller', 250, 255, 6, 5000, 150, 0, '/cdn/file-1710841148055.jpg', '/cdn/file-1710841148088.jpg', 1, '19.03.2024'),
(46, '24 cm Kazayağı Dikey Bıçağı 6 m', 0, 1, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave ön destek burun\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'KZ-04', 50000, 1, 'Tüm modeller', 230, 260, 6, 5000, 150, 0, '/cdn/file-1710841322910.jpg', '/cdn/file-1710841322937.jpg', 1, '19.03.2024'),
(47, 'Nizip Kazayağı Bıçağı 7 mm', 0, 1, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave ön destek burun\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'KZ-06', 50000, 1, 'Tüm modeller', 265, 315, 7, 5000, 204, 0, '/cdn/file-1710841454832.jpg', '/cdn/file-1710841454865.jpg', 1, '19.03.2024'),
(48, 'Pulluk Parçalı Burun (Ünlü Model)', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Sıcak dövme çelik ağız yapısı\n-48 HRC sertlik\n-Elektrostatik yüzey boyası\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-01', 499, 50, 'Ünlü parçalı tüm modeller', 350, 90, 14, 3, 315, 0, '/cdn/file-1710844831053.jpg', '/cdn/file-1710844831086.jpg', 1, '19.03.2024'),
(49, 'Parçalı Arka Bıçak (Ünlü Model)', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Sıcak dövme çelik ağız yapısı\n-48 HRC sertlik\n-Elektrostatik yüzey boyası\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-02', 500, 20, 'Ünlü parça tüm modeller', 390, 135, 10, 3, 385, 0, '/cdn/file-1710845004641.jpg', '/cdn/file-1710845004660.jpg', 1, '19.03.2024'),
(50, '8-9 Numara Pulluk Bıçağı (Ünlü Model)', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Sıcak dövme çelik ağız yapısı\n-48 HRC sertlik\n-Elektrostatik yüzey boyası\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-03', 500, 10, '8-9 Numara', 470, 175, 10, 5, 350, 0, '/cdn/file-1710845174898.jpg', '/cdn/file-1710845174923.jpg', 1, '19.03.2024'),
(51, '10-13 Numara Pulluk Bıçağı (Ünlü Model)', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Sıcak dövme çelik ağız yapısı\n-48 HRC sertlik\n-Elektrostatik yüzey boyası\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-04', 500, 10, '10-13 Numara', 540, 200, 10, 5, 350, 0, '/cdn/file-1710845461161.jpg', '/cdn/file-1710845461189.jpg', 1, '19.03.2024'),
(52, '14 Numara Pulluk Bıçağı (Ünlü Model', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Sıcak dövme çelik ağız yapısı\n-48 HRC sertlik\n-Elektrostatik yüzey boyası\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-05', 499, 10, '14 Numara', 590, 200, 8, 5, 350, 0, '/cdn/file-1710845665832.jpg', '/cdn/file-1710845665774.jpg', 1, '19.03.2024'),
(53, 'Ekostar Pulluk Bıçağı (Ünlü Model', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Sıcak dövme çelik ağız yapısı\n-48 HRC sertlik\n-Havşalı delik yapısı\n\n', 'P-Ü-06', 500, 50, 'Ünlü parçalı tüm modeller', 350, 90, 12, 5, 269, 0, '/cdn/file-1710845893022.jpg', '/cdn/file-1710845893046.jpg', 1, '19.03.2024'),
(54, 'Pulluk Uzun Taban Bıçağı (Ünlü Model)', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-48 HRC sertlik\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-07', 500, 10, '10-13 Numara', 600, 110, 12, 5, 348, 0, '/cdn/file-1710846080339.jpg', '/cdn/file-1710846080296.jpg', 1, '19.03.2024'),
(55, 'Pulluk Kısa Taban Bıçağı (Ünlü Model) ', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-48 HRC sertlik\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-08', 500, 10, '8-9 Numara', 410, 110, 12, 5, 350, 0, '/cdn/file-1710846347080.jpg', '/cdn/file-1710846347106.jpg', 1, '19.03.2024'),
(56, 'Pulluk Kulak Ön Parça 10-13 No (Ünlü Model)', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-48 HRC sertlik\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-09', 500, 10, '10-13 Numara', 300, 135, 8, 5, 348, 0, '/cdn/file-1710846560541.jpg', '/cdn/file-1710846560480.jpg', 1, '19.03.2024'),
(57, 'Pulluk Kulak Ön Parça 8-9 No (Ünlü Model) ', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-48 HRC sertlik\n-Havşalı delik yapısı\n-Kırılma-kıvrılma karşı garantili\n', 'P-Ü-10', 500, 10, '8-9 Numara', 270, 135, 8, 4, 349, 0, '/cdn/file-1710846704266.jpg', '/cdn/file-1710846704219.jpg', 1, '19.03.2024'),
(58, 'Yem Karma Testere Bıçak 5 mm', 0, 3, '-Özel bor alaşımlı çelik malzeme\n-Atmosfer kontrollü fırınlarda ısıl işlem uygulaması\n-48-50 HRC sertlik\n-CNC işleme keskin bıçak ağızları\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'YM-02', 50000, 1, 'Yatay model', 85, 1, 5, 998, 31, 0, '/cdn/file-1710847649058.jpg', '/cdn/file-1710847649086.jpg', 1, '19.03.2024'),
(59, 'Yem Karma Yatay Bıçak 5 mm', 0, 3, '-Özel bor alaşımlı çelik malzeme\n-Atmosfer kontrollü fırınlarda ısıl işlem uygulaması\n-48-50 HRC sertlik\n-CNC işleme keskin bıçak ağızları\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'YM-03', 50000, 1, 'Yatay model', 240, 95, 5, 5000, 69, 0, '/cdn/file-1710847864894.jpg', '/cdn/file-1710847864915.jpg', 1, '19.03.2024'),
(60, 'Yem Karma Balta Tip Bıçak 5 mm', 0, 3, '-Özel bor alaşımlı çelik malzeme\n-Atmosfer kontrollü fırınlarda ısıl işlem uygulaması\n-48-50 HRC sertlik\n-CNC işleme keskin bıçak ağızları\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'YM-04', 50000, 1, 'Tüm modeller', 160, 82, 5, 5000, 57, 0, '/cdn/file-1710848018428.jpg', '/cdn/file-1710848018458.jpg', 1, '19.03.2024'),
(61, 'Yem Karma Dikey Bıçak 5 mm', 0, 3, '-Özel bor alaşımlı çelik malzeme\n-Atmosfer kontrollü fırınlarda ısıl işlem uygulaması\n-48-50 HRC sertlik\n-CNC işleme keskin bıçak ağızları\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'YM-05', 50000, 1, 'Dikey model', 200, 190, 5, 500, 125, 0, '/cdn/file-1710848271582.jpg', '/cdn/file-1710848271533.jpg', 1, '19.03.2024'),
(62, 'Yem Karma Dikey Bıçak 6 mm', 0, 3, '-Özel bor alaşımlı çelik malzeme\n-Atmosfer kontrollü fırınlarda ısıl işlem uygulaması\n-48-50 HRC sertlik\n-CNC işleme keskin bıçak ağızları\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılma karşı garantili\n', 'YM-06', 50000, 1, 'Dikey model', 328, 370, 6, 5000, 485, 0, '/cdn/file-1710848865506.jpg', '/cdn/file-1710848865534.jpg', 1, '19.03.2024'),
(63, '60X12 Dövme Çizel-Patlatma Bıçağı', 0, 4, '-Özel bor alaşımlı çelik malzeme\n-3 taraflı dövme çelik ağızlı\n-48-50 HRC sertlik\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılmaya karşı garantili\n', 'PT-01', 49998, 1, 'Tüm modeller', 320, 60, 10, 500, 163, 0, '/cdn/file-1710849469436.jpg', '/cdn/file-1710849469988.jpg', 1, '19.03.2024'),
(64, '70X12 Dövme Çizel-Patlatma Bıçağı', 0, 4, '-Özel bor alaşımlı çelik malzeme\n-3 taraflı dövme çelik ağızlı\n-48-50 HRC sertlik\n-Kumlama malzeme yüzeyi\n-Kırılma-kıvrılmaya karşı garantili\n', 'PT-02', 50000, 1, 'Tüm modeller', 375, 70, 11, 999, 200, 0, '/cdn/file-1710849578405.jpg', '/cdn/file-1710849578446.jpg', 1, '19.03.2024'),
(65, '60X12 Dövme Çizel-Patlatma Bıçağı (Ekostar)', 0, 4, '-1040 kalite lama\n-40-45 HRC sertlik\n-Kumlama malzeme yüzeyi\n', 'PT-03', 49999, 1, 'Tüm modeller', 320, 60, 12, 5000, 132, 0, '/cdn/file-1710849711800.jpg', '/cdn/file-1710849711820.jpg', 1, '19.03.2024'),
(66, '70X12 Dövme Çizel-Patlatma Bıçağı (Ekostar)', 0, 4, '-1040 kalite lama\n-40-45 HRC sertlik\n-Kumlama malzeme yüzeyi\n', 'PT-04', 50000, 1, 'Tüm modeller', 375, 70, 12, 999, 200, 0, '/cdn/file-1710849837294.jpg', '/cdn/file-1710849837323.jpg', 1, '19.03.2024'),
(67, 'Kültivatör Yılan Dili Bıçağı', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave destek burun - Havşalı delik yapısı\n-Kumlamalı malzeme yüzeyi\n-Kırılma-kıvrılmaya karşı garantili', 'PT-06', 49999, 10, 'Tüm modeller', 300, 65, 8, 5000, 100, 0, '/cdn/file-1710850698432.jpg', '/cdn/file-1710850698460.jpg', 1, '19.03.2024'),
(68, 'Dövme Sivri Uçlu Tırmık Dişi', 0, 4, '-1040 Kalite lama\n-40-45 HRC sertlik\n-Kumlamalı malzeme yüzeyi', 'PT-05', 999, 100, 'Tüm modeller', 240, 20, 1, 5, 80, 0, '/cdn/file-1710851210832.jpg', '/cdn/file-1710851210790.jpg', 1, '19.03.2024'),
(69, 'İthal Model Patik', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave destek burun - Havşalı delik yapısı\n-Kumlamalı malzeme yüzeyi\n-Kırılma-kıvrılmaya karşı garantili\n', 'PT-8', 10000, 50, 'Tüm modeller', 190, 40, 5, 3, 50, 0, '/cdn/file-1710851494379.jpg', '/cdn/file-1710851494407.jpg', 1, '19.03.2024'),
(70, 'Dövme Ağız Tambur Bıçağı', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave destek burun\n-Kumlamalı malzeme yüzeyi\n\n', 'PT-09', 10000, 500, 'Tüm modeller', 110, 50, 3, 5, 14, 0, '/cdn/file-1710852522245.jpg', '/cdn/file-1710852522182.jpg', 1, '19.03.2024'),
(71, 'Ekostar Ezme Ağız Tambur Bıçağı', 0, 2, '-Özel bor alaşımlı çelik malzeme\n-Dövme ağız yapısı\n-48-50 HRC sertlik\n-İlave destek burun\n-Kumlamalı malzeme yüzeyi\n', 'PT-10', 9998, 500, 'Tüm modeller', 110, 50, 2, 5, 13, 0, '/cdn/file-1710852636086.jpg', '/cdn/file-1710852636020.jpg', 1, '19.03.2024'),
(72, 'Fide-Pancar Çapalama Aparatı', 1, 6, '-Tüm modellere uyumlu üretim\n-Isıl işlemli çelik bıçaklar\n-Ayarlanabilir diskler\n-Siyah boyalı', 'C-01', 100, 1, 'Tüm çapalar', 850, 0, 0, 10, 3500, 0, '/cdn/file-1710853765193.jpg', '/cdn/file-1710853765252.jpg', 1, '19.03.2024'),
(73, 'Haşhaş-Tütün Çapalama Aparat', 1, 6, '-Tüm modellere uyumlu üretim\n-Isıl işlemli çelik bıçaklar\n-Ayarlanabilir diskler\n-Siyah boyalı\n', 'C-02', 1000, 1, 'Tüm çapalar', 549, 0, 0, 10, 3800, 0, '/cdn/file-1710854174834.jpg', '/cdn/file-1710854174763.jpg', 1, '19.03.2024'),
(74, 'Soğan Çapalama Aparatı', 1, 6, '-Tüm modellere uyumlu üretim\n-Isıl işlemli çelik bıçaklar\n-Ayarlanabilir diskler\n-Siyah boyalı\n', 'C-02-S', 1000, 1, 'Tüm çapalar', 850, 0, 0, 10, 4999, 0, '/cdn/file-1710854434964.jpg', '/cdn/file-1710854435033.jpg', 1, '19.03.2024'),
(75, 'Kekik Çapalama Aparatı', 1, 6, '-Tüm modellere uyumlu üretim\n-Isıl işlemli çelik bıçaklar\n-Ayarlanabilir diskler\n-Siyah boyalı\n', 'C-02-K', 1002, 1, 'Tüm çapalar', 850, 0, 0, 4, 5000, 0, '/cdn/file-1710854797045.jpg', '/cdn/file-1710854797085.jpg', 1, '19.03.2024'),
(76, 'Alt Bağlantı Çapalama Takımları', 1, 6, '-Tüm modellere uyumlu üretim\n-Isıl işlemli çelik bıçaklar\n-Özel olarak üretilebilen altı köşe alt gruplar\n-Siyah boyalı\n', 'C-04', 1000, 1, 'Tüm çapalar', 450, 0, 0, 5, 2575, 0, '/cdn/file-1710854929591.jpg', '/cdn/file-1710854929513.jpg', 1, '19.03.2024'),
(77, 'Bıçaksız Alt Bağlantı Takımları', 1, 6, '-Tüm modellere uyumlu üretim\n-Isıl işlemli çelik bıçaklar\n-Ayarlanabilir diskler\n-Siyah boyalı', 'C-05', 1000, 1, 'Tüm çapalar', 450, 0, 0, 3, 1875, 0, '/cdn/file-1710855159065.jpg', '/cdn/file-1710855159098.jpg', 1, '19.03.2024'),
(78, 'Çapa Makinası Teker Milleri', 1, 6, '-Tüm modellere uyumlu üretim \n-2,5 mm alt köşe mil kalınlığı\n-6 mm flanş kalınlığı\n-Siyah boyalı', 'C-07', 1000, 2, 'Tüm çapalar', 250, 3, 6, 5, 500, 0, '/cdn/file-1711012515431.jpg', '/cdn/file-1711012513461.jpg', 1, '21.03.2024'),
(93, 'Çapa Makinası Cırcır Milleri', 1, 6, '-Tüm modellere uyumlu üretim \n-Flanş bölümü dökümdür\n-Siyah boyalı  \n', 'C-08', 1000, 2, 'Tüm çapalar', 200, 1, 3, 5, 1900, 0, '/cdn/file-1711013259937.jpg', '/cdn/file-1711013259882.jpg', 1, '21.03.2024'),
(94, 'İlave Bağlantı Aparatı', 1, 6, '-Tüm modellere uyumlu üretim \n-Dayanıklı kaynak yapısı\n-5 mm flanş kalınlığı\n-Siyah boyalı  \n', 'C-06', 1000, 2, 'Tüm çapalar', 190, 5, 3, 5, 374, 0, '/cdn/file-1711013464058.jpg', '/cdn/file-1711013463978.jpg', 1, '21.03.2024'),
(95, 'Çapa Makinası Aynası', 1, 6, '-Tüm modellere uyumlu üretim \n-Siyah boyalı  \n', 'A-16', 1000, 2, 'Tüm çapalar', 300, 3, 130, 5, 375, 0, '/cdn/file-1711013772956.jpg', '/cdn/file-1711013772991.jpg', 1, '21.03.2024'),
(96, 'Römork Bağlantı Aparatı', 1, 6, '-Özel ölçüyle üretim yapılır\n-Siyah boyalı  \n', 'A-22', 1000, 1, 'Tüm çapalar', 240, 1, 1, 4, 250, 0, '/cdn/file-1711013952634.jpg', '/cdn/file-1711013952696.jpg', 1, '21.03.2024'),
(97, 'Çapa Makinası Kuyruk Mili', 1, 6, '-Tüm modellere uyumlu üretim \n-Isıl işlemli çelik kuyruk mili\n-Siyah boyalı  \n', 'A-23', 1000, 1, 'Tüm çapalar', 420, 1, 10, 4, 185, 0, '/cdn/file-1711014101732.jpg', '/cdn/file-1711014101682.jpg', 1, '21.03.2024'),
(98, 'Çapa ve Römork Tekeri 400/8', 1, 9, '-400/8 ebat\n-Yüksek dayanıklı lastik yapısı\n-ANLAS-BİLLAS Marka Yerli üretim\n', 'TK-01', 999, 5, 'Tüm çapalar', 400, 1, 1, 5, 690, 0, '/cdn/file-1711014431169.jpg', '/cdn/file-1711014431088.jpg', 1, '21.03.2024'),
(99, 'Çapa ve Römork Tekeri 500/10', 1, 9, '-400/8 ebat\n-Yüksek dayanıklı lastik yapısı\n-ANLAS-BİLLAS Marka Yerli üretim\n', 'TK-02', 1000, 5, 'Ttüm çapalar', 500, 1, 1, 5, 1550, 0, '/cdn/file-1711014585402.jpg', '/cdn/file-1711014585505.jpg', 1, '21.03.2024'),
(100, 'Çapa ve Römork Tekeri 650/80/13', 1, 9, '-650x80x13\n-Yüksek dayanıklı lastik yapısı\n-ANLAS-BİLLAS Marka Yerli üretim\n', 'TK-03', 1000, 5, 'Tüm çapalar', 1, 1, 1, 5, 1900, 0, '/cdn/file-1711014881683.jpg', '/cdn/file-1711014881759.jpg', 1, '21.03.2024'),
(101, 'Anlas-Billas 400/8 Komple Teker Seti', 1, 9, '-400/8 ebat\n-Yüksek dayanıklı lastik yapısı\n-ANLAS-BİLLAS Marka Yerli üretim\n-Demiray 1,5 mm jant\n-23/24/27/28/32 mm 6 köşe ebatlarında\n', 'TK-04', 1000, 5, 'Tüm çapalar', 400, 1, 1, 5, 2375, 0, '/cdn/file-1711015105254.jpg', '/cdn/file-1711015105248.jpg', 1, '21.03.2024'),
(102, 'Anlas-Billas 500/10 Komple Teker Seti', 1, 9, '-400/8 ebat\n-Yüksek dayanıklı lastik yapısı\n-ANLAS-BİLLAS Marka Yerli üretim\n-Demiray 2 mm jant\n-23/24/27/28/32 mm 6 köşe ebatlarında\n', 'TK-05', 1000, 5, 'Tüm çapalar', 500, 1, 1, 5, 4150, 0, '/cdn/file-1711015232577.jpg', '/cdn/file-1711015232661.jpg', 1, '21.03.2024'),
(103, 'İthal 400/8 Komple Teker Seti', 1, 9, '-400/8 ebat\n-23/24/27/28/32 mm 6 köşe ebatlarında\n', 'TK-06', 1000, 5, 'Tüm çapalar', 400, 1, 1, 5, 1690, 0, '/cdn/file-1711017356859.jpg', '/cdn/file-1711017356772.jpg', 1, '21.03.2024'),
(104, 'Teker İç Lastikleri 400/8', 1, 9, '-400/8 \n-Yüksek dayanıklı lastik yapısı\n-ANLAS - BİLLAS Marka Yerli üretim\n', 'TK-07', 1000, 20, 'Tüm çapalar', 400, 1, 1, 5, 125, 0, '/cdn/file-1711017795030.jpg', '/cdn/file-1711017795099.jpg', 1, '21.03.2024'),
(105, 'Teker İç Lastikleri 500/10', 1, 9, '-500/10 \n-Yüksek dayanıklı lastik yapısı\n-ANLAS - BİLLAS Marka Yerli üretim\n', 'TK-07', 1000, 20, 'Tüm çapalar', 500, 1, 1, 5, 170, 0, '/cdn/file-1711017873151.jpg', '/cdn/file-1711017873219.jpg', 1, '21.03.2024'),
(106, 'Teker İç Lastikleri 650/80/13', 1, 9, '-650/80/13\n-Yüksek dayanıklı lastik yapısı\n-ANLAS - BİLLAS Marka Yerli üretim\n', 'TK-07', 1000, 20, 'Tüm çapalar', 650, 1, 1, 5, 240, 0, '/cdn/file-1711018003362.jpg', '/cdn/file-1711018003263.jpg', 1, '21.03.2024'),
(107, 'Teker Jantı 400/8', 1, 9, '-400/8 ebat\n-1,5 mm galvaniz sac\n-Zor koşullara karşı dayanıklı', 'TK-08', 1000, 10, 'Genel', 400, 1, 1, 5, 395, 0, '/cdn/file-1711018236014.jpg', '/cdn/file-1711018236056.jpg', 1, '21.03.2024'),
(108, 'Teker Jantı 500/10', 1, 9, '-500/10 ebat\n-2 mm galvaniz sac\n-Zor koşullara karşı dayanıklı', 'TK-09', 1000, 10, 'Genel', 500, 1, 1, 5, 560, 0, '/cdn/file-1711018326161.jpg', '/cdn/file-1711018326202.jpg', 1, '21.03.2024'),
(109, 'Teker Jantı 500/12', 1, 9, '-Tek parçalı bütün kaynakllı jant\n-Zor koşullara karşı dayanıklı', 'TK-010', 1000, 1, 'Genel', 500, 1, 1, 5, 650, 0, '/cdn/file-1711018450769.jpg', '/cdn/file-1711018450669.jpg', 1, '21.03.2024'),
(110, 'Çapa Makinası Pimi', 1, 9, '-Kaplamalı yüzey\n-Mandallı kilit yapısı\n-Dayanıklı malzeme', 'TK-11', 1000, 100, 'Tüm çapalar', 75, 7, 1, 5, 650, 0, '/cdn/file-1711018635526.jpg', '/cdn/file-1711018635469.jpg', 1, '21.03.2024'),
(111, 'Çapa Makinası Civata Takımı', 1, 9, '-M10 çelik cıvata\n-M10 çelik somun', 'M10', 1000, 200, 'Tüm çapalar', 10, 30, 1, 5, 500, 0, '/cdn/file-1711018782129.jpg', '/cdn/file-1711018782040.jpg', 1, '21.03.2024'),
(112, 'Çiftli Çapa Makinası Pulluğu', 1, 8, '-Pulluk milleri (10 mm) ısıl işlemli çeliktir.\n-Pulluğun iskeleti 2,5 mm profilden oluşmaktadır.\n-Pulluk kulak kalınlığı : 3mm\n-Kurt ağızı-yuvarlak bağlantı seçeneği\n-Ayarlanabilir pulluk yüksekliği \n-Dayanıklı kaynak yapısı', 'A-01', 1000, 1, 'Dizel çapa', 375, 700, 1, 5, 2700, 0, '/cdn/file-1711019383551.jpg', '/cdn/file-1711019383427.jpg', 1, '21.03.2024'),
(113, 'Karık Açma-Kapama Aparatı', 1, 8, '-Karık açma mili ısıl işlemli çeliktir\n-Karı açma - kapama iskeleti 2,5 mm 6 köşe borudur\n-2,5 mm karık açma  - 2,5 mm karık kapama kalınlığı\n-Kurt ağızı-yuvarlak bağlantı seçeneği\n-Ayarlanabilir karık açma - kapama yüksekliği \n-Dayanıklı kaynak yapısı', 'A-02', 1000, 1, 'Dizel çapa', 800, 700, 1, 5, 2700, 0, '/cdn/file-1711019677187.jpg', '/cdn/file-1711019677059.jpg', 1, '21.03.2024'),
(114, 'Dönerli Çapa Makinası Pulluğu', 1, 8, '-Pulluk bıçakları ısıl işlemli çeliktir\n-Pulluk milleri 40 mm ısıl işlemli çeliktir\n-Pulluk kulak kalınlığı 2,5 \n-Kurt ağızı-yuvarlak bağlantı seçeneği\n-Ayarlanabilir döndürme mekanızması\n-Dayanıklı kaynak yapısı', 'A-03', 1000, 1, 'Tüm çapalar', 670, 580, 1, 5, 2875, 0, '/cdn/file-1711019901416.jpg', '/cdn/file-1711019901458.jpg', 1, '21.03.2024'),
(115, 'Dönerli Çapa Makinası Pulluğu', 1, 8, '-Pulluk kulak kalınlığı 3mm \n-Kurt ağızı-yuvarlak bağlantı seçeneği\n-Dayanıklı kaynak yapısı\n-Dönerli mekanızma yapısı\n-Kalın gövde laması', 'A-04', 1000, 1, 'Dizel çapalar', 250, 230, 1, 5, 2875, 0, '/cdn/file-1711020076359.jpg', '/cdn/file-1711020076253.jpg', 1, '21.03.2024'),
(116, 'Çiftli Çapa Makinası Pulluğu', 1, 8, '-4 mm kalın, paslanmaz pulluk aynası\n-Sökülebilir pulluk uç ve kulakları\n-10x50 lama ebatları\n-Kurt ağızı-yuvarlak bağlantı seçeneği\n-Dayanıklı kaynak yapısı', 'A-05-Y', 1000, 1, 'Dizel çapalar', 300, 250, 1, 5, 3000, 0, '/cdn/file-1711020297055.jpg', '/cdn/file-1711020296948.jpg', 1, '21.03.2024'),
(117, 'Aynalı Tekli Çapa Pulluğu-Dizel Modeller', 1, 8, '-4 mm kalın, paslanmaz pulluk aynası\n-Sökülebilir pulluk uç ve kulakları\n-10x60 lama ebatları\n-Kurt ağızı-yuvarlak bağlantı seçeneği\n-Dayanıklı kaynak yapısı', 'A-06-Y', 1000, 1, 'Dizel çapalar', 345, 280, 1, 5, 1750, 0, '/cdn/file-1711020460000.jpg', '/cdn/file-1711020459916.jpg', 1, '21.03.2024'),
(118, 'Aynalı Tekli Çapa Pulluğu-Benzinli Modeller', 1, 8, '-4 mm kalın, paslanmaz pulluk aynası\n-Sökülebilir pulluk uç ve kulakları\n-10x50 lama ebatları\n-Kurt ağızı-yuvarlak bağlantı seçeneği\n-Dayanıklı kaynak yapısı', 'A-07-Y', 1000, 1, 'Benzinli çapalar', 300, 250, 1, 5, 1600, 0, '/cdn/file-1711020588231.jpg', '/cdn/file-1711020588268.jpg', 1, '21.03.2024'),
(119, 'Çapa Makinası Kar Küreme Aparatı', 1, 8, '-Ayarlanabilir küreme ağızı\n-2 mm küreme sac kalınlığı\n-Küreme küregine monteli ilave tekerler\n-Dayanıklı kaynak yapısı\n-Kalın profil makina bağlantı şasesi', 'A-08-Y', 1000, 1, 'Tüm çapalar', 800, 430, 1, 5, 1800, 0, '/cdn/file-1711020891777.jpg', '/cdn/file-1711020891801.jpg', 1, '21.03.2024'),
(120, 'Ayarlı Karık Açma Aparatı', 1, 8, '-Karık açma mileri (10 mm) ısıl işlemli çeliktir\n-Karık açma kulak kalınlığı: 3mm\n-Ayarlanabilir karık açma açısı \n-Ayarlanabilir toprak batma derinliği (sivri uç)\n-Tekli pulluk olarak kullanılabilme özelliği\n-Dayanıklı kaynak yapısı ', 'A-05', 1000, 3, 'Tüm çapalar', 230, 350, 1, 5, 750, 0, '/cdn/file-1711021321385.jpg', '/cdn/file-1711021321256.jpg', 1, '21.03.2024'),
(123, 'Sivri Uçlu Karık Açma Aparatı', 1, 8, '-Karık açma mileri (10 mm) ısıl işlemli çeliktir\n-Karık açma kulak kalınlığı: 3mm\n-Ayarlanabilir karık açma açısı\n-Ayarlanabilir toprak batma derinliği (sivri uç)\n-Tekli pulluk olarak kullanılabilme özelliği\n-Dayanıklı kaynak yapısı', 'A-06', 1000, 3, 'Tüm çapalar', 500, 230, 1, 5, 875, 0, '/cdn/file-1711021820229.jpg', '/cdn/file-1711021820216.jpg', 1, '21.03.2024'),
(124, 'Sabit Karık Açma Aparatı', 1, 8, '-Karık açma milleri (10 mm) ısıl işlemli çeliktir\n-Karık açma kulak kalınlığı: 3mm\n-Ayarlanabilir toprak batma derinliği\n-Dayanıklı kaynak yapısı', 'A-07', 1000, 3, 'Tüm çapalar', 300, 150, 1, 5, 685, 0, '/cdn/file-1711022001874.jpg', '/cdn/file-1711022001758.jpg', 1, '21.03.2024'),
(125, 'Tekli Çapa Makinası Pulluğu', 1, 8, '-Pulluk mili(10 mm) ısıl işlemli çeliktir\n-Karık açma kulak kalınlığı: 3mm\n-Ayarlanabilir toprak batma derinliği\n-Dayanıklı kaynak yapısı', 'A-08', 1000, 3, 'Tüm çapalar', 245, 200, 1, 5, 565, 0, '/cdn/file-1711022112497.jpg', '/cdn/file-1711022112516.jpg', 1, '21.03.2024'),
(126, 'Üçlü Ayarlı Kazayağı Aparatı', 1, 8, '-Karık açma mileri (10 mm) ısıl işlemli çeliktir\n-Karık açma kulak kalınlığı: 3mm\n-Ayarlanabilir karık açma açısı\n-Ayarlanabilir toprak batma derinliği\n-Tekli pulluk olarak kullanılabilme özelliği\n-Dayanıklı kaynak yapısı', 'A-9', 1, 1, 'Tüm çapalar', 400, 550, 1, 5, 1800, 0, '/cdn/file-1711022440481.jpg', '/cdn/file-1711022440374.jpg', 1, '21.03.2024'),
(127, 'Beşli Ayarlı Kazayağı Aparatı', 1, 8, '-Karık açma mileri (10 mm) ısıl işlemli çeliktir\n-Karık açma kulak kalınlığı: 3mm\n-Ayarlanabilir karık açma açısı\n-Ayarlanabilir toprak batma derinliği\n-Tekli pulluk olarak kullanılabilme özelliği\n-Dayanıklı kaynak yapısı', 'A-10', 1, 1, 'Dizel çapalar', 400, 700, 1, 5, 2300, 0, '/cdn/file-1711022535002.jpg', '/cdn/file-1711022534872.jpg', 1, '21.03.2024'),
(128, 'Çapa Makinası Tırmığı - 9 Diş', 1, 8, '-Tırmık dişleri ısıl işlemli çeliktir\n-Tırmık laması 35x10 mm çelik lama \n-Dayanıklı kaynak yapısı\n-Ayarlanabilir yükseklik', 'A-11', 1000, 3, 'Tüm çapalar', 610, 750, 1, 5, 1800, 0, '/cdn/file-1711022828529.jpg', '/cdn/file-1711022828567.jpg', 1, '21.03.2024'),
(129, 'Çapa Makinası Tırmığı - 7 Diş', 1, 8, '-Tırmık dişleri ısıl işlemli çeliktir\n-Tırmık laması 35x10 mm çelik lama \n-Dayanıklı kaynak yapısı\n-Ayarlanabilir yükseklik', 'A-12', 1000, 1, 'Dizel çapalar', 610, 700, 1, 5, 1750, 0, '/cdn/file-1711022910075.jpg', '/cdn/file-1711022910100.jpg', 1, '21.03.2024'),
(130, '500x10 Ebat Demir Teker-Dizel Modeller', 1, 8, '-4 mm kalınlığında gövde sacı\n-Dayanıklı kaynak yapısı \n-23/24/27/28/32 m bağlantı milleri', 'A-13', 1000, 1, 'Tüm modeller', 385, 110, 1, 5, 2300, 0, '/cdn/file-1711023431749.jpg', '/cdn/file-1711023431664.jpg', 1, '21.03.2024'),
(131, '400x10 Ebat Demir Teker-Benzinli Modeller', 1, 8, '-4 mm kalınlığında gövde sacı\n-Dayanıklı kaynak yapısı \n-23/24/27/28/32 m bağlantı milleri', 'A-14', 1000, 1, 'Tüm modeller', 325, 110, 1, 5, 2050, 0, '/cdn/file-1711023526308.jpg', '/cdn/file-1711023526363.jpg', 1, '21.03.2024'),
(132, 'Ot Toplama Aparatı', 1, 8, 'Ot toplama aparatı', 'A-15', 100, 10, 'Tüm modeller', 550, 375, 5, 5, 155, 0, '/cdn/file-1711023756360.jpg', '/cdn/file-1711023756259.jpg', 1, '21.03.2024'),
(133, 'Karık Açma - Tekli Pulluk Aparatı', 1, 8, '-Karık açma milleri (10 mm) ısıl işlemli çeliktir\n-Karık açma kulak kalınlığı:3 mm \n-Ayarlanabilir toprak batma derinliği \n-Dayanıklı kaynak yapısı', 'A-16', 1, 3, 'Tüm modeller', 455, 310, 1, 5, 750, 0, '/cdn/file-1711023993155.jpg', '/cdn/file-1711023993094.jpg', 1, '21.03.2024'),
(134, 'Ekonomik Model Tekli Pulluk', 1, 8, '-Pulluk mili 10 mm\n-Pulluk kulak kalınlığı:3 mm \n-Ayarlanabilir toprak batma derinliği \n-Dayanıklı kaynak yapısı', 'A-16', 1, 3, 'Tüm modeller', 500, 210, 1, 5, 500, 0, '/cdn/file-1711024102529.jpg', '/cdn/file-1711024102483.jpg', 1, '21.03.2024');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sub_categories`
--

CREATE TABLE `sub_categories` (
  `subCategoryId` int NOT NULL,
  `categoryId` int NOT NULL,
  `subCategoryName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `sub_categories`
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
-- Tablo için tablo yapısı `unconfirmed_orders`
--

CREATE TABLE `unconfirmed_orders` (
  `orderId` int NOT NULL,
  `customerId` int NOT NULL,
  `orderDate` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `orderDetails` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `unverified_users`
--

CREATE TABLE `unverified_users` (
  `userId` int NOT NULL,
  `userName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userSurName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userCommercialTitle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userAdress` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userMail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userPassword` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userTaxNumber` bigint NOT NULL,
  `userPhone` bigint NOT NULL,
  `userRegisteredDate` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userAdminLevel` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
  `userId` int NOT NULL,
  `userName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userSurName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userCommercialTitle` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userAdress` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userMail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userPassword` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userTaxNumber` bigint NOT NULL,
  `userPhone` bigint NOT NULL,
  `userRegisteredDate` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userAdminLevel` int NOT NULL,
  `isBanned` tinyint(1) NOT NULL DEFAULT '0',
  `basket` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO `users` (`userId`, `userName`, `userSurName`, `userCommercialTitle`, `userAdress`, `userMail`, `userPassword`, `userTaxNumber`, `userPhone`, `userRegisteredDate`, `userAdminLevel`, `isBanned`, `basket`) VALUES
(15, '4WAY', 'DEV', 'test', 'adres içerik', 'info@4way.dev', '$2a$10$e0AXHxX2vmW9yJwj8o4KO.5Shxq9GoDDBNisYdop0TSrwcrEzamdu', 111111, 111111, '17.03.2024', 5, 0, '[]'),
(16, 'Mine', 'Boran', 'Demiray Portal', 'Test', 'boranmine571@gmail.com', '$2b$10$0t46ymQOQtuZqqmyWxWJkuDnweZOL4nwoxQpd1oPkTIyXaNpNBFLS', 123456789, 1234567890, '17.03.2024', 5, 0, '[{\"productId\":20,\"amount\":17}]');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryId`);

--
-- Tablo için indeksler `discount_byuser`
--
ALTER TABLE `discount_byuser`
  ADD PRIMARY KEY (`discountId`);

--
-- Tablo için indeksler `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Tablo için indeksler `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`);

--
-- Tablo için indeksler `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`subCategoryId`);

--
-- Tablo için indeksler `unconfirmed_orders`
--
ALTER TABLE `unconfirmed_orders`
  ADD PRIMARY KEY (`orderId`);

--
-- Tablo için indeksler `unverified_users`
--
ALTER TABLE `unverified_users`
  ADD PRIMARY KEY (`userId`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `discount_byuser`
--
ALTER TABLE `discount_byuser`
  MODIFY `discountId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Tablo için AUTO_INCREMENT değeri `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Tablo için AUTO_INCREMENT değeri `products`
--
ALTER TABLE `products`
  MODIFY `productId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- Tablo için AUTO_INCREMENT değeri `unconfirmed_orders`
--
ALTER TABLE `unconfirmed_orders`
  MODIFY `orderId` int NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `unverified_users`
--
ALTER TABLE `unverified_users`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
  MODIFY `userId` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
