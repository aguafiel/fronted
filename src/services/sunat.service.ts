import { ReniecDniService } from "./api-routes"
export const sunatService = {
    consultaDatos(nroDocumento: string, type: boolean) {
        return fetch(`${ReniecDniService}?isPersonaNatural=${type}&nroDocumento=${nroDocumento}`);
    }
};