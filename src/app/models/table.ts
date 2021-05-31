import { Client } from "./client";

export interface Table {
    number: string,
    client: Client,
    orderList: any,
    point: number,
    pointUsed: number,
    total: number
}