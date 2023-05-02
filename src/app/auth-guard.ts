import { inject } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./login/auth.service";
import { MessageService } from "./services/message.service";

import { ERRORS } from "./config/errors.module";

export const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(MessageService);

    if (!authService.isLoggedIn()) {
        router.navigate(['/']);
        messageService.simpleWarnMessage(ERRORS.ERROR_LOGIN)
        return false;
    }

    return true;
}

export const adminGuard = () => {
    // TODO: stump
    const messageService = inject(MessageService);

    messageService.simpleWarnMessage("TEST ADMIN");
    return true;
}