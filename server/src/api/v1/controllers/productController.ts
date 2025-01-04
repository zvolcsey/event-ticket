import { Request, Response, NextFunction } from "express";
import type { Product } from "@shared/types";

const productExamples: Product[] = [
  { id: '1', name: 'Product 1', price: 10, description: 'Product description 1', image: 'product1.jpg' },
  { id: '2', name: 'Product 2', price: 20,  description: 'Product description 2', image: 'product2.jpg' },
]

export const getProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<Product[]> | void> => {
  try {
    res.status(200).json(productExamples);
    return;
  } catch (error) {
    next(error);
  }
}