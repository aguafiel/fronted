import {TipoEmpleadoI} from "./TipoEmpleadoI";
import {PersonaI} from "./PersonaI";

export interface EmpleadoI {
    id?: number;
    personaId?: number;
    tipoEmpleadoId?: number;
    status?: number;
    isDeleted?: number;
    createdAt?: string;
    updatedAt?: string;
    tipoEmpleado?: TipoEmpleadoI;
    persona?: PersonaI;
}