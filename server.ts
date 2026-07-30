import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from "./src/data/initialData";
import { DEFAULT_SITE_SETTINGS } from "./src/utils/helpers";
import { Product, Order, SiteSettings } from "./src/types";

interface StoreDB {
  products: Product[];
  siteSettings: SiteSettings;
  orders: Order[];
}

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "store_db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read DB or initialize default
function readDB(): StoreDB {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error reading database file, using default data", error);
  }

  // Initial default state
  const defaultDB: StoreDB = {
    products: INITIAL_PRODUCTS,
    siteSettings: DEFAULT_SITE_SETTINGS,
    orders: INITIAL_ORDERS
  };

  saveDB(defaultDB);
  return defaultDB;
}

// Save DB to disk
function saveDB(db: StoreDB) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database file", error);
  }
}

async function startServer() {
  const app = express();

  // Support large base64 image uploads (e.g., logo images up to 50MB)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get full store database
  app.get("/api/store", (_req, res) => {
    const db = readDB();
    res.json(db);
  });

  // Save/update products
  app.post("/api/store/products", (req, res) => {
    try {
      const { products } = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: "Invalid products array" });
      }
      const db = readDB();
      db.products = products;
      saveDB(db);
      res.json({ success: true, products: db.products });
    } catch (error) {
      res.status(500).json({ error: "Failed to save products" });
    }
  });

  // Save single product (add or update)
  app.put("/api/store/products/:id", (req, res) => {
    try {
      const productId = req.params.id;
      const updatedProduct: Product = req.body;
      const db = readDB();
      
      const index = db.products.findIndex((p) => p.id === productId);
      if (index >= 0) {
        db.products[index] = updatedProduct;
      } else {
        db.products.unshift(updatedProduct);
      }

      saveDB(db);
      res.json({ success: true, product: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/store/products/:id", (req, res) => {
    try {
      const productId = req.params.id;
      const db = readDB();
      db.products = db.products.filter((p) => p.id !== productId);
      saveDB(db);
      res.json({ success: true, products: db.products });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Save/update site settings
  app.post("/api/store/settings", (req, res) => {
    try {
      const settings: SiteSettings = req.body;
      const db = readDB();
      db.siteSettings = { ...db.siteSettings, ...settings };
      saveDB(db);
      res.json({ success: true, siteSettings: db.siteSettings });
    } catch (error) {
      res.status(500).json({ error: "Failed to save site settings" });
    }
  });

  // Save/update orders
  app.post("/api/store/orders", (req, res) => {
    try {
      const { orders, newOrder } = req.body;
      const db = readDB();

      if (Array.isArray(orders)) {
        db.orders = orders;
      } else if (newOrder) {
        // Prevent duplicate order ID
        const existingIdx = db.orders.findIndex(o => o.id === newOrder.id);
        if (existingIdx >= 0) {
          db.orders[existingIdx] = newOrder;
        } else {
          db.orders.unshift(newOrder);
        }
      }

      saveDB(db);
      res.json({ success: true, orders: db.orders });
    } catch (error) {
      res.status(500).json({ error: "Failed to save orders" });
    }
  });

  // Update single order status
  app.put("/api/store/orders/:id", (req, res) => {
    try {
      const orderId = req.params.id;
      const { status, deliveryNotes } = req.body;
      const db = readDB();

      const orderIndex = db.orders.findIndex((o) => o.id === orderId);
      if (orderIndex >= 0) {
        if (status) db.orders[orderIndex].status = status;
        if (deliveryNotes !== undefined) db.orders[orderIndex].deliveryNotes = deliveryNotes;
        saveDB(db);
        res.json({ success: true, order: db.orders[orderIndex] });
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update order" });
    }
  });

  // Vite development middleware or Production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
