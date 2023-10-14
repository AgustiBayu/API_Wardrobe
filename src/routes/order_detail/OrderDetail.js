const express = require('express');
const app = express();
const productCategoryRoute = require('./src/routes/product_category/ProductCategory.js')
const port = 3000;

app.use(express.json())
app.use('/api', )
app.listen(port, ()=>{
    console.log(`App running on port http://localhost:${port}/api`)
})