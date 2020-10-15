const Product = require("../models/product");
const OrderDetails = require("../models/orderdetail");
const Cart = require("../models/cart");

var RajaOngkir = require("rajaongkir-nodejs").Starter(
  "0c1822d88fb4bda9b1a7f9cd3b17ead4"
);

exports.getProducts = (req, res) => {
  Product.find()
    .sort("-createdAt")
    .then((dataProduct) => {
      return res.render("product/index", {
        title: "All Products",
        data: dataProduct,
        user: req.user,
      });
    });
};

exports.getAddProduct = (req, res) => {
  return res.render("product/add", {
    title: "Add Product",
    user: req.user,
    customjs: true,
  });
};

exports.getEditProduct = (req, res) => {
  const productId = req.params.id;

  Product.findById({ _id: productId }).then((dataProduct) => {
    return res.render("product/add", {
      title: "Edit Product",
      data: dataProduct,
      user: req.user,
      customjs: true,
    });
  });
};

exports.getUserProduct = (req, res) => {
  Product.find().then((data) => {
    return res.render("user/product", {
      title: "Katalog",
      data: data,
      user: req.user,
    });
  });
};

exports.getUserProductDetails = (req, res) => {
  const prodId = req.params.id;

  Product.findById({ _id: prodId }).then((dataProduct) => {
    return res.render("user/product/details", {
      title: dataProduct.title,
      data: dataProduct,
      user: req.user,
    });
  });
};

exports.getUserCart = (req, res) => {
  return res.render("user/cart", {
    title: "Cart",
    user: req.user,
  });
};

exports.getOrderSalesPanel = (req, res) => {
  OrderDetails.find()
    .populate("user")
    .then((dataOrder) => {
      // console.log(dataOrder);

      return res.render("user/product/ordersalespanel", {
        title: "Order Sales Panel",
        data: dataOrder,
        user: req.user,
      });
    });
};

exports.getOrderStatus = (req, res) => {
  const userId = req.user._id;

  OrderDetails.find({ user: userId }).then((dataOrder) => {
    return res.render("user/product/orderstatus", {
      title: "Order Status",
      data: dataOrder,
      user: req.user,
    });
  });
};

exports.getOrderDetails = (req, res) => {
  const orderId = req.params.id;

  OrderDetails.find({ _id: orderId }).then((dataOrder) => {
    return res.render("user/product/orderdetails", {
      title: "Order Details",
      data: dataOrder,
      user: req.user,
    });
  });
};

/**
 * POST Method
 */

exports.postProduct = (req, res, next) => {
  const { title, description, price, weight, qty } = req.body;
  const gallery = req.files.map((file) => file.path);
  // console.log(gallery);
  const newProduct = new Product();

  newProduct.title = title;
  newProduct.description = description;
  newProduct.price = price;
  newProduct.weight = weight;
  newProduct.qty = qty;
  if (req.files) {
    newProduct.gallery = gallery;
    next();
  }

  newProduct.save((err) => {
    if (err) console.log(err);
  });

  return res.redirect("/product");
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.id;
  const removeId = req.params.delete;

  if (productId) {
    const { title, description, price, weight, qty } = req.body;
    const gallery = req.files.map((file) => file.path);

    Product.findById({ _id: productId })
      .then((dataProduct) => {
        dataProduct.title = title;
        dataProduct.description = description;
        dataProduct.price = price;
        dataProduct.weight = weight;
        dataProduct.qty = qty;
        if (req.files.length > 0) {
          dataProduct.gallery = gallery;
        }

        dataProduct.save((err, dataProduct) => {
          if (err) console.log(err);
        });

        return res.redirect("/product");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (removeId) {
    Product.findById({ _id: removeId }).then((dataProduct) => {
      dataProduct.remove();
      return res.redirect("/product");
    });
  }
};

exports.postCart = (req, res) => {
  const prodId = req.params.prodId;

  const { qty } = req.body;

  const newOrder = new Cart();
  newOrder.product = prodId;
  newOrder.qty = qty;
  newOrder.user = req.user._id;
  newOrder.save((err, done) => {
    if (err) {
      console.log(err);
    }

    if (done) {
      return res.redirect("/product/cart");
    }
  });
};

/**
 * API
 */

exports.getCartAPI = (req, res) => {
  const userId = req.user._id;
  Cart.find({ user: userId })
    .populate("product")
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "Error" });
    });
};

exports.getProvinces = (req, res) => {
  RajaOngkir.getProvinces()
    .then((prov) => {
      RajaOngkir.getCities()
        .then((city) => {
          res.status(200).send({ provinces: prov, cities: city });
        })
        .catch((err) => {
          // Aksi ketika error terjadi
          console.log(err);
          res.status(400).send({ message: "Error" });
        });
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send({ message: "Error" });
    });
};

// exports.getCity = (req, res) => {
//   let idProvince = req.params.province;
//   RajaOngkir.getCity(req.query.province)
// }

exports.getShipping = (req, res) => {
  const cityId = req.query.cityId;
  var params = {
    origin: 23, // ID Kota atau Kabupaten Asal
    destination: cityId, // ID Kota atau Kabupaten Tujuan
    weight: 1000, // Berat Barang dalam gram (gr)
  };
  RajaOngkir.getJNECost(params)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((error) => {
      console.log(error);

      res.status(400).send({ message: "Error" });
    });
};

exports.postOrderDetails = (req, res) => {
  const userId = req.user._id;
  const { item, ship, total } = req.body;

  console.log(req.body);

  const newOrder = new OrderDetails();

  newOrder.user = userId;
  newOrder.item = item;
  newOrder.shippingCost = ship;
  newOrder.total = parseInt(total) + parseInt(ship);
  newOrder.status = "Belum Bayar";

  newOrder.save((err, done) => {
    if (err) {
      console.log(err);
      res.status(400).send({ message: "Error" });
    }

    if (done) {
      Cart.deleteMany({ user: userId }).then((cartData) => {
        console.log(cartData);
      });
      res.status(200).send(done);
    }
  });
};

exports.getOrderDetailsAPI = (req, res) => {
  const orderId = req.params.id;

  OrderDetails.find({ _id: orderId })
    .then((dataOrder) => {
      res.status(200).send(dataOrder);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "Error" });
    });
};

exports.payOrder = (req, res) => {
  const orderId = req.params.id;

  const { pay } = req.body;

  console.log(req.body);

  OrderDetails.findById({ _id: orderId })
    .then((dataOrder) => {
      dataOrder.paymentMethod = pay;
      dataOrder.status = "Menunggu Konfirmasi Pembayaran";

      dataOrder.save((err, done) => {
        if (err) {
          console.log(err);

          res.status(400).send({ message: "Error" });
        }

        if (done) {
          res.status(200).send(done);
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "Error" });
    });
};
