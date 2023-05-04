import { animate, style, transition, trigger } from "@angular/animations";
import { environment } from "../environments/environment";

export interface navLink {
    routerLink: string;
    displayName: string;
    description: string;
    primary: boolean;
    type?: string;
    disabled: boolean;
}

export type Printer = {
    name: string,
    address: string,
    x1: number,
    x2: number,
    y1: number,
    y2: number,
};
export class CONSTANTS {
    public static TITLE = "MOLG OrderEntry"
    public static VERSION = "1.0.5"

    public static GLOBAL_API_ENDPOINT = environment.apiUrl;
    public static AUTH_API_ENDPOINT = environment.authUrl;

    // One hour time in minutes, seconds and miliseconds
    public static TOKEN_EXPIRY_TIME = 720 * 60 * 1000;

    public static CHECK_LOGIN_TIME = 1000 * 60 * 15;
    public static EXPIRE_WARN_TIME = 1000 * 60 * 30;

    public static JWT_ACCESS_TOKEN_STORAGE = 'jwt_acccess_token';
    public static JWT_REFRESH_TOKEN_STORAGE = 'jwt_refresh_token';
    public static JWT_EXPIRES_STORAGE = 'expires_at';
    public static JWT_USERNAME_STORAGE = 'username';

    public static NAV_LINKS: navLink[] = [
        { routerLink: '/hilfe', disabled: false, displayName: "Hilfe", type: 'Information', primary: true, description: "Erklärung der Webseite." },
        { routerLink: '/proben/search', disabled: false, displayName: 'Suche', type: 'Probensuche', primary: true, description: 'Proben aus dem Archiv raussuchen.' },
        { routerLink: '/proben/archiv', disabled: false, displayName: 'Archiv', type: 'Lagerung', primary: true, description: 'Proben archivieren.' },
        { routerLink: '/proben', disabled: false, displayName: 'Proben', type: 'Eingang', primary: true, description: "Vergabe von Gennummer." },
    ]


    public static PRINTERS: Printer[] = [
        { name: "largePrinter", address: (window.isSecureContext ? "http://" : "http://") + "bc-molg.labmed.de" + "/pstprnt", x1: 180, x2: 165, y1: 80, y2: 120 },
        { name: "smallPrinter", address: (window.isSecureContext ? "http://" : "http://") + "bc-cyto.labmed.de" + "/pstprnt", x1: 10, x2: 0, y1: 30, y2: 60 },
    ]
}

export class ANIMATIONS {
    public static inOutAnimation = [
        trigger(
            'inOutAnimation', [
            transition(':enter', [
                style({ opacity: 0, height: 'fit-content' }),
                animate('1s ease-out', style({ opacity: 1, height: 'auto', translateX: 10 })),
            ]),
            transition(':leave', [
                style({ opacity: 1, height: 'auto' }),
                animate('1s ease-in', style({ opacity: 0, height: 'fit-content' })),
            ]),
        ],
        )
    ];
}