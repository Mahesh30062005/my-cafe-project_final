package com.cafe.service;

import com.cafe.dto.MenuItemResponseDto;
import com.cafe.entity.MenuItem;
import com.cafe.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service layer for menu operations.
 * Returns menu items grouped by category so the frontend can render
 * tabbed sections without additional client-side logic.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;

    /**
     * Returns all available menu items grouped by category.
     * The map is ordered using the natural enum declaration order.
     *
     * @return LinkedHashMap of { categoryKey → List<MenuItemResponseDto> }
     */
    @Transactional(readOnly = true)
    public Map<String, List<MenuItemResponseDto>> getMenuGroupedByCategory() {
        log.debug("Fetching grouped menu from database");

        List<MenuItem> allItems = menuItemRepository.findByAvailableTrueOrderByDisplayOrderAsc();

        // Group by category preserving enum declaration order
        return allItems.stream()
                .map(this::toDto)
                .collect(Collectors.groupingBy(
                        MenuItemResponseDto::getCategory,
                        LinkedHashMap::new,
                        Collectors.toList()
                ));
    }

    /** Maps a MenuItem entity to its outgoing DTO. */
    private MenuItemResponseDto toDto(MenuItem item) {
        return MenuItemResponseDto.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory().name())
                .displayOrder(item.getDisplayOrder())
                .build();
    }
}
