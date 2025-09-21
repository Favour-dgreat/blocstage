// Date and time validation utilities

export interface DateValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * Validates that start date/time is before end date/time
 * @param startDateTime - Start date/time string (ISO format)
 * @param endDateTime - End date/time string (ISO format)
 * @param fieldName - Name of the field for error message (optional)
 * @returns DateValidationResult with validation status and message
 */
export const validateDateTimeRange = (
  startDateTime: string,
  endDateTime: string,
  fieldName: string = "Event"
): DateValidationResult => {
  // Check if both dates are provided
  if (!startDateTime || !endDateTime) {
    return {
      isValid: true, // Don't validate if either field is empty
      message: ""
    };
  }

  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  // Check if dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return {
      isValid: false,
      message: "Please enter valid dates and times"
    };
  }

  // Check if start is before end
  if (startDate >= endDate) {
    return {
      isValid: false,
      message: `${fieldName} start date/time must be before the end date/time`
    };
  }

  return {
    isValid: true,
    message: ""
  };
};

/**
 * Validates a single date/time field
 * @param dateTime - Date/time string to validate
 * @param fieldName - Name of the field for error message
 * @returns DateValidationResult with validation status and message
 */
export const validateDateTime = (
  dateTime: string,
  fieldName: string
): DateValidationResult => {
  if (!dateTime) {
    return {
      isValid: true, // Don't validate empty fields
      message: ""
    };
  }

  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      message: `Please enter a valid ${fieldName}`
    };
  }

  return {
    isValid: true,
    message: ""
  };
};

/**
 * Shows an alert to the user with the validation message
 * @param message - Error message to display
 */
export const showDateTimeAlert = (message: string): void => {
  alert(message);
};
