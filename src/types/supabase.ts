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
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          plan: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string
          plan: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          owner_id: string
          plan?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          owner_id?: string
          plan?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
        }
      }
      solutions: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string | null
          category: string
          status: 'draft' | 'published' | 'archived'
          content: Json
          metadata: Json
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          title: string
          description?: string | null
          category: string
          status?: 'draft' | 'published' | 'archived'
          content?: Json
          metadata?: Json
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          description?: string | null
          category?: string
          status?: 'draft' | 'published' | 'archived'
          content?: Json
          metadata?: Json
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      contrato_locacao: {
        Row: {
          id: number
          imovel_id: number
          locatario_id: number
          tipo_locacao_id: number
          valor: number
          caucao: number | null
          valor_iptu: number | null
          valor_condominio: number | null
          data_inicio_contrato: string
          data_fim_contrato: string
          dia_vencimento: number
          indice_reajuste: string
          periodicidade_reajuste: number
          observacoes: string | null
          clausulas_especiais: string | null
          status: string
          contrato_assinado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          imovel_id: number
          locatario_id: number
          tipo_locacao_id: number
          valor: number
          caucao?: number | null
          valor_iptu?: number | null
          valor_condominio?: number | null
          data_inicio_contrato: string
          data_fim_contrato: string
          dia_vencimento: number
          indice_reajuste?: string
          periodicidade_reajuste?: number
          observacoes?: string | null
          clausulas_especiais?: string | null
          status?: string
          contrato_assinado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          imovel_id?: number
          locatario_id?: number
          tipo_locacao_id?: number
          valor?: number
          caucao?: number | null
          valor_iptu?: number | null
          valor_condominio?: number | null
          data_inicio_contrato?: string
          data_fim_contrato?: string
          dia_vencimento?: number
          indice_reajuste?: string
          periodicidade_reajuste?: number
          observacoes?: string | null
          clausulas_especiais?: string | null
          status?: string
          contrato_assinado?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      imovel: {
        Row: {
          id: number
          codigo_imovel: string
          disponivel: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          codigo_imovel: string
          disponivel?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          codigo_imovel?: string
          disponivel?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      locatario: {
        Row: {
          id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
        }
      }
      tipo_locacao: {
        Row: {
          id: number
          descricao: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          descricao: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          descricao?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
