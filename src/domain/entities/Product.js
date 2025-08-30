class Product {
  constructor({ id, name, description, price, category, stock, createdBy, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.stock = stock;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isInStock() {
    return this.stock > 0;
  }

  decreaseStock(quantity) {
    if (this.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }

  increaseStock(quantity) {
    this.stock += quantity;
  }
}

module.exports = Product;