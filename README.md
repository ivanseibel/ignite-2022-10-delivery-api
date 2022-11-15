# ignite-2022-10-delivery-api
Delivery REST API

# REQUIREMENTS

## Cars

### Functional requirements

- Should be able to create a car.

### Business rules

- Should not be possible to create a car with an existing license plate.
- The car should be registered by default with the status "available".
- Only admin users can create a car.

## Car list

### Functional requirements

- Should be able to list all available cars.
- Should be able to list all available cars by category.
- Should be able to list all available cars by brand.
- Should be able to list all available cars by name.

### Business rules

- The user does not need to be authenticated to list the cars.

## Car specification

### Functional requirements

- Should be able to register a car specification.

### Business rules

- Should not be possible to register a specification for a non-existent car.
- Should not duplicate a specification for the same car.

## Car images

### Functional requirements

- Should be able to register an image for a car.

### Non-functional requirements

Use multer to upload images.

### Business rules

- The user should be able to register more than one image for the same car.
- Only admin users can register images.

## Rental

### Functional requirements

- Should be able to register a rental.

### Business rules

- The rental should have a minimum duration of 24 hours.
- should not be able to create a new rental if there is another open to the same user.
- should not be able to create a new rental if there is another open to the same car.
- The user must be authenticated in order to create a rental.
- When registering a rental, the status of the car should be changed to "unavailable".

## Close rental

### Functional requirements

Should be able to close a rental and return a car.

### Business rules

- If the car is returned before 24 hours, the rental should be charged at a daily rate.
- When the rental is closed, the car should be available for rental again.
- When the rental is closed, the user should be able to rent a car again.
- When the rental is closed, the total amount should be calculated and saved in the rental.
- If the return time is exceeded, the daily rate should be charged for the additional time.
- In there is a fine, the total amount should be increased by the fine amount.
- The user must be authenticated in order to close a rental.