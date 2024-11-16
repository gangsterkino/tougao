declare namespace API {
    interface UserInfo {
        currentUser?: {
            name: string;
            role: string;
        };
    }
    interface InitialState {
        currentUser: CurrentUser;
        loading?: string;
    }
}
