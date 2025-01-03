const express = require('express');
const router = express.Router();
const database = require('./database.js');
const bcrypt = require('bcrypt');
const multer = require('multer');
const mailAPI = require('./mailAPI.js');

//console.log(content);
//mailAPI.sendEmail('berkan150150@gmail.com', 'e-mail başlığı', content);

const SimpleStorage = require('./SimpleStorage.js');

const myStorage = new SimpleStorage();

let newProducts = [
    {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #1',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },
      {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #2',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },
      {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #3',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },
      {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #4',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },
      {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #4',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },

      {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #4',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },

      {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #4',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },
      
      {
        productName: 'Antrac Çapa Makinelerine Uyumlu Demiray Çapa Makinası Alt Grup (24 Bıçaklı) #4',
        productSrc: '/assets/images/screenshot-9.png',
        productOldPrice: 20000,
        productNewPrice: 18000,
      },
]

let categoryList = [
    {
        categoryName: 'Traktör Arkası Çapa Ekipmanları',
        imgSource: '/assets/images/popular-category-6.png',
        redirectPage: '/product?subCategoryId=0&selectedType=1',
      },
      {
        categoryName: 'Çapa Makinesi Ekipmanları',
        imgSource: '/assets/images/popular-category-1.png',
        redirectPage: '/product?subCategoryId=1&selectedType=1',
      },
      {
        categoryName: 'Çapa Makinesi Römorkları',
        imgSource: '/assets/images/popular-category-2.png',
        redirectPage: '/product?subCategoryId=7&selectedType=0',
      },
      {
        categoryName: 'Bahçe El Çapaları',
        imgSource: '/assets/images/popular-category-8.png',
        redirectPage: '/product?subCategoryId=10&selectedType=0',
      },
      {
        categoryName: 'Harman Ekipmanları',
        imgSource: '/assets/images/popular-category-7.png',
        redirectPage: '/product?subCategoryId=11&selectedType=0',
      },
]

// ana sayfa
router.get('/', async (req, res) => {
    try {
        const isLogged = req.signedCookies['userId'];
        let isAdmin = await checkIsAdmin(req);

        res.render('index', { isLogged: isLogged, isAdmin: isAdmin});
    //res.json({ data: 'Hello!' });
    } catch (error) {
        console.log(error);
    }
});

router.get('/api/loadheadercategories', async (req, res) => {
    try {
        let categories = await database.getCategories();
        let subCategories = await database.getSubCategories();

        categories.forEach(x =>  {
        let parts = x.categoryName.split(' ');

        const lastName = parts.pop();
        const firstName = parts.join(' ');

        x.lastName = lastName;
        x.firstName = firstName;
        x.subCategories = subCategories.filter(j => j.categoryId == x.categoryId);
        });
    //console.log(categories);
        return res.json({ success: true, headerCategories: categories});    
    } catch (error) {
        console.log(error);
    } 
});

router.get('/api/loadproducts', async (req, res) => {
    try {
        newProducts = await getNewProducts();
        return res.json({ success: true, newProducts: newProducts, categoryList: categoryList });
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/exitaction', (req, res) => {
    try {
            //const { exit } = req.body;
    if(req.signedCookies['rememberMe']) res.clearCookie('rememberMe');
    if(req.signedCookies['userId']) res.clearCookie('userId');
    if(req.signedCookies['isLogged']) res.clearCookie('isLogged');

    return res.json({ success: true, redirectPage: '/' });
    
    } catch (err) {
        console.log(err);    
    }
});

// login
router.get('/login', (req, res) => {
    try {
        const isLogged = req.signedCookies['userId'];
        if(isLogged) {
            res.redirect('/');
            return;
        }
    
        res.render('login'); 

    } catch (err) {
        console.log(err);
    }

});

router.post('/api/loginaction', async (req, res) => {
    try {
        const { loginData } = req.body;
   if(!loginData) return;
   //console.log(loginData.mail);
   let user = await database.getUserByMail(loginData.mail);
   if(user === null) {
    //res.json({ infoMessage: 'Mail veya şifre hatalı!' });
    console.log('Mail veya şifre hatalı!');
    return res.json({ success: false, errorMessage: 'Mail veya şifre hatalı!', waitTime: 2000});
   }
   const checkLogin = await checkUserMailAndPassword(loginData.password, user.userPassword);
   if(checkLogin) {
    console.log('Giriş doğrulandı! Yönlendiriliyorsunuz...');
    //res.json({ infoMessage: 'Giriş doğrulandı! Yönlendiriliyorsunuz...' });

    if(loginData.rememberMe === true) {
        res.cookie('userId', user.userId, { signed: true, maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true }); // 7 gün geçerli
    } else {
        res.cookie('userId', user.userId, { signed: true, httpOnly: true });
    }

    return res.json({ success: true, redirectPage: '/', infoMessage: 'Giriş doğrulandı! Yönlendiriliyorsunuz...' });
   } else {
    console.log('Mail veya şifre hatalı!');
    //res.json({ infoMessage: 'Mail veya şifre hatalı!' });
    return res.json({ success: false, errorMessage: 'Mail veya şifre hatalı!', waitTime: 2000});
   }

    } catch (err) {
        console.log(err);   
    }
});

async function checkUserMailAndPassword(passwordInput, hashedPassword) {
    try {
        const passwordCorrect = await bcrypt.compare(passwordInput, hashedPassword);
        return passwordCorrect;
    } catch (err) {
        console.log(err);
        return null;
    }
}

// login
router.get('/register', (req, res) => {
    try {
        const isLogged = req.signedCookies['userId'];
        if(isLogged) {
            res.redirect('/');
            return;
        }
    
        res.render('register');
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/registeraction', async (req, res) => {
    try {
    const { registerData } = req.body;
    if(!registerData) return;

    if(registerData.userMail === '' || registerData.userName === '' || registerData.userSurName === '' || registerData.userCommercialTitle === '' || registerData.userAdress === '' || 
       registerData.userTaxNumber === '' || registerData.userPhone === '' || registerData.userPassword === '' || registerData.verifyPassword === '') return res.json({success: true, message: "Kayıt işlemi başarısız! Lütfen boş alanları doldurun."});
       
    let getAllUsers = await database.getAllUsers();
    

    let isRegistered = false;
    getAllUsers.forEach(x => {
        if(x.userMail === registerData.userMail) {
            isRegistered = true;
        }
    });
    if(isRegistered) return res.json({errorMessage: "Böyle bir kullanıcı zaten kayıtlı!", waitTime: 1500});

    let getAllUnverifiedUsers = await database.getAllUnverifiedUsers();

    let isUnverifiedUser = false;
    getAllUnverifiedUsers.forEach(x => {
        if(x.userMail === registerData.userMail) {
            isUnverifiedUser = true;
        }
    });
    if(isUnverifiedUser) return res.json({errorMessage: "Hesabınız henüz onaylanmamış lütfen onaylanmasını bekleyin!", waitTime: 2000});

    database.createUnverifiedUser(registerData.userName, registerData.userSurName, registerData.userCommercialTitle, registerData.userAdress, registerData.userMail,
    registerData.userPassword, registerData.userTaxNumber, registerData.userPhone, new Date());
    
    res.json({successMessage: "Kayıt işlemi başarılı!", waitTime: 1500, success: true, redirectPage: '/'});
    let mailText = mailAPI.userComingForAdminText();
    await sendMailToAdmins('Yeni Üye Kayıt İşlemi', mailText);
    } catch (err) {
        console.log(err);
    }
});

// sepet
router.get('/product-content', async (req, res) => {
    try {
    const isLogged = req.signedCookies['userId'];
    //if(!isLogged) return res.redirect('/');
    let isAdmin = await checkIsAdmin(req);

    const { productId } = req.query;
    //const productId = req.session.lastSelectedProductId;
    if(!productId) return;

    const userId = req.signedCookies['userId'];
    //if(!userId) return;


    let product = await database.getProductById(parseInt(productId));
    if(!product) return;

    let discount = await database.getDiscountsByProductId(product.productId);
    if(discount.length > 0 && discount[0].ownerId === parseInt(userId)) {
        product.productDiscountedPrice = discount[0].discount;
    }

    const showingProduct = product;
    res.render('product-content', { isLogged: isLogged, isAdmin: isAdmin, showingProduct: showingProduct });

    } catch (err) {
        console.log(err);
    }
    
});

router.post('/api/selectproductbyid', async (req, res) => {
    try {
        const { productId } = req.body;
        if(!productId) return;
    /*
    console.log('selectedProductId: ' + productId);
    let product = await database.getProductById(productId);
    if(!product) return;
    */
    //req.session.lastSelectedProductId = productId;

        res.json({ success: true, redirectPage: `/product-content?productId=${productId}` });
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/addproducttobasket', async (req, res) => {
    try {
        const { addingProductId, addingAmount } = req.body;
    if(!addingProductId) return;
    const userId = req.signedCookies['userId'];
    if(!userId) return;

    let user = await database.getUserById(parseInt(userId));
    if(user === null) {
        console.log('user not found');
        return;
    }

    let product = await database.getProductById(addingProductId);
    if(product.productAmount <= 0) {
        // stok yok
        res.json({ errorMessage: 'Bu ürünün stoğu bitmiş! Sepete eklenemez', waitTime: 2000});
        return;
    }

    if(addingAmount < product.productMaxStock) {
        res.json({ errorMessage: `Bu üründen en az ${product.productMaxStock} adet satın alabilirsiniz!` })
        return;
    }

    let userBasketList = JSON.parse(user.basket);;
    let index = userBasketList.findIndex(x => x.productId === addingProductId);
    if(index === -1) {
        const basketData = {
            productId: addingProductId,
            amount: addingAmount
        };
    
        userBasketList.push(basketData);
        //user.basket = JSON.stringify(userBasketList);
    }
    else {
        // console.log("basketCount: "+ userBasketList[index].amount);
        // console.log("maxStock: " +product.productMaxStock);

        if(userBasketList[index].amount + addingAmount <= product.productAmount)
            userBasketList[index].amount += addingAmount;
    }
    user.basket = userBasketList;

    await database.updateUserBasketById(userId, JSON.stringify(user.basket));

    res.json({success: true, redirectPage: '/basket'});
    } catch (error) {
        console.log(error);
    }
});

// sepet
router.get('/basket', async (req, res) => {
    try {
        const isLogged = req.signedCookies['userId'];
    if(!isLogged) return res.redirect('/');
    let isAdmin = await checkIsAdmin(req);

    const userId = parseInt(req.signedCookies['userId']);
    if(!userId) return;
    const user = await database.getUserById(userId);
    if(user === null) {
        console.log('user bulunamadı! basket');
        return;
    }

    let basketData = [];
    const userBasket = JSON.parse(user.basket);
    const products = await database.getAllProducts();

    for(let i = 0; i < userBasket.length; i++) {
        const x = userBasket[i];
        let product = products.find(j => j.productId === x.productId);
        if(product) {
            let discountedPrice = product.productDiscountedPrice;
            let discount = await database.getDiscountsByProductId(product.productId);
            if(discount.length > 0 && discount[0].ownerId === parseInt(userId)) {
                discountedPrice = discount[0].discount;
            }

            let addingProductData = {
                id: x.productId,
                name: product.productName,
                img: product.productImage,
                amount: x.amount,
                maxStock: product.productAmount,
                price: product.productPrice,
                discountedPrice: discountedPrice,
                selected: true,
            }
            basketData.push(addingProductData);
        }
    }
    /*
    userBasket.forEach(x => {
        let product = products.find(j => j.productId === x.productId);
        if(product) {
            
            let addingProductData = {
                id: x.productId,
                name: product.productName,
                img: product.productImage,
                amount: x.amount,
                maxStock: product.productMaxStock,
                price: product.productPrice,
                discountedPrice: product.productDiscountedPrice,
                selected: true,
            }
            basketData.push(addingProductData);
        }
    });
    */
    res.render('basket', { isLogged: isLogged, isAdmin: isAdmin, basketData: basketData });
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/deletebasket', async (req, res) => {
    try {
        const { deletingBasketList } = req.body;

    const userId = parseInt(req.signedCookies['userId']);
    if(!userId) return;
    const user = await database.getUserById(userId);
    if(user === null) {
        console.log('user bulunamadu! basket');
        return;
    }

    let userBasketList = JSON.parse(user.basket);
    deletingBasketList.forEach(x => {
        let index = userBasketList.findIndex(j => j.productId === x);
        if(index !== -1) {
            userBasketList.splice(index, 1);
            //delete userBasketList[basketIndex];
        }
    });

    user.basket = userBasketList;
    await database.updateUserBasketById(userId, JSON.stringify(user.basket));

    res.json({success: true, redirectPage: '/basket'});
    /*
    console.log(userBasket);

    console.log(deletingBasketList);
    */   
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/confirmbuyproduct', async (req, res) => {
    try {
        const { buyingProducts, paymentType } = req.body;
    if(buyingProducts === undefined || paymentType === undefined) return res.json({errorMessage: 'Bir hata oluştu daha sonra tekrar deneyin!'});
    const userId = parseInt(req.signedCookies['userId']);
    if(!userId) return res.json({errorMessage: 'Bir hata oluştu daha sonra tekrar deneyin!'});;
    let user = await database.getUserById(userId);
    if(user === null) return res.json({errorMessage: 'Bir hata oluştu daha sonra tekrar deneyin!'});;

    let buyingList = [];
    for(let i = 0; i < buyingProducts.length; i++) {
        let x = buyingProducts[i];
        let product = await database.getProductById(x.id);
        if(product !== null) {
            let inPrice = product.productPrice;
            if(product.productDiscountedPrice > 0) inPrice = product.productDiscountedPrice; // indirim işlemi

            let discount = await database.getDiscountsByProductId(product.productId);
            if(discount.length > 0 && discount[0].ownerId === parseInt(userId)) {
                inPrice = discount[0].discount;
            }

            if(product.productAmount < x.amount) {
                return res.json({ errorMessage: `${product.productName} isimli ürünün yeteri kadar stoğu yok!`, waitTime: 5000 });
            }

            if(x.amount < product.productMaxStock) {
                return res.json({ errorMessage: `${product.productName} isimli üründen en az ${product.productMaxStock} adet almalısınız!`, waitTime: 3000 });
            }
            product.productAmount -= x.amount;
            await database.updateProductById(product.productId, product);

            const buyData = {
                productId: x.id,
                productName: product.productName,
                productAmount: x.amount,
                productPrice: inPrice
            };
            buyingList.push(buyData);
        }
    }

    user.basket = [];
    console.log();

    await database.createOrder(userId, paymentType, buyingList);
    await database.updateUserById(user.userId, user);

    let mailText = mailAPI.orderComingForAdminText();
    await sendMailToAdmins('Sipariş Geldi', mailText);

    res.json({successMessage: 'Siparişiniz iletildi!', redirectPage: '/order-history', waitTime: 2000});
    /*
    setTimeout(() => {
        res.json({ success: true, redirectPage: '/order-history' });
    }, 2000);
    */
    /*
    buyingProducts.forEach(x => {
        let product = await database.getProductById(x.id);
        let buying = {
            productId: x.id,

        };
    });
    */

    //await database.createOrder(userId, paymentType, );
    } catch (err) {
        console.log(err);
    }
});

// sepet
router.get('/product', async (req, res) => {
    try {
        // console.log('subCategoryId: ' + subCategoryId);

    const isLogged = req.signedCookies['userId'];
    let isAdmin = await checkIsAdmin(req);

    // const subCategoryId = parseInt(req.session.lastSubCategory);
    // const selectedType = req.session.lastCategorySelectedType;
    let { subCategoryId, selectedType, rndCategory } = req.query;
    const userId = req.signedCookies['userId'];
    //if(userId === undefined) res.redirect('/');

    if(subCategoryId === undefined) {
        //subCategoryId = 0;
        return;
    }
    if(selectedType === undefined) {
        //selectedType = 1;
        return;
    }

    if(rndCategory === undefined) rndCategory = false;

    subCategoryId = parseInt(subCategoryId);
    selectedType = parseInt(selectedType);

    let products = await database.getAllProducts();
    let selectedHeadCategory;
    let selectedSubCategories;
    let _selectedSubCategory = { subCategoryId: 1, categoryId: 0, subCategoryName: 'Kazayağı Grubu' };

    if(selectedType === 0) { // seçili olan alt kategoriyi göster
        let categories = await database.getCategories();
        let subCategories = await database.getSubCategories();
        let selectedSubCategory = subCategories.find(x => x.subCategoryId == parseInt(subCategoryId));
        
        if(!selectedSubCategory) {
            console.log('alt kategori bulunamadı!');
            return;
        }

        products = products.filter(x => x.productSubCategory === parseInt(subCategoryId));
    
        selectedHeadCategory = categories.find(x => x.categoryId === selectedSubCategory.categoryId);
    
        selectedSubCategories = subCategories.filter(x => x.categoryId === selectedSubCategory.categoryId);
        _selectedSubCategory = selectedSubCategory
    
    }
    else if(selectedType === 1) { // bütün kategorileri göster
        let categories = await database.getCategories();
        let subCategories = await database.getSubCategories();

        if(rndCategory !== null && rndCategory === true) {
            const randomNumber = getRandomIntInclusive(0, categories.length - 1);
            subCategoryId = randomNumber;
        }

        selectedHeadCategory = categories.find(x => x.categoryId == parseInt(subCategoryId));
        //console.log(selectedHeadCategory);

        products = products.filter(x => x.productCategory === selectedHeadCategory.categoryId);

        selectedSubCategories = subCategories.filter(x => x.categoryId === selectedHeadCategory.categoryId);

        //res.json({ success: true, redirectPage: '/product', headCategoryName: selectedHeadCategory[0].categoryName, subCategories: selectedSubCategories, selectedType: selectedType, products: products });
    }

    for(let i = 0; i < products.length; i++) {
        const product = products[i];
        let discount = await database.getDiscountsByProductId(product.productId);
        if(discount.length > 0 && discount[0].ownerId === parseInt(userId)) {
            product.productDiscountedPrice = discount[0].discount;
        }
    }

    let productOtherData = {
        headCategoryName: selectedHeadCategory.categoryName,
        subCategories: selectedSubCategories,
        selectedType: selectedType,
        products: products,
        subCategoryId: parseInt(subCategoryId),
        selectedSubCategory: _selectedSubCategory,
    }

    res.render('product', { isLogged: isLogged, isAdmin: isAdmin, productOtherData: productOtherData, rndCategory: rndCategory });

    } catch (err) {
        console.log(err);    
    }
});

router.post('/api/sendtoproductpage', async (req, res) => {
    try {
        const { subCategoryId, selectedType } = req.body;
    if(subCategoryId === undefined || selectedType === undefined) {
        console.log('subCategory data not found!'); 
        return; 
    }

    // req.session.lastSubCategory = subCategoryId;
    // req.session.lastCategorySelectedType = selectedType;
    

    res.json({ success: true, redirectPage: `/product?subCategoryId=${subCategoryId}&selectedType=${selectedType}` });
    } catch (err) {
        console.log(err);
    }
});

async function checkIsAdmin(req) {
    try {
        let adminLevel = 0;
        const reqAdminLevel = 5;

        if(req.signedCookies['userId']) {
            let userId = parseInt(req.signedCookies['userId']);
            let user = await database.getUserById(userId);
            if(user !== null) {
                adminLevel = user.userAdminLevel;
            }
        }

        const isAdmin = adminLevel === reqAdminLevel ? true : false;
        return isAdmin;
    } catch (err) {
        console.log(err);
        return false;   
    }
}

// PANEL
router.get('/panel/current_accounts', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        let orders = await database.getAllOrders();
        const currentAccounts = orders.filter(x => x.orderStatus === 1);
    
        for (let i = 0; i < currentAccounts.length; i++) {
            let x = currentAccounts[i];
            let customer = await database.getUserById(x.orderOwner);
            
            x.nameSurName = `${customer.userName} ${customer.userSurName}`;
            x.commTitle = customer.userCommercialTitle;
            x.taxNumber = customer.userTaxNumber;
            x.adress = customer.userAdress;
            x.phone = customer.userPhone;
            x.registerDate = customer.userRegisteredDate;
            x.mail = customer.userMail;
            x.orderData = JSON.parse(x.orderData);
        }
        
    
        res.render('panel/current_accounts', { userName: user.userName, currentAccounts: currentAccounts });
    } catch (err) {
        console.log(err);
    }
});
router.get('/panel/discount', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        let userList = await database.getAllUsers();
        let safeUserList = [];
    
        for(var i = 0; i < userList.length; i++) {
            let newUser = {
                nameSurName: `${userList[i].userName} ${userList[i].userSurName}`,
                userId: userList[i].userId,
                //userSurName: userList[i].userSurName,
                userCommercialTitle: userList[i].userCommercialTitle,
                userAdress: userList[i].userAdress,
                userMail: userList[i].userMail,
                userTaxNumber: userList[i].userTaxNumber,
                userPhone: userList[i].userPhone,
                userRegisteredDate: userList[i].userRegisteredDate,
                selected: false,
                isBanned: userList[i].isBanned   
            }
            safeUserList.push(newUser);
        }
    
        let products = await database.getAllProducts();
        products.forEach(x => {
            x.selected = false;
        });
    
        let categories = await database.getCategories();
        let subCategories = await database.getSubCategories();
    
        res.render('panel/discount', { userName: user.userName, users: safeUserList, products: products, categories: categories, subCategories: subCategories });
    } catch (err) {
        console.log(err);   
    }
});

router.post('/api/addproductdiscount', async (req, res) => {
    try {
        const { addingDiscountProduct, addingUsers, newPrice } = req.body;
    if(newPrice === null) {
        return res.json({ errorMessage: 'Hatalı bir miktar girişi yaptınız! Tekrar deneyin.', waitTime: 3000 }); 
    }
    if(addingDiscountProduct === undefined || addingUsers === undefined) {
        return res.json({ errorMessage: 'Bir hata oluştu! Sayfayı yenileyip tekrar deneyin.', waitTime: 3000 });
    }
    //console.log('newPrice: ' + newPrice);
    for(let i = 0; i < addingUsers.length; i++) {
        const userId = addingUsers[i].userId;
        await database.createDiscount(userId, addingDiscountProduct.productId, newPrice);
    }

    res.json({ successMessage: 'Seçilen kullanıcılara özel indirim başarıyla yapıldı!', waitTime: 3000 });   
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/removeproductdiscount', async (req, res) => {
    try {
        const { removingDiscountProduct } = req.body;
        if(removingDiscountProduct === undefined) {
            return res.json({ errorMessage: 'Bir hata oluştu! Sayfayı yenileyip tekrar deneyin.', waitTime: 3000 });
        }
        let discountList = await database.getDiscountsByProductId(removingDiscountProduct.productId);
        for(let i = 0; i < discountList.length; i++) {
            const discount = discountList[i];
            await database.deleteDiscountById(discount.discountId);
        }
        res.json({ successMessage: 'Seçilen ürüne yapılmış bütün indirimler silindi!', waitTime: 3000 });
    } catch (err) {
        console.log(err);
    }
});

router.get('/panel/index', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
        const users = await database.getAllUsers();
        const usersCount = users.length;
    
        const products = await database.getAllProducts();
        const productsCount = products.length;
    
        let totalSales = 0;
        let orders = await database.getAllOrders();
        let confirmOrders = orders.filter(x => x.orderStatus === 1);
        confirmOrders.forEach(x => {
            x.orderData = JSON.parse(x.orderData);
            let total = 0;
            x.orderData.forEach(j => {
                total += (j.productAmount * j.productPrice);
            });
            totalSales += total;
        });
    
        const waitingOrders = orders.filter(x => x.orderStatus === 0);
    
        for (let i = 0; i < waitingOrders.length; i++) {
            let x = waitingOrders[i];
            let customer = await database.getUserById(x.orderOwner);
            
            x.name = customer.userName;
            x.surName = customer.userSurName;
            x.nameSurName = `${customer.userName} ${customer.userSurName}`;
            x.commTitle = customer.userCommercialTitle;
            x.taxNumber = customer.userTaxNumber;
            x.adress = customer.userAdress;
            x.phone = customer.userPhone;
            x.orderData = JSON.parse(x.orderData);
        }
    
        res.render('panel/index', { userName: user.userName, usersCount: usersCount, productsCount: productsCount, totalSales: totalSales, waitingOrders: waitingOrders });
    } catch (err) {
        console.log(err);   
    }
});
router.get('/panel/members-wait', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        res.render('panel/members-wait', { userName: user.userName });
    } catch (err) {
        console.log(err);
    }
});
router.post('/api/confirmuser', async (req, res) => {
    try {
        const { confirmingUsers } = req.body;
        if(!confirmingUsers) return;
        for(let i = 0; i < confirmingUsers.length; i++) {
            let confirmUserId = confirmingUsers[i];
            await database.confirmUnverifiedUserById(confirmUserId);
        }
    
        await loadUnVerifiedUsers(res);
    } catch (err) {
        console.log(err);   
    }
});
router.post('/api/deleteunverifieduser', async (req, res) => {
    try {
        const { deletingUnVerifUsers } = req.body;
        if(!deletingUnVerifUsers) return;
        for(let i = 0; i < deletingUnVerifUsers.length; i++) {
            let deletingUserId = deletingUnVerifUsers[i];
            await database.deleteUnverifiedUserById(deletingUserId);
        }
    
        await loadUnVerifiedUsers(res);
    } catch (err) {
        console.log(err);
    }

});
router.get('/panel/members', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        res.render('panel/members', { userName: user.userName });
    } catch (err) {
        console.log(err);   
    }
});

router.post('/api/banusers', async (req, res) => {
    try {
        const { banningUsers } = req.body;
        if(!banningUsers) return;
        
        for(let i = 0; i < banningUsers.length; i++) {
            let user = await database.getUserById(banningUsers[i]);
            user.isBanned = !user.isBanned;
            await database.updateUserById(user.userId, user);
        }
        
        await loadVerifiedUsers(res);
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/makeadminusers', async (req, res) => {
    try {
        const { makingAdminList } = req.body;
        if(makingAdminList === undefined) return;
        
        for(let i = 0; i < makingAdminList.length; i++) {
            let id = makingAdminList[i];
            let user = await database.getUserById(id);
            if(user !== null) {
                user.userAdminLevel = 5;
                await database.updateUserById(user.userId, user);
            }   
        }
        res.json({ successMessage: 'Seçili kullanıcılar başarıyla yönetici yapıldı!', waitTime: 1500 });
     } catch (err) {
        console.log(err);
    }
});

router.post('/api/unmakeadminusers', async (req, res) => {
    try {
        const { unMakingAdminList } = req.body;
        if(unMakingAdminList === undefined) return;
        
        for(let i = 0; i < unMakingAdminList.length; i++) {
            let id = unMakingAdminList[i];
            let user = await database.getUserById(id);
            if(user !== null) {
                user.userAdminLevel = 0;
                await database.updateUserById(user.userId, user);
            }   
        }
        res.json({ successMessage: 'Seçili kullanıcılar başarıyla yöneticilikten çıkartıldı!', waitTime: 2000 });
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/deleteusers', async (req, res) => {
    try {
        const { deletingUsers } = req.body;
        if(!deletingUsers) return;
        
        for(let i = 0; i < deletingUsers.length; i++) {
            await database.deleteUserById(deletingUsers[i]);
        }
    
        await loadVerifiedUsers(res);
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/edituser', async (req, res) => {
    try {
        const { editingUser, editingUserId } = req.body;
        if(!editingUser || !editingUserId) return;
        //console.log('editing user id: %d' ,editingUserId);
    
        let user = await database.getUserById(editingUserId);
        if(user == null) {
            console.log('silinmek istenen kullanıcı bulunamadı!');
            return;
        }
    
        let parts = editingUser.nameSurName.split(' ');
        let surname = parts.pop(); // Dizinin son elemanını alıp çıkarıyoruz, bu soyad olacak
        let name = parts.join(' '); // Geriye kalan kısmı birleştiriyoruz, bu da isim olacak
    
        user.userName = name;
        user.userSurName = surname;
        user.userCommercialTitle = editingUser.commTitle;
        user.taxNumber = editingUser.taxNo;
        user.userAdress = editingUser.adress;
        user.userPhone = editingUser.phone;
        user.userMail = editingUser.mail;
    
        await database.updateUserById(editingUserId, user);
        if(editingUser.password !== '') {
            await database.updateUserPassword(editingUserId, editingUser.password);
        }
        await loadVerifiedUsers(res);
    } catch (err) {
        console.log(err);   
    }
});

router.post('/api/createuser', async (req, res) => {
    try {
        const { creatingUser } = req.body;
        if(!creatingUser) return;
        
        let parts = creatingUser.nameSurName.split(' ');
        let surname = parts.pop(); // Dizinin son elemanını alıp çıkarıyoruz, bu soyad olacak
        let name = parts.join(' '); // Geriye kalan kısmı birleştiriyoruz, bu da isim olacak
    
        await database.createUser(name, surname, creatingUser.commTitle, creatingUser.adress, creatingUser.mail, creatingUser.password, creatingUser.taxNo, creatingUser.phone, new Date());
        await loadVerifiedUsers(res);   
    } catch (err) {
        console.log(err);
    }
});

router.get('/api/loadpanelusers', async (req, res) => {
    try {
        await loadVerifiedUsers(res);
    } catch (err) {
        console.log(err);
    }
});

async function loadVerifiedUsers(res) {
    try {
        let userList = await database.getAllUsers();
        let safeUserList = [];
    
        for(var i = 0; i < userList.length; i++) {
            let newUser = {
                userId: userList[i].userId,
                userNameSurName: userList[i].userName + ' ' + userList[i].userSurName,
                //userSurName: userList[i].userSurName,
                userCommercialTitle: userList[i].userCommercialTitle,
                userAdress: userList[i].userAdress,
                userMail: userList[i].userMail,
                userTaxNumber: userList[i].userTaxNumber,
                userPhone: userList[i].userPhone,
                userRegisteredDate: userList[i].userRegisteredDate,
                isChecked: false,
                isBanned: userList[i].isBanned   
            }
            safeUserList.push(newUser);
        }
    
        return res.json({success: true, userList: safeUserList});   
    } catch (err) {
        console.log(err);
        return null;
    }
}

router.get('/api/loadunverifiedusers', async (req, res) => {
    try {
        await loadUnVerifiedUsers(res);
    } catch (err) {
        console.log(err);
    }
});

async function loadUnVerifiedUsers(res) {
    try {
        let unverifiedUsers = await database.getAllUnverifiedUsers();
        let safeUserList = [];
    
        for(var i = 0; i < unverifiedUsers.length; i++) {
            let newUser = {
                userId: unverifiedUsers[i].userId,
                userNameSurName: unverifiedUsers[i].userName + ' ' + unverifiedUsers[i].userSurName,
                //userSurName: userList[i].userSurName,
                userCommercialTitle: unverifiedUsers[i].userCommercialTitle,
                userAdress: unverifiedUsers[i].userAdress,
                userMail: unverifiedUsers[i].userMail,
                userTaxNumber: unverifiedUsers[i].userTaxNumber,
                userPhone: unverifiedUsers[i].userPhone,
                userRegisteredDate: unverifiedUsers[i].userRegisteredDate,
                isChecked: false,
            }
            safeUserList.push(newUser);
        }

        return res.json({success: true, unverifiedUserList: safeUserList});

    } catch (err) {
        console.log(err);
        return null;
    }
}

router.get('/panel/order-details', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        const { orderId, isCurrentAcc } = req.query;
        if(orderId === undefined) {
            return res.redirect('/');
        }
        let order = await database.getOrderById(parseInt(orderId));
        if(order === null) {
            return res.redirect('/');
        }
        let customer = await database.getUserById(order.orderOwner);
        if(customer === null) {
            return res.redirect('/');
        }
    
        order.name = customer.userName;
        order.surName = customer.userSurName;
        order.nameSurName = `${customer.userName} ${customer.userSurName}`;
        order.commTitle = customer.userCommercialTitle;
        order.taxNumber = customer.userTaxNumber;
        order.adress = customer.userAdress;
        order.phone = customer.userPhone;
        order.mail = customer.userMail;
        order.orderData = JSON.parse(order.orderData);
    
        res.render('panel/order-details', { userName: user.userName, order: order, isCurrentAcc: isCurrentAcc });   
    } catch (err) {
        console.log(err);
    }
});

router.get('/panel/order-history-v2', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        res.render('panel/order-history-v2', { userName: user.userName });
    } catch (err) {
        console.log(err);
    }
});
router.get('/panel/order-history', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        res.render('panel/order-history', { userName: user.userName });

    } catch (err) {
        console.log(err);
    }
});

router.get('/panel/order-status', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        const { orderId } = req.query;
        if(orderId === undefined) {
            return res.redirect('orders-total');
        }
    
        let order = await database.getOrderById(parseInt(orderId));
        if(order === null) {
            return res.redirect('orders-total');
        }
    
        const orderData = {
            orderId: orderId,
            createdDate: order.orderCreatedDate,
            time: order.orderCreatedTime,
            state: order.orderStatus.toString(),
        }
    
        res.render('panel/order-status', { userName: user.userName, orderData: orderData });
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/confirmorder', async (req, res) => {
    try {
        const { confirmOrderData } = req.body;
        if(confirmOrderData === undefined) return res.json({ errorMessage: 'Bir hata oluştu ana sayfaya yönlendiriliyorsunuz...', waitTime: 1500, redirectPage: '/'});
    
        let order = await database.getOrderById(confirmOrderData.orderId);
        if(order == null) {
            return res.json({ errorMessage: 'Ürün bulunamadı ana sayfaya yönlendiriliyorsunuz...', waitTime: 1500, redirectPage: '/'});
        }
        let user = await database.getUserById(order.orderOwner);
        if(user === null) return res.json({ errorMessage: 'Kullanıcı bulunamadı ana sayfaya yönlendiriliyorsunuz...', waitTime: 1500, redirectPage: '/'});
        order.orderStatus = confirmOrderData.newStatus;
        await database.updateOrderById(order.orderId, order);

        if(confirmOrderData.reportCustomer === true) {
            if(order.orderStatus === 0) { // 
                let content = mailAPI.orderWaitingHTML(order.orderId, confirmOrderData.note);
                mailAPI.sendEmail(user.userMail, 'Sipariş Bekliyor', content);
            }
            if(order.orderStatus === 1) { // onaylanırsa
                let content = mailAPI.orderConfirmHTML(order.orderId, confirmOrderData.note);
                mailAPI.sendEmail(user.userMail, 'Sipariş Onaylandı', content);
            }
            else if(order.orderStatus === 2) { // iptal edilirse
                let content = mailAPI.orderCancelHTML(order.orderId, confirmOrderData.note);
                mailAPI.sendEmail(user.userMail, 'Sipariş İptal Edildi', content);
            }
        }

        if(order.orderStatus === 0) {
            res.json({ successMessage: 'Sipariş beklemeye alındı ana sayfaya yönlendiriliyorsunuz...', waitTime: 2000, redirectPage: 'orders-total' })
        } else if(order.orderStatus === 1) {
            res.json({ successMessage: 'Sipariş başarıyla onaylandı ana sayfaya yönlendiriliyorsunuz...', waitTime: 2000, redirectPage: 'orders-total' });
        } else if(order.orderStatus === 2) {
            res.json({ successMessage: 'Sipariş iptal edildi ana sayfaya yönlendiriliyorsunuz...', waitTime: 2000, redirectPage: 'orders-total' });
        }

        /*
        setTimeout(() => {
            res.json({ success: true, redirectPage: 'orders-total' });
        }, 1500);
        */
    } catch (err) {
        console.log(err);
    }
});

router.get('/panel/orders-confirm', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        let orders = await database.getAllOrders();
        const confirmOrders = orders.filter(x => x.orderStatus === 1);
    
        for (let i = 0; i < confirmOrders.length; i++) {
            let x = confirmOrders[i];
            let customer = await database.getUserById(x.orderOwner);
            
            x.name = customer.userName;
            x.surName = customer.userSurName;
            x.nameSurName = `${customer.userName} ${customer.userSurName}`;
            x.commTitle = customer.userCommercialTitle;
            x.taxNumber = customer.userTaxNumber;
            x.adress = customer.userAdress;
            x.phone = customer.userPhone;
            x.orderData = JSON.parse(x.orderData);
        }
    
        res.render('panel/orders-confirm', { userName: user.userName, confirmOrders: confirmOrders });
    } catch (err) {
        console.log(err);   
    }
});
router.get('/panel/orders-total', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        const orders = await database.getAllOrders();
        for (let i = 0; i < orders.length; i++) {
            let x = orders[i];
            let customer = await database.getUserById(x.orderOwner);
            
            x.name = customer.userName;
            x.surName = customer.userSurName;
            x.nameSurName = `${customer.userName} ${customer.userSurName}`;
            x.commTitle = customer.userCommercialTitle;
            x.taxNumber = customer.userTaxNumber;
            x.adress = customer.userAdress;
            x.phone = customer.userPhone;
            x.orderData = JSON.parse(x.orderData);
        }
    
        res.render('panel/orders-total', { userName: user.userName, orders: orders });
    } catch (err) {
        console.log(err);   
    }
});
router.get('/panel/orders-wait', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        let orders = await database.getAllOrders();
        const waitingOrders = orders.filter(x => x.orderStatus === 0);
    
        for (let i = 0; i < waitingOrders.length; i++) {
            let x = waitingOrders[i];
            let customer = await database.getUserById(x.orderOwner);
            
            x.name = customer.userName;
            x.surName = customer.userSurName;
            x.nameSurName = `${customer.userName} ${customer.userSurName}`;
            x.commTitle = customer.userCommercialTitle;
            x.taxNumber = customer.userTaxNumber;
            x.adress = customer.userAdress;
            x.phone = customer.userPhone;
            x.orderData = JSON.parse(x.orderData);
        }
    
        //console.log(waitingOrders);
        res.render('panel/orders-wait', { userName: user.userName, waitingOrders: waitingOrders });
    } catch (err) {
        console.log(err);
    }
});
router.get('/panel/product-archive', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        res.render('panel/product-archive', { userName: user.userName });
    } catch (err) {
        console.log(err);
    }
});
router.get('/panel/product-confirm', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        res.render('panel/product-confirm', { userName: user.userName });
    } catch (err) {
        console.log(err);
    }
});

router.get('/panel/products', async (req, res) => {
    try {
        if(!req.signedCookies['userId']) {
            return res.redirect('/');
        }
        let userId = parseInt(req.signedCookies['userId']);
        let user = await database.getUserById(userId);
        if(user === null) {
            console.log('kullanıcı bulunamadı!');
            return res.redirect('/');
        }
        if(user.userAdminLevel !== 5) return res.redirect('/');
    
        /*
        let categories = await database.getCategories();
        console.log(categories.length);
        for(let i = 0; i < categories.length; i++) {
            console.log(categories[i]);
        }
        */
    
        res.render('panel/products', { userName: user.userName });
    } catch (err) {
        console.log(err);
    }
});

router.get('/api/loadpanelcategories', async (req, res) => {
    try {
        let categories = await database.getCategories();
        let subcategories = await database.getSubCategories();
        res.json({ categories: categories, subcategories: subcategories });   
    } catch (err) {
        console.log(err);
    }
});

router.get('/api/loadpanelproducts', async (req, res) => {
    try {
        let products = await database.getAllProducts();
        products.forEach(x => {
            x.selected = false;
        });
    
        //console.log(products);
        res.json({ products: products });
    } catch (err) {
        console.log(err);
    }
});

router.get('/api/loadarchiveproducts', async (req, res) => {
    try {
        let archiveProducts = await database.getArchiveProducts();
        let categories = await database.getCategories();
        let subCategories = await database.getSubCategories();
        
        archiveProducts.forEach(x => {
            x.selected = false;
        });
    
        res.json({ archiveProducts: archiveProducts, categories: categories, subCategories: subCategories });
    } catch (err) {
        console.log(err);
    }
});

// Multer API

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/cdn/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
  });

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true); // Dosyayı kabul et
    } else {
      cb(new Error('Unsupported file type'), false); // Dosyayı reddet
    }
};
  
const upload = multer({
   dest: 'public/cdn/',
   fileFilter: fileFilter,
   storage: storage,
});

router.post('/upload', upload.single('file'), async (req, res) => {
   try {
    const { imageType, pData } = req.body;
    let photoData = {
        imageType: imageType,
        fileName: req.file.filename
    };
    if(parseInt(imageType) === 1) {
        //req.session.productImage = photoData.fileName;
        myStorage.setData('productImage', photoData.fileName);
        //console.log(`imageType: ${imageType} | imageName: ${req.file.filename} `); // 1
    } else if(parseInt(imageType) === 2) {
        setTimeout(async () => {
            //console.log(`imageType: ${imageType} | imageName: ${req.file.filename} `); // 2

            const getFirstPhotoData = myStorage.getData('productImage');
            //const getFirstPhotoData = req.session.productImage;
            if(!getFirstPhotoData) {
                console.log('productImage not found!');
                return;
            }

            const productData = JSON.parse(pData);

            const imgSrc = `/cdn/${getFirstPhotoData}`;
            const sizeImgSrc = `/cdn/${photoData.fileName}`;
            console.log(`${productData.productName}`);

            await database.createProduct(productData.productName, productData.selectedCategoryId, productData.selectedSubCategoryId, productData.productDesc, productData.productCode,
            productData.productAmount, productData.productBox, productData.productModel, productData.productLength, productData.productWidth, productData.productThickness,
            productData.productMaxStock, productData.productPrice, productData.productDiscountedPrice, imgSrc, sizeImgSrc);

            myStorage.deleteData('productImage');
            //console.log('productImage cleared!');
        
            return;
        }, 2000);
    }
    //console.log(req.file.filename); // dosya adını çeker

    res.send({ message: 'File uploaded successfully' });

   } catch (error) {
    res.status(400).send({ message: 'Error uploading file', error: error.message });
   }
});

router.post('/api/updateproduct', async (req, res) => {
    try {
        const { pData, pId } = req.body;

        let updatingProduct = await database.getProductById(pId);
        if(updatingProduct === null) {
            console.log('ürün bulunamadı!');
            return;
        }

        let checkCategory = await checkCategoryAndSubCategory(pData.selectedCategoryId, pData.selectedSubCategoryId);

        if(checkCategory === false) {
            return res.json({ errorMessage: 'Seçilen kategori ile alt kategori uyuşmuyor!', waitTime: 1500 });
        }

        if(pData.productName === undefined) {
            return res.json({ errorMessage: 'Ürün adını belirtmelisiniz!', waitTime: 1500 });
        } else if(pData.selectedCategoryId === undefined) {
            return res.json({ errorMessage: 'Kategori seçmelisiniz!', waitTime: 1500 });
        } else if(pData.selectedSubCategoryId === undefined || pData.selectedCategoryId === -1) {
            return res.json({ errorMessage: 'Alt kategori seçmelisiniz!', waitTime: 1500 });
        } else if(pData.productDesc === undefined) {
            return res.json({ errorMessage: 'Ürün açıklaması girmelisiniz!', waitTime: 1500 });
        } else if(pData.productCode === undefined) {
            return res.json({ errorMessage: 'Ürün kodu girmelisiniz!', waitTime: 1500 });
        } else if(pData.productAmount === undefined) {
            return res.json({ errorMessage: 'Ürün miktarı girmelisiniz!', waitTime: 1500 });
        } else if(pData.productModel === undefined) {
            return res.json({ errorMessage: 'Ürün modelini girmelisiniz!', waitTime: 1500 });
        } else if(pData.productLength === undefined) {
            return res.json({ errorMessage: 'Ürün uzunluğunu belirtmelisiniz!', waitTime: 1500 });
        } else if(pData.productWidth === undefined) {
            return res.json({ errorMessage: 'Ürün genişliğini belirtmelisiniz!', waitTime: 1500 });
        } else if(pData.productThickness === undefined) {
            return res.json({ errorMessage: 'Ürün kalınlığını belirtmelisiniz!', waitTime: 1500 });
        } else if(pData.productMaxStock === undefined) {
            return res.json({ errorMessage: 'Ürünün en az ne kadar alınacağını belirtmelisiniz!', waitTime: 1500 });
        } else if(pData.productPrice === undefined) {
            return res.json({ errorMessage: 'Ürünün fiyatını belirtmelisiniz!', waitTime: 1500 });
        }

        updatingProduct.productName = pData.productName;
        updatingProduct.productCategory = pData.selectedCategoryId;
        updatingProduct.productSubCategory = pData.selectedSubCategoryId;
        updatingProduct.productDescription = pData.productDesc;
        updatingProduct.productCode = pData.productCode;
        updatingProduct.productAmount = pData.productAmount;
        updatingProduct.productModel = pData.productModel;
        updatingProduct.productLength = pData.productLength;
        updatingProduct.productWidth = pData.productWidth;
        updatingProduct.productThickness = pData.productThickness;
        updatingProduct.productMaxStock = pData.productMaxStock;
        updatingProduct.productPrice = pData.productPrice;
        updatingProduct.productDiscountedPrice = pData.productDiscountedPrice;
        await database.updateProductById(pId, updatingProduct);
        res.json({ waitTime: 1500, successMessage: 'Ürün başarıyla düzenlendi! Yönlendiriliyorsunuz...', reloadPage: true});

    } catch (err) {
        console.log(err);   
    }
});

router.post('/api/deleteproducts', async (req, res) => {
    try {
        const { deletingProducts } = req.body;
        console.log('silinmek istenen ürünler: ' + deletingProducts);
        for(let i = 0; i < deletingProducts.length; i++) {
            let deletingProductId = deletingProducts[i];
            await database.deleteProductById(deletingProductId);
        }
    
        res.json({ success: true });

    } catch (err) {
        console.log(err);
    }
});

router.post('/api/archiveproducts', async (req, res) => {
    try {
        const { archiveProducts } = req.body;
        for(let i = 0; i < archiveProducts.length; i++) {
            let archiveProductId = archiveProducts[i];
            let product = await database.getProductById(archiveProductId);
            product.productState = !product.productState;
            await database.updateProductById(archiveProductId, product);
        }
        res.json({ success: true });

    } catch (err) {
        console.log(err);
    }
});

router.post('/api/publishproducts', async (req, res) => {
    try {
        const { publishingArchiveProducts } = req.body;
        if(!publishingArchiveProducts) return;
        for (let i = 0; i < publishingArchiveProducts.length; i++) {
            const archiveProductId = publishingArchiveProducts[i];
            let product = await database.getProductById(archiveProductId);
            product.productState = true;
            await database.updateProductById(archiveProductId, product);
        }
        res.json({ success: true });
    } catch (err) {
        console.log(err);
    }
});



router.get('/order-history', async (req, res) => {
    try {
        const isLogged = req.signedCookies['userId'];
        if(!isLogged) return res.redirect('/');
        let isAdmin = await checkIsAdmin(req);
        const userId = req.signedCookies['userId'];
        if(!userId) res.redirect('/');
    
        const userOrders = await database.getUserOrders(userId);
        let user = await database.getUserById(userId);
        if(user === null) {
            return res.redirect('/');
        }
        //console.log(userOrders);
        let waitingOrders = userOrders.filter(x => x.orderStatus === 0);
        waitingOrders.forEach(x => {
            x.name = user.userName;
            x.surName = user.userSurName;
            x.commTitle = user.userCommercialTitle;
            x.taxNumber = user.userTaxNumber;
            x.adress = user.userAdress;
            x.phone = user.userPhone;
            x.orderData = JSON.parse(x.orderData);
        });
    
        let completedOrders = userOrders.filter(x => x.orderStatus === 1);
        completedOrders.forEach(x => {
            x.name = user.userName;
            x.surName = user.userSurName;
            x.commTitle = user.userCommercialTitle;
            x.taxNumber = user.userTaxNumber;
            x.adress = user.userAdress;
            x.phone = user.userPhone;
            x.orderData = JSON.parse(x.orderData);
        });
    
        let canceledOrders = userOrders.filter(x => x.orderStatus === 2);
        canceledOrders.forEach(x => {
            x.name = user.userName;
            x.surName = user.userSurName;
            x.commTitle = user.userCommercialTitle;
            x.taxNumber = user.userTaxNumber;
            x.adress = user.userAdress;
            x.phone = user.userPhone;
            x.orderData = JSON.parse(x.orderData);
        });
    
        const orders = {
            waitingOrders,
            completedOrders,
            canceledOrders
        }
    
        res.render('order-history', { isLogged: isLogged, isAdmin: isAdmin, orders: orders });
    } catch (err) {
        console.log(err);
    }
});

router.get('/profile', async (req, res) => {
    try {
        const isLogged = req.signedCookies['userId'];
        if(!isLogged) return res.redirect('/');
        let isAdmin = await checkIsAdmin(req);
        const userId = req.signedCookies['userId'];
        if(!userId) res.redirect('/');

        let user = await database.getUserById(userId);
        if(user === null) {
            return res.redirect('/');
        }

        const profileData = {
            name: user.userName,
            surName: user.userSurName,
            commTitle: user.userCommercialTitle,
            taxNumber: user.userTaxNumber,
            phone: user.userPhone,
            mail: user.userMail,
            adress: user.userAdress,
        };
        console.log(profileData);

        res.render('profile', { isLogged: isLogged, isAdmin: isAdmin, profileData: profileData });
    } catch (err) {
        console.log(err);
    }
});

router.post('/api/saveprofiledata', async (req, res) => {
    try {
        const { userProfile, newPassword } = req.body;
        if(userProfile === undefined || newPassword === undefined) return res.json({ errorMessage: 'Hata oluştu! Daha sonra tekrar deneyin', waitTime: 2500});

        const userId = req.signedCookies['userId'];
        if(!userId) res.redirect('/');

        let user = await database.getUserById(userId);
        if(user === null) {
            return res.redirect('/');
        }

        user.userName = userProfile.name;
        user.userSurName = userProfile.surName;
        user.userCommercialTitle = userProfile.commTitle;
        user.userTaxNumber = userProfile.taxNumber;
        user.userPhone = userProfile.phone;
        user.userMail = userProfile.mail;
        user.userAdress = userProfile.adress;
        if(newPassword !== '') {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            user.userPassword = hashedPassword;
        }
        await database.updateUserById(userId, user);

        res.json({ successMessage: 'Kişisel bilgileriniz başarıyla güncellendi!', waitTime: 2500 })
    } catch (err) {
        console.log(err);
    }
});

// Sayfa bulunamadı (En sonda olmalı)
router.use((req, res, next) => {
    try {
        // Kullanıcıyı ana sayfaya yönlendir
        res.redirect('/');   
    } catch (err) {
        console.log(err);
    }
});


async function getNewProducts() {
    try {
        let products = await database.getAllProducts();
        let newProducts = [];
        for (let x of products) {
            if (newProducts.length >= 5) break;
            const isNew = isNewProduct(x);
            if (isNew) newProducts.push(x);
        }
        return newProducts;
    } catch (err) {
        console.log(err);
        return null;
    }
}

/*
async function getNewProducts() {
    try {
        let products = await database.getAllProducts();
        let newProducts = [];
        products = products.forEach(x => {
            const isNew = isNewProduct(x);
            if(isNew === true) newProducts.push(x);
        });
        return newProducts;
    } catch (err) {
        console.log(err);
        return null;
    }
}
*/

function isNewProduct(product) {
    try {
        const createdDate = convertToDate(product.createdDate);
        const dateNow = new Date();
        var difference = dateNow - createdDate;
        var dateDifference = difference / (1000 * 3600 * 24);
        return dateDifference <= 10 && dateDifference >= 0;   
    } catch (err) {
        console.log(err);
        return null;
    }
}

function convertToDate(dateString) {
    try {
        const parts = dateString.split('.');
        return new Date(parts[2], parts[1] - 1, parts[0]);   
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function sendMailToAdmins(headText, text) {
    try {
        let users = await database.getAllUsers();
        users = users.filter(x => x.userAdminLevel >= 5);
        for(let i = 0; i < users.length; i++) {
            const admin = users[i];
            mailAPI.sendEmail(admin.userMail, headText, text);
        }
    } catch (err) {
        console.log(err);   
    }
}

function getRandomIntInclusive(min, max) {
    try {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } catch (err) {
        console.log(err);
        return null;
    }
  }

async function checkCategoryAndSubCategory(categoryId, subCategoryId) {
    let categories = await database.getCategories();
    let subCategories = await database.getSubCategories();

    let category = categories.find(x => x.categoryId === categoryId);
    if(!category) return false;

    let subCategory = subCategories.find(x => x.subCategoryId === subCategoryId);
    if(!subCategory) return false;

    if(subCategory.categoryId === category.categoryId) return true;
    else return false;
}

/*
(async () => {
    const newProducts = await getNewProducts();
    console.log(`yeni ürünler: ${JSON.stringify(newProducts)}`);
})();
*/

module.exports = router;