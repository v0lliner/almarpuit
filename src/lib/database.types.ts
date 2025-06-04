export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sections: {
        Row: {
          id: string
          key: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          key: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      translations: {
        Row: {
          id: string
          section_id: string | null
          key: string
          et: string | null
          en: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          section_id?: string | null
          key: string
          et?: string | null
          en?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          section_id?: string | null
          key?: string
          et?: string | null
          en?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      images: {
        Row: {
          id: string
          section_id: string | null
          key: string
          url: string
          alt_text: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          section_id?: string | null
          key: string
          url: string
          alt_text?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          section_id?: string | null
          key?: string
          url?: string
          alt_text?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          key: string
          value: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}