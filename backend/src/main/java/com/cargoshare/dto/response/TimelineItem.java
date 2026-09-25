package com.cargoshare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimelineItem {
    private String step;
    private String title;
    private LocalDateTime timestamp;
    private boolean completed;
}
