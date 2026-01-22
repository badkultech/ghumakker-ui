export type Gender = "MALE" | "FEMALE" | "OTHER" | "NA"

export interface UserDTO {
  firstName: string
  middleName?: string
  lastName: string
  email: string
  mobileNumber?: string
  password: string
  confirmPassword: string
  gender?: Gender
  roles: string[]
  isOrganization?: boolean
  otp?: string
  employeeNumber?: string
}

export type CreateSuperAdminRequest = Pick <UserDTO, 'firstName' | 'lastName' | 'email' | 'roles' | 'employeeNumber'>;