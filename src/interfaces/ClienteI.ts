import { EmpleadoI } from "./EmpleadoI";
import { MultitablaI } from "./MultitablaI";
import { PersonaI } from "./PersonaI";
import { TipoPersonaI } from "./TipoPersonaI";
import { ZonaI } from "./ZonaI";

export interface ClienteI {
    id?: number;
    codigo?: string;
    zonaId?: number;
    isDeleted?: number;
    status?: number;
    nroOrden?: number;
    diaVisitaId?: number;
    tipoPersonaId?: number;
    diaVisita?: MultitablaI;
    personaId?: number;
    empleadoId?: number;
    comprobanteId?: number;
    empleado?: EmpleadoI,
    persona?: PersonaI;
    zona?: ZonaI;
    tipoPersona?: TipoPersonaI;
    createdAt?: string;
    updatedAt?: string;

}