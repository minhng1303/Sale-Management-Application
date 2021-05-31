export interface Drink {
    name?: string,
    price?: number,
    category?: string,
    url?: string,
    description?: string,
    ingredients?: [{
      name:string,
      quantity: number  
    }]
}