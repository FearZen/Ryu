export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface CraftingItem {
  id: string
  name: string
  description: string | null
  category: string
  base_price: number | null
  image_url: string | null
  created_at: string
}

export interface AcquisitionData {
  method: 'job' | 'crafting' | 'gathering';
  job_name?: string;
  tools?: string[];
  location_name?: string;
  steps?: string[];
  sub_ingredients?: { name: string; count: number }[];
  yield?: number;
}

export interface Material {
  id: string
  crafting_item_id: string
  name: string
  quantity_per_item: number
  tutorial: string | null
  image_url: string | null
  location_image_url: string | null
  created_at: string
  acquisition_data: AcquisitionData | null
}

export interface MapLocation {
  id: string
  name: string
  description: string | null
  x_position: number
  y_position: number
  image_url: string | null
  type: 'general' | 'base' | 'gathering' | 'storage' | 'work' | 'hospital' | 'police'
  created_at: string
}

export interface GalleryItem {
  id: string
  title: string | null
  description: string | null
  image_urls: string[]
  created_at: string
}

export interface Announcement {
  content: string
  is_active: boolean
  created_at: string
}

export interface TreasuryItem {
  id: string
  name: string
  description: string | null
  category: string
  image_url: string | null
  image_urls?: string[] // Optional for now as we migrate
  stock: number
  created_at: string
}

export interface TreasuryTransaction {
  id: string
  item_id: string
  user_id: string
  type: 'DEPOSIT' | 'WITHDRAW'
  quantity: number
  proof_image_url: string | null
  proof_image_urls?: string[]
  notes: string | null
  created_at: string
  // Joins
  treasury_items?: TreasuryItem
  profiles?: Profile
}

export interface Profile {
  id: string
  username: string | null
  bio?: string | null
  hierarchy_rank?: string // 'Member', 'Vice', 'OG', 'The Boss' etc
  role: 'admin' | 'treasurer' | 'member'
  avatar_url: string | null
  updated_at: string | null
}
