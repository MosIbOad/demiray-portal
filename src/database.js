const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { create } = require('hbs');
const config = require('./config.json');

// Veritabanı bağlantı havuzunu oluştur
const pool = mysql.createPool({
    host: config.DATABASE_HOST,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// const pool = mysql.createPool({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

async function confirmUnverifiedUserById(unverifiedUserId) {
    try {
        // Şifreyi hash'leme. Güvenlik için bcrypt kullanıyoruz.
        let unverifiedUser = await getUnverifiedUserById(unverifiedUserId);

        const query = 'INSERT INTO users (userName, userSurName, userCommercialTitle, userAdress, userMail, userPassword, userTaxNumber, userPhone, userRegisteredDate, userAdminLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [unverifiedUser.userName, unverifiedUser.userSurName, unverifiedUser.userCommercialTitle, unverifiedUser.userAdress, unverifiedUser.userMail, unverifiedUser.userPassword, unverifiedUser.userTaxNumber, unverifiedUser.userPhone, unverifiedUser.userRegisteredDate, unverifiedUser.userAdminLevel];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Kullanıcı başarıyla oluşturuldu', results);

        await deleteUnverifiedUserById(unverifiedUserId);

        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Kullanıcı oluşturulurken bir hata meydana geldi:', error);
        throw error;
    }
}

async function createUser(name, surName, commTitle, adress, mail, password, taxNumber, phoneNumber, _registeredDate, adminLevel = 0, banned = false, basket = '[]') {
    try {
        // Şifreyi hash'leme. Güvenlik için bcrypt kullanıyoruz.
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const registeredDate = formatDate(_registeredDate);

        const query = 'INSERT INTO users (userName, userSurName, userCommercialTitle, userAdress, userMail, userPassword, userTaxNumber, userPhone, userRegisteredDate, userAdminLevel, isBanned, basket) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [name, surName, commTitle, adress, mail, hashedPassword, taxNumber, phoneNumber, registeredDate, adminLevel, banned, basket];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Kullanıcı başarıyla oluşturuldu', results);
        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Kullanıcı oluşturulurken bir hata meydana geldi:', error);
        throw error;
    }
}

async function updateUserById(userId, updatedUser) {
    try {
        // Güncellenecek kullanıcı verileri
        const {
            userName, userSurName, userCommercialTitle, userAdress, userMail,
            userPassword, userTaxNumber, userPhone, userRegisteredDate, userAdminLevel, 
            isBanned, basket
        } = updatedUser;
        console.log("typeof Basket: " + typeof basket);

        // Güncelleme sorgusu
        const query = `
            UPDATE users 
            SET userName = ?, userSurName = ?, userCommercialTitle = ?, userAdress = ?, 
                userMail = ?, userPassword = ?, userTaxNumber = ?, userPhone = ?, 
                userRegisteredDate = ?, userAdminLevel = ?, isBanned = ?, basket = ?
            WHERE userId = ?
        `;
        const values = [
            userName, userSurName, userCommercialTitle, userAdress, userMail,
            userPassword, userTaxNumber, userPhone, userRegisteredDate, userAdminLevel, isBanned, JSON.stringify(basket),
            userId
        ];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Kullanıcı bilgileri başarıyla güncellendi', results);

        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Kullanıcı güncellenirken bir hata meydana geldi:', error);
        throw error;
    }
}

async function banUserById(userId, banned) {
    try {
        // Güncellenecek kullanıcı verileri

        // Güncelleme sorgusu
        const query = `
            UPDATE users 
            SET isBanned = ?
            WHERE userId = ?
        `;
        const values = [banned, userId];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Kullanıcı başarıyla yasaklandı', results);

        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Kullanıcı güncellenirken bir hata meydana geldi:', error);
        throw error;
    }
}

async function updateUserBasketById(userId, basket) {
    try {
        const query = `
            UPDATE users 
            SET basket = ?
            WHERE userId = ?
        `;
        const values = [basket, userId];

        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        connection.release();

        //console.log('Kullanıcı sepeti düzenlendi', results);

        return results;
    } catch (error) {
        console.error('Kullanıcı güncellenirken bir hata meydana geldi:', error);
        throw error;
    }
}

async function updateUserPassword(userId, newPassword) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Güncelleme sorgusu
        const query = `
            UPDATE users 
            SET userPassword = ?
            WHERE userId = ?
        `;
        const values = [hashedPassword, userId];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Kullanıcı şifresi güncellendi', results);

        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Kullanıcı güncellenirken bir hata meydana geldi:', error);
        throw error;
    }
}


async function createUnverifiedUser(name, surName, commTitle, adress, mail, password, taxNumber, phoneNumber, _registeredDate, adminLevel = 0) {
    try {
        // Şifreyi hash'leme. Güvenlik için bcrypt kullanıyoruz.
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const registeredDate = formatDate(_registeredDate);

        const query = 'INSERT INTO unverified_users (userName, userSurName, userCommercialTitle, userAdress, userMail, userPassword, userTaxNumber, userPhone, userRegisteredDate, userAdminLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [name, surName, commTitle, adress, mail, hashedPassword, taxNumber, phoneNumber, registeredDate, adminLevel];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Kullanıcı oluşturulurken bir hata meydana geldi:', error);
        throw error;
    }
}

function formatDate(date) {
    let day = date.getDate(); // Günü al (1-31)
    let month = date.getMonth() + 1; // Ayı al (0-11) ve 1 ekle
    let year = date.getFullYear(); // Yılı al
  
    // Gün veya ay tek haneli ise başlarına "0" ekle
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
  
    // "gg.aa.yyyy" formatında birleştir
    return day + '.' + month + '.' + year;
}

function formatTime(now) {
    const hours = now.getHours().toString().padStart(2, '0'); // Saat için
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Dakika için
    return hours + ':' + minutes;
}


async function createProduct(name, category, subCategory, description, code, amount, boxStock, model, length, width, thickness, maxStock, price, discountedPrice, image, sizeImage, state = 1, _registeredDate = new Date()) {
    try {
        const registeredDate = formatDate(_registeredDate);

        const query = 'INSERT INTO products (productName, productCategory, productSubCategory, productDescription, productCode, productAmount, productBox, productModel, productLength, productWidth, productThickness, productMaxStock, productPrice, productDiscountedPrice, productImage, productSizeImage, productState, createdDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [name, category, subCategory, description, code, amount, boxStock, model, length, width, thickness, maxStock, price, discountedPrice, image, sizeImage, state, registeredDate];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('ürün oluşturuldu!');
        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Ürün oluşturulurken bir hata meydana geldi:', error);
        throw error;
    }
}

async function updateProductById(productId, updatedProduct) {
    try {
        // Güncellenecek kullanıcı verileri
        const {
            productName, productCategory, productSubCategory, productDescription, productCode, productAmount, productBox, productModel, productLength, 
            productWidth, productThickness, productMaxStock, productPrice, productDiscountedPrice, productState
        } = updatedProduct;

        // Güncelleme sorgusu
        const query = `
            UPDATE products 
            SET productName = ?, productCategory = ?, productSubCategory = ?, productDescription = ?, 
                productCode = ?, productAmount = ?, productBox = ?, productModel = ?, productLength = ?, 
                productWidth = ?, productThickness = ?, productMaxStock = ?, productPrice = ?,
                productDiscountedPrice = ?, productState = ?
            WHERE productId = ?
        `;
        const values = [
            productName, productCategory, productSubCategory, productDescription, productCode, productAmount, productBox, productModel, productLength, 
            productWidth, productThickness, productMaxStock, productPrice, productDiscountedPrice, productState,
            productId
        ];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Ürün bilgileri başarıyla güncellendi', results);

        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Kullanıcı güncellenirken bir hata meydana geldi:', error);
        throw error;
    }
}

async function getProductById(id) {
    try {
        const query = 'SELECT * FROM products WHERE productId = ?';
        const values = [id];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // Kullanıcıyı döndür
        } else {
            return null; // Kullanıcı bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the user:', error);
        throw error;
    }
}

async function getProductByCode(code) {
    try {
        const query = 'SELECT * FROM products WHERE productCode = ?';
        const values = [code];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // Kullanıcıyı döndür
        } else {
            return null; // Kullanıcı bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the user:', error);
        throw error;
    }
}

// createUser('berkan', '123')
//     .then(result => console.log('Create user result:', result))
//     .catch(error => console.error('Create user error:', error));

async function getUserByName(username) {
    try {
        const query = 'SELECT * FROM users WHERE userName = ?';
        const values = [username];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // Kullanıcıyı döndür
        } else {
            return null; // Kullanıcı bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the user:', error);
        throw error;
    }
}

async function getUserByMail(userMail) {
    try {
        const query = 'SELECT * FROM users WHERE userMail = ?';
        const values = [userMail];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // Kullanıcıyı döndür
        } else {
            return null; // Kullanıcı bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the user:', error);
        throw error;
    }
}

async function getUserById(userId) {
    try {
        const query = 'SELECT * FROM users WHERE userId = ?';
        const values = [userId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // Kullanıcıyı döndür
        } else {
            return null; // Kullanıcı bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the user:', error);
        throw error;
    }
}

async function getUnverifiedUserById(userId) {
    try {
        const query = 'SELECT * FROM unverified_users WHERE userId = ?';
        const values = [userId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // Kullanıcıyı döndür
        } else {
            return null; // Kullanıcı bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the user:', error);
        throw error;
    }
}

async function getAllUsers() {
    try {
        const query = 'SELECT * FROM users';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}

async function getCategories() {
    try {
        const query = 'SELECT * FROM categories';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all categories:', error);
        throw error;
    }
}

async function getAllProducts() {
    try {
        const query = 'SELECT * FROM products';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}

async function getArchiveProducts() {
    try {
        const query = 'SELECT * FROM products WHERE productState = 0';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}

async function getSubCategories() {
    try {
        const query = 'SELECT * FROM sub_categories';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all sub categories:', error);
        throw error;
    }
}

async function getAllUnverifiedUsers() {
    try {
        const query = 'SELECT * FROM unverified_users';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}


async function deleteUserById(userId) {
    try {
        const query = 'DELETE FROM users WHERE userId = ?';
        const values = [userId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (result.affectedRows > 0) {
            console.log(`User with userId=${userId} has been deleted.`);
            return true; // Kullanıcı başarıyla silindi
        } else {
            console.log(`User with userId=${userId} not found.`);
            return false; // Kullanıcı bulunamadı, silinemedi
        }
    } catch (error) {
        console.error('An error occurred while deleting the user:', error);
        throw error;
    }
}

async function deleteUnverifiedUserById(userId) {
    try {
        const query = 'DELETE FROM unverified_users WHERE userId = ?';
        const values = [userId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (result.affectedRows > 0) {
            console.log(`User with userId=${userId} has been deleted.`);
            return true; // Kullanıcı başarıyla silindi
        } else {
            console.log(`User with userId=${userId} not found.`);
            return false; // Kullanıcı bulunamadı, silinemedi
        }
    } catch (error) {
        console.error('An error occurred while deleting the user:', error);
        throw error;
    }
}

async function deleteProductById(productId) {
    try {
        const query = 'DELETE FROM products WHERE productId = ?';
        const values = [productId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (result.affectedRows > 0) {
            console.log(`Product with productId=${productId} has been deleted.`);
            return true; // Kullanıcı başarıyla silindi
        } else {
            console.log(`Product with productId=${productId} not found.`);
            return false; // Kullanıcı bulunamadı, silinemedi
        }
    } catch (error) {
        console.error('An error occurred while deleting the product:', error);
        throw error;
    }
}

async function createOrder(orderOwner, paymentType, orderData) {
    try {
        const now = new Date();

        const registeredDate = formatDate(now);
        const registeredTime = formatTime(now);

        const orderStatus = 0;
        const query = 'INSERT INTO orders (orderOwner, orderCreatedDate, orderCreatedTime, orderStatus, orderPaymentType, orderData) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [orderOwner, registeredDate, registeredTime, orderStatus, paymentType, JSON.stringify(orderData)];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Sipariş oluşturulurken bir hata meydana geldi:', error);
        throw error;
    }
}

async function updateOrderById(orderId, updatedOrder) {
    try {
        // Güncellenecek kullanıcı verileri
        const {
            orderOwner, orderStatus, orderPaymentType, orderData
        } = updatedOrder;

        // Güncelleme sorgusu
        const query = `
            UPDATE orders 
            SET orderOwner = ?, orderStatus = ?, orderPaymentType = ?, orderData = ?
            WHERE orderId = ?
        `;
        const values = [
            orderOwner, orderStatus, orderPaymentType, orderData,
            orderId
        ];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Sipariş bilgileri başarıyla güncellendi', results);

        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Sipariş güncellenirken bir hata meydana geldi:', error);
        throw error;
    }
}

async function getOrderById(orderId) {
    try {
        const query = 'SELECT * FROM orders WHERE orderId = ?';
        const values = [orderId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // Siparişi döndür
        } else {
            return null; // Sipariş bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the order:', error);
        throw error;
    }
}

async function getUserOrders(userId) {
    try {
        const query = 'SELECT * FROM orders WHERE orderOwner = ?';
        const values = [userId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}

async function getAllOrders() {
    try {
        const query = 'SELECT * FROM orders;';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}

async function deleteOrderById(orderId) {
    try {
        const query = 'DELETE FROM orders WHERE orderId = ?';
        const values = [orderId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (result.affectedRows > 0) {
            console.log(`Orders with orderId=${orderId} has been deleted.`);
            return true; // Sipariş başarıyla silindi
        } else {
            console.log(`Orders with orderId=${orderId} not found.`);
            return false; // Sipariş bulunamadı, silinemedi
        }
    } catch (error) {
        console.error('An error occurred while deleting the product:', error);
        throw error;
    }
}

async function createDiscount(userId, productId, newDiscountPrice) {
    try {
        const query = 'INSERT INTO discount_byuser (ownerId, productId, discount) VALUES (?, ?, ?)';
        const values = [userId, productId, newDiscountPrice];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('İndirim oluşturulurken bir hata meydana geldi:', error);
        throw error;
    }
}

async function updateDiscountById(discountId, updatedDiscount) {
    try {
        // Güncellenecek kullanıcı verileri
        const {
            ownerId, productId, discount
        } = updatedDiscount;

        // Güncelleme sorgusu
        const query = `
            UPDATE discount_byuser 
            SET ownerId = ?, productId = ?, discount = ?
            WHERE discountId = ?
        `;
        const values = [
            ownerId, productId, discount,
            discountId
        ];

        // Veritabanına bağlan ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [results] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        // İşlem başarılı
        console.log('Sipariş bilgileri başarıyla güncellendi', results);

        return results;
    } catch (error) {
        // Hata yönetimi
        console.error('Sipariş güncellenirken bir hata meydana geldi:', error);
        throw error;
    }
}

async function getDiscountById(discountId) {
    try {
        const query = 'SELECT * FROM discount_byuser WHERE discountId = ?';
        const values = [discountId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (rows.length > 0) {
            return rows[0]; // İndirimi döndür
        } else {
            return null; // İndirimi bulunamadı
        }
    } catch (error) {
        console.error('An error occurred while fetching the order:', error);
        throw error;
    }
}

async function getDiscountsByProductId(productId) {
    try {
        const query = 'SELECT * FROM discount_byuser WHERE productId = ?';
        const values = [productId]
        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}

async function getAllDiscounts() {
    try {
        const query = 'SELECT * FROM discount_byuser;';

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query);

        // Bağlantıyı havuza geri bırak
        connection.release();

        //console.log('All users fetched:', rows);
        return rows; // Tüm kullanıcıları döndür
    } catch (error) {
        console.error('An error occurred while fetching all users:', error);
        throw error;
    }
}

async function deleteDiscountById(discountId) {
    try {
        const query = 'DELETE FROM discount_byuser WHERE discountId = ?';
        const values = [discountId];

        // Veritabanı havuzundan bağlantı al ve sorguyu çalıştır
        const connection = await pool.getConnection();
        const [result] = await connection.query(query, values);

        // Bağlantıyı havuza geri bırak
        connection.release();

        if (result.affectedRows > 0) {
            console.log(`Discount with orderId=${discountId} has been deleted.`);
            return true; // Sipariş başarıyla silindi
        } else {
            console.log(`Discount with orderId=${discountId} not found.`);
            return false; // Sipariş bulunamadı, silinemedi
        }
    } catch (error) {
        console.error('An error occurred while deleting the product:', error);
        throw error;
    }
}

// Fonksiyonu test etmek için kullan
// (async () => {
//     let user = await getUserByName('berkan');
//     if(user === null) {
//         console.log('kullanıcı bulunamadı!');
//     }
//     else {
//         console.log('userInfo: '+ user.name);
//     }
//   })();

// Kullanıcı oluşturma örneği
// (async () => {
//     await createUser('Mertcan', 'Test', 'lorem', 'adress 123w123 vvqwased adress', 'berkan150150@gmail.com', '123', 1234567, 53030223, new Date(), 5);
// })();

// Kullanıcı aktarma örneği
// (async () => {
//     confirmUnverifiedUserById(1);
// })();

// Kullanıcı banlama örneği
// (async () => {
//     banUserById(1, false);
// })();

// (async () => {
//     let product = await getProductById(5);
//     if(product == null) {
//         console.log('ürün bulunamadı!');
//         return;
//     }
//     console.log(product);
// })();

module.exports = {
  confirmUnverifiedUserById,
  createUser,
  updateUserById,
  banUserById,
  updateUserPassword,
  updateUserBasketById,
  updateProductById,
  createUnverifiedUser,
  createProduct,
  getUserById,
  getUnverifiedUserById,
  getUserByName,
  getUserByMail,
  getCategories,
  getSubCategories,
  getAllUsers,
  getAllUnverifiedUsers,
  getAllProducts,
  getArchiveProducts,
  getProductByCode,
  getProductById,
  deleteUnverifiedUserById,
  deleteUserById,
  deleteProductById,
  createOrder,
  updateOrderById,
  getOrderById,
  getUserOrders,
  getAllOrders,
  deleteOrderById,
  createDiscount,
  updateDiscountById,
  getDiscountsByProductId,
  getAllDiscounts,
  getDiscountById,
  deleteDiscountById,
};