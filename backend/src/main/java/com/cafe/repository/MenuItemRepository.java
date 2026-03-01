package com.cafe.repository;

import com.cafe.entity.MenuItem;
import com.cafe.entity.MenuItem.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for {@link MenuItem}.
 */
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    /**
     * Retrieve all available items for a given category, ordered by displayOrder.
     *
     * @param category the menu category to filter by
     * @return ordered list of available menu items
     */
    List<MenuItem> findByCategoryAndAvailableTrueOrderByDisplayOrderAsc(MenuCategory category);

    /**
     * Retrieve ALL available items regardless of category.
     *
     * @return ordered list of all available items
     */
    List<MenuItem> findByAvailableTrueOrderByDisplayOrderAsc();
}
