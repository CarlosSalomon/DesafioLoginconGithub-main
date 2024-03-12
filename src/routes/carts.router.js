

import {Router} from "express"
import { __dirname } from "../utils.js"
import CartManager from "../dao/mongomanagers/cartManagerMongo.js"
import ProductManager from "../dao/mongomanagers/productManagerMongo.js"
import { requireAuth, isAdmin } from "../config/authMiddleware.js"


const cm = new CartManager()
const pm = new ProductManager()


const router =Router()

router.get("/carts", async(req,res)=>{
   const carrito=await cm.getCarts()
   res.json({carrito})
})

router.get("/carts/:cid",  async(req,res)=>{
  const{cid}=req.params
    const carritofound=await cm.getCartById(cid)
    res.json({status:"success",carritofound})
})

router.post('/add-to-cart',  async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await cm.getCartById()
    const existingProductIndex = cart.products.findIndex(product => product._id === productId);

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      const productDetails = await pm.getProductById(productId);
      cart.products.push({
        _id: productId,
        quantity,
        title: productDetails.title,
        price: productDetails.price,
        total:productDetails.price * productDetails.quantity 
      });
    }

    res.status(200).json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
});

router.post('/carts', async (req, res) => {
  try {
      const { obj } = req.body;

      if (!Array.isArray(obj)) {
          return res.status(400).send('Invalid request: products must be an array');
      }

      const validProducts = [];

      for (const product of obj) {
          const checkId = await pm.getProductById(product._id);
          if (checkId === null) {
              return res.status(404).send(`Product with id ${product._id} not found`);
          }
          validProducts.push(checkId);
      }

      const cart = await cm.addCart(validProducts);
      res.status(200).send(cart);

  } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
  }
});



router.post("/cart/:cid/products/:pid",  async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const checkIdProduct = await pm.getProductById(pid);
      if (!checkIdProduct) {
        return res.status(404).send({ message: `Product with ID: ${pid} not found` });
      }
  
      const checkIdCart = await cm.getCartById(cid);
      if (!checkIdCart) {
        return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
      }
  
      const result = await cm.addProductInCart(cid, { _id: pid, quantity:quantity });
      console.log(result);
      return res.status(200).send({
        message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
        cart: result,
      });
    } catch (error) {
      console.error("Error occurred:", error);
      return res.status(500).send({ message: "An error occurred while processing the request" });
    }
  });
  

export default router