package com.dev.MyResuMate.Util;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // This will send a 400 error
public class InvalidResumeException extends RuntimeException {
    public InvalidResumeException(String message) {
        super(message);
    }
}