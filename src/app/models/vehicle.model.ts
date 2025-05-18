export interface Vehicle {
  id: number;
  model: string;
  year: number;
  price: number;
  connected: number;
  software_updated: number;
  image_url: string; 
  total_sales: number;
}
  
 export interface VehicleData {
  vin: string;
  odometer: number;
  tire_pressure: string;
  status: string;
  battery_status: string;
  fuel_level: number;  
  lat: number;
lng: number;      
  vehicle_id?: number;
}