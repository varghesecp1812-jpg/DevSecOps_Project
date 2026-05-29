-- ============================================================
-- Food Ordering System - Database Schema
-- Run: mysql -h <RDS_HOST> -u admin -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS foodapp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE foodapp_db;

-- ─── Users ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(100)         NOT NULL,
  email        VARCHAR(150)         NOT NULL UNIQUE,
  password     VARCHAR(255)         NOT NULL,
  phone        VARCHAR(15),
  role         ENUM('user','admin') DEFAULT 'user',
  is_active    BOOLEAN              DEFAULT TRUE,
  created_at   TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ─── Restaurants ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS restaurants (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  name         VARCHAR(150)    NOT NULL,
  slug         VARCHAR(150)    NOT NULL UNIQUE,
  cuisine      VARCHAR(100),
  description  TEXT,
  image_url    VARCHAR(500),
  address      TEXT,
  rating       DECIMAL(2,1)    DEFAULT 0.0,
  delivery_time INT            DEFAULT 30,   -- minutes
  min_order    DECIMAL(8,2)    DEFAULT 0,
  is_open      BOOLEAN         DEFAULT TRUE,
  is_active    BOOLEAN         DEFAULT TRUE,
  created_at   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
);

-- ─── Menu Categories ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_categories (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id  INT          NOT NULL,
  name           VARCHAR(100) NOT NULL,
  sort_order     INT          DEFAULT 0,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
);

-- ─── Menu Items ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS menu_items (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  restaurant_id  INT            NOT NULL,
  category_id    INT,
  name           VARCHAR(200)   NOT NULL,
  description    TEXT,
  price          DECIMAL(8,2)   NOT NULL,
  image_url      VARCHAR(500),
  is_veg         BOOLEAN        DEFAULT TRUE,
  is_available   BOOLEAN        DEFAULT TRUE,
  is_popular     BOOLEAN        DEFAULT FALSE,
  created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id)   REFERENCES menu_categories(id) ON DELETE SET NULL,
  INDEX idx_restaurant (restaurant_id)
);

-- ─── Addresses ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT          NOT NULL,
  label       VARCHAR(50)  DEFAULT 'Home',
  line1       VARCHAR(200) NOT NULL,
  line2       VARCHAR(200),
  city        VARCHAR(100) NOT NULL,
  pincode     VARCHAR(10)  NOT NULL,
  is_default  BOOLEAN      DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─── Orders ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  user_id         INT            NOT NULL,
  restaurant_id   INT            NOT NULL,
  address_id      INT,
  total_amount    DECIMAL(8,2)   NOT NULL,
  delivery_charge DECIMAL(8,2)   DEFAULT 0,
  status          ENUM('placed','confirmed','preparing','out_for_delivery','delivered','cancelled')
                  DEFAULT 'placed',
  payment_method  ENUM('cod','online') DEFAULT 'cod',
  payment_status  ENUM('pending','paid','failed') DEFAULT 'pending',
  notes           TEXT,
  placed_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE RESTRICT,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT,
  FOREIGN KEY (address_id)    REFERENCES addresses(id)   ON DELETE SET NULL,
  INDEX idx_user   (user_id),
  INDEX idx_status (status)
);

-- ─── Order Items ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  order_id     INT            NOT NULL,
  menu_item_id INT            NOT NULL,
  name         VARCHAR(200)   NOT NULL,   -- snapshot at order time
  price        DECIMAL(8,2)   NOT NULL,
  quantity     INT            NOT NULL,
  FOREIGN KEY (order_id)     REFERENCES orders(id)     ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT
);

-- ─── Cart ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  user_id        INT NOT NULL,
  restaurant_id  INT NOT NULL,
  menu_item_id   INT NOT NULL,
  quantity       INT NOT NULL DEFAULT 1,
  added_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE CASCADE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id)  REFERENCES menu_items(id)  ON DELETE CASCADE,
  UNIQUE KEY unique_cart (user_id, menu_item_id)
);

-- ─── Login Logs (security) ────────────────────────────────
CREATE TABLE IF NOT EXISTS login_logs (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  user_id    INT,
  email      VARCHAR(150),
  ip_address VARCHAR(45),
  success    BOOLEAN,
  reason     VARCHAR(100),
  logged_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_ip (ip_address, logged_at)
);

-- ─── Seed: Admin ──────────────────────────────────────────
-- Password: Admin@123
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@foodapp.com',
 '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VKH.', 'admin');

-- ─── Seed: Restaurants ────────────────────────────────────
INSERT IGNORE INTO restaurants (name, slug, cuisine, description, rating, delivery_time, min_order) VALUES
('Spice Garden',   'spice-garden',   'North Indian', 'Authentic Mughlai & Punjabi cuisine', 4.5, 35, 150),
('Dosa Express',   'dosa-express',   'South Indian', 'Fresh dosas, idlis & Kerala meals',   4.3, 25, 100),
('Pizza Palace',   'pizza-palace',   'Italian',       'Wood-fired pizzas & pasta',           4.1, 40, 200),
('Dragon Wok',     'dragon-wok',     'Chinese',       'Indo-Chinese street food & rice bowls',4.4, 30, 120),
('Burger Bros',    'burger-bros',    'American',      'Gourmet burgers & loaded fries',      4.2, 20, 150);

-- ─── Seed: Menu Categories ────────────────────────────────
INSERT IGNORE INTO menu_categories (restaurant_id, name, sort_order) VALUES
(1,'Starters',1),(1,'Main Course',2),(1,'Breads',3),(1,'Desserts',4),
(2,'Dosas',1),(2,'Idli & Vada',2),(2,'Rice Meals',3),(2,'Beverages',4),
(3,'Pizzas',1),(3,'Pasta',2),(3,'Sides',3),
(4,'Starters',1),(4,'Noodles & Rice',2),(4,'Soups',3),
(5,'Burgers',1),(5,'Sides',2),(5,'Drinks',3);

-- ─── Seed: Menu Items ─────────────────────────────────────
INSERT IGNORE INTO menu_items (restaurant_id, category_id, name, description, price, is_veg, is_popular) VALUES
-- Spice Garden
(1,1,'Paneer Tikka','Cottage cheese marinated in spices, grilled in tandoor',220,TRUE,TRUE),
(1,1,'Chicken Seekh Kebab','Minced chicken with herbs on skewer',280,FALSE,TRUE),
(1,2,'Butter Chicken','Tender chicken in creamy tomato gravy',320,FALSE,TRUE),
(1,2,'Dal Makhani','Slow-cooked black lentils with butter',200,TRUE,FALSE),
(1,2,'Palak Paneer','Cottage cheese in spinach gravy',250,TRUE,FALSE),
(1,3,'Garlic Naan','Tandoor-baked bread with garlic',60,TRUE,FALSE),
(1,3,'Butter Roti','Whole wheat bread with butter',40,TRUE,FALSE),
(1,4,'Gulab Jamun','Soft dumplings in sugar syrup',80,TRUE,FALSE),
-- Dosa Express
(2,5,'Masala Dosa','Crispy dosa with spiced potato filling',120,TRUE,TRUE),
(2,5,'Paneer Dosa','Dosa stuffed with spiced paneer',150,TRUE,FALSE),
(2,5,'Ghee Roast Dosa','Plain dosa roasted in pure ghee',100,TRUE,TRUE),
(2,6,'Plain Idli (2 pcs)','Steamed rice cakes with sambar & chutney',80,TRUE,FALSE),
(2,6,'Medu Vada','Crispy lentil doughnuts with sambar',90,TRUE,TRUE),
(2,7,'Kerala Rice Meals','Full meals with curry, sambar, payasam',180,TRUE,FALSE),
(2,8,'Filter Coffee','Authentic South Indian filter coffee',50,TRUE,TRUE),
-- Pizza Palace
(3,9,'Margherita Pizza','Classic tomato, mozzarella, basil',250,TRUE,FALSE),
(3,9,'Pepperoni Pizza','Loaded with spicy pepperoni slices',380,FALSE,TRUE),
(3,9,'BBQ Chicken Pizza','Smoky BBQ sauce with grilled chicken',360,FALSE,TRUE),
(3,10,'Penne Arrabbiata','Pasta in spicy tomato sauce',220,TRUE,FALSE),
(3,11,'Garlic Bread','Toasted with herb butter',120,TRUE,TRUE),
-- Dragon Wok
(4,12,'Spring Rolls (6 pcs)','Crispy veg spring rolls with sauce',140,TRUE,TRUE),
(4,12,'Chilli Chicken','Indo-Chinese style dry chilli chicken',280,FALSE,TRUE),
(4,13,'Veg Hakka Noodles','Stir-fried noodles with vegetables',180,TRUE,FALSE),
(4,13,'Chicken Fried Rice','Wok-tossed rice with chicken & egg',220,FALSE,TRUE),
(4,14,'Hot & Sour Soup','Tangy soup with vegetables',110,TRUE,FALSE),
-- Burger Bros
(5,15,'Classic Veg Burger','Aloo tikki with fresh veggies',149,TRUE,FALSE),
(5,15,'Crispy Chicken Burger','Fried chicken fillet with coleslaw',199,FALSE,TRUE),
(5,15,'Double Smash Burger','Two beef patties, cheese, special sauce',299,FALSE,TRUE),
(5,16,'Loaded Fries','Crispy fries with cheese sauce & jalapeños',149,TRUE,TRUE),
(5,17,'Chocolate Milkshake','Thick shake with whipped cream',129,TRUE,FALSE);
