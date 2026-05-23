export const RoleType = {
    contributor: "contributor",
    maintainer: "maintainer",
} as const;

export type UserRole = "contributor" | "maintainer" ;