export enum UserActionTypes {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAILURE = 'REGISTER_FAILURE',
  }
  
  // Definición del tipo de estado del usuario
  export interface UserState {
    userData: UserData | null; 
    loading: boolean; 
    error: string | null; 
  }
  
  // Definición de la estructura de los datos del usuario
  export interface UserData {
    id: string;
    username: string;
    email: string;
  }
  export interface Status {
    id: number;
    name: string;
    description: string;
  }
  export interface Branch {
    branch_id: number;
    name: string;
    address: string;
    description: string;
    status: {
      name: string;
    };
    image_url: string;
  }

  export interface BranchUpload {
    partner_id?: number;
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    description: string;
    status_id?: number;
    image_url?: string;
    image_data?: string | null;
  }

  export interface TouristPointComment {
    id: number;
    tourist_point_id:number;
    tourist_id:number;
    tourist_first_name: string;
    tourist_image_url: string;
    rating: number;
    comment: string;
    created_at: string;
    deleted_at: string | null;
    status: {
      id:number;
      name: string;
    };
  }

  export interface TouristPointCommentId {
    ratings: TouristPointComment | [];
    average_rating: number
  }

  export interface BranchComment {
    id: number;
    branch_id:number;
    user_id: number;
    first_name: string;
    rating: number;
    comment: string;
    created_at: string;
    status: {
      id:number;
      name: string;
    };
    deleted_at: string | null;
  }
  export interface BranchCommentId {
    ratings: BranchComment | [];
    average_rating: number
  }

  export interface TouristComment {
    
    id: number;
    branch_id:number;
    tourist_id: number;
    rating: number;
    comment: string;
    created_at: string;
    status: {
      id:number;
      name: string;
    }| null;
    deleted_at: string | null;
  }

  export interface TouristCommentId {
    ratings: TouristComment | [];
    average_rating: number
  }