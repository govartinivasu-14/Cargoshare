package com.cargoshare.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.math.BigDecimal;

@ResponseStatus(HttpStatus.CONFLICT)
public class InsufficientSpaceException extends RuntimeException {
    private final BigDecimal availableCapacity;

    public InsufficientSpaceException(BigDecimal availableCapacity) {
        super("Sorry, only " + availableCapacity.stripTrailingZeros().toPlainString() + " CBM is currently available.");
        this.availableCapacity = availableCapacity;
    }

    public BigDecimal getAvailableCapacity() {
        return availableCapacity;
    }
}
