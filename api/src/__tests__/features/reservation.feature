Feature: Reservation management

  Scenario: Create a new reservation
    Given the application is running
    When I create a reservation with "Alice", "alice@example.com", "2025-02-20T18:00:00Z", and 2
    Then the reservation should be created successfully
