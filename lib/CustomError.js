class ValidError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidError";
    }
}

class NotUniqueEmail extends Error {
    constructor(message) {
        super(message);
        this.name = "NotUniqueEmail";
    }
}

class NotExistUserError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotExistUserError";
    }
}

class NotMatchPassword extends Error {
    constructor(message) {
        super(message);
        this.name = "NotMatchPassword";
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
export {
    ValidError,
    NotUniqueEmail,
    NotExistUserError,
    NotMatchPassword,
    TokenTypeUnMatch,
    UserNotExistError,
    TokenNotExistError,
};
