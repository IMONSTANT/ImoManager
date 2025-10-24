/**
 * Index de Templates de Documentos
 * Exporta todos os templates HTML e suas variáveis esperadas
 */

import { D1_DECLARACAO_ENTREGA_CONTRATO, D1_VARIAVEIS_ESPERADAS } from './d1_declaracao_entrega_contrato';
import { D2_FICHA_CADASTRO_FIADOR, D2_VARIAVEIS_ESPERADAS } from './d2_ficha_cadastro_fiador';
import { D3_CONTRATO_LOCACAO, D3_VARIAVEIS_ESPERADAS } from './d3_contrato_locacao';
import { D4_TERMO_VISTORIA_ENTRADA, D4_VARIAVEIS_ESPERADAS } from './d4_termo_vistoria_entrada';
import { D5_TERMO_VISTORIA_SAIDA, D5_VARIAVEIS_ESPERADAS } from './d5_termo_vistoria_saida';
import { D6_AUTORIZACAO_DEBITO, D6_VARIAVEIS_ESPERADAS } from './d6_autorizacao_debito';
import { D7_TERMO_ENTREGA_CHAVES, D7_VARIAVEIS_ESPERADAS } from './d7_termo_entrega_chaves';
import { D8_NOTIFICACAO_ATRASO, D8_VARIAVEIS_ESPERADAS } from './d8_notificacao_atraso';
import { D9_ACORDO_RESCISAO, D9_VARIAVEIS_ESPERADAS } from './d9_acordo_rescisao';
import { D10_RECIBO_PAGAMENTO, D10_VARIAVEIS_ESPERADAS } from './d10_recibo_pagamento';
import type { DocumentoTipo } from '@/lib/types/documento';

export interface TemplateConfig {
  template: string;
  variaveis_esperadas: string[];
  nome: string;
  descricao: string;
}

export const TEMPLATES: Record<DocumentoTipo, TemplateConfig> = {
  D1: {
    template: D1_DECLARACAO_ENTREGA_CONTRATO,
    variaveis_esperadas: D1_VARIAVEIS_ESPERADAS,
    nome: 'Declaração de Entrega de Contrato',
    descricao: 'Declaração de recebimento do contrato de locação com reconhecimento de firma'
  },
  D2: {
    template: D2_FICHA_CADASTRO_FIADOR,
    variaveis_esperadas: D2_VARIAVEIS_ESPERADAS,
    nome: 'Ficha Cadastral de Fiador',
    descricao: 'Cadastro completo de fiador com dados pessoais e profissionais'
  },
  D3: {
    template: D3_CONTRATO_LOCACAO,
    variaveis_esperadas: D3_VARIAVEIS_ESPERADAS,
    nome: 'Contrato de Locação',
    descricao: 'Contrato completo de locação residencial ou comercial com todas as cláusulas'
  },
  D4: {
    template: D4_TERMO_VISTORIA_ENTRADA,
    variaveis_esperadas: D4_VARIAVEIS_ESPERADAS,
    nome: 'Termo de Vistoria de Entrada',
    descricao: 'Vistoria detalhada do estado do imóvel no início da locação'
  },
  D5: {
    template: D5_TERMO_VISTORIA_SAIDA,
    variaveis_esperadas: D5_VARIAVEIS_ESPERADAS,
    nome: 'Termo de Vistoria de Saída',
    descricao: 'Vistoria detalhada do estado do imóvel no final da locação'
  },
  D6: {
    template: D6_AUTORIZACAO_DEBITO,
    variaveis_esperadas: D6_VARIAVEIS_ESPERADAS,
    nome: 'Autorização de Débito Automático',
    descricao: 'Autorização para débito automático do aluguel em conta bancária'
  },
  D7: {
    template: D7_TERMO_ENTREGA_CHAVES,
    variaveis_esperadas: D7_VARIAVEIS_ESPERADAS,
    nome: 'Termo de Entrega de Chaves',
    descricao: 'Declaração de entrega provisória ou definitiva das chaves do imóvel'
  },
  D8: {
    template: D8_NOTIFICACAO_ATRASO,
    variaveis_esperadas: D8_VARIAVEIS_ESPERADAS,
    nome: 'Notificação de Atraso de Pagamento',
    descricao: 'Notificação formal de débito em atraso com cálculo de encargos'
  },
  D9: {
    template: D9_ACORDO_RESCISAO,
    variaveis_esperadas: D9_VARIAVEIS_ESPERADAS,
    nome: 'Acordo de Rescisão de Contrato',
    descricao: 'Termo de rescisão amigável de contrato de locação'
  },
  D10: {
    template: D10_RECIBO_PAGAMENTO,
    variaveis_esperadas: D10_VARIAVEIS_ESPERADAS,
    nome: 'Recibo de Pagamento',
    descricao: 'Comprovante de pagamento de aluguel e encargos'
  }
};

export function getTemplate(tipo: DocumentoTipo): TemplateConfig {
  const config = TEMPLATES[tipo];
  if (!config) {
    throw new Error(`Template não encontrado para o tipo: ${tipo}`);
  }
  return config;
}

export function getTemplateHTML(tipo: DocumentoTipo): string {
  return getTemplate(tipo).template;
}

export function getVariaveisEsperadas(tipo: DocumentoTipo): string[] {
  return getTemplate(tipo).variaveis_esperadas;
}
