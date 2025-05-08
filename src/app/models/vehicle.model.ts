export interface Vehicle {
    id: number;
    model: string;
    year: number;
    price: number;
    connected: number;
    softwareUpdated: number;
    imageUrl: string;
    totalSales:number
  }
  
  export interface VehicleData {
    vin: string;
    odometer: number;
    tirePressure: string;
    status: string;
    batteryStatus: string;
    fuelLevel: number;
    lat: number;
    long: number;
  }