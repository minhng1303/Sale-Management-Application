

export interface Order {
    date: Date,
    client?: any,
    table: string,
    totalSpent: number,
    pointUsed?: number,
    cash?: number,
    savedPoint?: number,
    drinks: any
}