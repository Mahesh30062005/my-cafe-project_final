package com.cafe.controller;

import com.cafe.dto.MenuItemResponseDto;
import com.cafe.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for menu-related endpoints.
 * <p>
 * Endpoints:
 * <ul>
 *   <li>GET /api/menu — returns all available items grouped by category</li>
 * </ul>
 */
@Slf4j
@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    /**
     * Returns all available menu items grouped into category buckets.
     * Response shape: { "HOT_BEVERAGES": [...], "COLD_BEVERAGES": [...], ... }
     *
     * @return 200 OK with grouped menu map
     */
    @GetMapping
    public ResponseEntity<Map<String, List<MenuItemResponseDto>>> getMenu() {
        log.info("Menu requested");
        return ResponseEntity.ok(menuService.getMenuGroupedByCategory());
    }
}
