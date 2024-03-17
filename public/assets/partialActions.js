const app = new Vue({
    el: '#app',
    data: {
      // profile
      userProfile: {
        name: 'Test',
        surName: 'Test',
        commTitle: 'lorem',
        taxNumber: 1234567,
        phone: 53030223,
        mail: 'mailtest@gmail.com',
        adress: 'adress 123w123 vvqwased adress'
      },
      newPassword: '',
      // order-history
      completedOrders: [],
      waitingOrders: [],
      canceledOrders: [],
      // basket
      basketList: [],
      paymentType: '0',
      // product-content
      showingProduct: {},
      showingProductAmount: 1,
      // product
      headCategoryName: 'Tarım Makine Bıçakları',
      subCategories: [],
      selectedType: 0,
      filterType: 0,
      showProductsInStock: true,
      selectedSubCategory: { subCategoryId: 1, categoryId: 0, subCategoryName: 'Kazayağı Grubu' },

      products: [],
      firstProducts: [],

      headerCategories: [],

      selectedCategorySlider: 1,
      categoryList: [],
      selectedNewProductSlider: 1,
      newProductList: [],

      userMenuDelay: false,
      userMenu: false,
      productMenuEnabled: false,
    },
    created: function() {
      // alert("Toplam indirim yüzde: " + this.calcPercentage(1200, 2000));
    },
    delimiters: ['[', ']'],
    watch: {
      filterType(newValue) {
        this.filterType = parseInt(newValue, 10);
      },
      showProductsInStock(newValue) {
        //alert(newValue);
      },
    },
    computed: {
      paginatedCategories() {
        let selectedCategory = this.selectedCategorySlider - 1;
        const startIndex = selectedCategory * 5;
        const endIndex = startIndex + 5;
        return this.categoryList.slice(startIndex, endIndex);
      },
      getCategorySliderCount() {
        return Math.ceil(this.categoryList.length / 5);
      },

      paginatedNewProducts() {
        let selectedProduct = this.selectedNewProductSlider - 1;
        const startIndex = selectedProduct * 5;
        const endIndex = startIndex + 5;
        return this.newProductList.slice(startIndex, endIndex);
      },
      getNewProductsSliderCount() {
        return Math.ceil(this.newProductList.length / 5);
      },
      showInStockProducts() {

        
      },
      filteredProducts() {
        let products = this.products;
        const filterType = Number(this.filterType);

        if(this.showProductsInStock)
            products = products.filter(x => x.productAmount > 0);
        
        //console.log(JSON.stringify(products));
        if(filterType === 0) {
          return products;
        } else if(filterType === 1) {
          return products.sort((a, b) => a.productPrice - b.productPrice);
        } else if(filterType === 2) {
          return products.sort((a, b) => b.productPrice - a.productPrice);
        } else if(filterType === 3) {
          return products.filter(x => x.productDiscountedPrice !== 0);
        } else if(filterType === 4) {
          return products.sort((a, b) => {
            const dateA = this.convertToDate(a.createdDate);
            const dateB = this.convertToDate(b.createdDate);
            return dateB - dateA; // Tarihleri karşılaştırma
          });
        }
      },

      selectedBasketList() {
        return this.basketList.filter(x => x.selected === true);
      },
      totalBasketPrice() {
        let totalPrice = 0;
        this.selectedBasketList.forEach(x => {
          let price = x.price;
          if(x.discountedPrice > 0) {
            price = x.discountedPrice;
          }
          totalPrice += x.amount * price;
        });

        return totalPrice;
      },
    },
    methods: {
      userMenuActive(){
        this.userMenu = !this.userMenu;
      },
      userMenuActiveWithDelay(state, delay) {
        if(this.userMenuDelay) return;
        this.userMenuDelay = true;
        setTimeout(()=> {
          this.userMenu = state;
          this.userMenuDelay = false;
        }, delay);
      },
      redirectPanel() {
        window.location.href = 'panel/index'; 
      },
      redirectProfile() {
        window.location.href = 'profile';
      },
      setCategorySliderPage(pageId) {
        this.selectedCategorySlider = pageId;
      },
      setNewProductSliderPage(pageId) {
        this.selectedNewProductSlider = pageId;
      },
      isNewProduct(productId) {
        let product = this.products.find(x => x.productId === productId);
        if (!product) return false;
        const createdDate = this.convertToDate(product.createdDate);
        const dateNow = new Date();
        var difference = dateNow - createdDate;
        var dateDifference = difference / (1000 * 3600 * 24);
        return dateDifference <= 10 && dateDifference >= 0;
      },
      calcDiscount(newPrice, oldPrice) {
        let percentage = ((oldPrice - newPrice) / oldPrice) * 100;
        return percentage;
      },
      exitUser() {
        $.ajax({
          url: '/api/exitaction',
          type: 'POST',
          contentType: 'application/json',
          //data: JSON.stringify({ exit: 'exit' }),
          success: function(response) {
            if(response.success) {
              window.location.href = response.redirectPage;
            }
          },
          error: function() {
              //alert('Sunucu ile iletişim kurulamadı.');
          }
      });
      },
      showProductMenu() {
        this.productMenuEnabled = true;
      },
      hideProductMenu() {
        this.productMenuEnabled = false;
      },
      redirectSelectedPageCategory(subCategoryId, selectedType = 0) {
        
        $.ajax({
          url: '/api/sendtoproductpage',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ subCategoryId: subCategoryId, selectedType: selectedType }),
          success: function(response) {
            if(response.success) {
              window.location.href = response.redirectPage;
            }
          },
          error: function() {
              //alert('Sunucu ile iletişim kurulamadı.');
          }
      });

        // const baseUrl = "/product";
        // const queryParams = "?data=" + encodeURIComponent(subCategoryId);
        // window.location.href = baseUrl + queryParams;
        /*
        alert("seçilen alt kategori id: " + subCategoryId);
        */
      },
      selectProductById(productId) {
        $.ajax({
          url: '/api/selectproductbyid',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ productId: productId }),
          success: function(response) {
            if(response.success) {
              window.location.href = response.redirectPage;
            }
          },
          error: function() {
              //alert('Sunucu ile iletişim kurulamadı.');
          }
      });
      },
      convertToDate(dateString) {
        const parts = dateString.split('.');
        return new Date(parts[2], parts[1] - 1, parts[0]);
      },
      decreaseShowingProductAmount() { // azalt
        if(this.showingProductAmount <= 1) { this.showingProductAmount = 1; return; }
        this.showingProductAmount--;
      },
      increaseShowingProductAmount() { // arttır
        if(this.showingProductAmount >= this.showingProduct.productMaxStock) { this.showingProductAmount = this.showingProduct.productMaxStock; return; }
        this.showingProductAmount++;
      },
      addProductToBasket() {
        const addingProductId = this.showingProduct.productId;
        //alert("sepete eklenmek istenen ürün id: " + addingProductId);
        $.ajax({
          url: '/api/addproducttobasket',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ addingProductId: addingProductId, addingAmount: this.showingProductAmount }),
          success: function(response) {
            if(response.success) {
              window.location.href = response.redirectPage;
            }
            if(response.errorMessage) {
              errorMessage(response.errorMessage, response.waitTime);
            }
            if(response.successMessage) {
              successMessage(response.successMessage, response.waitTime);
            }
          },
          error: function() {
              //alert('Sunucu ile iletişim kurulamadı.');
          }
        });
      },
      increaseProductBasket(productId) {
        let index = this.basketList.findIndex(x => x.id === productId);
        if(index === -1) return;
        if(this.basketList[index].amount >= this.basketList[index].maxStock) {
          this.basketList[index].amount = this.basketList[index].maxStock;
          return;
        }
        this.basketList[index].amount++;
      },
      decreaseProductBasket(productId) {
        let index = this.basketList.findIndex(x => x.id === productId);
        if(index === -1) return;
        if(this.basketList[index].amount <= 1) {
          this.basketList[index].amount = 1;
          return;
        }
        this.basketList[index].amount--;
      },
      clearSelectedBasketList() {
        let deletingBasketList = [];
        this.selectedBasketList.forEach(x => {
          deletingBasketList.push(x.id);
        });
        //alert(JSON.stringify(deletingBasketList));

        $.ajax({
          url: '/api/deletebasket',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ deletingBasketList: deletingBasketList }),
          success: function(response) {
            if(response.success) {
              window.location.href = response.redirectPage;
            }
          },
          error: function() {
              //alert('Sunucu ile iletişim kurulamadı.');
          }
        });
      },
      confirmBasketToBuy() {
        const paymentType = parseInt(this.paymentType);
        let buyingProducts = this.selectedBasketList;

        if(buyingProducts.length <= 0) return alert('Sepetinizde ürün bulunamadı!');
        $.ajax({
          url: '/api/confirmbuyproduct',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ buyingProducts: buyingProducts, paymentType: paymentType }),
          success: function(response) {
            if(response.success) {
              window.location.href = response.redirectPage;
            }
            if(response.successMessage) {
              successMessage(response.successMessage, response.waitTime);
              setTimeout(() => {
                if(response.redirectPage) {
                  window.location.href = response.redirectPage;
                }
                
              }, response.waitTime);
            }
            if(response.errorMessage) {
              
              Swal.fire({
                position: "center",
                icon: "error",
                title: response.errorMessage,
                showConfirmButton: false,
                timer: 1500
              });

            }
          },
          error: function() {
              //alert('Sunucu ile iletişim kurulamadı.');
          }
        });
        //alert(JSON.stringify(buyingProducts));
        //alert(paymentType);
      },
      getBasketPrice(basketId) {
        let basketList = this.basketList;
        let basket = basketList.find(x => x.id === basketId);
        if(!basket) return 0;
        if(basket.discountedPrice > 0) {
          return basket.discountedPrice;
        }
        else return basket.price;
      },
      calcWaitingOrderTotalPrice(orderId) {
        let waitingOrders = this.waitingOrders;
        let price = 0;
        let order = waitingOrders.find(x => x.orderId === orderId);
        if(!order) return price;
        order.orderData.forEach(x => {
          price += (x.productAmount * x.productPrice);
        });
        return price;
      },
      calcCompletedOrderTotalPrice(orderId) {
        let completedOrders = this.completedOrders;
        let price = 0;
        let order = completedOrders.find(x => x.orderId === orderId);
        if(!order) return price;
        order.orderData.forEach(x => {
          price += (x.productAmount * x.productPrice);
        });
        return price;
      },
      calcCanceledOrderTotalPrice(orderId) {
        let canceledOrders = this.canceledOrders;
        let price = 0;
        let order = canceledOrders.find(x => x.orderId === orderId);
        if(!order) return price;
        order.orderData.forEach(x => {
          price += (x.productAmount * x.productPrice);
        });
        return price;
      },
      redirectPage(link) {
        window.location.href = link;
      },
      saveProfileData() {
        $.ajax({
          url: '/api/saveprofiledata',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ userProfile: this.userProfile, newPassword: this.newPassword }),
          success: function(response) {
            if(response.success) {
              window.location.href = response.redirectPage;
            }
            if(response.successMessage) {
              successMessage(response.successMessage, response.waitTime);
            }
            if(response.errorMessage) {
              errorMessage(response.errorMessage, response.waitTime);
            }
          },
          error: function() {
              //alert('Sunucu ile iletişim kurulamadı.');
          }
        });
      },
      productContentText() {
        if(this.showingProduct.productDescription) {
          let content = this.showingProduct.productDescription;
          //content = content.replace(/\n/g, '\n');
          //content = content.replace(/(?:\r\n|\r|\n)/g, '\n');
          return content.replace(/(?:\r\n|\r|\n)/g, '<br />');;
        } else return '';
      }
    },
    mounted() {

    }
});

$.ajax({
url: '/api/loadproducts',
type: 'GET',
contentType: 'application/json',
success: function(response) {
  if(response.success) {
    app.newProductList = response.newProducts;
    app.categoryList = response.categoryList;

  }
},
error: function() {

}
});



$.ajax({
  url: '/api/loadheadercategories',
  type: 'GET',
  contentType: 'application/json',
  success: function(response) {
    if(response.success) {
      app.headerCategories = response.headerCategories;
    }
  },
  error: function() {
  
  }
});

$.ajax({
  url: '/api/loadmainproductpage',
  type: 'GET',
  contentType: 'application/json',
  success: function(response) {
    if(response.success) {
      app.products = response.products;
    }
  },
  error: function() {
  
  }
});


window.onload = () => {
  loadProductsWithCategory();
  loadJustProductForShowing();
  loadBasket();
  loadOrders();
  loadProfileData();
};


function loadProductsWithCategory() {
  try {
    app.headCategoryName = _serverData.headCategoryName;
    app.subCategories = _serverData.subCategories;
    app.selectedType = _serverData.selectedType; // 1 bütün kategorileri gösterir | 0 sadece seçili kategoriyi gösterir
    app.products = _serverData.products;
    app.firstProducts = _serverData.products;
    app.selectedSubCategory = _serverData.selectedSubCategory;
    if(_rndCategory && _rndCategory === true) {
      app.filterType = 3;
    }
    
  } catch (error) {
    
  }
}

function loadJustProductForShowing() {
  try {
    app.showingProduct = _showingProductData;
    
    /*
    app.showingProduct = serverData.showingProduct;
    alert(JSON.stringify(serverData.showingProduct));
    */
  } catch (error) {
    
  }
}

function loadBasket() {
  try {
    app.basketList = _basketData;
    //alert(_basketData);
  } catch (error) {
    
  }
}

function loadOrders() {
  try {
    app.waitingOrders = _serverData.waitingOrders;
    app.completedOrders = _serverData.completedOrders;
    app.canceledOrders = _serverData.canceledOrders;
  } catch (error) {
    
  }
}

function loadProfileData() {
  try {
    app.userProfile = _profileData;
  } catch (error) {
    
  }
}


function successMessage(text, delay = 1500) {
  Swal.fire({
    position: "center",
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer: delay
  });
}

function errorMessage(text, delay = 1500) {
  Swal.fire({
    position: "center",
    icon: "error",
    title: text,
    showConfirmButton: false,
    timer: delay
  });
}