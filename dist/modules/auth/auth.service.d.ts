import type { loginUser, SignUpUser } from "./auth.interface";
export declare const authService: {
    signUpUserDB: (payload: SignUpUser) => Promise<any>;
    loginUserDB: (payload: loginUser) => Promise<{
        token: string;
        user: any;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map