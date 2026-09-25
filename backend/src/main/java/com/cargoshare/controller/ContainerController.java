package com.cargoshare.controller;

import com.cargoshare.dto.request.ContainerRequest;
import com.cargoshare.dto.response.ContainerResponse;
import com.cargoshare.entity.enums.TransportMode;
import com.cargoshare.security.UserPrincipal;
import com.cargoshare.service.ContainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/containers")
@RequiredArgsConstructor
public class ContainerController {

    private final ContainerService containerService;

    @GetMapping("/search")
    public ResponseEntity<List<ContainerResponse>> searchContainers(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) TransportMode mode,
            @RequestParam(required = false) BigDecimal minSpace,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureDate) {

        return ResponseEntity.ok(containerService.searchContainers(origin, destination, mode, minSpace, departureDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContainerResponse> getContainer(@PathVariable String id) {
        Long numericId = parseContainerId(id);
        return ResponseEntity.ok(containerService.getContainerById(numericId));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ContainerResponse> addContainer(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ContainerRequest req) {

        return ResponseEntity.ok(containerService.addContainer(principal.getId(), req));
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ContainerResponse> updateContainer(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id,
            @RequestBody ContainerRequest req) {

        Long numericId = parseContainerId(id);
        return ResponseEntity.ok(containerService.updateContainer(principal.getId(), numericId, req));
    }

    private Long parseContainerId(String id) {
        if (id.startsWith("CNT-")) {
            return Long.parseLong(id.substring(4));
        }
        return Long.parseLong(id);
    }
}
