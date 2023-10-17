const express = require('express')
const app = express()
const port = 3000

const ProductCategoryRoute = require('./src/routes/product_category/ProductCategory.js')
const SupplierRoute = require('./src/routes/supplier/Supplier.js')
const MaterialRoute = require('./src/routes/raw_material/RawMaterial.js')
const ProductRoute = require('./src/routes/product/Product.js')
const MaterialProductRoute = require('./src/routes/material_product/MaterialProduct.js')
const ProductStockRoute = require('./src/routes/product_stock/ProductStock.js')

app.use(express.json())
app.use('/api', ProductCategoryRoute)
app.use('/api', SupplierRoute)
app.use('/api', MaterialRoute)
app.use('/api', ProductRoute)
app.use('/api', MaterialProductRoute)
app.use('/api', ProductStockRoute)

app.listen(port, () => {
    console.log(`app running on port http://localhost:${port}/api`)
})