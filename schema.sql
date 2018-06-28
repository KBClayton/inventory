DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(300) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  stock_quantity INT NOT NULL,
  price float(10) NOT NULL,
  product_sales float(10) NOT NULL DEFAULT 0,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs float(10) NOT NULL,
  PRIMARY KEY (department_id)
);
