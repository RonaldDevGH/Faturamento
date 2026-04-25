import { ItemNota } from "./item-nota.models";

export class NotaFiscal {
    seqNumero: number = 0;
    status: string = '';
    dataEmissao: string = '';
    produtos: ItemNota[] = [];
}