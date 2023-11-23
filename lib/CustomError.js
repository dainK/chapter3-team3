class ValidError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidError";
    }
}

class TokenNotExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "TokenNotExistError";
    }
}

class UserNotExistError extends Error {
    constructor(message) {
        super(message);
        this.name = "UserNotExistError";
    }
}

class TokenTypeUnMatch extends Error {
    constructor(message) {
        super(message);
        this.name = "TokenTypeUnMatch";
    }
}

export { ValidError, TokenTypeUnMatch, UserNotExistError, TokenNotExistError };
