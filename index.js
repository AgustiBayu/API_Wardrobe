const express = require("express");
const app = express();
const port = 3000;

const ProductCategoryRoute = require("./src/routes/product_category/ProductCategory.js");
const SupplierRoute = require("./src/routes/supplier/Supplier.js");
const MaterialRoute = require("./src/routes/raw_material/RawMaterial.js");
const ProductRoute = require("./src/routes/product/Product.js");
const MaterialProductRoute = require("./src/routes/material_product/MaterialProduct.js");
const ProductStockRoute = require("./src/routes/product_stock/ProductStock.js");
const CustomerRoute = require("./src/routes/customer/Customer.js");
const OrderRoute = require('./src/routes/order/Order.js');
const OrderDetailRoute = require('./src/routes/order_detail/OrderDetail.js');
const OrderMoRoute = require('./src/routes/order_mo/Order_Mo.js');
const PurchesOrderRoute = require('./src/routes/purchase_order/PurchaseOrder.js')
const PaymentPoRoute = require('./src/routes/payment_po/PaymentPo.js')

app.use(express.json());
app.use("/api", ProductCategoryRoute);
app.use("/api", SupplierRoute);
app.use("/api", MaterialRoute);
app.use("/api", ProductRoute);
app.use("/api", MaterialProductRoute);
app.use("/api", ProductStockRoute);
app.use("/api", CustomerRoute);
app.use("/api", OrderRoute);
app.use("/api", OrderDetailRoute);
app.use("/api", OrderMoRoute);
app.use("/api", PurchesOrderRoute);
app.use("/api", PaymentPoRoute);

app.listen(port, () => {
  console.log(`app running on port http://localhost:${port}/api`);
});
