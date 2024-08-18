export interface User {
    name: string,
    email: string,
    sector: string,
    role: string,
    firebaseId?: string, // ?: campo opcional
    healthPlan?: string,
    dentalPlan?: string,
}
