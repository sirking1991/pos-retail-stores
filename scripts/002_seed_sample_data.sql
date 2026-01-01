-- Insert sample products (motorcycle spare parts)
INSERT INTO products (name, description, category, sku, cost_price, selling_price, stock_quantity, reorder_level) VALUES
('Engine Oil 10W-40', 'High performance motorcycle engine oil', 'Lubricants', 'OIL-10W40', 8.50, 15.00, 50, 10),
('Brake Pads (Front)', 'Premium front brake pads', 'Brake System', 'BP-FRONT', 12.00, 25.00, 30, 5),
('Brake Pads (Rear)', 'Premium rear brake pads', 'Brake System', 'BP-REAR', 10.00, 22.00, 25, 5),
('Air Filter', 'High flow air filter', 'Air System', 'AF-001', 6.00, 12.00, 40, 8),
('Spark Plug', 'NGK Iridium spark plug', 'Ignition', 'SP-NGK', 4.50, 10.00, 60, 15),
('Chain Lubricant', 'Chain cleaning and lubrication spray', 'Lubricants', 'CHAIN-LUB', 5.00, 11.00, 35, 10),
('Clutch Cable', 'Universal clutch cable', 'Controls', 'CC-UNI', 7.00, 15.00, 20, 5),
('Throttle Cable', 'Universal throttle cable', 'Controls', 'TC-UNI', 7.00, 15.00, 18, 5),
('Headlight Bulb H4', 'High intensity halogen bulb', 'Electrical', 'HB-H4', 3.50, 8.00, 45, 10),
('Battery 12V', 'Maintenance-free 12V battery', 'Electrical', 'BAT-12V', 35.00, 70.00, 15, 3);
