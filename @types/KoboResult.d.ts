interface KoboResults {
  _id: string;

  'group_DadosBasicos/Txt_IdFamilia': string;

  'group_DadosBasicos/Dt_Coleta': string;

  'group_localizacao/municipio': string;

  'group_localizacao/geo_Localizacao': string;

  'group_ProgTransfRenda/bool_CadUnico': string;

  'group_ProgTransfRenda/dt_CadUnico'?: string;

  'group_ProgTransfRenda/integer_PBF': string;

  meses_desde_CadUnico_R1: string;

  R1: string;

  R2: string;

  E1: string;

  E2: string;

  I1: string;

  I2: string;

  I3: string;

  I4: string;

  S1: string;

  N1: string;

  IPM_total: string;

  _uuid: string;

  _submission_time: string;

  _submitted_by: string;

  'meta/rootUuid': string;

  // _validation_status?: Record<string, unknown>;
}