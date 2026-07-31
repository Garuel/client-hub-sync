export enum TipoDocumentoEnum {
  DNI = 1,
  CE = 2,
  RUC = 3,
  PASAPORTE = 4,
  OTROS = 5,
}

export const TipoDocumentoLabel: Record<number, string> = {
  [TipoDocumentoEnum.DNI]: 'DNI',
  [TipoDocumentoEnum.CE]: 'CE',
  [TipoDocumentoEnum.RUC]: 'RUC',
  [TipoDocumentoEnum.PASAPORTE]: 'Pasaporte',
  [TipoDocumentoEnum.OTROS]: 'Otros',
};