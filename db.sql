/* Назва бд */
digital_shop
/* Таюлиця користувачів*/
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255)
);
/**/

/*Товари*/
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10, 2),
    version VARCHAR(50),
    display VARCHAR(50),
    os VARCHAR(50),
    processor VARCHAR(50),
    ram VARCHAR(50)
)
INSERT INTO products (name, price, version, display, os, processor, ram)
VALUES 
('Laptop XYZ', 1200.00, '1.0', '15.6 inches', 'Windows 10', 'Intel Core i5', '8GB'),
('Smartphone ABC', 699.99, '2.5', '6.1 inches', 'Android 11', 'Snapdragon 865', '6GB'),
('Tablet QWE', 499.50, '3.2', '10.1 inches', 'iOS 15', 'Apple A14 Bionic', '4GB');
/**/

/*Замовлення*/
CREATE TABLE my_orders (
    id SERIAL PRIMARY KEY,
    userId INT,
    product_ids INT[],
    counts INT[],
    FOREIGN KEY (userId) REFERENCES users(id)
);
/**/