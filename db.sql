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