export interface ILegacyClienteMySQL {
  id: number;
  txt_primer_nombre: string;
  txt_segundo_nombre?: string;
  txt_apellido_paterno: string;
  txt_apellido_materno?: string;
  num_dni_ruc: string;
  id_tipo_doc_legacy: number;
  flg_activo: number;
}
