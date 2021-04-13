const express = require('express')
const Products = require('../models/product')

exports.index = async (req, res, next) => {
  const products = await Products.find()
  res.status(200).json({ message: products })
}

exports.findOne = async (req, res, next) => {
  const { id } = req.params
  const product = await Products.findById(id)
  res.status(200).json({ products: product })
}

exports.create = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body

    if (!req.file) {
      // const productImage = 'No Image'
      return 'No Image'
    }

    const productImage = req.file.filename
    const products = new Products({
      name,
      description,
      price,
      photo: productImage,
      category,
    })
    await products.save()
    res.status(201).json({ products: products })
  } catch (error) {
    console.log(error.message)
  }
}

exports.update = async (req, res, next) => {
  const { id } = req.params

  const { name, description, price, category } = req.body

  if (req.file) {
    var productImage = req.file.filename
  } else {
    var productImage = 'No Image'
  }

  const product = await Products.findByIdAndUpdate(
    { _id: id },
    {
      name: name,
      description: description,
      price: price,
      category: category,
      photo: productImage,
    }
  )
  res.status(200).json({ products: product })
}

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Products.findByIdAndDelete(id)

    res.status(204)
  } catch (error) {
    console.log(error)
  }
}
