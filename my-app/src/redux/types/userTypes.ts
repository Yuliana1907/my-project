export interface IUser {
    email: string
    id: string
    logo: string
    username: string
    about: string
    name: string
}
  
export interface IUserState {
    user: IUser | null
    isLoading: boolean
    isLoaded: boolean
    error: any | null
}

    