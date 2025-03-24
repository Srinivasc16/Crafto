-- Add products
INSERT INTO products (name, description, price, image, types)
VALUES ('Product 1', 'High quality product', 999.99, 'https://via.placeholder.com/150', '3 Types');

-- Add subproducts linked to product
INSERT INTO subproducts (name, price, description, product_id)
VALUES ('SubProduct 1', 299.99, 'Part of Product 1', 1),
       ('SubProduct 2', 199.99, 'Part of Product 1', 1);
