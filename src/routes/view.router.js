import { Router } from "express";
import { __dirname } from "../utils.js";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";
import CartManager from '../dao/mongomanagers/cartManagerMongo.js';
import { productsModel } from '../dao/models/products.model.js';
import { requireAuth, isAdmin } from "../config/authMiddleware.js"
import userManager from "../dao/mongomanagers/userManagerMongo.js";
import express from 'express';
import path from 'path';

const cmanager = new CartManager();
const pmanager = new ProductManager()
const usmanager = new userManager();
const userManagerInstance = new userManager();
const router = Router()

// Middleware para pasar el objeto user a las vistas
const setUserInLocals = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};

// Usar el middleware en todas las rutas
router.use(setUserInLocals);

router.use('/productos', express.static(path.join(__dirname, 'public')));


router.get("/chat", requireAuth, (req, res) => {
  res.render("chat")
})


router.get('/', async (req, res) => {
  res.render('home')
})


router.get('/login', async (req, res) => {
  res.render('login')
})

router.get('/register', async (req, res) => {
  res.render('register')
})

router.get('/perfil', requireAuth, async (req, res) => {
  try {
      const userInfo = await userManagerInstance.getUserInfo(req.session.user.email);
      res.render('perfil', { user: userInfo });
  } catch (error) {
  
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) res.send('Failed Logout')
    res.redirect('/')
  })
})


router.get("/productos", requireAuth, async (req, res) => {
  try {
      let pageNum = parseInt(req.query.page) || 1;
      let itemsPorPage = parseInt(req.query.limit) || 8;
      let sortByPrice = req.query.sort === 'asc' ? 'price' : req.query.sort === 'desc' ? '-price' : null;
      let category = req.query.category ? { category: req.query.category } : {};


      const query = {};

      if (sortByPrice) {
          query.sort = sortByPrice;
      }

      const products = await productsModel.paginate(category, { page: pageNum, limit: itemsPorPage, sort: query.sort, lean: true });

      products.prevLink = products.hasPrevPage ? `?limit=${itemsPorPage}&page=${products.prevPage}` : '';
      products.nextLink = products.hasNextPage ? `?limit=${itemsPorPage}&page=${products.nextPage}` : '';

      products.page = products.page;
      products.totalPages = products.totalPages;
      console.log(products)
      res.render('productos', products);
  } catch (error) {
      console.log('Error al leer los productos', error);
      res.status(500).json({ error: 'error al leer los productos' });
  }
});

router.get("/realtimeproducts", requireAuth, isAdmin, (req, res) => {
  res.render("realtimeproducts")
})

router.get("/cart", requireAuth, async (req, res) => {
  const productsInCart = await cmanager.getCartById("65ca90fcd9c2dcb92a0bb005")
  const productList = Object.values(productsInCart.products)
  res.render("cart", { productList })
})

router.delete('/delete-to-cart', requireAuth, async (req, res) => {
  try {
    const { productId } = req.body;
    const removeCartProduct = await cmanager.removeProductFromCart("65ca90fcd9c2dcb92a0bb005", productId);
    res.json({ success: true, message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
});

router.post('/add-to-cart', requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cmanager.getCartById("65ca90fcd9c2dcb92a0bb005");
    if (productId) {
      const id = productId;
      const productDetails = await pmanager.getProductById(productId);
      const addedProduct = await cmanager.addProductInCart("65ca90fcd9c2dcb92a0bb005", productDetails, id, quantity);
    }

    res.json({ success: true, message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ message: 'Error al agregar producto al carrito' });
  }
});
router.delete('/empty-cart', requireAuth, async (req, res) => {
  try {
    // Lógica para vaciar completamente el carrito
    const cartId = "65ca90fcd9c2dcb92a0bb005"; // ID del carrito a vaciar

    const cart = await cmanager.removeallProductFromCart(cartId);

    res.status(200).json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error('Error al vaciar el carrito:', error);
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
});

router.get("/:cid", requireAuth, async (req, res) => {
  try {
    const id = req.params.cid
    const result = await productsModel.findById(id).lean().exec()
    if (result === null) {
      return res.status(404).json({ status: 'error', error: 'product not found' })
    }
    res.render('partials/productDetail', result)
  } catch (error) {
    res.status(500).json({ error: 'error al leer el producto' })
  }
})




export default router