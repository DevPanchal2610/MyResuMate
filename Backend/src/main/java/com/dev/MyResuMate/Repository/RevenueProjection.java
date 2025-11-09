package com.dev.MyResuMate.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface RevenueProjection {
    LocalDate getDate();
    BigDecimal getTotal();
}