package com.cafe.repository;

import com.cafe.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for {@link Feedback}.
 * Provides CRUD operations out of the box.
 * Custom query methods can be added here using method-name derivation.
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Example of a derived query (available for future use):
    // List<Feedback> findByRatingGreaterThanEqual(int minimumRating);
}
