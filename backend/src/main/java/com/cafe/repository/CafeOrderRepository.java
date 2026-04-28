package com.cafe.repository;

import com.cafe.entity.CafeOrder;
import com.cafe.entity.CafeOrder.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CafeOrderRepository extends JpaRepository<CafeOrder, Long> {
    List<CafeOrder> findByStatusOrderByCreatedAtAsc(OrderStatus status);

    long countByUserId(Long userId);

    boolean existsByOrderNumber(String orderNumber);

    List<CafeOrder> findByStatusAndOrderTypeInOrderByCreatedAtAsc(
            OrderStatus status,
            List<CafeOrder.OrderType> orderTypes
    );
}
