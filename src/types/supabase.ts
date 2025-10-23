export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      arquivo_anexo: {
        Row: {
          contrato_id: number | null
          criado_em: string
          descricao: string | null
          documento_id: number | null
          fiador_id: number | null
          id: number
          locatario_id: number | null
          mime_type: string | null
          nome_arquivo: string
          observacoes_validacao: string | null
          storage_path: string
          tamanho_bytes: number | null
          tipo_arquivo: string
          uploadado_em: string
          uploadado_por: string | null
          url_publica: string | null
          validado: boolean | null
          validado_em: string | null
          validado_por: string | null
        }
        Insert: {
          contrato_id?: number | null
          criado_em?: string
          descricao?: string | null
          documento_id?: number | null
          fiador_id?: number | null
          id?: number
          locatario_id?: number | null
          mime_type?: string | null
          nome_arquivo: string
          observacoes_validacao?: string | null
          storage_path: string
          tamanho_bytes?: number | null
          tipo_arquivo: string
          uploadado_em?: string
          uploadado_por?: string | null
          url_publica?: string | null
          validado?: boolean | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Update: {
          contrato_id?: number | null
          criado_em?: string
          descricao?: string | null
          documento_id?: number | null
          fiador_id?: number | null
          id?: number
          locatario_id?: number | null
          mime_type?: string | null
          nome_arquivo?: string
          observacoes_validacao?: string | null
          storage_path?: string
          tamanho_bytes?: number | null
          tipo_arquivo?: string
          uploadado_em?: string
          uploadado_por?: string | null
          url_publica?: string | null
          validado?: boolean | null
          validado_em?: string | null
          validado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arquivo_anexo_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivo_anexo_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivo_anexo_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivo_anexo_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documento_instancia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivo_anexo_fiador_id_fkey"
            columns: ["fiador_id"]
            isOneToOne: false
            referencedRelation: "fiador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivo_anexo_locatario_id_fkey"
            columns: ["locatario_id"]
            isOneToOne: false
            referencedRelation: "locatario"
            referencedColumns: ["id"]
          },
        ]
      }
      assinatura: {
        Row: {
          assinado_em: string | null
          atualizado_em: string
          certificado_digital: string | null
          cpf_signatario: string | null
          criado_em: string
          documento_id: number
          email_signatario: string
          id: number
          ip_assinatura: string | null
          lembrete_enviado_em: string | null
          motivo_recusa: string | null
          nome_signatario: string
          notificado_em: string | null
          ordem_assinatura: number
          pessoa_id: number | null
          recusado_em: string | null
          status: Database["public"]["Enums"]["assinatura_status_enum"]
          tipo_signatario: string
          token_assinatura: string | null
        }
        Insert: {
          assinado_em?: string | null
          atualizado_em?: string
          certificado_digital?: string | null
          cpf_signatario?: string | null
          criado_em?: string
          documento_id: number
          email_signatario: string
          id?: number
          ip_assinatura?: string | null
          lembrete_enviado_em?: string | null
          motivo_recusa?: string | null
          nome_signatario: string
          notificado_em?: string | null
          ordem_assinatura?: number
          pessoa_id?: number | null
          recusado_em?: string | null
          status?: Database["public"]["Enums"]["assinatura_status_enum"]
          tipo_signatario: string
          token_assinatura?: string | null
        }
        Update: {
          assinado_em?: string | null
          atualizado_em?: string
          certificado_digital?: string | null
          cpf_signatario?: string | null
          criado_em?: string
          documento_id?: number
          email_signatario?: string
          id?: number
          ip_assinatura?: string | null
          lembrete_enviado_em?: string | null
          motivo_recusa?: string | null
          nome_signatario?: string
          notificado_em?: string | null
          ordem_assinatura?: number
          pessoa_id?: number | null
          recusado_em?: string | null
          status?: Database["public"]["Enums"]["assinatura_status_enum"]
          tipo_signatario?: string
          token_assinatura?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinatura_documento_id_fkey"
            columns: ["documento_id"]
            isOneToOne: false
            referencedRelation: "documento_instancia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assinatura_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoa"
            referencedColumns: ["id"]
          },
        ]
      }
      chave_movimentacao: {
        Row: {
          assinatura_digital: string | null
          comprovante_storage_path: string | null
          condicao_chaves: string | null
          contrato_id: number
          criado_em: string
          data_movimentacao: string
          descricao_chaves: string | null
          id: number
          imovel_id: number
          numero_copia: number | null
          observacoes: string | null
          pessoa_cpf: string | null
          pessoa_nome: string
          pessoa_tipo: string | null
          quantidade_chaves: number
          responsavel_id: string | null
          tipo: Database["public"]["Enums"]["chave_movimentacao_tipo_enum"]
        }
        Insert: {
          assinatura_digital?: string | null
          comprovante_storage_path?: string | null
          condicao_chaves?: string | null
          contrato_id: number
          criado_em?: string
          data_movimentacao?: string
          descricao_chaves?: string | null
          id?: number
          imovel_id: number
          numero_copia?: number | null
          observacoes?: string | null
          pessoa_cpf?: string | null
          pessoa_nome: string
          pessoa_tipo?: string | null
          quantidade_chaves?: number
          responsavel_id?: string | null
          tipo: Database["public"]["Enums"]["chave_movimentacao_tipo_enum"]
        }
        Update: {
          assinatura_digital?: string | null
          comprovante_storage_path?: string | null
          condicao_chaves?: string | null
          contrato_id?: number
          criado_em?: string
          data_movimentacao?: string
          descricao_chaves?: string | null
          id?: number
          imovel_id?: number
          numero_copia?: number | null
          observacoes?: string | null
          pessoa_cpf?: string | null
          pessoa_nome?: string
          pessoa_tipo?: string | null
          quantidade_chaves?: number
          responsavel_id?: string | null
          tipo?: Database["public"]["Enums"]["chave_movimentacao_tipo_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "chave_movimentacao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chave_movimentacao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chave_movimentacao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chave_movimentacao_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imovel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chave_movimentacao_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "view_imoveis_completos"
            referencedColumns: ["id"]
          },
        ]
      }
      cobranca: {
        Row: {
          atualizado_em: string
          criado_em: string
          gateway: string
          id: number
          linha_digitavel: string | null
          nosso_numero: string | null
          parcela_id: number
          payload_webhook: Json | null
          qr_code: string | null
          qr_code_image_url: string | null
          status: Database["public"]["Enums"]["cobranca_status_enum"]
          txid: string | null
          url_boleto: string | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          gateway: string
          id?: number
          linha_digitavel?: string | null
          nosso_numero?: string | null
          parcela_id: number
          payload_webhook?: Json | null
          qr_code?: string | null
          qr_code_image_url?: string | null
          status?: Database["public"]["Enums"]["cobranca_status_enum"]
          txid?: string | null
          url_boleto?: string | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          gateway?: string
          id?: number
          linha_digitavel?: string | null
          nosso_numero?: string | null
          parcela_id?: number
          payload_webhook?: Json | null
          qr_code?: string | null
          qr_code_image_url?: string | null
          status?: Database["public"]["Enums"]["cobranca_status_enum"]
          txid?: string | null
          url_boleto?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobranca_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "parcela"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracao_regua_cobranca: {
        Row: {
          ativo: boolean | null
          atualizado_em: string
          criado_em: string
          descricao: string | null
          dia_aviso_atraso: number | null
          dia_juridico: number | null
          dia_lembrete: number | null
          dia_negociacao: number | null
          dia_primeiro_reaviso: number | null
          id: number
          nome: string
          percentual_juros_dia: number | null
          percentual_multa: number | null
          template_aviso_atraso: string | null
          template_lembrete: string | null
          template_negociacao: string | null
          template_reaviso: string | null
          usar_email: boolean | null
          usar_sms: boolean | null
          usar_whatsapp: boolean | null
        }
        Insert: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          dia_aviso_atraso?: number | null
          dia_juridico?: number | null
          dia_lembrete?: number | null
          dia_negociacao?: number | null
          dia_primeiro_reaviso?: number | null
          id?: number
          nome: string
          percentual_juros_dia?: number | null
          percentual_multa?: number | null
          template_aviso_atraso?: string | null
          template_lembrete?: string | null
          template_negociacao?: string | null
          template_reaviso?: string | null
          usar_email?: boolean | null
          usar_sms?: boolean | null
          usar_whatsapp?: boolean | null
        }
        Update: {
          ativo?: boolean | null
          atualizado_em?: string
          criado_em?: string
          descricao?: string | null
          dia_aviso_atraso?: number | null
          dia_juridico?: number | null
          dia_lembrete?: number | null
          dia_negociacao?: number | null
          dia_primeiro_reaviso?: number | null
          id?: number
          nome?: string
          percentual_juros_dia?: number | null
          percentual_multa?: number | null
          template_aviso_atraso?: string | null
          template_lembrete?: string | null
          template_negociacao?: string | null
          template_reaviso?: string | null
          usar_email?: boolean | null
          usar_sms?: boolean | null
          usar_whatsapp?: boolean | null
        }
        Relationships: []
      }
      contrato_locacao: {
        Row: {
          arquivo_contrato_url: string | null
          atualizado_em: string
          caucao: number | null
          clausulas_especiais: string | null
          contrato_assinado: boolean | null
          criado_em: string
          data_assinatura: string | null
          data_fim_contrato: string
          data_inicio_contrato: string
          data_ultimo_reajuste: string | null
          data_vencimento_aluguel: number
          deleted_at: string | null
          dia_vencimento: number
          fiador_id: number | null
          id: number
          imovel_id: number
          indice_reajuste: string | null
          locatario_id: number
          numero_contrato: string | null
          observacoes: string | null
          periodicidade_reajuste: number | null
          status: Database["public"]["Enums"]["status_contrato"]
          tipo_locacao_id: number
          valor: number
          valor_condominio: number | null
          valor_iptu: number | null
        }
        Insert: {
          arquivo_contrato_url?: string | null
          atualizado_em?: string
          caucao?: number | null
          clausulas_especiais?: string | null
          contrato_assinado?: boolean | null
          criado_em?: string
          data_assinatura?: string | null
          data_fim_contrato: string
          data_inicio_contrato: string
          data_ultimo_reajuste?: string | null
          data_vencimento_aluguel?: number
          deleted_at?: string | null
          dia_vencimento?: number
          fiador_id?: number | null
          id?: number
          imovel_id: number
          indice_reajuste?: string | null
          locatario_id: number
          numero_contrato?: string | null
          observacoes?: string | null
          periodicidade_reajuste?: number | null
          status?: Database["public"]["Enums"]["status_contrato"]
          tipo_locacao_id: number
          valor: number
          valor_condominio?: number | null
          valor_iptu?: number | null
        }
        Update: {
          arquivo_contrato_url?: string | null
          atualizado_em?: string
          caucao?: number | null
          clausulas_especiais?: string | null
          contrato_assinado?: boolean | null
          criado_em?: string
          data_assinatura?: string | null
          data_fim_contrato?: string
          data_inicio_contrato?: string
          data_ultimo_reajuste?: string | null
          data_vencimento_aluguel?: number
          deleted_at?: string | null
          dia_vencimento?: number
          fiador_id?: number | null
          id?: number
          imovel_id?: number
          indice_reajuste?: string | null
          locatario_id?: number
          numero_contrato?: string | null
          observacoes?: string | null
          periodicidade_reajuste?: number | null
          status?: Database["public"]["Enums"]["status_contrato"]
          tipo_locacao_id?: number
          valor?: number
          valor_condominio?: number | null
          valor_iptu?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contrato_fiador"
            columns: ["fiador_id"]
            isOneToOne: false
            referencedRelation: "fiador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contrato_imovel"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imovel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contrato_imovel"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "view_imoveis_completos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contrato_locatario"
            columns: ["locatario_id"]
            isOneToOne: false
            referencedRelation: "locatario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_contrato_tipo_locacao"
            columns: ["tipo_locacao_id"]
            isOneToOne: false
            referencedRelation: "tipo_locacao"
            referencedColumns: ["id"]
          },
        ]
      }
      documento_instancia: {
        Row: {
          assinado_em: string | null
          assinatura_provider: string | null
          assinatura_provider_id: string | null
          atualizado_em: string
          cancelado_em: string | null
          cancelado_por: string | null
          conteudo_html: string | null
          contrato_id: number | null
          criado_em: string
          dados_documento: Json
          data_limite_assinatura: string | null
          enviado_em: string | null
          fiador_id: number | null
          gerado_em: string | null
          gerado_por: string | null
          id: number
          imovel_id: number | null
          locatario_id: number | null
          modelo_id: number
          motivo_cancelamento: string | null
          numero_documento: string
          observacoes: string | null
          parcela_id: number | null
          pdf_storage_path: string | null
          pdf_url: string | null
          prazo_assinatura_dias: number | null
          requer_assinatura: boolean
          status: Database["public"]["Enums"]["documento_status_enum"]
          tipo: Database["public"]["Enums"]["documento_tipo_enum"]
        }
        Insert: {
          assinado_em?: string | null
          assinatura_provider?: string | null
          assinatura_provider_id?: string | null
          atualizado_em?: string
          cancelado_em?: string | null
          cancelado_por?: string | null
          conteudo_html?: string | null
          contrato_id?: number | null
          criado_em?: string
          dados_documento?: Json
          data_limite_assinatura?: string | null
          enviado_em?: string | null
          fiador_id?: number | null
          gerado_em?: string | null
          gerado_por?: string | null
          id?: number
          imovel_id?: number | null
          locatario_id?: number | null
          modelo_id: number
          motivo_cancelamento?: string | null
          numero_documento: string
          observacoes?: string | null
          parcela_id?: number | null
          pdf_storage_path?: string | null
          pdf_url?: string | null
          prazo_assinatura_dias?: number | null
          requer_assinatura?: boolean
          status?: Database["public"]["Enums"]["documento_status_enum"]
          tipo: Database["public"]["Enums"]["documento_tipo_enum"]
        }
        Update: {
          assinado_em?: string | null
          assinatura_provider?: string | null
          assinatura_provider_id?: string | null
          atualizado_em?: string
          cancelado_em?: string | null
          cancelado_por?: string | null
          conteudo_html?: string | null
          contrato_id?: number | null
          criado_em?: string
          dados_documento?: Json
          data_limite_assinatura?: string | null
          enviado_em?: string | null
          fiador_id?: number | null
          gerado_em?: string | null
          gerado_por?: string | null
          id?: number
          imovel_id?: number | null
          locatario_id?: number | null
          modelo_id?: number
          motivo_cancelamento?: string | null
          numero_documento?: string
          observacoes?: string | null
          parcela_id?: number | null
          pdf_storage_path?: string | null
          pdf_url?: string | null
          prazo_assinatura_dias?: number | null
          requer_assinatura?: boolean
          status?: Database["public"]["Enums"]["documento_status_enum"]
          tipo?: Database["public"]["Enums"]["documento_tipo_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "documento_instancia_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_fiador_id_fkey"
            columns: ["fiador_id"]
            isOneToOne: false
            referencedRelation: "fiador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imovel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "view_imoveis_completos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_locatario_id_fkey"
            columns: ["locatario_id"]
            isOneToOne: false
            referencedRelation: "locatario"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "documento_modelo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documento_instancia_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "parcela"
            referencedColumns: ["id"]
          },
        ]
      }
      documento_modelo: {
        Row: {
          ativo: boolean
          atualizado_em: string
          criado_em: string
          criado_por: string | null
          data_vigencia_fim: string | null
          data_vigencia_inicio: string
          descricao: string | null
          id: number
          nome: string
          template: string
          tipo: Database["public"]["Enums"]["documento_tipo_enum"]
          variaveis_esperadas: Json | null
          versao: number
        }
        Insert: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_vigencia_fim?: string | null
          data_vigencia_inicio?: string
          descricao?: string | null
          id?: number
          nome: string
          template: string
          tipo: Database["public"]["Enums"]["documento_tipo_enum"]
          variaveis_esperadas?: Json | null
          versao?: number
        }
        Update: {
          ativo?: boolean
          atualizado_em?: string
          criado_em?: string
          criado_por?: string | null
          data_vigencia_fim?: string | null
          data_vigencia_inicio?: string
          descricao?: string | null
          id?: number
          nome?: string
          template?: string
          tipo?: Database["public"]["Enums"]["documento_tipo_enum"]
          variaveis_esperadas?: Json | null
          versao?: number
        }
        Relationships: []
      }
      empresa_cliente: {
        Row: {
          cnpj: string | null
          contato_principal: string | null
          created_at: string
          deleted_at: string | null
          descricao: string
          email: string | null
          endereco_id: number
          id: number
          imovel_id: number | null
          inscricao_estadual: string | null
          inscricao_municipal: string | null
          nome_fantasia: string | null
          observacoes: string | null
          razao_social: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          contato_principal?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao: string
          email?: string | null
          endereco_id: number
          id?: number
          imovel_id?: number | null
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          observacoes?: string | null
          razao_social?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          contato_principal?: string | null
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          email?: string | null
          endereco_id?: number
          id?: number
          imovel_id?: number | null
          inscricao_estadual?: string | null
          inscricao_municipal?: string | null
          nome_fantasia?: string | null
          observacoes?: string | null
          razao_social?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_empresa_cliente_endereco"
            columns: ["endereco_id"]
            isOneToOne: false
            referencedRelation: "endereco"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_empresa_cliente_imovel"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imovel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_empresa_cliente_imovel"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "view_imoveis_completos"
            referencedColumns: ["id"]
          },
        ]
      }
      endereco: {
        Row: {
          bairro: string
          cep: string
          cidade: string
          complemento: string | null
          created_at: string
          deleted_at: string | null
          id: number
          logradouro: string
          numero: string
          pais: string
          uf: string
          updated_at: string
        }
        Insert: {
          bairro: string
          cep: string
          cidade?: string
          complemento?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          logradouro: string
          numero: string
          pais?: string
          uf?: string
          updated_at?: string
        }
        Update: {
          bairro?: string
          cep?: string
          cidade?: string
          complemento?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          logradouro?: string
          numero?: string
          pais?: string
          uf?: string
          updated_at?: string
        }
        Relationships: []
      }
      fiador: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          observacoes: string | null
          patrimonio_estimado: number | null
          pessoa_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          observacoes?: string | null
          patrimonio_estimado?: number | null
          pessoa_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          observacoes?: string | null
          patrimonio_estimado?: number | null
          pessoa_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_fiador_pessoa"
            columns: ["pessoa_id"]
            isOneToOne: true
            referencedRelation: "pessoa"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_reajuste: {
        Row: {
          contrato_locacao_id: number
          created_at: string
          data_reajuste: string
          id: number
          indice_utilizado: string
          observacoes: string | null
          percentual_reajuste: number
          valor_anterior: number
          valor_novo: number
        }
        Insert: {
          contrato_locacao_id: number
          created_at?: string
          data_reajuste: string
          id?: number
          indice_utilizado: string
          observacoes?: string | null
          percentual_reajuste: number
          valor_anterior: number
          valor_novo: number
        }
        Update: {
          contrato_locacao_id?: number
          created_at?: string
          data_reajuste?: string
          id?: number
          indice_utilizado?: string
          observacoes?: string | null
          percentual_reajuste?: number
          valor_anterior?: number
          valor_novo?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_historico_reajuste_contrato"
            columns: ["contrato_locacao_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_historico_reajuste_contrato"
            columns: ["contrato_locacao_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_historico_reajuste_contrato"
            columns: ["contrato_locacao_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
        ]
      }
      imovel: {
        Row: {
          area_construida: number | null
          area_total: number | null
          banheiros: number | null
          codigo_imovel: string | null
          created_at: string
          data_disponibilidade: string | null
          deleted_at: string | null
          descricao: string | null
          disponivel: boolean
          endereco_id: number
          id: number
          iptu: number | null
          locador_id: number
          observacoes: string | null
          quartos: number | null
          tipo_imovel_id: number
          updated_at: string
          vagas_garagem: number | null
          valor_aluguel: number
          valor_condominio: number | null
        }
        Insert: {
          area_construida?: number | null
          area_total?: number | null
          banheiros?: number | null
          codigo_imovel?: string | null
          created_at?: string
          data_disponibilidade?: string | null
          deleted_at?: string | null
          descricao?: string | null
          disponivel?: boolean
          endereco_id: number
          id?: number
          iptu?: number | null
          locador_id: number
          observacoes?: string | null
          quartos?: number | null
          tipo_imovel_id: number
          updated_at?: string
          vagas_garagem?: number | null
          valor_aluguel: number
          valor_condominio?: number | null
        }
        Update: {
          area_construida?: number | null
          area_total?: number | null
          banheiros?: number | null
          codigo_imovel?: string | null
          created_at?: string
          data_disponibilidade?: string | null
          deleted_at?: string | null
          descricao?: string | null
          disponivel?: boolean
          endereco_id?: number
          id?: number
          iptu?: number | null
          locador_id?: number
          observacoes?: string | null
          quartos?: number | null
          tipo_imovel_id?: number
          updated_at?: string
          vagas_garagem?: number | null
          valor_aluguel?: number
          valor_condominio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_imovel_endereco"
            columns: ["endereco_id"]
            isOneToOne: false
            referencedRelation: "endereco"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_imovel_locador"
            columns: ["locador_id"]
            isOneToOne: false
            referencedRelation: "locador"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_imovel_locador"
            columns: ["locador_id"]
            isOneToOne: false
            referencedRelation: "view_imoveis_completos"
            referencedColumns: ["locador_id"]
          },
          {
            foreignKeyName: "fk_imovel_tipo_imovel"
            columns: ["tipo_imovel_id"]
            isOneToOne: false
            referencedRelation: "tipo_imovel"
            referencedColumns: ["id"]
          },
        ]
      }
      locador: {
        Row: {
          cnpj: string | null
          created_at: string
          deleted_at: string | null
          id: number
          pessoa_id: number
          razao_social: string | null
          tipo_pessoa: string
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          pessoa_id: number
          razao_social?: string | null
          tipo_pessoa?: string
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          pessoa_id?: number
          razao_social?: string | null
          tipo_pessoa?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_locador_pessoa"
            columns: ["pessoa_id"]
            isOneToOne: true
            referencedRelation: "pessoa"
            referencedColumns: ["id"]
          },
        ]
      }
      locatario: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: number
          pessoa_id: number
          referencias: string | null
          renda_mensal: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          pessoa_id: number
          referencias?: string | null
          renda_mensal?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: number
          pessoa_id?: number
          referencias?: string | null
          renda_mensal?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_locatario_pessoa"
            columns: ["pessoa_id"]
            isOneToOne: true
            referencedRelation: "pessoa"
            referencedColumns: ["id"]
          },
        ]
      }
      notificacao: {
        Row: {
          agendado_para: string | null
          assunto: string | null
          canal: Database["public"]["Enums"]["notificacao_canal_enum"]
          contrato_id: number | null
          criado_em: string
          documento_id: number | null
          entregue_em: string | null
          enviado_em: string | null
          erro_mensagem: string | null
          id: number
          lido_em: string | null
          mensagem: string
          parcela_id: number | null
          payload: Json | null
          pessoa_id: number | null
          status: string | null
          template: string | null
          tentativas: number | null
        }
        Insert: {
          agendado_para?: string | null
          assunto?: string | null
          canal: Database["public"]["Enums"]["notificacao_canal_enum"]
          contrato_id?: number | null
          criado_em?: string
          documento_id?: number | null
          entregue_em?: string | null
          enviado_em?: string | null
          erro_mensagem?: string | null
          id?: number
          lido_em?: string | null
          mensagem: string
          parcela_id?: number | null
          payload?: Json | null
          pessoa_id?: number | null
          status?: string | null
          template?: string | null
          tentativas?: number | null
        }
        Update: {
          agendado_para?: string | null
          assunto?: string | null
          canal?: Database["public"]["Enums"]["notificacao_canal_enum"]
          contrato_id?: number | null
          criado_em?: string
          documento_id?: number | null
          entregue_em?: string | null
          enviado_em?: string | null
          erro_mensagem?: string | null
          id?: number
          lido_em?: string | null
          mensagem?: string
          parcela_id?: number | null
          payload?: Json | null
          pessoa_id?: number | null
          status?: string | null
          template?: string | null
          tentativas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notificacao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacao_parcela_id_fkey"
            columns: ["parcela_id"]
            isOneToOne: false
            referencedRelation: "parcela"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notificacao_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoa"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          plan: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          plan?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          plan?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parcela: {
        Row: {
          atualizado_em: string
          competencia: string
          contrato_id: number
          criado_em: string
          data_pagamento: string | null
          desconto: number | null
          id: number
          juros: number | null
          multa: number | null
          observacoes: string | null
          principal: number
          status: Database["public"]["Enums"]["parcela_status_enum"]
          valor_pago: number | null
          vencimento: string
        }
        Insert: {
          atualizado_em?: string
          competencia: string
          contrato_id: number
          criado_em?: string
          data_pagamento?: string | null
          desconto?: number | null
          id?: number
          juros?: number | null
          multa?: number | null
          observacoes?: string | null
          principal: number
          status?: Database["public"]["Enums"]["parcela_status_enum"]
          valor_pago?: number | null
          vencimento: string
        }
        Update: {
          atualizado_em?: string
          competencia?: string
          contrato_id?: number
          criado_em?: string
          data_pagamento?: string | null
          desconto?: number | null
          id?: number
          juros?: number | null
          multa?: number | null
          observacoes?: string | null
          principal?: number
          status?: Database["public"]["Enums"]["parcela_status_enum"]
          valor_pago?: number | null
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcela_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcela_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcela_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
        ]
      }
      pendencia: {
        Row: {
          atualizado_em: string
          comprovante_storage_path: string | null
          contrato_id: number | null
          criado_em: string
          data_limite: string | null
          data_resolucao: string | null
          descricao: string
          id: number
          imovel_id: number | null
          prioridade: number
          rescisao_id: number | null
          responsavel_id: string | null
          solucao: string | null
          status: Database["public"]["Enums"]["pendencia_status_enum"]
          tipo: Database["public"]["Enums"]["pendencia_tipo_enum"]
          titulo: string
          valor_estimado: number | null
          valor_real: number | null
          vistoria_id: number | null
        }
        Insert: {
          atualizado_em?: string
          comprovante_storage_path?: string | null
          contrato_id?: number | null
          criado_em?: string
          data_limite?: string | null
          data_resolucao?: string | null
          descricao: string
          id?: number
          imovel_id?: number | null
          prioridade?: number
          rescisao_id?: number | null
          responsavel_id?: string | null
          solucao?: string | null
          status?: Database["public"]["Enums"]["pendencia_status_enum"]
          tipo: Database["public"]["Enums"]["pendencia_tipo_enum"]
          titulo: string
          valor_estimado?: number | null
          valor_real?: number | null
          vistoria_id?: number | null
        }
        Update: {
          atualizado_em?: string
          comprovante_storage_path?: string | null
          contrato_id?: number | null
          criado_em?: string
          data_limite?: string | null
          data_resolucao?: string | null
          descricao?: string
          id?: number
          imovel_id?: number | null
          prioridade?: number
          rescisao_id?: number | null
          responsavel_id?: string | null
          solucao?: string | null
          status?: Database["public"]["Enums"]["pendencia_status_enum"]
          tipo?: Database["public"]["Enums"]["pendencia_tipo_enum"]
          titulo?: string
          valor_estimado?: number | null
          valor_real?: number | null
          vistoria_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pendencia_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendencia_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendencia_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendencia_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imovel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendencia_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "view_imoveis_completos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendencia_rescisao_id_fkey"
            columns: ["rescisao_id"]
            isOneToOne: false
            referencedRelation: "rescisao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pendencia_vistoria_id_fkey"
            columns: ["vistoria_id"]
            isOneToOne: false
            referencedRelation: "vistoria"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoa: {
        Row: {
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          data_registro: string
          deleted_at: string | null
          email: string | null
          endereco_id: number | null
          id: number
          nome: string
          observacoes: string | null
          profissao_id: number | null
          rg: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_registro?: string
          deleted_at?: string | null
          email?: string | null
          endereco_id?: number | null
          id?: number
          nome: string
          observacoes?: string | null
          profissao_id?: number | null
          rg?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          data_registro?: string
          deleted_at?: string | null
          email?: string | null
          endereco_id?: number | null
          id?: number
          nome?: string
          observacoes?: string | null
          profissao_id?: number | null
          rg?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_pessoa_endereco"
            columns: ["endereco_id"]
            isOneToOne: false
            referencedRelation: "endereco"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pessoa_profissao"
            columns: ["profissao_id"]
            isOneToOne: false
            referencedRelation: "profissao"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string
          plan: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name: string
          plan?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profissao: {
        Row: {
          created_at: string
          deleted_at: string | null
          descricao: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          descricao: string
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      rescisao: {
        Row: {
          atualizado_em: string
          chaves_devolvidas: boolean | null
          concluido_em: string | null
          contrato_id: number
          criado_em: string
          data_desejada_saida: string
          data_devolucao_chaves: string | null
          data_efetiva_saida: string | null
          data_solicitacao: string
          id: number
          motivo: string
          multa_paga: boolean | null
          observacoes: string | null
          pendencias_resolvidas: boolean | null
          responsavel_id: string | null
          solicitado_por: string
          status: Database["public"]["Enums"]["rescisao_status_enum"]
          tem_multa: boolean
          tem_pendencias: boolean | null
          termo_rescisao_id: number | null
          tipo: Database["public"]["Enums"]["rescisao_tipo_enum"]
          valor_multa: number | null
          vistoria_aprovada: boolean | null
          vistoria_saida_id: number | null
        }
        Insert: {
          atualizado_em?: string
          chaves_devolvidas?: boolean | null
          concluido_em?: string | null
          contrato_id: number
          criado_em?: string
          data_desejada_saida: string
          data_devolucao_chaves?: string | null
          data_efetiva_saida?: string | null
          data_solicitacao?: string
          id?: number
          motivo: string
          multa_paga?: boolean | null
          observacoes?: string | null
          pendencias_resolvidas?: boolean | null
          responsavel_id?: string | null
          solicitado_por: string
          status?: Database["public"]["Enums"]["rescisao_status_enum"]
          tem_multa?: boolean
          tem_pendencias?: boolean | null
          termo_rescisao_id?: number | null
          tipo: Database["public"]["Enums"]["rescisao_tipo_enum"]
          valor_multa?: number | null
          vistoria_aprovada?: boolean | null
          vistoria_saida_id?: number | null
        }
        Update: {
          atualizado_em?: string
          chaves_devolvidas?: boolean | null
          concluido_em?: string | null
          contrato_id?: number
          criado_em?: string
          data_desejada_saida?: string
          data_devolucao_chaves?: string | null
          data_efetiva_saida?: string | null
          data_solicitacao?: string
          id?: number
          motivo?: string
          multa_paga?: boolean | null
          observacoes?: string | null
          pendencias_resolvidas?: boolean | null
          responsavel_id?: string | null
          solicitado_por?: string
          status?: Database["public"]["Enums"]["rescisao_status_enum"]
          tem_multa?: boolean
          tem_pendencias?: boolean | null
          termo_rescisao_id?: number | null
          tipo?: Database["public"]["Enums"]["rescisao_tipo_enum"]
          valor_multa?: number | null
          vistoria_aprovada?: boolean | null
          vistoria_saida_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rescisao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rescisao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rescisao_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rescisao_termo_rescisao_id_fkey"
            columns: ["termo_rescisao_id"]
            isOneToOne: false
            referencedRelation: "documento_instancia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rescisao_vistoria_saida_id_fkey"
            columns: ["vistoria_saida_id"]
            isOneToOne: false
            referencedRelation: "vistoria"
            referencedColumns: ["id"]
          },
        ]
      }
      solution_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_data: Json
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_data: Json
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "solution_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solutions: {
        Row: {
          category: string
          content: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solutions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solutions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tipo_imovel: {
        Row: {
          created_at: string
          deleted_at: string | null
          descricao: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          descricao: string
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      tipo_locacao: {
        Row: {
          created_at: string
          deleted_at: string | null
          descricao: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          descricao: string
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      vistoria: {
        Row: {
          aprovada: boolean | null
          atualizado_em: string
          checklist: Json | null
          contrato_id: number
          criado_em: string
          data_agendada: string
          data_realizada: string | null
          fotos: Json | null
          id: number
          imovel_id: number
          locador_presente: boolean | null
          locatario_presente: boolean | null
          motivo_reprovacao: string | null
          observacoes_gerais: string | null
          status: Database["public"]["Enums"]["vistoria_status_enum"]
          tem_pendencias: boolean | null
          termo_vistoria_id: number | null
          tipo: Database["public"]["Enums"]["vistoria_tipo_enum"]
          vistoriador_id: string | null
          vistoriador_nome: string | null
        }
        Insert: {
          aprovada?: boolean | null
          atualizado_em?: string
          checklist?: Json | null
          contrato_id: number
          criado_em?: string
          data_agendada: string
          data_realizada?: string | null
          fotos?: Json | null
          id?: number
          imovel_id: number
          locador_presente?: boolean | null
          locatario_presente?: boolean | null
          motivo_reprovacao?: string | null
          observacoes_gerais?: string | null
          status?: Database["public"]["Enums"]["vistoria_status_enum"]
          tem_pendencias?: boolean | null
          termo_vistoria_id?: number | null
          tipo: Database["public"]["Enums"]["vistoria_tipo_enum"]
          vistoriador_id?: string | null
          vistoriador_nome?: string | null
        }
        Update: {
          aprovada?: boolean | null
          atualizado_em?: string
          checklist?: Json | null
          contrato_id?: number
          criado_em?: string
          data_agendada?: string
          data_realizada?: string | null
          fotos?: Json | null
          id?: number
          imovel_id?: number
          locador_presente?: boolean | null
          locatario_presente?: boolean | null
          motivo_reprovacao?: string | null
          observacoes_gerais?: string | null
          status?: Database["public"]["Enums"]["vistoria_status_enum"]
          tem_pendencias?: boolean | null
          termo_vistoria_id?: number | null
          tipo?: Database["public"]["Enums"]["vistoria_tipo_enum"]
          vistoriador_id?: string | null
          vistoriador_nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vistoria_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contrato_locacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vistoria_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_ativos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vistoria_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "view_contratos_vencendo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vistoria_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imovel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vistoria_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "view_imoveis_completos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vistoria_termo_vistoria_id_fkey"
            columns: ["termo_vistoria_id"]
            isOneToOne: false
            referencedRelation: "documento_instancia"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_contratos_ativos: {
        Row: {
          atualizado_em: string | null
          caucao: number | null
          codigo_imovel: string | null
          criado_em: string | null
          data_fim_contrato: string | null
          data_inicio_contrato: string | null
          dia_vencimento: number | null
          fiador_cpf: string | null
          fiador_nome: string | null
          fiador_telefone: string | null
          id: number | null
          imovel_cep: string | null
          imovel_cidade: string | null
          imovel_descricao: string | null
          imovel_endereco_completo: string | null
          locador_cpf: string | null
          locador_nome: string | null
          locador_telefone: string | null
          locatario_cpf: string | null
          locatario_email: string | null
          locatario_nome: string | null
          locatario_telefone: string | null
          numero_contrato: string | null
          status: Database["public"]["Enums"]["status_contrato"] | null
          tipo_imovel: string | null
          tipo_locacao: string | null
          valor: number | null
        }
        Relationships: []
      }
      view_contratos_vencendo: {
        Row: {
          codigo_imovel: string | null
          data_fim_contrato: string | null
          dias_restantes: number | null
          id: number | null
          locatario_nome: string | null
          locatario_telefone: string | null
          numero_contrato: string | null
          valor: number | null
        }
        Relationships: []
      }
      view_imoveis_completos: {
        Row: {
          area_construida: number | null
          area_total: number | null
          bairro: string | null
          banheiros: number | null
          cep: string | null
          cidade: string | null
          codigo_imovel: string | null
          complemento: string | null
          created_at: string | null
          data_disponibilidade: string | null
          descricao: string | null
          disponivel: boolean | null
          id: number | null
          iptu: number | null
          locador_cpf: string | null
          locador_email: string | null
          locador_id: number | null
          locador_nome: string | null
          locador_telefone: string | null
          logradouro: string | null
          numero: string | null
          pais: string | null
          quartos: number | null
          tipo_imovel: string | null
          uf: string | null
          updated_at: string | null
          vagas_garagem: number | null
          valor_aluguel: number | null
          valor_condominio: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      atualizar_parcelas_vencidas: { Args: never; Returns: number }
      auto_update_contract_status: { Args: never; Returns: undefined }
      calcular_multa_juros: {
        Args: { p_data_referencia?: string; p_parcela_id: number }
        Returns: {
          dias_atraso: number
          nova_multa: number
          novo_juros: number
        }[]
      }
      format_cep: { Args: { cep_input: string }; Returns: string }
      format_cnpj: { Args: { cnpj_input: string }; Returns: string }
      format_cpf: { Args: { cpf_input: string }; Returns: string }
      gerar_numero_documento: {
        Args: { p_tipo: Database["public"]["Enums"]["documento_tipo_enum"] }
        Returns: string
      }
      marcar_documentos_expirados: {
        Args: never
        Returns: {
          documentos_expirados: number
        }[]
      }
      validate_cpf: { Args: { cpf_input: string }; Returns: boolean }
    }
    Enums: {
      assinatura_status_enum: "pendente" | "assinado" | "recusado" | "expirado"
      chave_movimentacao_tipo_enum:
        | "entrega"
        | "devolucao"
        | "copia"
        | "perda"
        | "reposicao"
      cobranca_status_enum:
        | "criada"
        | "emitida"
        | "paga"
        | "vencida"
        | "cancelada"
        | "estornada"
      documento_status_enum:
        | "rascunho"
        | "gerado"
        | "enviado"
        | "parcialmente_assinado"
        | "assinado"
        | "cancelado"
        | "expirado"
      documento_tipo_enum:
        | "D1"
        | "D2"
        | "D3"
        | "D4"
        | "D5"
        | "D6"
        | "D7"
        | "D8"
        | "D9"
        | "D10"
      notificacao_canal_enum: "email" | "whatsapp" | "sms" | "push" | "outro"
      parcela_status_enum:
        | "pendente"
        | "emitido"
        | "pago"
        | "vencido"
        | "cancelado"
        | "estornado"
      pendencia_status_enum:
        | "aberta"
        | "em_andamento"
        | "resolvida"
        | "cancelada"
      pendencia_tipo_enum:
        | "financeira"
        | "documental"
        | "manutencao"
        | "entrega"
        | "contratual"
        | "outro"
      rescisao_status_enum:
        | "solicitada"
        | "em_analise"
        | "aprovada"
        | "concluida"
        | "cancelada"
      rescisao_tipo_enum:
        | "normal"
        | "antecipada_locador"
        | "antecipada_locatario"
        | "judicial"
      status_contrato:
        | "ativo"
        | "pendente"
        | "encerrado"
        | "cancelado"
        | "renovado"
      vistoria_status_enum:
        | "agendada"
        | "realizada"
        | "aprovada"
        | "reprovada"
        | "cancelada"
      vistoria_tipo_enum: "entrada" | "saida" | "periodica" | "manutencao"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      assinatura_status_enum: ["pendente", "assinado", "recusado", "expirado"],
      chave_movimentacao_tipo_enum: [
        "entrega",
        "devolucao",
        "copia",
        "perda",
        "reposicao",
      ],
      cobranca_status_enum: [
        "criada",
        "emitida",
        "paga",
        "vencida",
        "cancelada",
        "estornada",
      ],
      documento_status_enum: [
        "rascunho",
        "gerado",
        "enviado",
        "parcialmente_assinado",
        "assinado",
        "cancelado",
        "expirado",
      ],
      documento_tipo_enum: [
        "D1",
        "D2",
        "D3",
        "D4",
        "D5",
        "D6",
        "D7",
        "D8",
        "D9",
        "D10",
      ],
      notificacao_canal_enum: ["email", "whatsapp", "sms", "push", "outro"],
      parcela_status_enum: [
        "pendente",
        "emitido",
        "pago",
        "vencido",
        "cancelado",
        "estornado",
      ],
      pendencia_status_enum: [
        "aberta",
        "em_andamento",
        "resolvida",
        "cancelada",
      ],
      pendencia_tipo_enum: [
        "financeira",
        "documental",
        "manutencao",
        "entrega",
        "contratual",
        "outro",
      ],
      rescisao_status_enum: [
        "solicitada",
        "em_analise",
        "aprovada",
        "concluida",
        "cancelada",
      ],
      rescisao_tipo_enum: [
        "normal",
        "antecipada_locador",
        "antecipada_locatario",
        "judicial",
      ],
      status_contrato: [
        "ativo",
        "pendente",
        "encerrado",
        "cancelado",
        "renovado",
      ],
      vistoria_status_enum: [
        "agendada",
        "realizada",
        "aprovada",
        "reprovada",
        "cancelada",
      ],
      vistoria_tipo_enum: ["entrada", "saida", "periodica", "manutencao"],
    },
  },
} as const
