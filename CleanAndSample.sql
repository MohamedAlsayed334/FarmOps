-- Clean Tables and Insert Sample Data
-- Run after DDL.sql

USE FarmDelivaryDB;
GO

-- Disable FK constraints temporarily
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL";
GO

-- Delete all data from tables (in reverse FK order)
DELETE FROM DELIVARY_TRIP_LINE;
DELETE FROM ORDER_LINE;
DELETE FROM ORDERS;
DELETE FROM DELIVARY_TRIP;
DELETE FROM HARVEST_BATCH;
DELETE FROM FARM_SPECIALIZATION;
DELETE FROM RESTAURANT;
DELETE FROM TRUCK;
DELETE FROM DRIVER;
DELETE FROM FARM;
DELETE FROM CROP_TYPE;
GO

-- Enable FK constraints
EXEC sp_msforeachtable "ALTER TABLE ? CHECK CONSTRAINT ALL";
GO

-- Insert Sample Data (in FK order)

-- Crop Types
INSERT INTO CROP_TYPE (CROPTYPEID, CROPCATEGORY) VALUES
(1, 'Vegetables'),
(2, 'Fruits'),
(3, 'Herbs'),
(4, 'Grains');

-- Farms
INSERT INTO FARM (FARMID, FARM_NAME, LOCATION, CITY) VALUES
(1, 'Green Valley', 'North Valley', 'New York'),
(2, 'Sunrise Farm', 'East Hills', 'Boston'),
(3, 'Riverdale', 'South Plains', 'Philadelphia'),
(4, 'Highland', 'Mountain View', 'Chicago'),
(5, 'Coastal', 'Seaside Road', 'Miami'),
(6, 'Prairie Wind', 'Open Plains', 'Dallas');

-- Drivers
INSERT INTO DRIVER (DRIVERID, DRIVERNAME, LICENSENUMBER) VALUES
(1, 'John Smith', 123456789),
(2, 'Sarah Johnson', 987654321),
(3, 'Mike Davis', 456789123),
(4, 'Emily Brown', 789123456);

-- Trucks
INSERT INTO TRUCK (TRUCK_ID, TRUCK_REG, CAPACITY_KG) VALUES
(1, 'TRUCK-001', 5000),
(2, 'TRUCK-002', 7500),
(3, 'TRUCK-003', 10000),
(4, 'TRUCK-004', 3000);

-- Restaurants
INSERT INTO RESTAURANT (RESTAURANTID, NAME, DELIVERY_ADDRESS, DELIVER_WINDOW, CITY) VALUES
(1, 'The Green Plate', '123 Main St', '2026-01-01T10:00:00', 'New York'),
(2, 'Fresh Bistro', '456 Oak Ave', '2026-01-01T12:00:00', 'Boston'),
(3, 'Farm to Table', '789 Pine Rd', '2026-01-01T11:00:00', 'Philadelphia'),
(4, 'Organic Kitchen', '321 Elm Blvd', '2026-01-01T09:00:00', 'Chicago'),
(5, 'Rustic Dining', '654 Maple Dr', '2026-01-01T13:00:00', 'Miami');

-- Farm Specializations
INSERT INTO FARM_SPECIALIZATION (CROPTYPEID, FARMID) VALUES
(1, 1), (2, 2), (3, 3), (1, 4), (4, 5), (2, 6);

-- Harvest Batches
INSERT INTO HARVEST_BATCH (FARMID, BATCHID, CROPTYPEID, HARVEST_DATE, AVAILABLE_QTY, UNIT_PRICE) VALUES
(1, 1, 1, '2026-04-01', 1000, 250),
(1, 2, 1, '2026-04-10', 800, 300),
(2, 1, 2, '2026-04-05', 500, 450),
(3, 1, 3, '2026-04-03', 200, 500),
(4, 1, 1, '2026-04-08', 1200, 275),
(5, 1, 4, '2026-04-12', 3000, 150),
(6, 1, 2, '2026-04-06', 600, 400);

-- Orders
INSERT INTO ORDERS (RESTAURANTID, ORDERID, ORDER_DATE, ORDER_STATUS) VALUES
(1, 1, '2026-04-10', 'Delivered'),
(2, 1, '2026-04-11', 'Delivered'),
(1, 2, '2026-04-14', 'Delivered'),
(3, 1, '2026-04-15', 'Delivered'),
(4, 1, '2026-04-16', 'Processing'),
(2, 2, '2026-04-18', 'Delivered'),
(5, 1, '2026-04-18', 'Delivered');

-- Order Lines
INSERT INTO ORDER_LINE (RESTAURANTID, ORDERID, ORDERLINEID, FARMID, BATCHID, QUANTITY) VALUES
(1, 1, 1, 1, 1, 100),
(1, 1, 2, 2, 1, 50),
(2, 1, 1, 2, 1, 75),
(1, 2, 1, 1, 2, 200),
(3, 1, 1, 3, 1, 30),
(4, 1, 1, 4, 1, 150),
(2, 2, 1, 6, 1, 100),
(5, 1, 1, 5, 1, 500);

-- Delivery Trips
INSERT INTO DELIVARY_TRIP (TRIPID, DRIVERID, TRUCK_ID, TRIP_DATE, ROUTE_NAME, TOTAL_DISTANCE) VALUES
(1, 1, 1, '2026-04-15T08:00:00', 'NYC Metro', 150.5),
(2, 2, 2, '2026-04-15T09:00:00', 'Boston Express', 200.0),
(3, 1, 1, '2026-04-16T08:00:00', 'NYC Metro', 180.0),
(4, 3, 3, '2026-04-16T10:00:00', 'Regional Route', 350.0),
(5, 2, 2, '2026-04-17T09:00:00', 'Boston Express', 210.0);

-- Delivery Trip Lines
INSERT INTO DELIVARY_TRIP_LINE (TRIP_ID, ORDER_LINE_ID, TRIPID, RESTAURANTID, ORDERID, ORDERLINEID, STOP_SEQUENCE, ACTUAL_DELIVERY_TIME) VALUES
(1, 1, 1, 1, 1, 1, 1, '2026-04-15T10:30:00'),
(1, 2, 1, 1, 1, 2, 2, '2026-04-15T11:45:00'),
(2, 1, 2, 2, 1, 1, 1, '2026-04-15T12:30:00'),
(3, 1, 3, 1, 2, 1, 1, '2026-04-16T09:15:00'),
(4, 1, 4, 3, 1, 1, 1, '2026-04-16T11:00:00'),
(4, 2, 4, 4, 1, 1, 2, '2026-04-16T12:30:00'),
(5, 1, 5, 2, 2, 1, 1, '2026-04-17T10:00:00'),
(5, 2, 5, 5, 1, 1, 2, '2026-04-17T11:30:00');

GO

PRINT 'Tables cleaned and sample data inserted successfully!';
