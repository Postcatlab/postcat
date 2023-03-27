import { ApiData } from 'pc/browser/src/app/services/storage/db/dto/apiData.dto';

/**
 * Group list api data
 */
export interface ApiDataFromList extends ApiData {
  requestMethod?: number;
}
