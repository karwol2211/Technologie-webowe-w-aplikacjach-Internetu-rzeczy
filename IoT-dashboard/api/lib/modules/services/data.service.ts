import DataModel from '../schemas/data.schema';


export default class DataService {


   public async getAll() {
       try {
           const data = await DataModel.find();
           return data;
       } catch (error) {
           throw new Error(`Query failed: ${error}`);
       }
   }
}
